"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlaying,
  setVolumeState,
  nextTrack,
  prevTrack,
} from "../lib/features/playerSlice";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import Image from "next/image";
import YouTube from "react-youtube";

export default function AudioPlayerBar() {
  const dispatch = useDispatch();

  // 1. YouTube API Configuration Options
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1, // Auto-plays instantly when currentTrack.videoId changes
      controls: 0, // Hides native video elements
      disablekb: 1, // Disables YouTube hotkeys
      playsinline: 1, // Prevents mobile browsers from triggering native full-screen video
    },
  };

  // Extract values directly from Redux Store
  const { currentTrack, isPlaying, volume } = useSelector(
    (state) => state.player,
  );

  // Local presentation states for the playback progress bar
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Store the YouTube player instance instead of the HTML5 Audio object
  const ytPlayerRef = useRef(null);

  // 2. Track YouTube Timeline Events safely into local states
  useEffect(() => {
    let interval;

    if (isPlaying && ytPlayerRef.current) {
      interval = setInterval(() => {
        if (
          ytPlayerRef.current &&
          typeof ytPlayerRef.current.getCurrentTime === "function"
        ) {
          setCurrentTime(ytPlayerRef.current.getCurrentTime());
        }
      }, 1000); // Polls every second to advance progress bar smoothly
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // 3. Keep YouTube Instance playing and volume levels in sync with Redux Actions
  useEffect(() => {
    const player = ytPlayerRef.current;
    if (!player) return;

    // Sync Playback State
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }

    // Sync Volume Level (YouTube API accepts scale integers from 0 to 100)
    const ytVolumeValue = Math.round(volume * 100);
    player.setVolume(ytVolumeValue);
  }, [isPlaying, volume, currentTrack]);

  if (!currentTrack) return null; // Player remains hidden until a song triggers

  // 4. Capture the internal YouTube instance reference on mount/swap
  const onPlayerReady = (event) => {
    ytPlayerRef.current = event.target;
    setDuration(event.target.getDuration());

    // Sync initial global volume context to new item frame
    event.target.setVolume(Math.round(volume * 100));

    // Handle track state if user clicked an item while song was already active
    if (isPlaying) {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };

  // 5. Watch track state changes (like track endings)
  const onPlayerStateChange = (event) => {
    // Update live layout duration when video starts tracking
    if (event.data === 1) {
      // 1 is YT.PlayerState.PLAYING
      setDuration(event.target.getDuration());
    }

    // Auto-advance to next track when song finishes playing
    if (event.data === 0) {
      // 0 is YT.PlayerState.ENDED
      dispatch(nextTrack());
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (
      ytPlayerRef.current &&
      typeof ytPlayerRef.current.seekTo === "function"
    ) {
      ytPlayerRef.current.seekTo(time, true);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    dispatch(setVolumeState(val));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get fallback configuration for the image source thumbnail
  const thumbnailUrl =
    currentTrack?.thumbnails?.[0]?.url || currentTrack?.thumbnails?.url || "";

  return (
    <div className="fixed bottom-0 inset-x-0 h-20 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between text-white z-50">
      {/* HIDDEN AUDIO ENGINE ELEMENT */}
      <div className="pointer-events-none absolute h-0 w-0 opacity-0 overflow-hidden">
        <YouTube
          videoId={currentTrack.videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

      {/* Left Track Block */}
      <div className="flex items-center gap-3 w-1/4">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            className="rounded object-cover"
            width={60}
            height={60}
            loading="lazy"
            alt="SongTrackImage"
          />
        )}
        <div className="truncate">
          <p className="text-sm font-medium truncate">{currentTrack?.name}</p>
          <p className="text-xs text-zinc-400 truncate">
            {currentTrack?.artist?.name}
          </p>
        </div>
      </div>

      {/* Mid Timeline Playback interface Block */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(prevTrack())}
            className="text-zinc-400 hover:text-white"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={() => dispatch(setPlaying(!isPlaying))}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? (
              <Pause size={16} fill="black" />
            ) : (
              <Play size={16} fill="black" className="ml-0.5" />
            )}
          </button>
          <button
            onClick={() => dispatch(nextTrack())}
            className="text-zinc-400 hover:text-white"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="w-full flex items-center gap-2 text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime ?? ""}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-white"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Control Block */}
      <div className="flex items-center justify-end gap-2 w-1/4">
        <Volume2 size={16} className="text-zinc-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
          className="w-20 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}
