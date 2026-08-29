"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { formatDuration } from "../../utils/helperFunc";
import { useDispatch } from "react-redux";
import { setPlaying, setTrack } from "../lib/features/playerSlice";

export default function SongList({ song }) {
  const dispatch = useDispatch();

  const songPlaying = () => {
    dispatch(setPlaying(true));
    dispatch(setTrack(song))
  };

  const thumbnailUrl = song?.thumbnails?.[1]?.url || "/placeholder.png"; // FIX: fallback

  return (
    <div className="flex flex-col">
      <div
        onClick={songPlaying}
        className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/40 transition group cursor-pointer"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Play />
          <div className="w-12 h-12 relative shrink-0 rounded-md overflow-hidden bg-zinc-800">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                sizes="100px"
                fill
                alt="Tile"
                loading="eager"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Play size={16} fill="white" className="text-white" />
            </div>
          </div>
          <div className="truncate">
            <h4 className="text-white font-medium truncate">{song?.name}</h4>
            <p className="text-sm text-zinc-400 truncate">
              {song?.artist?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <span className="text-sm text-zinc-500 font-mono">
            {formatDuration(song?.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
