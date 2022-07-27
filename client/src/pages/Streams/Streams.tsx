import { FC, useContext, useEffect, useState } from "react";
import styles from "./streams.module.css";
import { ethers } from "ethers";
import { useWeb3Provider } from "../../hooks/use-web3-provider";
import * as web3 from "../../constants/contract-metadata";
import { AuthContext } from "../../context/auth-context";
import { Button } from "primereact/button";
import axios from "axios";
import StreamGrid from "../../components/stream-grid/stream-grid";

const PAYEE = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

const Streams: FC = () => {
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(true);
  const provider = useWeb3Provider();
  const authData = useContext(AuthContext);
  const subscriptionStoreContract = new ethers.Contract(
    web3.STORE_ADDRESS,
    web3.STORE_ABI,
    provider.getSigner()
  );

  useEffect(() => {
    const _fetchSubscription = async () => {
      const subscription =
        await subscriptionStoreContract.activeSubscriptionFromUser(
          authData.selectedAddress,
          PAYEE
        );
      if (subscription[5] === 1) {
        setSubscriptionActive(true);
      } else {
        setSubscriptionActive(false);
      }
    };
    _fetchSubscription();
  }, []);

  const handleOnClick = async () => {
    const now = Math.floor(new Date().getTime() / 1000.0);
    const DAY_IN_SECONDS = 86400;
    const response = await subscriptionStoreContract.newDailySubscription(
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      now,
      now + DAY_IN_SECONDS
    );
    await provider.waitForTransaction(response.hash);
    const subscription =
      await subscriptionStoreContract.activeSubscriptionFromUser(
        authData.selectedAddress,
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
      );
    await axios.post("https://5987-89-206-112-12.eu.ngrok.io/api/v1/usage", {
      subscriptionId: subscription[0],
      usage: 0,
      debtor: authData.selectedAddress,
      payee: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      createdAt: now,
      expiresAt: now + DAY_IN_SECONDS,
    });
  };
  return (
    <div className={styles.root}>
      {subscriptionActive && (
        <div>
          <h2 className={styles.subtitle}>
            Please select a stream you want to watch
          </h2>
          <StreamGrid />
        </div>
      )}
      {!subscriptionActive && (
        <div className={styles.renewalContainer}>
          <h2 className={styles.subtitle}>
            Please renew your subscription to continue watching
          </h2>
          <Button
            label="Renew Subscription"
            className={`p-button-primary p-button-lg ${styles.button}`}
            onClick={handleOnClick}
          ></Button>
        </div>
      )}
    </div>
  );
};

export default Streams;
