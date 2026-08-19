"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MoreVertical, Music, User, Disc, Play } from "lucide-react";
import SongTiles from "../components/SongTIles";
import { useSearchParams } from "next/navigation";
import Image from "next/image";



const DemoAPI = [
  {
    trackId: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    album: "Whenever You Need Somebody",
    durationSeconds: 212,
    imageUrl:
      "https://images.unsplash.com/photo-1782466240456-d0cb52d1d920?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  },
  {
    trackId: "kJQP7kiw5Fk",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    album: "Vida",
    durationSeconds: 229,
    imageUrl:
      "https://images.unsplash.com/photo-1786616207540-ccac22814fcb?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  },
  {
    trackId: "9bZkp7q19f0",
    title: "Gangnam Style",
    artist: "PSY",
    album: "Psy 6th (Six Rules), Part 1",
    durationSeconds: 239,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661885493074-e18964497278?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  },
  {
    trackId: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    album: "Whenever You Need Somebody",
    durationSeconds: 212,
    imageUrl:
      "https://images.unsplash.com/photo-1782466240456-d0cb52d1d920?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  },
  {
    trackId: "kJQP7kiw5Fk",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    album: "Vida",
    durationSeconds: 229,
    imageUrl:
      "https://images.unsplash.com/photo-1786616207540-ccac22814fcb?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  },
  {
    trackId: "9bZkp7q19f0",
    title: "Gangnam Style",
    artist: "PSY",
    album: "Psy 6th (Six Rules), Part 1",
    durationSeconds: 239,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661885493074-e18964497278?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    youtubeUrl: "https://youtube.com",
  },
];


export default function SearchResults() {
  // const searchQuery = useSelector((state) => state.search.query || "");
  const [results, setResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const searchParams = useSearchParams()

  const querySearch = searchParams.get('q')


  
  useEffect(() => {
    if (!querySearch.trim()) {
      setResults([]);
      return;
    }
    const lower = querySearch.toLowerCase().trim();
    setResults(
      DemoAPI.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
        (item.artist && item.artist.toLowerCase().includes(lower)),
      ),
    );
  }, [querySearch]);  

  if (!querySearch.trim()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 bg-[#030303]">
        <Music size={48} className="mb-4 text-zinc-700" />
        <p className="text-lg">Type something above to start searching</p>
      </div>
    );
  }

  const songs = results.filter((i) => i.type === "Song");
  const artists = results.filter((i) => i.Type === "Artist");
  const albums = results.filter((i) => i.Type === "Album");
  const topResult = results[0];

  return (
    <div className="min-h-screen bg-[#030303] text-white px-4 md:px-12 py-6 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 overflow-x-auto pb-4 border-b border-zinc-800 scrollbar-none">
          {["All", "Songs", "Artists", "Albums"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                activeFilter === f
                  ? "bg-white text-black font-bold"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            No results found matching &quot;{querySearch}&quot;
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(activeFilter === "All" || activeFilter === "Artists") && (
              <div className="flex flex-col gap-8">
                {activeFilter === "All" && topResult && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-zinc-200">
                      Top Result
                    </h2>
                    <div className="bg-[#121212] border border-zinc-900 p-6 rounded-2xl relative group hover:bg-zinc-800/40 transition cursor-pointer">
                      <div
                        className={`w-24 h-20 bg-zinc-800 flex items-center justify-center mb-6 ${topResult.Type === "Artist" ? "rounded-full" : "rounded-xl"}`}
                      >
                        {topResult.Type === "Artist" ? (
                          <User size={40} className="text-zinc-400" />
                        ) : (
                          !topResult.imageUrl ?
                          <Music size={40} className="text-zinc-400" />
                          :
                          <Image
                            src={topResult.imageUrl}
                            width={100}
                            height={100}
                            alt="SongCover"
                          />
                        )}
                      </div>
                      <h3 className="text-2xl font-black truncate text-white">
                        {topResult.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2 flex items-center gap-1.5">
                        <span className="capitalize">{topResult.Type}</span>
                        {topResult.artist && (
                          <>
                            • <span>{topResult.artist}</span>
                          </>
                        )}
                      </p>
                      <button className="absolute bottom-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center">
                        <Play size={20} fill="black" className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {artists.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-200">Artists</h2>
            <div className="flex flex-col gap-1">
              {artists.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 hover:bg-zinc-900 rounded-xl group cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <User size={22} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold truncate">
                        {a.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {a.Followers}
                      </p>
                    </div>
                  </div>
                  <button className="text-zinc-400 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition rounded-full">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`flex flex-col gap-8 ${activeFilter === "All" ? "lg:col-span-2" : "lg:col-span-3"}`}
        >
          {(activeFilter === "All" || activeFilter === "Songs") &&
            songs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-zinc-200">Songs</h2>
                <div className="flex flex-col bg-zinc-900/20 rounded-2xl border border-zinc-900 overflow-hidden">
                  {songs.map((s, idx) => (
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 bg-zinc-800 rounded-md flex items-center justify-center relative shrink-0 overflow-hidden">
                        <Music
                          size={16}
                          className="text-zinc-500 group-hover:opacity-0"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                          <Play size={16} fill="white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold truncate">
                          {s.title}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {s.artist} • {s.album}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 ml-4 shrink-0">
                        <span className="text-xs text-zinc-500 font-medium hidden sm:flex items-center gap-1">
                          <Clock size={12} /> {String(s.durationSeconds / 60).slice(0, 4).replace(".", ":")}
                        </span>
                        <button className="text-zinc-400 hover:text-white p-1.5 rounded-full">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {(activeFilter === "All" || activeFilter === "Albums") &&
          albums.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-zinc-200">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {albums.map((al, idx) => (
                  <div
                    key={idx}
                    className="bg-[#121212]/40 border border-zinc-900 p-4 rounded-xl hover:bg-zinc-900 group cursor-pointer relative"
                  >
                    <div className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center mb-3 overflow-hidden relative">
                      <Disc
                        size={36}
                        className="text-zinc-500 transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                        <Play size={14} fill="black" className="ml-0.5" />
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold truncate text-white">
                      {al.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {al.artist} • {al.Year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      <div>
        {/* <div>
          <h3 className="font-bold text-gray-500">Top Search Result</h3>
          <div className="space-y-8 sm:space-x-8 my-4 mx-1 w-full sm:grid sm:grid-cols-2 md:grid-cols-3"> */}
            {/* {results.filter((item) => 
              item.title.includes(querySearch)
              
              <SongTiles
                item={item}
               />
            )} */}
          {/* </div>
        </div> */}
      </div>
    </div>
  );
}
