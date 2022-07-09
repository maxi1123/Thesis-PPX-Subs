import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

export const useWeb3Provider = () => {
  return provider;
};
