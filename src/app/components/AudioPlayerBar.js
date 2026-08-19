'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPlaying, setVolumeState, nextTrack, prevTrack } from '../lib/features/playerSlice';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Playing = {
    trackId: "9bZkp7q19f0",
    title: "Gangnam Style",
    artist: "PSY",
    album: "Psy 6th (Six Rules), Part 1",
    durationSeconds: 239,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661885493074-e18964497278?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  }

export default function AudioPlayerBar() {
  const dispatch = useDispatch();
  
  // Extract values directly from Redux Store
//   const { currentTrack, isPlaying, volume } = useSelector((state) => state.player);

const currentTrack = Playing.title
const isPlaying = true
const volume = 0.5
  
  // Local high-frequency presentation layer state (avoids lagging Redux)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // 1. Maintain singleton initialization on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 2. Track Audio Timeline Events safely into local states
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => dispatch(nextTrack());

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch]);

  // 3. Keep Native Audio playing states perfectly in sync with Redux State Switches
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // If source shifted, load the new stream route cleanly
    if (audio.src !== currentTrack.src) {
      audio.src = currentTrack.src;
    }

    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(() => dispatch(setPlaying(false)));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, volume, dispatch]);

  if (!currentTrack) return null; // Player remains hidden until a song triggers

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    dispatch(setVolumeState(val));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-0 inset-x-0 h-20 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between text-white z-50">
      
      {/* Left Track Block */}
      <div className="flex items-center gap-3 w-1/4">
        <img src={currentTrack.coverUrl} className="w-12 h-12 rounded object-cover" alt="" />
        <div className="truncate">
          <p className="text-sm font-medium truncate">{currentTrack.SongName}</p>
          <p className="text-xs text-zinc-400 truncate">{currentTrack.Artist}</p>
        </div>
      </div>

      {/* Mid Timeline Playback interface Block */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => dispatch(prevTrack())} className="text-zinc-400 hover:text-white"><SkipBack size={18} /></button>
          <button 
            onClick={() => dispatch(setPlaying(!isPlaying))} 
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
          </button>
          <button onClick={() => dispatch(nextTrack())} className="text-zinc-400 hover:text-white"><SkipForward size={18} /></button>
        </div>

        <div className="w-full flex items-center gap-2 text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
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
