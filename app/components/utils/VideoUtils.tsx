import { Video, TwitchResponse } from "@/app/type/api/video";

export const processVideoData = (response: TwitchResponse): Video[] => {
  return response.data.map((video: Video) => ({
    id: video.id,
    url: `https://www.twitch.tv/videos/${video.id}`,
    title: video.title,
  }));
};
