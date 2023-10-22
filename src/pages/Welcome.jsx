import { Database } from "@tableland/sdk";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Wallet, ethers } from "ethers";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import bg from "../images/bg.webp";

const Welcome = () => {
    const address = useAddress();
    const navigate = useNavigate();
    const usersTable = "users_80001_8033";
    const privateKey =
        process.env.REACT_APP_PRIVATE_KEY;
    const wallet = new Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL
    );
    const signer = wallet.connect(provider);
    const db = new Database({ signer });

    const handleAfterLoginNavigation = async (signedInAddress) => {
        const isRegistered = await checkIfAddressRegistered(signedInAddress);
        if (isRegistered) {
            navigate("/feed");
        } else {
            navigate("/register");
        }
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

    useEffect(() => {
        if (address) {
            handleAfterLoginNavigation(address);
        }
    }, [address]);

    return (
        <HomeContainer>
            <HomeAppContainer>
                <AppInfo>
                    <AppLogo>Art & Chai</AppLogo>
                    <AppSlogan>A transparent dating app <br/>for creative people!</AppSlogan>
                </AppInfo>
                <WalletConnectContainer>
                    <ConnectWallet />
                </WalletConnectContainer>
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
    background-image: linear-gradient(#ec4b66, #d12542);
    box-shadow: #00000052 5px 5px 30px;
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 1rem;
`;

const AppInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AppLogo = styled.div`
    color: white;
    font-family: "Pacifico", cursive;
    font-size: 4rem;
`;

const AppSlogan = styled.div`
    color: white;
    font-family: "Pacifico", cursive;
    font-size: 1.5rem;
    text-align: center;
`;

const WalletConnectContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Welcome;
