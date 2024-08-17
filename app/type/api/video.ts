// types.ts
export type Video = {
  id: string;
  url: string;
  title: string;
};

export type TwitchResponse = {
  data: Video[];
};