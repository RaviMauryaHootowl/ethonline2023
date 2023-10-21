import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider, ethers } from "ethers";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import {
    Chat,
    Close,
    Favorite,
    HeatPumpRounded,
    Person,
} from "@mui/icons-material";
import moment from "moment";
import { BounceLoader } from "react-spinners";

const Home = () => {
    const address = useAddress();
    const navigate = useNavigate();
    const [feedsList, setFeedsList] = useState([]);
    const [feedIndex, setFeedIndex] = useState(0);
    const usersTable = "users_80001_8033";
    const likesTable = "likes_80001_8073";
    const privateKey =
        "8fbbd233d350f9e9d3a13181253c1660280934382295662dc453075f05055731";
    const wallet = new Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"
    );
    const signer = wallet.connect(provider);
    const db = new Database({ signer });
    const [isLikeSending, setIsLikeSending] = useState(false);

    useEffect(() => {
        if (!address) {
            navigate("/");
        } else {
            fetchFeeds();
        }
    }, [address]);

    const fetchFeeds = async () => {
        const data = await db
            .prepare(
                `SELECT * FROM ${usersTable} where wallet_address <> '${address}';`
            )
            .all();
        setFeedsList(data.results);
    };

    const sendLike = async () => {
        setIsLikeSending(true);
        const likeEntryInDB = await db
            .prepare(
                `SELECT * FROM ${likesTable} where from_user = '${address}' AND to_user = '${feedsList[feedIndex].wallet_address}'`
            )
            .all();
        if (likeEntryInDB.results.length == 0) {
            const { meta: insertLike } = await db
                .prepare(
                    `INSERT INTO ${likesTable}(to_user, from_user, like_done, relike_done) values('${feedsList[feedIndex].wallet_address}', '${address}', 1, 0);`
                )
                .run();

            await insertLike.txn.wait();
        } else {
            alert("You have already liked them!");
        }
        setIsLikeSending(false);
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
                    <NavOption
                        onClick={() => {
                            navigate("/chats");
                        }}
                    >
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
                    {feedsList.length > 0 ? (
                        <ProfileContentContainer>
                            <MainProfileImage src="https://hildurko.com/wp-content/uploads/2020/08/Calm-Lake-Landscape-Easy-acrylic-painting-for-beginners-PaintingTutorial-Painting-ASMR.jpg" />
                            <ProfileInfoContainer>
                                <ProfileName>
                                    {feedsList[feedIndex].name}
                                </ProfileName>
                                <ProfileGender>
                                    {feedsList[feedIndex].gender == 0
                                        ? "F"
                                        : "M"}
                                </ProfileGender>
                                ,
                                <ProfileAge>
                                    {moment().diff(
                                        moment(feedsList[feedIndex].dob),
                                        "years"
                                    )}
                                </ProfileAge>
                            </ProfileInfoContainer>
                            <ProfileWriteUpContainer>
                                <WriteUpQuestion>
                                    What do I love?
                                </WriteUpQuestion>
                                <WriteUpAnswer>
                                    {feedsList[feedIndex].profile_json.bio}
                                </WriteUpAnswer>
                            </ProfileWriteUpContainer>
                            <AdditionContentContainer>
                                <WriteUpQuestion>
                                    Some peaceful paintings
                                </WriteUpQuestion>
                                <MainProfileImage src="https://i.ytimg.com/vi/3jEwpJKyKMM/maxresdefault.jpg" />
                            </AdditionContentContainer>
                            <AdditionContentContainer>
                                <WriteUpQuestion>
                                    What do you love?
                                </WriteUpQuestion>
                                <MainProfileImage src="https://www.myhobbyclass.com/storage/Acrylic-painting-of-Spring-season-landscape-painting-with-tree-on.jpg" />
                            </AdditionContentContainer>
                            <OverflowActionButtons>
                                <SkipButton>
                                    <Close color="#ec4b66" />
                                </SkipButton>
                                <LoveButton onClick={sendLike}>
                                    {isLikeSending ? (
                                        <BounceLoader size={40} color="white" />
                                    ) : (
                                        <Favorite color="white" />
                                    )}
                                </LoveButton>
                            </OverflowActionButtons>
                        </ProfileContentContainer>
                    ) : (
                        "No profiles found!"
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

export default Home;
