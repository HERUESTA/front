"use client";

import { useState, ChangeEvent } from "react";
import axios from "../lib/axios"; // axios設定ファイルを正しいパスに配置

type Video = {
  id: string;
  url: string;
  title: string;
};

const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN;

export default function Home() {
  const [streamerId, setStreamerId] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const videoData = response.data.data.map((video: any) => ({
        id: video.id,
        url: `https://www.twitch.tv/videos/${video.id}`,
        title: video.title,
      }));
      setVideos(videoData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreamerId(e.target.value);
  };

  return (
    <div>
      <p>
        本サービスは、個人で運営する非公式サービスです。 Twitch
        Interactive社とは関係ございませんのでご注意ください。
      </p>
      <h1>Twitch Videos</h1>
      <input
        type="text"
        value={streamerId}
        onChange={handleInputChange}
        placeholder="Enter Streamer ID"
      />
      <button onClick={fetchVideos}>Search</button>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <h2>{video.title}</h2>
            <iframe
              src={`https://player.twitch.tv/?video=${video.id}&parent=${parentDomain}&autoplay=false`}
              height="300"
              width="400"
              allowFullScreen={true}
            ></iframe>
          </li>
        ))}
      </ul>
    </div>
  );
}
