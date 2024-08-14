"use client";

import { useState, ChangeEvent } from "react";
import axios from "../lib/axios"; // axios設定ファイルを正しいパスに配置

type Video = {
  id: string;
  url: string;
  title: string;
};

export default function Home() {
  const [streamerId, setStreamerId] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const videoData = response.data.data.map((video: any) => ({
        id: video.id,
        url: video.url,
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
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              {video.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
