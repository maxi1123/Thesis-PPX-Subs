import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';

import * as web3 from '../../../constants/contract-metadata';

import styles from '../tabs.module.css';

interface SetupSubTabPropsI {
  provider: ethers.providers.Web3Provider;
  userSubscriptionAddress: string;
}

const SetupSubTab: FC<SetupSubTabPropsI> = ({
  provider,
  userSubscriptionAddress,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [firstIsDisabled, setFirstIsDisabled] = useState<boolean>(false);
  const [secondIsDisabled, setSecondIsDisabled] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checks = async () => {
      const tokenContract = new ethers.Contract(
        web3.TOKEN_ADDRESS,
        web3.TOKEN_ABI,
        provider
      );
      const userAddresses = await provider.listAccounts();
      const isOperator = await tokenContract.isOperatorFor(
        userSubscriptionAddress,
        userAddresses[0]
      );
      if (isOperator) {
        const userSubscriptionContract = new ethers.Contract(
          userSubscriptionAddress,
          web3.USER_SUB_ABI,
          provider
        );
        const currentSubscription =
          await userSubscriptionContract.activeSubscription();
        if (currentSubscription[2] != 0 && currentSubscription[3] != null) {
          navigate('/streams');
        } else {
          setFirstIsDisabled(true);
          setSecondIsDisabled(false);
          setActiveIndex(1);
        }
      }
    };
    checks();
  }, []);
  const handleOnClick = async () => {
    const contract = new ethers.Contract(
      web3.STORE_ADDRESS,
      web3.STORE_ABI,
      provider.getSigner()
    );
    const accounts = await provider.listAccounts();
    const subAddress = await contract.subscriptionFromUser(accounts[0]);
    const subContract = new ethers.Contract(
      subAddress,
      web3.USER_SUB_ABI,
      provider.getSigner()
    );
    // await provider.waitForTransaction(response.hash);
    // callback(2);
    const now = Math.floor(new Date().getTime() / 1000.0);
    const DAY_IN_SECONDS = 86400;
    console.log(now);
    const response = await subContract.newDailySubscription(
      now,
      now + DAY_IN_SECONDS
    );
    await provider.waitForTransaction(response.hash);
    const subscription = await subContract.activeSubscription();
    console.log(subscription);
    await axios.post('https://f450-185-193-225-26.eu.ngrok.io/api/v1/usage', {
      subscriptionId: subscription[0],
      usage: 0,
      parentContract: subAddress,
      createdAt: now,
      expiresAt: now + DAY_IN_SECONDS,
    });
    navigate('/streams');
  };

  const handleAllowOperator = async () => {
    const storeContract = new ethers.Contract(
      web3.STORE_ADDRESS,
      web3.STORE_ABI,
      provider.getSigner()
    );
    const tokenContract = new ethers.Contract(
      web3.TOKEN_ADDRESS,
      web3.TOKEN_ABI,
      provider.getSigner()
    );
    const accounts = await provider.listAccounts();
    const subAddress = await storeContract.subscriptionFromUser(accounts[0]);
    const response = await tokenContract.authorizeOperator(subAddress);
    await provider.waitForTransaction(response.hash);
    setSecondIsDisabled(false);
    setFirstIsDisabled(true);
    setActiveIndex(1);
  };
  return (
    <Accordion
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
      className={styles.customAccordion}
    >
      <AccordionTab header="ALLOW OPERATOR" disabled={firstIsDisabled}>
        <div className={styles.contentContainer}>
          <p className={styles.text} style={{ width: '50%' }}>
            As a third step, you must allow your personal subscription contract
            to transfer tokens on your behalf.
          </p>
          <Button
            label="Allow Operator"
            className={`p-button-secondary p-button-lg ${styles.button}`}
            onClick={handleAllowOperator}
          ></Button>
        </div>
      </AccordionTab>
      <AccordionTab header="CONFIRM PAYMENT" disabled={secondIsDisabled}>
        <div className={styles.contentContainer}>
          <p className={styles.text} style={{ width: '50%' }}>
            As a third and last step, you must set up the payment scheme. This
            works as follows:
            <br />
            <br />
            You must prefund an escrow-like contract, which stays active for 24
            hours. The funds are locked and <b>cannot</b> be released by either
            party. When you consume a stream, your usage is tracked per-minute.
            After the escrow expires, the funds will be automatically
            distributed to the parties, according to the usage, which gets
            reported through the oracle.
          </p>
          <Button
            label="Confirm Payment"
            className={`p-button-secondary p-button-lg ${styles.button}`}
            onClick={handleOnClick}
          ></Button>
        </div>
      </AccordionTab>
    </Accordion>
  );
};

export default SetupSubTab;
