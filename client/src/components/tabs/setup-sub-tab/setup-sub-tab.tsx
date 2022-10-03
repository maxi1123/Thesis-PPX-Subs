import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "primereact/button";

import * as web3 from "../../../constants/contract-metadata";

import styles from "../tabs.module.css";
import { useWeb3Provider } from "../../../hooks/use-web3-provider";
import { AuthContext } from "../../../context/auth-context";
import { ONBOARDING_STATUS } from "../../../enums/onboarding-status";
import axios from "axios";

const SetupSubTab: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeRate, setActiveRate] = useState<number>(0);
  const authData = useContext(AuthContext);
  const navigate = useNavigate();
  const provider = useWeb3Provider();

  useEffect(() => {
    const fetchRate = async () => {
      const oracleContract = new ethers.Contract(
        web3.ORACLE_ADDRESS,
        web3.ORACLE_ABI,
        provider
      );
      const activeR = await oracleContract.activeRate();
      setActiveRate(activeR.toNumber());
    };
    if (authData.onboardingStatus === ONBOARDING_STATUS.Operator) {
      setActiveIndex(1);
    }
    fetchRate();
  }, [authData.onboardingStatus]);

  const handleAllowOperator = async () => {
    const tokenContract = new ethers.Contract(
      web3.TOKEN_ADDRESS,
      web3.TOKEN_ABI,
      provider.getSigner()
    );
    const response = await tokenContract.authorizeOperator(web3.STORE_ADDRESS);
    await provider.waitForTransaction(response.hash);
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
      "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f",
      now,
      now + 600
    );
    await provider.waitForTransaction(response.hash);
    const subscription = await storeContract.activeSubscriptionFromUser(
      authData.selectedAddress,
      "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f"
    );
    await axios.post("https://evening-ocean-47800.herokuapp.com/api/v1/usage", {
      subscriptionId: subscription[0],
      usage: 0,
      debtor: authData.selectedAddress,
      payee: "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f",
      createdAt: now,
      expiresAt: now + 600,
    });
    authData.onboardingStatus = ONBOARDING_STATUS.Completed;
    authData.setAuthContext({ ...authData });
    navigate("/streams");
  };
  return (
    <>
      <div
        className={`${styles.subContainer} ${
          activeIndex !== 0 ? styles.applyOpacity : ""
        }`}
      >
        <h2 className={styles.headerText}>ONBOARDING 1/2</h2>
        <div className={styles.divider} />
        <p className={styles.textAlt}>
          As a preparation for the last onboarding step you must allow the smart
          contract to transfer tokens from your balance
        </p>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdrop}>
            <i
              className="pi pi-angle-double-right"
              style={{ fontSize: "15px", color: "#24b47e" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            The provider cannot abuse this allowance as it is given exclusively to the smart
            contract
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdrop}>
            <i
              className="pi pi-angle-double-right"
              style={{ fontSize: "15px", color: "#24b47e" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            The smart contract solely needs the allowance for the prefunding
            mechanism as this necessitates transferring tokens from your balance
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdropAlt}>
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "15px", color: "#b42424" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            If in doubt the allowance can always be revoked
          </p>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            label="Give allowance"
            disabled={activeIndex !== 0}
            className={`p-button-primary p-button-lg ${styles.button}`}
            onClick={handleAllowOperator}
          ></Button>
        </div>
      </div>
      <div
        className={`${styles.subContainer} ${
          activeIndex !== 1 ? styles.applyOpacity : ""
        }`}
      >
        <h2 className={styles.headerText}>ONBOARDING 2/2</h2>
        <div className={styles.divider} />
        <p className={styles.textAlt}>
          To get access to the service you must lock funds equal to the amount
          worth 24 hours (1440 minutes) of watchtime
        </p>
        <div className={styles.activeRateWrapper}>
          <p className={styles.activeRateValue}>{activeRate}</p>
          <p style={{ fontSize: "17px", color: '#32325d', marginLeft: "10px" }}>= 0.0017$</p>
        </div>
        <div className={styles.flexWrapper}>
          <p style={{ fontSize: "14px", color: "#8898aa"}}>
            at the start of each minute
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdrop}>
            <i
              className="pi pi-angle-double-right"
              style={{ fontSize: "15px", color: "#24b47e" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            The smart contract transfers an amount of {1440*activeRate} tokens (1440 min * {activeRate}) from your balance to
            itself and locks it
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdrop}>
            <i
              className="pi pi-angle-double-right"
              style={{ fontSize: "15px", color: "#24b47e" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            From the locked balance each minute the smart contract sends the
            payout to the provider according to the above rate
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdrop}>
            <i
              className="pi pi-angle-double-right"
              style={{ fontSize: "15px", color: "#24b47e" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            The provider has no access to your locked tokens, only the smart
            contract can execute payouts
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBackdropAlt}>
            <i
              className="pi pi-money-bill"
              style={{ fontSize: "15px", color: "#b42424" }}
            ></i>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "#525f7f",
              marginLeft: "10px",
              lineHeight: "26px",
            }}
          >
            You will get all unused funds back automatically after the 24 hour
            period expires
          </p>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            label="Lock tokens"
            disabled={activeIndex !== 1}
            className={`p-button-primary p-button-lg ${styles.button}`}
            onClick={handleOnClick}
          ></Button>
        </div>
      </div>
    </>
  );
};

export default SetupSubTab;

// <Accordion
//   activeIndex={activeIndex}
//   onTabChange={(e) => setActiveIndex(e.index)}
//   className={styles.customAccordion}
// >
//   <AccordionTab header="ALLOW OPERATOR" disabled={firstIsDisabled}>
//     <div className={styles.contentContainer}>
//       <p className={styles.text} style={{ width: "50%" }}>
//         As a second step, you must allow the Subscription Store contract to
//         transfer tokens on your behalf.
//       </p>
//       <Button
//         label="Allow Operator"
//         className={`p-button-primary p-button-lg ${styles.button}`}
//         onClick={handleAllowOperator}
//       ></Button>
//     </div>
//   </AccordionTab>
//   <AccordionTab header="CONFIRM PAYMENT" disabled={secondIsDisabled}>
//     <div className={styles.contentContainer}>
//       <p className={styles.text} style={{ width: "50%" }}>
//         As a third and last step, you must set up the payment scheme. This
//         works as follows:
//         <br />
//         <br />
//         You must prefund an escrow-like contract, which stays active for 24
//         hours. The funds, equal to the amount corresponding to a full day of watchtime, are locked and <b>cannot</b> be released by either
//         party. When you consume a stream, your usage, in terms of watch
//         time, is tracked per-minute and charged in a five minute interval,
//         according to the usage, which gets reported through an oracle. After
//         the escrow expires, the remaining funds will be automatically
//         distributed to the parties.
//       </p>
// <Button
//   label="Confirm Payment"
//   className={`p-button-primary p-button-lg ${styles.button}`}
//   onClick={handleOnClick}
// ></Button>
//     </div>
//   </AccordionTab>
// </Accordion>
