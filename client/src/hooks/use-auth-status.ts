import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { AuthContext, AuthDataI } from "../context/auth-context";

import * as web3 from "../constants/contract-metadata";
import { OnboardingStatus } from "../enums/onboarding-status";

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

export const useAuthStatus = (
  setAuthContext: React.Dispatch<React.SetStateAction<AuthDataI>>
) => {
  const authData = useContext(AuthContext);

  useEffect(() => {
    const initAuthStatus = async () => {
      const accounts = await provider.listAccounts();
      setTimeout(async () => {
        if (accounts.length > 0) {
          authData.selectedAddress = accounts[0];
          authData.onboardingStatus = OnboardingStatus.Connected;
          const isOperator = await tokenContract.isOperatorFor(
            NULL_ADDRESS,
            authData.selectedAddress
          );
          if (isOperator) {
            authData.onboardingStatus = OnboardingStatus.Operator;

            const subscription =
              await subscriptionStoreContract.activeSubsctiptionFromUser(
                authData.selectedAddress,
                NULL_ADDRESS
              );

            const hasSubscription = subscription[1] !== NULL_ADDRESS;
            if (hasSubscription) {
              authData.onboardingStatus = OnboardingStatus.Completed;
            }
          }
        }
        setAuthContext({ ...authData });
        console.log("executing...");
      }, 5000);
      // if (accounts.length > 0) {
      //   authData.selectedAddress = accounts[0];
      //   authData.onboardingStatus = OnboardingStatus.Connected;
      //   const isOperator = await tokenContract.isOperatorFor(
      //     NULL_ADDRESS,
      //     authData.selectedAddress
      //   );
      //   if (isOperator) {
      //     authData.onboardingStatus = OnboardingStatus.Operator;

      //     const subscription =
      //       await subscriptionStoreContract.activeSubsctiptionFromUser(
      //         authData.selectedAddress,
      //         NULL_ADDRESS
      //       );

      //     const hasSubscription = subscription[1] !== NULL_ADDRESS;
      //     if (hasSubscription) {
      //       authData.onboardingStatus = OnboardingStatus.Completed;
      //     }
      //   }
      // }
      // setAuthContext({ ...authData });
      // console.log("executing...");
    };

    initAuthStatus();
  }, [authData, setAuthContext]);
};
