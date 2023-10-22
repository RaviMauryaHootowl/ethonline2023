import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { styled } from "styled-components";
import { Database } from "@tableland/sdk";
import { Wallet, ethers } from "ethers";
import { ConnectWallet, useAddress, useSigner } from "@thirdweb-dev/react";
import { useNavigate, useParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { Chat, Favorite, Person } from "@mui/icons-material";
import moment from "moment";
import { Client } from "@xmtp/xmtp-js";
import {Buffer} from "buffer";

window.Buffer = window.Buffer || Buffer;

const ChatPage = () => {
    const navigate = useNavigate();
    const address = useAddress();
    const chatSigner = useSigner();
    const isConnected = !!chatSigner;

    const params = useParams();
    const [chatsList, setChatsList] = useState([]);
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
    const [profileInfo, setProfileInfo] = useState({});
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const convRef = useRef(null);
    const clientRef = useRef(null);
    const [isOnNetwork, setIsOnNetwork] = useState(false);

    // helper function
    const buildContentTopic = (name) => `/xmtp/0/${name}/proto`;

    const buildUserInviteTopic = useCallback(() => {
        return buildContentTopic(`invite-${address}`);
    }, [address]);

    const buildUserIntroTopic = useCallback(() => {
        return buildContentTopic(`intro-${address}`);
    }, [address]);

    // this is the object we will pass as input reference
    let topics = useMemo(
        () => [buildUserInviteTopic(), buildUserIntroTopic()],
        [buildUserIntroTopic, buildUserInviteTopic]
    );

    const addTopic = (topicName) => {
        if (!topics.includes(topicName)) {
            topics.push(topicName);
        }
    };

    const fetchProfileInfo = async () => {
        const likeEntryInDB = await db
            .prepare(
                `SELECT * FROM ${usersTable} WHERE wallet_address = '${params.id}';`
            )
            .all();
        if (likeEntryInDB.results.length == 0) {
            navigate("/chats");
            return;
        }
        setProfileInfo(likeEntryInDB.results[0]);
    };

    useEffect(() => {
        if (address && params.id) {
            fetchProfileInfo();
        }
    }, [address, params]);

    const initXmtp = async () => {
        const xmtp = await Client.create(chatSigner, { env: "dev" });
        console.log(xmtp);
        newConversation(xmtp, profileInfo.wallet_address);
        setIsOnNetwork(!!xmtp.address);
        clientRef.current = xmtp;
    };

    const newConversation = async (xmtp_client, addressTo) => {
        if (await xmtp_client?.canMessage(addressTo)) {
            const conversation =
                await xmtp_client.conversations.newConversation(addressTo);
            addTopic(conversation);
            convRef.current = conversation;
            const allMessages = await conversation.messages();
            console.log(allMessages);
            setMessages(allMessages);
        } else {
            alert("Can't sent message as not on network!");
        }
    };

    const sendMessage = async () => {
        if (convRef.current && chatMessage) {
            await convRef.current.send(chatMessage);
            setChatMessage("");
        }
    };

    useEffect(() => {
        if (isOnNetwork && convRef.current) {
            const streamMessages = async () => {
                const newStream = await convRef.current.streamMessages();
                for await (const msg of newStream) {
                    const exists = messages.find((m) => m.id === msg.id);
                    if (!exists) {
                        setMessages((prevMessages) => {
                            const msgsnew = [...prevMessages, msg];
                            return msgsnew;
                        });
                    }
                }
            };
            streamMessages();
        }
    }, [isOnNetwork]);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    return (
        <HomeContainer>
            <HomeAppContainer>
                {/* <NotifiContext
                    // keep this "Production" unless you have a special Development environment set up by Notifi
                    env="Production"
                    signMessage={async (message) => {
                        const result = await chatSigner.signMessage({ message });
                        return arrayify(result);
                    }}
                    walletPublicKey={address ?? ""}
                    walletBlockchain="POLYGON"
                >
                    <NotifiSubscriptionCard
                        inputs={{ XMTPTopics: topics }}
                        cardId="614d38d4e4324b68b38125a0d9d0079e"
                    />
                </NotifiContext> */}
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
                    <ChatPageContainer>
                        <ChatListContainer>
                            {messages.map((message) => {
                                return (
                                    <ChatBubble
                                        isMe={message.senderAddress == address}
                                    >
                                        {message.content}
                                    </ChatBubble>
                                );
                            })}
                        </ChatListContainer>

                        <input
                            value={chatMessage}
                            onChange={(e) => {
                                setChatMessage(e.target.value);
                            }}
                        />
                        <button onClick={sendMessage}>Send</button>
                        <button onClick={initXmtp}>Init XMTP</button>
                    </ChatPageContainer>
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

const ChatPageContainer = styled.div`
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex: 1;
    padding: 1rem 0;
`;

const ChatListContainer = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const ChatBubble = styled.div`
    padding: 0.5rem;
    background-color: ${(props) => (props.isMe ? "#b0b3ff" : "#71ff9b")};
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    align-self: ${(props) => (props.isMe ? "flex-end" : "flex-start")};
`;

export default ChatPage;
