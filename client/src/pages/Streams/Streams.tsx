import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import VideoJS from "../../components/video-js";
import styles from "./streams.module.css";
// import { HlsVideoPlayer } from "../../components/hls-video-player";

const BASE_URL = "http://localhost:3333/api/v1/streams";

const Streams: FC = () => {
  const [streamList, setStreamList] = useState<Array<string>>([]);
  const playerRef = useRef(null);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
  };

  // const videoJsOptions = {
  //   autoplay: true,
  //   controls: true,
  //   responsive: true,
  //   fluid: true,
  //   sources: [
  //     {
  //       src: "https://zh2-11-hls7-live.zahs.tv/BBC1/m.m3u8?z32=MF2WI2LPL5RW6ZDFMNZT2YLBMMTGG43JMQ6TCNZQGBBUKOJZIM4DKQRZG5BTELJWIM2EKNSCGMYEEQRTHA3DGMJXEZUW42LUNFQWY4TBORST2MBGNVQXQ4TBORST2MJVGAYSM3LJNZZGC5DFHU3DAMBGONUWOPJWL4ZDGMTDMYYDOMJUG44WKMDFHBQTAZLFGUZWMYTBHBRGGZJWG43GKJTVONSXEX3JMQ6TGMBWGAZDOMBYEZ3D2MA",
  //       type: "application/x-mpegURL",
  //     },
  //   ],
  // };

  // const videoJsOptionsSecond = {
  //   autoplay: true,
  //   controls: true,
  //   responsive: true,
  //   fluid: true,
  //   sources: [
  //     {
  //       src: "https://zh2-11-hls7-live.zahs.tv/HD_sf1/m.m3u8?z32=MF2WI2LPL5RW6ZDFMNZT2YLBMMTGG43JMQ6TCNZQGBCTMNJVGNAUCMCEINATILKCIJDEGQJRIU3DKOCDHEZEGNBGNFXGS5DJMFWHEYLUMU6TAJTNMF4HEYLUMU6TGMBQGITG22LOOJQXIZJ5GYYDAJTTNFTT2OC7GAZGGNDCMJSTSZBRMFQTIYRYHFSTEOJSGM4TMODEGI2WIMZXMZRCM5LTMVZF62LEHUZTANRQGI3TAOBGOY6TA",
  //       type: "application/x-mpegURL",
  //     },
  //   ],
  // };

  useEffect(() => {
    console.log("ran effect");
    const _fetchStreamList = async () => {
      const result = await axios.get(`${BASE_URL}`);
      const streamListArr: Array<string> = [];
      result.data.forEach((elem: { alias: string }) => {
        streamListArr.push(elem.alias);
      });
      setStreamList(streamListArr);
    };

    _fetchStreamList();
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
    <div className={styles.gridContainer}>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      {/* <VideoJS options={videoJsOptionsSecond} onReady={handlePlayerReady} /> */}
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
};

export default Streams;

// const video = useRef(null);

// useEffect(() => {
//   const currentVideo = video.current;
//   const hls = new Hls();
//   if (currentVideo !== null) {
//     hls.attachMedia(currentVideo);
//     (currentVideo as HTMLVideoElement).addEventListener("play", () => {
//       console.log("Video played...");
//     });
//     (currentVideo as HTMLVideoElement).addEventListener("pause", () => {
//       console.log("Video paused...");
//     });
//     hls.on(Hls.Events.MEDIA_ATTACHED, () => {
//       hls.loadSource(
//         "https://zh2-11-hls7-live.zahs.tv/BBC1/m.m3u8?z32=MF2WI2LPL5RW6ZDFMNZT2YLBMMTGG43JMQ6TCNZQGBBUKOJZIM4DKQRZG5BTELJWIM2EKNSCGMYEEQRTHA3DGMJXEZUW42LUNFQWY4TBORST2MBGNVQXQ4TBORST2MJVGAYSM3LJNZZGC5DFHU3DAMBGONUWOPJWL4ZDGMTDMYYDOMJUG44WKMDFHBQTAZLFGUZWMYTBHBRGGZJWG43GKJTVONSXEX3JMQ6TGMBWGAZDOMBYEZ3D2MA"
//       );
//       hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
//         console.log(
//           "manifest loaded, found " + data.levels.length + " quality level"
//         );
//         (currentVideo as HTMLVideoElement)
//           .play()
//           .then(() => console.log("triggered play()"))
//           .catch((error) => {
//             console.log(error);
//           });
//       });
//     });
//   }
// }, [hasClicked]);
