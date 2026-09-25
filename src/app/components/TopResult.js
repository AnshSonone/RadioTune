"use client";

import { Music, User, Play, Pause } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setPlaying, setTrack, playQueue } from "../lib/features/playerSlice";

export default function TopResult({ topResult }) {
  const dispatch = useDispatch();

  const { isPlaying, currentTrack } = useSelector((state) => state.player);

  const songPlaying = () => {
    dispatch(setPlaying(true));
    dispatch(setTrack(topResult));
    dispatch(playQueue({ tracks: [topResult] }));
  };

  const thumbnailUrl =
    topResult?.thumbnails?.[topResult?.length > 0 ? 1 : 0]?.url;

  return (
    <div className="col-span-1 lg:col-span-2">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-zinc-200">
        Top Result
      </h2>
      <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-2xl group hover:bg-zinc-800/40 transition cursor-pointer">
        <div
          className={`w-16 h-16 sm:w-24 sm:h-24 bg-zinc-800 flex items-center justify-center mb-4 sm:mb-6 overflow-hidden ${
            topResult?.type === "Artist"
              ? "rounded-full shadow-2xl"
              : "rounded-xl shadow-lg"
          }`}
        >
          {topResult?.type === "Artist" ? (
            <User size={32} className="text-zinc-400 sm:hidden" />
          ) : !thumbnailUrl ? (
            <Music size={32} className="text-zinc-400 sm:hidden" />
          ) : (
            <Image
              src={thumbnailUrl}
              width={100}
              height={100}
              alt="Cover"
              loading="eager"
              className="object-cover"
            />
          )}
          {topResult?.type === "Artist" ? (
            <User size={40} className="text-zinc-400 hidden sm:block" />
          ) : !thumbnailUrl ? (
            <Music size={40} className="text-zinc-400 hidden sm:block" />
          ) : null}
        </div>

        <div className="flex justify-between items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl lg:text-3xl font-black truncate text-white">
              {topResult?.name}
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 sm:mt-2 flex items-center flex-wrap gap-1.5 font-medium">
              <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider">
                {topResult?.type}
              </span>
              {topResult?.artist && (
                <>
                  <span>•</span>
                  <span className="truncate">{topResult?.artist?.name}</span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={songPlaying}
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white text-black flex justify-center items-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying && topResult?.videoId === currentTrack?.videoId ? (
              <Pause size={18} fill="black" className="sm:hidden" />
            ) : (
              <Play size={18} fill="black" className="ml-0.5 sm:hidden" />
            )}
            {isPlaying && topResult?.videoId === currentTrack?.videoId ? (
              <Pause size={20} fill="black" className="hidden sm:block" />
            ) : (
              <Play size={20} fill="black" className="ml-0.5 hidden sm:block" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}