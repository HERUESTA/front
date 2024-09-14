"use client"; // これを追加

import React, { useEffect, useState } from 'react';
import { LikedVideo, Video } from '../type/api/video';
import axios from "../../lib/axios";
import VideoCard from '../components/organisms/VideoCard';


const Profile: React.FC = () => {
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
  const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || 'localhost';

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get('/liked_videos', { withCredentials: true });
        setLikedVideos(response.data);
      } catch (error) {
        console.error('いいねした動画の取得に失敗しました', error);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div>
      <h1>マイプロフィール</h1>
      <h2>いいねした動画</h2>
      <div className="flex flex-wrap">
        {likedVideos.map((video) => (
          <VideoCard
            key={video.video_id}
            id={video.video_id}
            title={video.title}
            parentDomain={parentDomain}
            liked={true} // すでにいいね済みなので true
            onLike={() => {}} // プロフィールページではいいね機能は不要かもしれません
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;