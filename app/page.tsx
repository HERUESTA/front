"use client";

import { useState, ChangeEvent, Children } from "react";
import axios from "../lib/axios";
import { Video, TwitchResponse } from "./type/api/video";
import Text from "./components/molecules/text/Text";
import TextInput from "./components/molecules/textInput/TextInput";
import { processVideoData } from "./components/utils/VideoUtils";
import SearchButton from "./components/molecules/button/SearchButton";
import VideoCard from "./components/organisms/VideoCard";

export default function Home() {
  const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || "localhost";
  const [streamerId, setStreamerId] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const videoData = processVideoData(response.data);
      setVideos(videoData);
    } catch (error) {
      console.error("ビデオが見つかりませんでした", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreamerId(e.target.value);
  };

  return (
    <div>
      <Text />
      <h1>Twitch Videos</h1>
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
      </div>
    </div>
  );
}
