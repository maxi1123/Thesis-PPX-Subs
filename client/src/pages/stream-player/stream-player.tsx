import axios from "axios";
import { Button } from "primereact/button";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import videojs from "video.js";
import VideoJS from "../../components/video-players/video-js";
import styles from "./stream-player.module.css";

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
  const { channel } = useParams();
  const playerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const _fetchStreamUrl = async () => {
      const response = await axios.post(
        "https://5987-89-206-112-12.eu.ngrok.io/api/v1/streams",
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

    _fetchStreamUrl();
  }, []);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
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
              className={`p-button-primary p-button-lg`}
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
