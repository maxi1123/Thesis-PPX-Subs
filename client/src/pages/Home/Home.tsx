import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

import logo from "../../assets/uzhlogo.svg";
import styles from "./home.module.css";

const Home: FC = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate("/onboarding");
  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            WELCOME TO THE PAY-PER-MINUTE STREAMING PORTAL
          </h1>
          <h2 className={styles.subtitle}>
            Decentralized platform access with ease
          </h2>
          <Button
            label="Next"
            icon="pi pi-arrow-right"
            className={`p-button-primary p-button-lg ${styles.button}`}
            iconPos="right"
            onClick={handleOnClick}
          />
        </div>
        <div className={styles.footer}>
          <p className={styles.text}>In collaboration with</p>
          <img src={logo} style={{ height: "200px" }} className="logo" />
        </div>
      </div>
    </>
  );
};

export default Home;
