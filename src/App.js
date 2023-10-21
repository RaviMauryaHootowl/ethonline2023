import React, { useEffect } from "react";
import Home from "./pages/Home";
import {
    RouterProvider,
    createBrowserRouter,
    useNavigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    useAddress,
} from "@thirdweb-dev/react";
import { Scroll } from "@thirdweb-dev/chains";
import Likes from "./pages/Likes";
import LikesProfile from "./pages/LikesProfile";
import ChatsList from "./pages/ChatsList";
import ChatPage from "./pages/Chat";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Welcome />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/feed",
            element: <Home />,
        },
        {
            path: "/hearts",
            element: <Likes />,
        },
        {
            path: "/hearts/:id",
            element: <LikesProfile />,
        },
        {
            path: "/chats",
            element: <ChatsList />,
        },
        {
            path: "/chats/:id",
            element: <ChatPage />,
        },
    ]);

    return (
        <ThirdwebProvider
            supportedWallets={[
                metamaskWallet(),
                coinbaseWallet(),
                walletConnect(),
            ]}
            activeChain={Scroll}
            clientId="2ca083eafd3ceae4cf0dfb62ff3acb5b"
        >
            <RouterProvider router={router}></RouterProvider>
        </ThirdwebProvider>
    );
};

export default App;
