import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Database } from "@tableland/sdk";
import { Wallet, ethers } from "ethers";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { Chat, Favorite, Person } from "@mui/icons-material";
import moment from "moment";

const Likes = () => {
    const navigate = useNavigate();
    const address = useAddress();
    const [likesList, setLikesList] = useState([]);
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

    useEffect(() => {
        fetchAllLikes();
    }, [address]);

    const fetchAllLikes = async () => {
        const data = await db
            .prepare(
                `SELECT * FROM ${likesTable} JOIN ${usersTable} ON ${likesTable}.to_user = '${address}' AND ${likesTable}.from_user = ${usersTable}.wallet_address;`
            )
            .all();
        setLikesList(data.results);
        console.log(data.results);
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
                    <NavOption>
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
                    <LikesPageContainer>
                        <PageHeader>Hearts I got!</PageHeader>
                        <LikesList>
                            {likesList.map((likeProfile) => {
                                return (
                                    <LikeProfileCard onClick={() => {
                                        navigate(`/hearts/${likeProfile.wallet_address}`)
                                    }}>
                                        <LikeProfilePic />
                                        <LikeProfileAbout>
                                            <LikeProfileName>
                                                {likeProfile.name}
                                            </LikeProfileName>
                                            <LikeProfileSubtext>
                                                <ProfileGender>
                                                    {likeProfile.gender == 0
                                                        ? "F"
                                                        : "M"}
                                                </ProfileGender>
                                                ,
                                                <ProfileAge>
                                                    {moment().diff(
                                                        moment(likeProfile.dob),
                                                        "years"
                                                    )}
                                                </ProfileAge>
                                            </LikeProfileSubtext>
                                        </LikeProfileAbout>
                                    </LikeProfileCard>
                                );
                            })}
                        </LikesList>
                    </LikesPageContainer>
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

const LikesPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1rem 0;
`;

const PageHeader = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
`;

const LikesList = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
`;

const LikeProfileCard = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background-color: #ffe2e7;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
`;

const LikeProfilePic = styled.div`
    flex: 2;
    height: 100px;
    background-image: url("https://hildurko.com/wp-content/uploads/2020/08/Calm-Lake-Landscape-Easy-acrylic-painting-for-beginners-PaintingTutorial-Painting-ASMR.jpg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
`;

const LikeProfileAbout = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const LikeProfileName = styled.div``;

const LikeProfileSubtext = styled.div`
    display: flex;
    flex-direction: row;
`;

const ProfileGender = styled.span`
    font-weight: 600;
`;
const ProfileAge = styled.span`
    font-weight: 600;
`;

export default Likes;
