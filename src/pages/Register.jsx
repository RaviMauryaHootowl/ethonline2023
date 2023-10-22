import React, { useCallback, useState, useMemo } from "react";
import { styled } from "styled-components";
import { useDropzone } from "react-dropzone";
import { UploadFileOutlined } from "@mui/icons-material";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import moment from "moment/moment";
import { Wallet, ethers } from "ethers";
import { Database } from "@tableland/sdk";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import makeStorageClient from "../web3storage";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { toast } from "react-toastify";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "1rem",
    borderColor: "#E3E3E3",
    backgroundColor: "#a1a1a155",
    color: "#6e6e6e",
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const Register = () => {
    const usersTable = "users_80001_8033";
    const address = useAddress();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileDob, setProfileDob] = useState("");
    const [profileGender, setProfileGender] = useState("0");
    const [profileBio, setProfileBio] = useState("");
    const [profilePicFile, setProfilePicFile] = useState(null);
    const privateKey = "";
    const wallet = new Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL
    );
    const signer = wallet.connect(provider);
    const db = new Database({ signer });

    const onDrop = useCallback(
        (acceptedFiles) => {
            const tempList = acceptedFiles;
            let profileContent;
            tempList.forEach((f, index) => {
                if (
                    f.path.includes(".png") ||
                    f.path.includes(".jpg") ||
                    f.path.includes(".jpeg")
                ) {
                    profileContent = f;
                    tempList.splice(index, 1);
                }
            });
            if (!profileContent) {
                alert("Atleast upload one image!");
                return;
            }
            setProfilePicFile([profileContent, ...tempList]);
        },
        [setProfilePicFile]
    );

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const registerUser = async () => {
        setIsLoading(true);
        const cid = await storeFiles();
        console.log(cid);
        const profileJson = {
            bio: profileBio,
            content: profilePicFile.map((contentFile) => {
                return `${cid}.ipfs.dweb.link/${contentFile.path}`;
            }),
        };

        const { meta: insertPost } = await db
            .prepare(
                `INSERT INTO ${usersTable}(name, dob, wallet_address, gender, profile_json, date_created, received_swipes, sent_swipes) values('${profileName}', '${profileDob}', '${address}', ${profileGender}, '${JSON.stringify(
                    profileJson
                )}', '${moment().format("YYYY-MM-DD")}', 0, 0);`
            )
            .run();

        await insertPost.txn.wait();
        raiseUMAStatement();
        toast.success("You are in!");
        handleAfterLoginNavigation(address);
    };

    const raiseUMAStatement = async () => {
        const contract = getContract(
            process.env.CONTRACT_ADDRESS,
            abi,
            library,
            address
        );
        const truth = `Art & Chai: Is this account authentic? Content URL: ${profilePicFile.map(
            (contentFile) => {
                return `${cid}.ipfs.dweb.link/${contentFile.path}`;
            }
        )}`;
        const transaction = await contract.assertTruth(truth);
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
            alert("error message");
            return;
        }
    };

    const handleAfterLoginNavigation = async (signedInAddress) => {
        const isRegistered = await checkIfAddressRegistered(signedInAddress);
        if (isRegistered) {
            navigate("/feed");
        } else {
            alert("Looks like you weren't registered!");
        }
        setIsLoading(false);
    };

    const checkIfAddressRegistered = async (signedInAddress) => {
        const data = await db
            .prepare(
                `SELECT * FROM ${usersTable} WHERE wallet_address = '${signedInAddress}';`
            )
            .all();
        console.log(data.results.length);
        return data.results.length > 0;
    };

    const storeFiles = async () => {
        const client = makeStorageClient();
        console.log(profilePicFile);
        const cid = await client.put(profilePicFile);
        console.log("stored files with cid:", cid);
        return cid;
    };

    return (
        <HomeContainer>
            <HomeAppContainer>
                <AppHeaderContainer>
                    <AppLogo>Art & Chai</AppLogo>
                    <ConnectWallet />
                </AppHeaderContainer>
                <RegisterPageContainer>
                    <TextInputGroup>
                        <span>Full Name</span>
                        <CustomInput
                            type="text"
                            value={profileName}
                            onChange={(e) => {
                                setProfileName(e.target.value);
                            }}
                            placeholder="What do we call you?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Date of Birth</span>
                        <CustomInput
                            type="date"
                            value={profileDob}
                            onChange={(e) => {
                                setProfileDob(e.target.value);
                            }}
                            placeholder="When were you born?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Gender</span>
                        <RadioButtonWithLabel>
                            <input
                                type="radio"
                                value="Male"
                                checked={profileGender === "1"}
                                onChange={(e) => {
                                    setProfileGender("1");
                                }}
                            />{" "}
                            Male
                        </RadioButtonWithLabel>
                        <RadioButtonWithLabel>
                            <input
                                type="radio"
                                value="Female"
                                checked={profileGender === "0"}
                                onChange={(e) => {
                                    setProfileGender("0");
                                }}
                            />{" "}
                            Female
                        </RadioButtonWithLabel>
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Showcase your art</span>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <UploadFileOutlined />
                            <p>
                                {profilePicFile != null
                                    ? `${profilePicFile.length} files added`
                                    : "Upload image"}
                            </p>
                        </div>
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Bio</span>
                        <CustomInputTextArea
                            type="textfield"
                            value={profileBio}
                            onChange={(e) => {
                                setProfileBio(e.target.value);
                            }}
                            placeholder="Write something cool about yourself"
                            rows={4}
                        />
                    </TextInputGroup>
                </RegisterPageContainer>
                <SubmitButton onClick={registerUser}>
                    {isLoading ? <BeatLoader color="#ffffff" /> : "Create"}
                </SubmitButton>
            </HomeAppContainer>
        </HomeContainer>
    );
};

const HomeContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Noto Sans", sans-serif;
`;

const HomeAppContainer = styled.div`
    background-color: #f4f4f4;
    box-shadow: #00000052 5px 5px 30px;
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const AppHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AppLogo = styled.div`
    color: #ec4b66;
    font-family: "Pacifico", cursive;
    font-size: 1.4rem;
`;

const RegisterPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
`;

const TextInputGroup = styled.div`
    background-color: #e7e7e7;
    border-radius: 6px;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    flex-direction: column;
    display: flex;

    span {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.6rem;
        color: #444444;
    }
`;

const CustomInput = styled.input`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.1rem;
`;

const CustomInputTextArea = styled.textarea`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    resize: none;
    font-family: "Noto Sans", sans-serif;
`;

const SubmitButton = styled.button`
    background-color: #ec4b66;
    color: white;
    border: none;
    outline: none;
    border-bottom: #c3203b 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
        border-bottom: 0;
    }
`;

const RadioButtonWithLabel = styled.div`
    display: flex;
    flex-direction: row;
`;

export default Register;
