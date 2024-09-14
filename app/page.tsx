"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "../lib/axios";
import { Video } from "./type/api/video";
import Text from "./components/molecules/text/Text";
import TextInput from "./components/molecules/textInput/TextInput";
import { processVideoData } from "./components/utils/VideoUtils";
import SearchButton from "./components/molecules/button/SearchButton";
import VideoCard from "./components/organisms/VideoCard";
import GestHeader from "./components/templates/header/GestHeader";
import LoginButton from "./components/LoginButton";

interface Follow {
  id: string | null;
  displayName: string;
  profileImageUrl: string | null;
}

export default function Home() {
  const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || "localhost";
  const [streamerId, setStreamerId] = useState<string>("");
  const [game_name, setGameName] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [clips, setClips] = useState<Video[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<string[]>([]); // いいねした動画のIDリスト

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/user_profile", { withCredentials: true });
        if (response.status === 401) {
          console.log("Redirecting to sign_in due to 401 response");
          window.location.replace("/users/sign_in");
        } else {
          setProfileImageUrl(response.data.profile_image_url);
          fetchFollows();
          fetchLikedVideos(); // いいねした動画の取得
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました", error);
      }
    };

    const fetchFollows = async () => {
      try {
        console.log("Fetch follows...");
        const response = await axios.get("/api/follows", { withCredentials: true });
        if (Array.isArray(response.data)) {
          setFollows(response.data);
        } else {
          setErrorMessage("フォローリストを取得できませんでした。");
        }
      } catch (error) {
        console.error("フォローリストの取得に失敗しました", error);
      }
    };

    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get("/liked_videos", { withCredentials: true });
        setLikedVideos(response.data.map((video: any) => video.video_id)); // いいねした動画のIDのみを保存
      } catch (error) {
        console.error("いいねした動画の取得に失敗しました", error);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const videoData = processVideoData(response.data);
      setVideos(videoData);
    } catch (error) {
      setErrorMessage("ビデオが見つかりませんでした");
      setVideos([]);
    }
  };

  const fetchClips = async () => {
    try {
      const response = await axios.get(`/twitch/clips`, { params: { game_name: game_name } });
      const clipData = response.data.map((clip: any) => ({
        id: clip.id,
        url: `https://clips.twitch.tv/${clip.id}`,
        title: clip.title,
      }));
      setClips(clipData);
    } catch (error) {
      console.error("クリップが見つかりませんでした", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreamerId(e.target.value);
  };

  const handleInputGameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGameName(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await axios.delete("/logout", { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  const likeVideo = async (video: Video) => {
    try {
      await axios.post(
        "/api/liked_videos",
        {
          liked_video: {
            video_id: video.id,
            title: video.title,
            thumbnail_url: video.thumbnail_url,
            video_url: video.url,
          },
        },
        { withCredentials: true }
      );
      setLikedVideos([...likedVideos, video.id]); // いいねした動画IDを追加
    } catch (error) {
      console.error("動画のいいねに失敗しました", error);
    }
  };

  return (
    <div>
      <GestHeader />
      {profileImageUrl ? (
        <div>
          <img
            src={profileImageUrl}
            alt="Twitch Profile"
            className="rounded-full w-16 h-16"
          />
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      ) : (
        <LoginButton />
      )}
      <Text />
      <TextInput
        value={game_name}
        onChange={handleInputGameChange}
        placeholder="ゲーム名を入力してください"
      />
      <SearchButton onClick={fetchClips} />
      <TextInput
        value={streamerId}
        onChange={handleInputChange}
        placeholder="配信者IDを入力してください"
      />
      <SearchButton onClick={fetchVideos} />

      <div>
        <h2>フォローリスト</h2>
        {follows.length > 0 ? (
          <ul>
            {follows.map((follow, index) => (
              <li key={follow.id ?? index}>
                <img
                  src={follow.profileImageUrl ?? "/path/to/default-image.jpg"}
                  alt={follow.displayName}
                  className="rounded-full w-8 h-8"
                />
                {follow.displayName}
              </li>
            ))}
          </ul>
        ) : (
          <p>フォローしているユーザーが見つかりません。</p>
        )}
      </div>

      <div className="flex flex-wrap">
        {videos.map((video) => (
         <VideoCard
         key={video.id}
         id={video.id}
         title={video.title}
         parentDomain={parentDomain}
         liked={likedVideos.includes(video.id)}
         onLike={() => likeVideo(video)} // 修正：videoオブジェクトを渡す
       />
        ))}
        {clips.map((clip) => (
          <VideoCard
            key={clip.id}
            id={clip.id}
            title={clip.title}
            parentDomain={parentDomain}
            liked={likedVideos.includes(clip.id)} // クリップのいいね状態の反映
            onLike={() => likeVideo(clip)}// クリップのいいねボタンのクリック時処理
          />
        ))}
      </div>
    </div>
  );
}