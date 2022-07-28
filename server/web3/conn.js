import ethers from "ethers";

let provider;
let signer;

const init = () => {
  const defaultProvider = new ethers.providers.getDefaultProvider(
    "http://localhost:8545"
  );
  signer = new ethers.Wallet(
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
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
