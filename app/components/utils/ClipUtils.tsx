// app/components/utils/ClipUtils.tsx

import { Clip, TwitchResponse } from "../../type/api/clip";

export const processClipData = (response: TwitchResponse): Clip[] => {
  return response.data.map((clip: Clip) => ({
    id: clip.id,
    url: `https://www.twitch.tv/videos/${clip.id}`,
    title: clip.title,
    thumbnail_url: clip.thumbnail_url,
  }));
};
