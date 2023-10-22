import { Web3Storage } from 'web3.storage'

function getAccessToken () {
  return process.env.REACT_APP_WEB3_STORAGE;
}

const makeStorageClient = () => {
    console.log(getAccessToken());
  return new Web3Storage({ token: getAccessToken() })
}

export default makeStorageClient;