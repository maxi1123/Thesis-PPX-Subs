import axios from "axios";
import { ethers } from "ethers";
import { Button } from "primereact/button";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import videojs from "video.js";
import VideoJS from "../../components/video-players/video-js";
import styles from "./stream-player.module.css";
import * as web3 from "../../constants/contract-metadata";
import { useWeb3Provider } from "../../hooks/use-web3-provider";
import { AuthContext } from "../../context/auth-context";

interface VideoJsOptionsI {
  autoplay: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: boolean;
  sources: [{ src: string; type: string }];
}

const defaultOptions: VideoJsOptionsI = {
  autoplay: false,
  controls: true,
  responsive: true,
  fluid: true,
  sources: [
    {
      src: "",
      type: "application/x-mpegURL",
    },
  ],
};

const StreamPlayer: FC = () => {
  const [videoJsOptions, setVideoJsOptions] = useState<VideoJsOptionsI>({
    ...defaultOptions,
  });
  const [loading, setLoading] = useState<boolean>(true);
  // const [initialReported, setInitialReported] = useState<boolean>(false);
  // const [isPaused, setIsPaused] = useState<boolean>(false);

  const authData = useContext(AuthContext);

  const playerRef = useRef(null);
  const subscriptionIdRef = useRef<string>("");

  const lastReportedUnixRef = useRef<number>(0);
  const timeCredit = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const isInitialReported = useRef<boolean>(false);

  const { channel } = useParams();
  const navigate = useNavigate();

  const provider = useWeb3Provider();

  const subscriptionStoreContract = new ethers.Contract(
    web3.STORE_ADDRESS,
    web3.STORE_ABI,
    provider.getSigner()
  );

  useEffect(() => {
    const _fetchStreamUrl = async () => {
      const response = await axios.post(
        "https://0cc1-89-206-112-10.eu.ngrok.io/api/v1/streams",
        {
          channelId: channel,
        }
      );
      setVideoJsOptions({
        ...defaultOptions,
        sources: [{ src: response.data, type: "application/x-mpegURL" }],
      });
      setLoading(false);
    };

    const _fetchSubscription = async () => {
      const subscription =
        await subscriptionStoreContract.activeSubscriptionFromUser(
          authData.selectedAddress,
          "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f"
        );
      if (subscription[5] === 2) {
        navigate("/subscription-end");
      }
    };

    _fetchStreamUrl();
    _fetchSubscription();
  }, []);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    player.on("pause", () => {
      videojs.log("player paused");
      isPausedRef.current = true;
      if (!timeCredit.current) {
        timeCredit.current =
          Math.floor(new Date().getTime() / 1000.0) -
          lastReportedUnixRef.current;
      } else {
        timeCredit.current =
          timeCredit.current +
          (Math.floor(new Date().getTime() / 1000.0) -
            lastReportedUnixRef.current);
      }
      console.log(timeCredit.current);
    });

    player.on("play", async () => {
      videojs.log("player started");
      lastReportedUnixRef.current = Math.floor(new Date().getTime() / 1000.0);
      isPausedRef.current = false;
      if (!isInitialReported.current) {
        const subscription =
          await subscriptionStoreContract.activeSubscriptionFromUser(
            authData.selectedAddress,
            "0x56d8b3F239BFc78E10fb66792eE89F3dD1B8B17f"
          );
        await axios.post(
          "https://0cc1-89-206-112-10.eu.ngrok.io/api/v1/usage/db",
          {
            subscriptionId: subscription[0],
          }
        );
        subscriptionIdRef.current = subscription[0];
        isInitialReported.current = true;
      }
      startTimeClock();
    });
  };

  const startTimeClock = async () => {
    console.log("timeclock executed", "is paused:", isPausedRef.current);
    const now = Math.floor(new Date().getTime() / 1000.0);
    if (timeCredit.current) {
      if (
        now - (lastReportedUnixRef.current as number) >=
        60 - timeCredit.current
      ) {
        await axios.post(
          "https://0cc1-89-206-112-10.eu.ngrok.io/api/v1/usage/db",
          {
            subscriptionId: subscriptionIdRef.current,
          }
        );
        lastReportedUnixRef.current = now;
        timeCredit.current = null;
      }
    } else {
      if (now - (lastReportedUnixRef.current as number) >= 60) {
        await axios.post(
          "https://0cc1-89-206-112-10.eu.ngrok.io/api/v1/usage/db",
          {
            subscriptionId: subscriptionIdRef.current,
          }
        );
        lastReportedUnixRef.current = now;
      }
    }

    !isPausedRef.current && setTimeout(startTimeClock, 1000);
  };

  return (
    <div className={styles.root}>
      {loading && <div>LOADING STREAM...</div>}
      {!loading && (
        <div className={styles.videoPlayerContainer}>
          <div className={styles.header}>
            <h2 className={styles.subtitle}>Enjoy your stream!</h2>
            <Button
              label="Go Back to Channel Selection"
              className={`p-button-primary p-button-lg ${styles.button}`}
              icon="pi pi-arrow-left"
              iconPos="left"
              onClick={() => navigate("/streams")}
            ></Button>
          </div>
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
