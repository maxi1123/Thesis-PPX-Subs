import { FC } from 'react';
import { Button } from 'primereact/button';

import styles from '../tabs.module.css';

interface ConnectWalletTabPropsI {
  callback: (x: number) => void;
}

const ConnectWalletTab: FC<ConnectWalletTabPropsI> = ({ callback }) => {
  const handleOnClick = async () => {
    await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });
    callback(1);
  };
  return (
    <div className={styles.contentContainer}>
      <p className={styles.text}>
        As a first step, please connect your MetaMask wallet
      </p>
      <Button
        label="Connect Wallet"
        className={`p-button-secondary p-button-lg ${styles.button}`}
        onClick={handleOnClick}
      ></Button>
    </div>
  );
};

export default ConnectWalletTab;
