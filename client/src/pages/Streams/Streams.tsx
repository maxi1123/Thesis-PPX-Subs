import { FC, useContext, useEffect } from "react";
import styles from "./streams.module.css";
import { ethers } from "ethers";
import { useWeb3Provider } from "../../hooks/use-web3-provider";
import * as web3 from "../../constants/contract-metadata";
import { AuthContext } from "../../context/auth-context";
import StreamGrid from "../../components/stream-grid/stream-grid";
import { useNavigate } from "react-router-dom";

const PAYEE = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

const Streams: FC = () => {
  const provider = useWeb3Provider();
  const navigate = useNavigate();
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
      if (subscription[5] === 2) {
        navigate("/subscription-end");
      }
    };
    _fetchSubscription();
  }, []);

  return (
    <div className={styles.root}>
      <div>
        <h2 className={styles.subtitle}>
          Please select a stream you want to watch
        </h2>
        <StreamGrid />
      </div>
    </div>
  );
};

export default Streams;
