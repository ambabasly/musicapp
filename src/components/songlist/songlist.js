import React from "react";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

export const Songlist = ({
  music,
  currentSongId,
  chooseSong,
  index,
  playing,
}) => {
  return (
    <div
      className={`songlist ${currentSongId === music.id ? "current" : ""}`}
      onClick={() => {
        chooseSong(index);
      }}
    >
      <div className="img-holder">
        <img src={music.cover_image_path} alt={music.name} />
      </div>
      <div className="song-details">
        <p className="title">{music.name}</p>
        <div className="lower-detail">
          <p className="lower">
            Song by: <b>{music.artist_name}</b>
          </p>
        </div>
      </div>
      <div className="play-or-pause">
        {playing && currentSongId === music.id ? (
          <PauseCircleOutlined className="action-icon" />
        ) : (
          <PlayCircleOutlined className="action-icon" />
        )}
      </div>
    </div>
  );
};
