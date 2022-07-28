import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";

import * as web3 from "../../../constants/contract-metadata";

import styles from "../tabs.module.css";
import { useWeb3Provider } from "../../../hooks/use-web3-provider";
import { AuthContext } from "../../../context/auth-context";
import { ONBOARDING_STATUS } from "../../../enums/onboarding-status";
import axios from "axios";

const SetupSubTab: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [firstIsDisabled, setFirstIsDisabled] = useState<boolean>(false);
  const [secondIsDisabled, setSecondIsDisabled] = useState<boolean>(true);
  const authData = useContext(AuthContext);
  const navigate = useNavigate();
  const provider = useWeb3Provider();

  useEffect(() => {
    if (authData.onboardingStatus === ONBOARDING_STATUS.Operator) {
      setActiveIndex(1);
    }
  }, [authData.onboardingStatus]);

  const handleAllowOperator = async () => {
    const tokenContract = new ethers.Contract(
      web3.TOKEN_ADDRESS,
      web3.TOKEN_ABI,
      provider.getSigner()
    );
    const response = await tokenContract.authorizeOperator(web3.STORE_ADDRESS);
    await provider.waitForTransaction(response.hash);
    setSecondIsDisabled(false);
    setFirstIsDisabled(true);
    authData.onboardingStatus = ONBOARDING_STATUS.Operator;
    authData.setAuthContext({ ...authData });
    setActiveIndex(1);
  };

  const handleOnClick = async () => {
    const storeContract = new ethers.Contract(
      web3.STORE_ADDRESS,
      web3.STORE_ABI,
      provider.getSigner()
    );
    const now = Math.floor(new Date().getTime() / 1000.0);
    const DAY_IN_SECONDS = 86400;
    const response = await storeContract.newDailySubscription(
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      now,
      now + 600
    );
    await provider.waitForTransaction(response.hash);
    const subscription = await storeContract.activeSubscriptionFromUser(
      authData.selectedAddress,
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    );
    await axios.post("https://5987-89-206-112-12.eu.ngrok.io/api/v1/usage", {
      subscriptionId: subscription[0],
      usage: 0,
      debtor: authData.selectedAddress,
      payee: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      createdAt: now,
      expiresAt: now + 600,
    });
    authData.onboardingStatus = ONBOARDING_STATUS.Completed;
    authData.setAuthContext({ ...authData });
    navigate("/streams");
  };
  return (
    <Accordion
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
      className={styles.customAccordion}
    >
      <AccordionTab header="ALLOW OPERATOR" disabled={firstIsDisabled}>
        <div className={styles.contentContainer}>
          <p className={styles.text} style={{ width: "50%" }}>
            As a second step, you must allow your personal subscription contract
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
          <p className={styles.text} style={{ width: "50%" }}>
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
