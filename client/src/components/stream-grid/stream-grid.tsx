import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stream-grid.module.css";
import bbcone from "../../assets/bbc-one.svg";
import srf1 from "../../assets/srf1.svg";

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
            src={bbcone}
            style={{ width: "200px" }}
            onClick={() => navigate("/streams/bbc-one")}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamGrid;
