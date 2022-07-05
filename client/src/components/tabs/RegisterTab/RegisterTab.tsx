import { FC, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'primereact/button';

import * as web3 from '../../../constants/contract-metadata';

import styles from '../tabs.module.css';

interface RegisterTabPropsI {
  provider: ethers.providers.Web3Provider;
  callback: (x: number) => void;
}

const RegisterTab: FC<RegisterTabPropsI> = ({ provider, callback }) => {
  const [userAddress, setUserAddress] = useState<string>('');
  useEffect(() => {
    const getAddress = async () => {
      const userAddress = await provider.listAccounts();
      return userAddress[0];
    };
    getAddress().then((address: string) => {
      setUserAddress(address);
    });
  }, []);
  const handleOnClick = async () => {
    const storeContract = new ethers.Contract(
      web3.STORE_ADDRESS,
      web3.STORE_ABI,
      provider.getSigner()
    );

    const response = await storeContract.registerUser();
    await provider.waitForTransaction(response.hash);
    callback(2);
  };
  return (
    <div className={styles.contentContainer}>
      <p className={styles.text}>
        As a second step, please register yourself as a platform user.
        <br />
        <br />
        Currently selected address:{' '}
        <span className={styles.userAddress}>{userAddress}</span>
      </p>
      <Button
        label="Register User"
        className={`p-button-secondary p-button-lg ${styles.button}`}
        onClick={handleOnClick}
      ></Button>
    </div>
  );
};

export default RegisterTab;
