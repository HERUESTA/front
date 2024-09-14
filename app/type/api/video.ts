
// types.ts
export type Video = {
  id: string;
  url: string;
  title: string;
  thumbnail_url: string;
};

export type TwitchResponse = {
  data: Video[];
};

export type LikedVideo = {
  id: number;
  video_id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
};