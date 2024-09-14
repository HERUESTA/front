// app/components/utils/VideoUtils.tsx

import { Video, TwitchResponse } from '../../type/api/video';

export const processVideoData = (response: TwitchResponse): Video[] => {
  return response.data.map((video: any) => ({
    id: video.id,
    url: `https://www.twitch.tv/videos/${video.id}`,
    title: video.title,
    thumbnail_url: video.thumbnail_url, // 追加
  }));
};