import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { AuthContext } from "../context/auth-context";
import { useWeb3Provider } from "./use-web3-provider";
import * as web3 from "../constants/contract-metadata";

export const useSubscriptionGuard = () => {
  const provider = useWeb3Provider();
  const navigate = useNavigate();
  const location = useLocation();

  const authData = useContext(AuthContext);
  useEffect(() => {
    const subscriptionStoreContract = new ethers.Contract(
      web3.STORE_ADDRESS,
      web3.STORE_ABI,
      provider.getSigner()
    );
    setInterval(async () => {
      if (location.pathname !== "/" && location.pathname !== "/onboarding") {
        try {
          const subscription =
            await subscriptionStoreContract.activeSubscriptionFromUser(
              authData.selectedAddress,
              "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f"
            );
          if (
            subscription[5] === 2 &&
            location.pathname !== "/subscription-end"
          ) {
            navigate("/subscription-end");
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 5000);
  }, [authData, navigate, provider]);
};
