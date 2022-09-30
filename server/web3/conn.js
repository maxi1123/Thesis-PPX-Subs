import ethers from 'ethers';

let provider;
let signer;

const init = () => {
  const urlInfo = {
    url: 'https://nd-359-001-579.p2pify.com/5c0ae8a7eb271107a8c43136310985d5',
  };

  const defaultProvider = new ethers.providers.JsonRpcProvider(urlInfo, 4002);
  signer = new ethers.Wallet(
    '890e3e4013ba0bdefc50e1cfd796fece7bdbd874bcc3b5d56c019110ebc0a524',
    defaultProvider
  );
  provider = signer.provider;
};

const getProvider = () => {
  return provider;
};

const getSigner = () => {
  return signer;
};

export { init, getProvider, getSigner };
