import ethers from 'ethers';

let provider;
let signer;

const init = () => {
    provider = new ethers.providers.JsonRpcProvider();
    signer = provider.getSigner();
};

const getProvider = () => {
    return provider;
};

const getSigner = () => {
    return signer;
};

export { init, getProvider, getSigner };
