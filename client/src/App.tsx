import React from 'react';
import { HlsVideoPlayer } from './components/hls-video-player';
import './App.css';

function App() {
    const hlsUrl =
        'https://zba6-2-hls7-live.zahs.tv/HD_sf1/m.m3u8?z32=MF2WI2LPL5RW6ZDFMNZT2YLBMMTGG43JMQ6TCNSGIQ4DOOBTGA2DONCBINCDELJRGU3EGM2BGBCEIRCEIE3UCQKEEZUW42LUNFQWY4TBORST2MBGNVQXQ4TBORST2MZQGAZCM3LJNZZGC5DFHU3DAMBGONUWOPJYL4YTINZRG4YGEMDFGA2TINRSG43TQZLGHE4WGOBZGUZTCOBSGUZTQJTVONSXEX3JMQ6TGMBWGAZDOMBYEZ3D2MA';
    return (
        <HlsVideoPlayer
            src={hlsUrl}
            autoPlay={false}
            controls={true}
            width="60%"
            height="auto"
        ></HlsVideoPlayer>
    );
}

export default App;
