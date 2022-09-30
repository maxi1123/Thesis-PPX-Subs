import { ethers } from "ethers";
import { SetStateAction, useContext, useEffect } from "react";
import { AuthContext, AuthDataI } from "../context/auth-context";

import * as web3 from "../constants/contract-metadata";
import { ONBOARDING_STATUS } from "../enums/onboarding-status";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

const tokenContract = new ethers.Contract(
  web3.TOKEN_ADDRESS,
  web3.TOKEN_ABI,
  provider
);

const subscriptionStoreContract = new ethers.Contract(
  web3.STORE_ADDRESS,
  web3.STORE_ABI,
  provider
);

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const PAYEE = "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f";

export const useAuthStatus = (
  callback: React.Dispatch<SetStateAction<AuthDataI>>
) => {
  const authData = useContext(AuthContext);
  useEffect(() => {
    const initAuthStatus = async () => {
      const accounts = await provider.listAccounts();
      setTimeout(async () => {
        if (accounts.length > 0) {
          authData.selectedAddress = accounts[0];
          authData.onboardingStatus = ONBOARDING_STATUS.Connected;
          const isOperator = await tokenContract.isOperatorFor(
            web3.STORE_ADDRESS,
            authData.selectedAddress
          );
          if (isOperator) {
            authData.onboardingStatus = ONBOARDING_STATUS.Operator;
            try {
              const subscription =
                await subscriptionStoreContract.activeSubscriptionFromUser(
                  authData.selectedAddress,
                  PAYEE
                );

              const hasSubscription = subscription[1] !== NULL_ADDRESS;
              if (hasSubscription) {
                authData.onboardingStatus = ONBOARDING_STATUS.Completed;
              }
            } catch (e) {
              console.warn(e);
            }
          }
        }
        callback({ ...authData });
      }, 1000);
    };

    initAuthStatus();
  }, [authData, callback]);
};
