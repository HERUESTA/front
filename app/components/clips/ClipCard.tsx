// ClipCard.tsx
"use client"; 

import React from 'react';

type ClipCardProps = {
  id: string;
  title: string;
  parentDomain: string;
};

const ClipCard: React.FC<ClipCardProps> = ({ id, title, parentDomain }) => {
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
        </div>
      </div>
    </div>
  );
};

export default ClipCard;