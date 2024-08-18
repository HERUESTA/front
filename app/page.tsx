"use client";

import { useState, ChangeEvent } from "react";
import axios from "../lib/axios";
import { Video, TwitchResponse } from "./type/api/video";
import Text from "./components/molecules/text/Text";
import TextInput from "./components/molecules/textInput/TextInput";
import { processVideoData } from "./components/utils/VideoUtils";
import SearchButton from "./components/molecules/button/SearchButton";
import VideoCard from "./components/organisms/VideoCard";
import GestHeader from "./components/templates/header/GestHeader";

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
  };

  return <button onClick={handleLogin}>Login with Twitch</button>;
};

export default function Home() {
  const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || "localhost";
  const [streamerId, setStreamerId] = useState<string>("");
  const [game_name, setGameName] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [clips, setClips] = useState<Video[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const videoData = processVideoData(response.data);
      setVideos(videoData);
    } catch (error) {
      setErrorMessage("ビデオが見つかりませんでした");
      console.error("ビデオが見つかりませんでした", error);
      setVideos([]); // エラー時には空の配列を設定
    }
  };

  const fetchClips = async () => {
    try {
      const response = await axios.get(`/twitch/clips`, {
        params: { game_name: game_name },
      });
      const clipData = response.data.map((clip: any) => ({
        id: clip.id,
        url: `https://clips.twitch.tv/${clip.id}`,
        title: clip.title,
      }));
      setClips(clipData);
    } catch (error) {
      console.error("クリップが見つかりませんでした", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreamerId(e.target.value);
  };

  const handleInputGameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGameName(e.target.value);
  };

  return (
    <div>
      <GestHeader />
      <Login />
      <Text />
      <TextInput
        value={game_name}
        onChange={handleInputGameChange}
        placeholder="ゲーム名を入力してください"
      />
      <SearchButton onClick={fetchClips} />
      <TextInput
        value={streamerId}
        onChange={handleInputChange}
        placeholder="配信者IDを入力してください"
      />
      <SearchButton onClick={fetchVideos} />
      <div className="flex flex-wrap">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            parentDomain={parentDomain}
          />
        ))}
        {clips.map((clip) => (
          <VideoCard
            key={clip.id}
            id={clip.id}
            title={clip.title}
            parentDomain={parentDomain}
          />
        ))}
      </div>
    </div>
  );
}
