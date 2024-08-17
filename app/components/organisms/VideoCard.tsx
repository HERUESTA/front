import React from "react";

type VideoCardProps = {
  id: string;
  title: string;
  parentDomain: string;
};

const VideoCard: React.FC<VideoCardProps> = ({ id, title, parentDomain }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl m-2">
      <figure>
        <iframe
          className="card-actions justify-end"
          src={`https://player.twitch.tv/?video=${id}&parent=${parentDomain}&autoplay=false`}
          height="300"
          width="400"
          allowFullScreen={true}
        ></iframe>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">いいね</button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
