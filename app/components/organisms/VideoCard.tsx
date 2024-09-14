// VideoCard.tsx
"use client"; 

import React from 'react';

type VideoCardProps = {
  id: string;
  title: string;
  parentDomain: string;
  liked: boolean;
  onLike: () => void;
  onUnlike: () => void;  // 新しく追加
};

const VideoCard: React.FC<VideoCardProps> = ({ id, title, parentDomain, liked, onLike, onUnlike }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl m-2">
      <figure>
        <iframe
          className="card-actions justify-end"
          src={`https://clips.twitch.tv/embed?clip=${id}&parent=${parentDomain}&autoplay=false`}
          height="300"
          width="400"
          allowFullScreen={true}
        ></iframe>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div className="card-actions justify-end">
          {liked ? (
            <button className="btn btn-secondary" onClick={onUnlike}>
              いいね解除
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onLike}>
              いいね
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;