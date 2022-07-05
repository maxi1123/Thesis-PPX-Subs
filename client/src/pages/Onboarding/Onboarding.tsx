import { FC, useEffect, useState } from 'react';
import { Steps } from 'primereact/steps';
import { Panel } from 'primereact/panel';
import { ethers } from 'ethers';
import ConnectWalletTab from '../../components/tabs/ConnectWalletTab/ConnectWalletTab';
import RegisterTab from '../../components/tabs/RegisterTab/RegisterTab';
import SetupSubTab from '../../components/tabs/SetupSubTab/SetupSubTab';

import * as web3 from '../../constants/contract-metadata';
import styles from './onboarding.module.css';

const Onboarding: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [userSubscriptionAddress, setUserSubscriptionAddress] =
    useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(
    new ethers.providers.Web3Provider((window as any).ethereum)
  );

  useEffect(() => {
    const isWalletConnected = async () => {
      const res = await provider.listAccounts();
      console.log('User address:', res);
      const storeContract = new ethers.Contract(
        web3.STORE_ADDRESS,
        web3.STORE_ABI,
        provider
      );

      // if user has wallet connection, res[0] === true
      if (res.length > 0) {
        try {
          const subAddress = await storeContract.subscriptionFromUser(res[0]);
          setUserSubscriptionAddress(subAddress);
          setActiveIndex(2);
        } catch (e: any) {
          console.log(e);

          // if user has wallet connection, but no subscription contract, push to RegisterTab
          setActiveIndex(1);
        }
      }
    };
    isWalletConnected();
  }, [activeIndex]);

  const items = [
    { label: 'CONNECT YOUR WALLET' },
    { label: 'REGISTER' },
    { label: 'SET UP PAYMENT' },
  ];

  return (
    <div className={styles.parentContainer}>
      <Panel className={styles.panel} header="ONBOARDING">
        <Steps
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
        />
        {activeIndex === 0 ? (
          <ConnectWalletTab callback={(x: number) => setActiveIndex(x)} />
        ) : (
          ''
        )}
        {activeIndex === 1 ? (
          <RegisterTab
            provider={provider}
            callback={(x: number) => setActiveIndex(x)}
          />
        ) : (
          ''
        )}
        {activeIndex === 2 ? (
          <SetupSubTab
            provider={provider}
            userSubscriptionAddress={userSubscriptionAddress}
          />
        ) : (
          ''
        )}
      </Panel>
    </div>
  );
};

export default Onboarding;
