import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Songlist from "../../components/songlist/songlist";
import { Tag, message } from "antd";
import {
  LikeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
  BackwardOutlined,
  ForwardOutlined,
} from "@ant-design/icons";
import { formatTiming } from "../../utils";

const Homepage = () => {
  const [musicList, setMusicList] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(false);

  const audio = useRef(null);

  const getMusicList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://api-stg.jam-community.com/song/trending"
      );
      setLoading(false);
      setMusicList(res.data);
      setCurrentSong(res.data[0]);
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Get songs, something went wrong");
    }
  }, []);

  useEffect(() => {
    getMusicList();
  }, [getMusicList]);

  const toggleAudio = () => {
    audio.current.paused ? audio.current.play() : audio.current.pause();
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const handleProgress = (e) => {
    let compute = (e.target.value * duration) / 100;
    setCurrentTime(compute);
    audio.current.currentTime = compute;
  };

  const prevSong = () => {
    let findIndex = musicList.findIndex((item) => item.id === currentSong.id);
    if (findIndex === 0) {
      setCurrentSong(musicList[musicList.length - 1]);
    } else {
      setCurrentSong(musicList[findIndex - 1]);
    }
    setPlaying(false);
    rerun();
  };

  const nextSong = () => {
    let findIndex = musicList.findIndex((item) => item.id === currentSong.id);
    if (findIndex === musicList.length - 1) {
      setCurrentSong(musicList[0]);
    } else {
      setCurrentSong(musicList[findIndex + 1]);
    }
    setPlaying(false);
    rerun();
  };

  const chooseSong = (index) => {
    setCurrentSong(musicList[index]);
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      rerun();
    }
  };

  const rerun = () => {
    setTimeout(() => {
      setPlaying(true);
      toggleAudio();
    }, 500);
  };

  const likeSong = async () => {
    try {
      setLiking(true);
      await axios.post(
        "https://api-stg.jam-community.com/interact/like?apikey= process.env.REACT_APP_API_KEY",
        {
          id: currentSong.id,
        },
        {
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
          },
        }
      );
      setLiking(false);
      message.success("Song liked successfully");
    } catch (error) {
      setLiking(false);
      message.error(
        `Like song, ${
          error?.response ? error.response.data.error : "something went wrong"
        }`
      );
    }
  };

  return (
    <div className="homepage">
      {loading ? (
        <div className="x-loader for-doccard">
          <LoadingOutlined style={{ fontSize: 60 }} />
        </div>
      ) : (
        <div className="homepage-main">
          {currentSong !== null && (
            <>
              <div className="song-top">
                <div className="top-img">
                  <img
                    src={currentSong.cover_image_path}
                    alt={currentSong.name}
                  />
                </div>
                <div className="info">
                  <p className="title">{currentSong.name}</p>
                  <div className="top-lower-details">
                    <p className="lower">
                      Song by: <b>{currentSong.artist_name}</b>
                    </p>
                    <p className="lower">
                      Genre(s):{" "}
                      {currentSong.song_genres.map((genres) => (
                        <Tag key={genres.id}>{genres.name}</Tag>
                      ))}
                    </p>
                    <Tag
                      icon={liking ? <LoadingOutlined /> : <LikeOutlined />}
                      color="#55acee"
                      className="action-tag"
                      onClick={() => {
                        if (!liking) {
                          likeSong();
                        }
                      }}
                    >
                      Like
                    </Tag>
                    <p className="timing">
                      <span>{formatTiming(currentTime)}</span>
                      <span>{formatTiming(currentSong.duration)}</span>
                    </p>
                  </div>
                  <audio
                    onEnded={nextSong}
                    onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                    ref={audio}
                    src={currentSong.music_file_path}
                    onCanPlay={(e) => setDuration(e.target.duration)}
                    type="audio/mpeg"
                    preload="true"
                    style={{
                      width: "100%",
                    }}
                  />
                  <div className="seek">
                    <div className="play-or-pause">
                      <BackwardOutlined
                        className="action-icon side"
                        onClick={() => prevSong()}
                      />
                      {!playing ? (
                        <PlayCircleOutlined
                          className="action-icon"
                          onClick={() => {
                            togglePlay();
                            toggleAudio();
                          }}
                        />
                      ) : (
                        <PauseCircleOutlined
                          className="action-icon"
                          onClick={() => {
                            togglePlay();
                            toggleAudio();
                          }}
                        />
                      )}
                      <ForwardOutlined
                        className="action-icon side"
                        onClick={() => nextSong()}
                      />
                    </div>
                    <div className="progress-holder">
                      <input
                        onChange={handleProgress}
                        value={duration ? (currentTime * 100) / duration : 0}
                        type="range"
                        name="progresBar"
                        id="prgbar"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="songlist-holder">
                {musicList.map((music, index) => (
                  <Songlist
                    currentSongId={currentSong.id}
                    key={music.id}
                    music={music}
                    chooseSong={chooseSong}
                    index={index}
                    playing={playing}
                    toggleAudio={toggleAudio}
                    togglePlay={togglePlay}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;
