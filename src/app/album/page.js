"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import { Play, Clock } from "lucide-react"
import { fetchAlbumData } from "@/utils/api" 
import SongList from "../components/SongList"
import Loading from "../components/Loading"

function AlbumResultInner() {
  const searchParams = useSearchParams()
  const querySearch = searchParams.get("q")

  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState("w-[0%]")
  
  useEffect(() => {
    if (!querySearch || !querySearch.trim()) {
      setResult(null)
      setLoading(false)
      return
    }
    const query = async () => {
      setProgress("w-[60%]")
      try {
        const data = await fetchAlbumData(querySearch)
        setResult(data)
        setProgress("w-full")
      } catch (err) {
        console.error(err)
        setResult(null)
      }
    }
    query()
  }, [querySearch])

  return (
    <div className="min-h-screen bg-[#030303] text-white pb-24">
      {progress !== "w-full" ? <Loading progress={progress} /> : (
        <>
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 px-4 sm:px-8 pt-10 sm:pt-16 pb-8 bg-linear-to-b from-zinc-800/60 to-[#030303]">
        <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 relative shrink-0 rounded-lg overflow-hidden shadow-2xl bg-zinc-800">
          {result && (
            <Image
              src={result?.thumbnails[3]?.url}
              fill
              sizes="(max-width: 640px) 160px, 240px"
              alt={result?.artist?.name || "album cover"}
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Album
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mt-2 mb-3 wrap-break-words">
            {result?.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 truncate max-w-full">
            {result?.artist?.name}
            {result?.year ? ` • ${result.year}` : ""}
            {result?.songs?.length ? ` • ${result?.songs?.length} songs` : ""}
          </p>
        </div>
      </div>

      {/* Play button bar */}
      <div className="px-4 sm:px-8 py-4 flex items-center gap-4">
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-white    hover:scale-105 transition rounded-full flex items-center justify-center shadow-lg">
          <Play size={20} fill="black" className="ml-1 text-black" />
        </button>
      </div>

      {/* Track list */}
      <div className="px-2 sm:px-8">
        <div className="hidden sm:grid grid-cols-[2rem_1fr_auto] gap-4 px-4 py-2 text-xs text-zinc-400 border-b border-zinc-800 mb-2">
          <span>#</span>
          <span>{result?.name}</span>
          <Clock size={14} />
        </div>

        <div className="flex flex-col">
          {result?.songs?.map((song, idx) => (
            <SongList 
                song={song}
                key={idx}
            />
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  )
}

export default function AlbumResult() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303]" />}>
      <AlbumResultInner />
    </Suspense>
  )
}