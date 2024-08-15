"use client";

import { useState, ChangeEvent } from "react";
import axios from "../lib/axios"; // axios設定ファイルを正しいパスに配置

type Clip = {
  id: string;
  url: string;
  title: string;
};

const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || "localhost";

export default function Home() {
  const [streamerId, setStreamerId] = useState<string>("");
  const [clips, setClips] = useState<Clip[]>([]);

  const fetchClips = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const clipData = response.data.data.map((clip: any) => ({
        id: clip.id,
        url: `https://clips.twitch.tv/${clip.id}`,
        title: clip.title,
      }));
      setClips(clipData);
    } catch (error) {
      console.error("Error fetching clips:", error);
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
      <h1>Twitch Clips</h1>
      <input
        type="text"
        value={streamerId}
        onChange={handleInputChange}
        placeholder="Enter Streamer ID"
      />
      <button onClick={fetchClips}>Search</button>
      <ul>
        {clips.map((clip) => (
          <li key={clip.id}>
            <h2>{clip.title}</h2>
            <iframe
              src={`https://clips.twitch.tv/embed?clip=${clip.id}&parent=${parentDomain}&autoplay=false`}
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