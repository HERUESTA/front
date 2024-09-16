// hook/useFetchVideos.ts

import axios from "axios";
import { processVideoData } from "../components/utils/VideoUtils";
import { TwitchResponse, Video } from "../type/api/video";

const fetchStreamerClips = async (id: string): Promise<Video[]> => {
  const response = await axios.get<TwitchResponse>(`/search/streamers/${id}`);
  return processVideoData(response.data);
};

const useFetchStreamersClips = (id: string) => {
  
}