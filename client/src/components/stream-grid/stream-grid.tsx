import { FC } from "react";
import styles from "./stream-grid.module.css";
import bbcone from "../../assets/bbc-one.svg";
import srf1 from "../../assets/srf1.svg";

const StreamGrid: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.flexContainer}>
        <div className={styles.flexItem}>
          <img src={srf1} style={{ width: "200px" }} />
        </div>
        <div className={styles.flexItem}>
          <img src={bbcone} style={{ width: "200px" }} />
        </div>
      </div>
    </div>
  );
};

export default StreamGrid;
