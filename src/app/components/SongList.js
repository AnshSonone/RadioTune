"use client";

import { Pause, Play, Music } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { playQueue, setPlaying, setTrack } from "../lib/features/playerSlice";
import { useEffect } from "react";
import { fetchSongsData } from "@/utils/api";

export default function SongList({ song }) {
  const dispatch = useDispatch();

  const { isPlaying, currentTrack } = useSelector((state) => state.player);

  const songPlaying = () => {
    dispatch(setPlaying(true));
    dispatch(setTrack(song));
    dispatch(playQueue({ tracks: [song] }));
  };

  const thumbnailUrl = song?.thumbnails?.[1 || 0]?.url;

  return (
    <div className="">
      <div
        onClick={songPlaying}
        className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/40 transition group cursor-pointer"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {isPlaying && song?.videoId === currentTrack?.videoId ? (
            <Pause size={16} className="text-white" />
          ) : (
            <Play size={16} className="text-white" />
          )}
          <div className="shrink-0 rounded-md overflow-hidden bg-zinc-800">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                width={52}
                height={52}
                alt="Tile"
                loading="eager"
                className="object-cover"
              />
            ) : (
              <Music
                size={16}
                className="text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            )}  
          </div>
          <div className="truncate">
            <h4 className="text-white font-medium truncate">
              {song?.name?.slice(0, 15)}...
            </h4>
            <p className="text-sm text-zinc-400 truncate">
              {song?.artist?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
