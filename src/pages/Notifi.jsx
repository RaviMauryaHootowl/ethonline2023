import React, { useMemo } from 'react';
import { arrayify } from '@ethersproject/bytes';
import { NotifiContext, NotifiSubscriptionCard } from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useEthers } from '@usedapp/core';
import { providers } from 'ethers';
import { Buffer } from "buffer";

window.Buffer = window.Buffer || Buffer;

const Notifi = () => {
  const { account, library } = useEthers();
  const signer = useMemo(() => {
    if (library instanceof providers.JsonRpcProvider) {
      return library.getSigner();
    }
    return undefined;
  }, [library]);

  if (account === undefined || signer === undefined) {
    // account is required
    return null;
  }

  const inputLabels = {
    label: {
      email: 'Email',
      sms: 'Text Message',
      telegram: 'Telegram',
    },
    placeholderText: {
      email: 'Email',
    },
  };

  const inputSeparators = {
    smsSeparator: {
      content: 'OR',
    },
    emailSeparator: {
      content: 'OR',
    },
  };

  const mystyle = {
    color : "red",


  };

  return (
    <NotifiContext
      dappAddress={process.env.REACT_APP_DAPP_ADDRESS}
      env="Production"
      signMessage={async (message) => {
        const result = await signer.signMessage(message);
        return arrayify(result);
      }}
      walletPublicKey={account}
    >
      <NotifiSubscriptionCard
        style={mystyle}
        cardId={process.env.REACT_APP_CARD_ID}
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        darkMode
      />
    </NotifiContext>
  );
};

export default Notifi;