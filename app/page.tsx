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
  id: string | null;  // フォローIDがnullの場合を考慮
  displayName: string;
  profileImageUrl: string | null;  // プロフィール画像URLがnullの場合を考慮
}

export default function Home() {
  const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || "localhost";
  const [streamerId, setStreamerId] = useState<string>("");
  const [game_name, setGameName] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [clips, setClips] = useState<Video[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]); // フォローリストの状態を追加
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // プロフィール画像URLの状態を追加

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/user_profile", {
          withCredentials: true,
        });
        if (response.status === 401) {
          window.location.replace("/users/sign_in");  // replaceを使用して無限ループを防ぐ
        } else {
          setProfileImageUrl(response.data.profile_image_url);
          fetchFollows();  // プロフィール取得に成功した場合のみフォローリストを取得
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました", error);
      }
    };

    const fetchFollows = async () => {
      try {
        const response = await axios.get("/api/follows", { withCredentials: true });
        console.log("Fetched follows:", response.data); // デバッグ用ログ
        if (Array.isArray(response.data)) {
          setFollows(response.data);
        } else {
          setErrorMessage("フォローリストを取得できませんでした。");
        }
      } catch (error) {
        console.error("フォローリストの取得に失敗しました", error);
      }
    };

    fetchUserProfile();  // 最初にユーザープロフィールを取得
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`/twitch/${streamerId}`);
      const videoData = processVideoData(response.data);
      setVideos(videoData);
    } catch (error) {
      setErrorMessage("ビデオが見つかりませんでした");
      console.error("ビデオが見つかりませんでした", error);
      setVideos([]); // エラー時には空の配列を設定
    }
  };

  const fetchClips = async () => {
    try {
      const response = await axios.get(`/twitch/clips`, {
        params: { game_name: game_name },
      });
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
      window.location.href = '/'; // ログアウト後にリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
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
      
      {/* フォローリストの表示 */}
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
          />
        ))}
        {clips.map((clip) => (
          <VideoCard
            key={clip.id}
            id={clip.id}
            title={clip.title}
            parentDomain={parentDomain}
          />
        ))}
      </div>
    </div>
  );
}