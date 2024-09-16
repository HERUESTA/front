"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "../../lib/axios";
import { Clip } from "../type/api/clip";
import Text from "../components/ui/Text";
import TextInput from "../components/ui/TextInput";
import SearchButton from "../components/ui/SearchButton";
import ClipCard from "../components/clips/ClipCard";
import GestHeader from "../components/layout/GestHeader";
import LoginButton from "../components/ui/LoginButton";
import { useFetchStreamersClip } from "../hook/useFetchStreamersClip";
import Loading from "../components/ui/Loading";

interface Follow {
  id: string | null;
  displayName: string;
  profileImageUrl: string | null;
}

export default function Home() {
  const parentDomain = process.env.NEXT_PUBLIC_PARENT_DOMAIN || "localhost";
  const [streamerId, setStreamerId] = useState<string>("");
  const [game_name, setGameName] = useState<string>("");
  const [videos, setVideos] = useState<Clip[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { streamerClip ,fetchStreamersClip, isLoading } = useFetchStreamersClip();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/user_profile", {
          withCredentials: true,
        });
        if (response.status === 401) {
          console.log("Redirecting to sign_in due to 401 response");
          window.location.replace("/users/sign_in");
        } else {
          setProfileImageUrl(response.data.profile_image_url);
          fetchFollows();
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました", error);
      }
    };

    const fetchFollows = async () => {
      try {
        console.log("Fetch follows...");
        const response = await axios.get("/api/follows", {
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setFollows(response.data);
        } else {
          setErrorMessage("フォローリストを取得できませんでした。");
        }
      } catch (error) {
        console.error("フォローリストの取得に失敗しました", error);
      }
    };

    fetchUserProfile();
  }, []);

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

  const handleInputClipChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStreamerId(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await axios.delete("/logout", { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  const handleFollowClick = (id: string | null) => {
    if (id) {
      setStreamerId(id); 
      fetchStreamersClip(id); 
    } else {
      console.warn("Clicked follow with null ID."); 
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
        onChange={handleInputClipChange}
        placeholder="ゲーム名を入力してください"
      />

      <SearchButton onClick={fetchClips} />
      <TextInput
        value={streamerId}
        onChange={handleInputClipChange}
        placeholder="配信者IDを入力してください"
      />
      <SearchButton onClick={() => fetchStreamersClip(streamerId)} />

      <div>
        <h2>フォローリスト</h2>
        {follows.length > 0 ? (
          <ul>
            {follows.map((follow) => (
              <li
                key={follow.id ?? undefined}
                onClick={() => handleFollowClick(follow.id)}
              >
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

       {/* ローディング中であればローディングコンポーネントを表示 */}
      {isLoading ? (
        <Loading />
      ) : (
      <div className="flex flex-wrap">
        {videos.map((video) => (
          <ClipCard
            key={video.id}
            id={video.id}
            title={video.title}
            parentDomain={parentDomain}
          />
        ))}
        {streamerClip.map((clip) => (
          <ClipCard
            key={clip.id}
            id={clip.id}
            title={clip.title}
            parentDomain={parentDomain}
          />
        ))}
      </div>
      )}
    </div>
  );
}
