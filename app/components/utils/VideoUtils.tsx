import { Video, TwitchResponse } from '../../type/api/video';

type TwitchVideoData = {
  id: string;
  title: string;
  thumbnail_url: string;
  // 必要に応じて他のプロパティを追加
};

export const processVideoData = (response: TwitchResponse): Video[] => {
  return response.data.map((video: TwitchVideoData) => ({
    id: video.id,
    url: `https://www.twitch.tv/videos/${video.id}`,
    title: video.title,
    thumbnail_url: video.thumbnail_url.replace('%{width}x%{height}', '320x180'),
  }));
};