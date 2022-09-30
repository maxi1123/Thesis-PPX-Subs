import axios from 'axios';
import { ethers } from 'ethers';
import { Button } from 'primereact/button';
import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as web3 from '../../constants/contract-metadata';
import { AuthContext } from '../../context/auth-context';
import { useWeb3Provider } from '../../hooks/use-web3-provider';
import styles from './subscription-end.module.css';

const SubscriptionEnd: FC = () => {
  const provider = useWeb3Provider();
  const authData = useContext(AuthContext);
  const navigate = useNavigate();
  const subscriptionStoreContract = new ethers.Contract(
    web3.STORE_ADDRESS,
    web3.STORE_ABI,
    provider.getSigner()
  );
  const handleOnClick = async () => {
    const now = Math.floor(new Date().getTime() / 1000.0);
    const DAY_IN_SECONDS = 86400;
    const response = await subscriptionStoreContract.newDailySubscription(
      '0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f',
      now,
      now + DAY_IN_SECONDS
    );
    await provider.waitForTransaction(response.hash);
    const subscription =
      await subscriptionStoreContract.activeSubscriptionFromUser(
        authData.selectedAddress,
        '0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f'
      );
    await axios.post('https://0cc1-89-206-112-10.eu.ngrok.io/api/v1/usage', {
      subscriptionId: subscription[0],
      usage: 0,
      debtor: authData.selectedAddress,
      payee: '0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f',
      createdAt: now,
      expiresAt: now + DAY_IN_SECONDS,
    });
    navigate('/streams');
  };
  return (
    <div className={styles.root}>
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
    </div>
  );
};

export default SubscriptionEnd;
