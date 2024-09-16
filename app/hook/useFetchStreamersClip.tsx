import { useState } from "react";
import { processClipData } from "../components/utils/ClipUtils";
import { Clip } from "../type/api/clip";
import axios from "../../lib/axios";
import Loading from "../components/ui/Loading";

// 配信者のクリップを取得
export const useFetchStreamersClip = () => {
  const [streamerClip, setStreamerClip] = useState<Clip[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchStreamersClip = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/search/streamers/${id}`);
      const videoData = processClipData(response.data);
      setStreamerClip(videoData);
    } catch (error) {
      console.error("ビデオが見つかりませんでした", error);
      setStreamerClip([]);
      setErrorMessage("ビデオが見つかりませんでした");
    } finally {
      setIsLoading(false);
    }
  };

  return { streamerClip, errorMessage, isLoading, fetchStreamersClip };
};
