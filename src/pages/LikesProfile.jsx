import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Database } from "@tableland/sdk";
import { Wallet, ethers } from "ethers";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useNavigate, useParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { Chat, Favorite, Person, Close, ArrowBack } from "@mui/icons-material";
import moment from "moment";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";

const LikesProfile = () => {
    const navigate = useNavigate();
    const params = useParams();
    const address = useAddress();
    const [profileInfo, setProfileInfo] = useState({});
    const usersTable = "users_80001_8033";
    const likesTable = "likes_80001_8073";
    const privateKey =
    process.env.REACT_APP_PRIVATE_KEY;
    const wallet = new Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL
    );
    const signer = wallet.connect(provider);
    const db = new Database({ signer });
    const [isLikeSending, setIsLikeSending] = useState(false);

    const fetchProfileInfo = async () => {
        const likeEntryInDB = await db
            .prepare(
                `SELECT * FROM ${likesTable} JOIN ${usersTable} ON ${likesTable}.to_user = '${address}' AND ${likesTable}.from_user = '${params.id}' AND ${likesTable}.from_user = ${usersTable}.wallet_address;`
            )
            .all();
        if (likeEntryInDB.results.length == 0) {
            navigate("/hearts");
            return;
        }
        setProfileInfo(likeEntryInDB.results[0]);
    };

    useEffect(() => {
        if (address && params.id) {
            fetchProfileInfo();
        }
    }, [address, params]);

    const performAMatch = async () => {
        setIsLikeSending(true);
        const { meta: updateMatch } = await db
            .prepare(
                `UPDATE ${likesTable} SET relike_done = 1 WHERE to_user = '${address}' AND from_user = '${profileInfo.wallet_address}';`
            )
            .run();

        await updateMatch.txn.wait();
        setIsLikeSending(false);
        toast.success("💘 It's a match!");
        navigate("/chats");
        // TODO: Add toast to make a match or animation
    };

    return (
        <HomeContainer>
            <HomeAppContainer>
                <SideBarNavigationContainer>
                    <NavOption
                        onClick={() => {
                            navigate("/feed");
                        }}
                    >
                        <HomeIcon fontSize="small" />
                        Feed
                    </NavOption>
                    <NavOption
                        onClick={() => {
                            navigate("/hearts");
                        }}
                    >
                        <Favorite fontSize="small" />
                        Hearts
                    </NavOption>
                    <NavOption onClick={() => {
                            navigate("/chats");
                        }}>
                        <Chat fontSize="small" />
                        Chats
                    </NavOption>
                    <FlexFullContainer />
                    <NavOption>
                        <Person fontSize="small" />
                        Account
                    </NavOption>
                </SideBarNavigationContainer>
                <MainContentContainer>
                    <AppHeaderContainer>
                        <AppLogo>Art & Chai</AppLogo>
                        <ConnectWallet />
                    </AppHeaderContainer>
                    <GoBackButton
                        onClick={() => {
                            navigate("/hearts");
                        }}
                    >
                        <ArrowBack fontSize="small" />
                        <GoBackText>Back</GoBackText>
                    </GoBackButton>
                    {profileInfo.wallet_address ? (
                        <ProfileContentContainer>
                            <MainProfileImage src={`https://${profileInfo.profile_json.content[0]}`} />

                            <ProfileInfoContainer>
                                <ProfileName>{profileInfo.name}</ProfileName>
                                <ProfileGender>
                                    {profileInfo.gender == 0 ? "F" : "M"}
                                </ProfileGender>
                                ,
                                <ProfileAge>
                                    {moment().diff(
                                        moment(profileInfo.dob),
                                        "years"
                                    )}
                                </ProfileAge>
                            </ProfileInfoContainer>
                            <ProfileWriteUpContainer>
                                <WriteUpQuestion>
                                    What do I love?
                                </WriteUpQuestion>
                                <WriteUpAnswer>
                                    {profileInfo.profile_json.bio}
                                </WriteUpAnswer>
                            </ProfileWriteUpContainer>
                            {
                                profileInfo.profile_json.content.length > 1 ? 
                                profileInfo.profile_json.content.slice(1).map((c) => {
                                    return <AdditionContentContainer>
                                    <WriteUpQuestion>
                                        More Content
                                    </WriteUpQuestion>
                                    {
                                        c.includes(".mp3") ? <iframe src={`https://${c}`} /> : <MainProfileImage src={`https://${c}`} />
                                    }
                                </AdditionContentContainer>
                                }) : <></>
                            }
                            <OverflowActionButtons>
                                <SkipButton>
                                    <Close color="#ec4b66" />
                                </SkipButton>
                                <LoveButton onClick={performAMatch}>
                                    {isLikeSending ? (
                                        <BounceLoader size={40} color="white" />
                                    ) : (
                                        <Favorite color="white" />
                                    )}
                                </LoveButton>
                            </OverflowActionButtons>
                        </ProfileContentContainer>
                    ) : (
                        "Not found!"
                    )}
                </MainContentContainer>
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
    width: max(30%, 550px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    align-items: stretch;
`;

const SideBarNavigationContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem;
    background-color: #ec4b66;
    border-radius: 1rem 0 0 1rem;
    color: white;
`;

const NavOption = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    border-radius: 0.5rem;
    padding: 0.8rem;
    cursor: pointer;
    &:hover {
        background-color: #ffffff36;
    }
`;

const FlexFullContainer = styled.div`
    flex: 1;
`;

const MainContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    position: relative;
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

const GoBackButton = styled.button`
    border: none;
    outline: none;
    background-color: transparent;
    align-self: flex-start;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
        background-color: #ec4b662f;
    }
`;

const GoBackText = styled.div`
    margin-left: 0.5rem;
`;

const ProfileContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
`;

const MainProfileImage = styled.img`
    width: 100%;
    border-radius: 1rem;
`;

const ProfileInfoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: end;
    padding: 0.5rem 0;
`;

const ProfileName = styled.span`
    font-weight: bold;
    font-size: 1.3rem;
    padding-right: 0.5rem;
`;

const ProfileGender = styled.span`
    font-weight: 600;
`;
const ProfileAge = styled.span`
    font-weight: 600;
`;

const ProfileWriteUpContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`;

const WriteUpQuestion = styled.div`
    font-weight: bold;
    padding-bottom: 0.4rem;
`;

const WriteUpAnswer = styled.div``;

const AdditionContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`;

const OverflowActionButtons = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: row;
`;

const SkipButton = styled.div`
    background-color: white;
    border: none;
    outline: none;
    margin: 0.5rem;
    margin-left: 0rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
`;

const LoveButton = styled.div`
    background-color: #ec4b66;
    border: none;
    outline: none;
    color: white;
    margin: 0.5rem;
    margin-left: 0rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
`;

export default LikesProfile;
