"use client";

import React, { useEffect, useState } from 'react';
import { LikedVideo, Video } from '../type/api/video';
import axios from '../../lib/axios'; // パスを調整
import VideoCard from '../components/organisms/VideoCard';
import Link from 'next/link';

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
      <Link href="/"> {/* ここを修正 */}
        <p>TOP画面</p>
      </Link>
      <h1>マイプロフィール</h1>
      <h2>いいねした動画</h2>
      <div className="flex flex-wrap">
        {likedVideos.map((video) => (
          <VideoCard
            key={video.video_id}
            id={video.video_id}
            title={video.title}
            parentDomain={parentDomain}
            liked={true}
            onLike={() => {}} // プロフィールページではいいね機能は不要かもしれません
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;