import { FC, useContext, useEffect, useState } from "react";
import { Steps } from "primereact/steps";
import { Panel } from "primereact/panel";
import { ethers } from "ethers";
import ConnectWalletTab from "../../components/tabs/connect-wallet-tab/connect-wallet-tab";
import SetupSubTab from "../../components/tabs/setup-sub-tab/setup-sub-tab";

import styles from "./onboarding.module.css";
import { AuthContext } from "../../context/auth-context";

const Onboarding: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [userSubscriptionAddress, setUserSubscriptionAddress] =
    useState<string>("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(
    new ethers.providers.Web3Provider((window as any).ethereum)
  );
  const authData = useContext(AuthContext);

  useEffect(() => {
    console.log(authData);
  });

  const items = [{ label: "CONNECT YOUR WALLET" }, { label: "SET UP PAYMENT" }];

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
          ""
        )}
        {activeIndex === 1 ? (
          <SetupSubTab
            provider={provider}
            userSubscriptionAddress={userSubscriptionAddress}
          />
        ) : (
          ""
        )}
      </Panel>
    </div>
  );
};

export default Onboarding;
