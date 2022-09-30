import { FC, useContext, useEffect, useState } from "react";
import { Steps } from "primereact/steps";
import { Panel } from "primereact/panel";
import ConnectWalletTab from "../../components/tabs/connect-wallet-tab/connect-wallet-tab";
import SetupSubTab from "../../components/tabs/setup-sub-tab/setup-sub-tab";

import styles from "./onboarding.module.css";
import { AuthContext } from "../../context/auth-context";
import { ONBOARDING_STATUS } from "../../enums/onboarding-status";

const Onboarding: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const authData = useContext(AuthContext);

  useEffect(() => {
    authData.onboardingStatus === ONBOARDING_STATUS.Connected ||
    authData.onboardingStatus === ONBOARDING_STATUS.Operator
      ? setActiveIndex(1)
      : setActiveIndex(0);
  }, [authData.onboardingStatus]);

  const items = [{ label: "CONNECT YOUR WALLET" }, { label: "SET UP PAYMENT" }];

  return (
    <div className={styles.parentContainer}>
      {activeIndex === 0 && (
        <ConnectWalletTab callback={(x: number) => setActiveIndex(x)} />
      )}
      {activeIndex === 1 && <SetupSubTab />}
    </div>
  );
};

export default Onboarding;

{
  /* <Panel className={styles.panel} header="ONBOARDING">
        <Steps
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
        />
        {activeIndex === 0 ? (
          <ConnectWalletTab callback={(x: number) => setActiveIndex(x)} />
        ) : (
          ""
        )}
        {activeIndex === 1 ? <SetupSubTab /> : ""}
      </Panel> */
}
