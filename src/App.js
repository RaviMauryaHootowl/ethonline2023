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
import 'react-toastify/dist/ReactToastify.css';
import '@notifi-network/notifi-react-card/dist/index.css';
import { ToastContainer } from "react-toastify";
import EditProfile from "./pages/EditProfile";
import { SCROLL_CONFIG } from "./scroll-config";
import Notifi from "./pages/Notifi";

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
        {
          path: "/account",
          element: <EditProfile />,
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
            config={SCROLL_CONFIG}
            clientId={process.env.THIRD_WEB_CLIENT_ID}
        >
            <Notifi />
            <ToastContainer />
            <RouterProvider router={router}></RouterProvider>
        </ThirdwebProvider>
    );
};

export default App;
