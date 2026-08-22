"use client";

import { Music, User, Play } from "lucide-react";
import Image from "next/image";
import { formatDuration } from "../../utils/helperFunc";
import { useDispatch } from "react-redux";
import { setPlaying, setTrack } from "../lib/features/playerSlice";

export default function TopResult({ topResult }) {
  const dispatch = useDispatch();

  const songPlaying = () => {
    dispatch(setPlaying(true));
    dispatch(setTrack(topResult));
  };

  const thumbnailUrl = topResult?.thumbnails?.[0]?.url; // FIX: chain through thumbnails

  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-bold mb-4 text-zinc-200">Top Result</h2>
      <div className="bg-[#] border border-zinc-900 p-6 rounded-2xl relative group hover:bg-zinc-800/40 transition cursor-pointer">
        <div
          className={`w-24 h-24 bg-zinc-800 flex items-center justify-center mb-6 relative overflow-hidden ${
            topResult?.type === "Artist"
              ? "rounded-full shadow-2xl"
              : "rounded-xl shadow-lg"
          }`}
        >
          {topResult?.type === "Artist" ? (
            <User size={40} className="text-zinc-400" />
          ) : !thumbnailUrl ? (
            <Music size={40} className="text-zinc-400" />
          ) : (
            <Image
              src={thumbnailUrl}
              fill
              sizes="100px"
              alt="Cover"
              loading="eager"
              className="object-cover"
            />
          )}
        </div>
        <h3 className="text-3xl font-black truncate text-white">
          {topResult?.name}
        </h3>
        <p className="text-sm text-zinc-400 mt-2 flex items-center gap-1.5 font-medium">
          <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs uppercase tracking-wider">
            {topResult?.type}
          </span>
          {topResult?.artist && (
            <>
              • <span>{topResult?.artist?.name}</span> •{" "}
              <span>{formatDuration(topResult?.duration)}</span>
            </>
          )}
        </p>
        <button
          onClick={songPlaying}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl"
        >
          <Play size={20} fill="black" className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}