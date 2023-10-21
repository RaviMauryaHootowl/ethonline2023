import { Database } from "@tableland/sdk";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Wallet, ethers } from "ethers";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const Welcome = () => {
    const address = useAddress();
    const navigate = useNavigate();
    const usersTable = "users_80001_8033";
    const privateKey = "8fbbd233d350f9e9d3a13181253c1660280934382295662dc453075f05055731";
    const wallet = new Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"
      );
    const signer = wallet.connect(provider);
    const db = new Database({ signer });

    const handleAfterLoginNavigation = async (signedInAddress) => {
        const isRegistered = await checkIfAddressRegistered(signedInAddress);
        if(isRegistered){
            navigate("/feed");
        }else{
            navigate("/register");
        }
    }

    const checkIfAddressRegistered = async (signedInAddress) => {
        const data = await db.prepare(`SELECT * FROM ${usersTable} WHERE wallet_address = '${signedInAddress}';`).all();
        console.log(data.results.length);
        return data.results.length > 0;
    }

    useEffect(() => {
        if (address) {
            handleAfterLoginNavigation(address);
        }
    }, [address]);

    return (
        <HomeContainer>
            <HomeAppContainer>
                <AppLogo>Art & Chai</AppLogo>
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
    background-color: #f4f4f4;
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

const AppLogo = styled.div`
    color: #ec4b66;
    font-family: "Pacifico", cursive;
    font-size: 4rem;
`;

const WalletConnectContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Welcome;
