// types.ts
export type Clip = {
  id: string;
  url: string;
  title: string;
  thumbnail_url: string;
};

export type TwitchVideoData = {
  id: string;
  url: string;
  title: string;
  thumbnail_url: string;
};

export type TwitchResponse = {
  data: TwitchVideoData[]; // 修正：Video[]からTwitchVideoData[]に変更
};

export type LikedVideo = {
  id: number;
  video_id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
};