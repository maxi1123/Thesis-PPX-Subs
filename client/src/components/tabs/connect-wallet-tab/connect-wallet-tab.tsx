import { FC, useContext } from "react";
import { Button } from "primereact/button";

import styles from "../tabs.module.css";
import { AuthContext } from "../../../context/auth-context";
import { useWeb3Provider } from "../../../hooks/use-web3-provider";
import { ONBOARDING_STATUS } from "../../../enums/onboarding-status";

interface ConnectWalletTabPropsI {
  callback: (x: number) => void;
}

const ConnectWalletTab: FC<ConnectWalletTabPropsI> = ({ callback }) => {
  const authData = useContext(AuthContext);
  const provider = useWeb3Provider();
  const handleOnClick = async () => {
    await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const accounts = await provider.listAccounts();
    authData.selectedAddress = accounts[0];
    authData.onboardingStatus = ONBOARDING_STATUS.Connected;
    authData.setAuthContext({ ...authData });
    callback(1);
  };
  return (
    <div className={styles.walletContainer}>
      <p className={styles.text}>
        As a first step, please connect your MetaMask wallet
      </p>
      <Button
        label="Connect Wallet"
        className={`p-button-primary p-button-lg ${styles.button}`}
        onClick={handleOnClick}
      ></Button>
    </div>
  );
};

export default ConnectWalletTab;
