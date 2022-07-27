import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stream-grid.module.css";
import srf1 from "../../assets/srf1.svg";
import srf2 from "../../assets/srf2.svg";
import srfinfo from "../../assets/srfinfo.svg";
import threeplus from "../../assets/3plus.svg";

const StreamGrid: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.flexContainer}>
        <div className={styles.flexItem}>
          <img
            src={srf1}
            style={{ width: "200px" }}
            onClick={() => navigate("/streams/srf1")}
          />
        </div>
        <div className={styles.flexItem}>
          <img
            src={srf2}
            style={{ width: "200px" }}
            onClick={() => navigate("/streams/srf_zwei")}
          />
        </div>
      </div>
      <div className={styles.flexContainer}>
        <div className={styles.flexItem}>
          <img
            src={srfinfo}
            style={{ width: "200px" }}
            onClick={() => navigate("/streams/srf_info")}
          />
        </div>
        <div className={styles.flexItem}>
          <img
            src={threeplus}
            style={{ width: "200px" }}
            onClick={() => navigate("/streams/3plus")}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamGrid;
