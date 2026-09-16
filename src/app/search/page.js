"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Music } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { fetchSearch } from "@/utils/api";
import TopResult from "../components/TopResult";
import SongList from "../components/SongList";
import Loading from "../components/Loading";
import ArtistList from "../components/ArtistList";
import AlbumList from "../components/AlbumList";

function SearchResultsInner() {
  const [results, setResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [progress, setProgress] = useState("w-[0%]");
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("q") ?? "";

  // Guards against out-of-order responses: if the user types a new query
  // before the previous fetchSearch call resolves, and that older request
  // happens to resolve *after* the newer one, this stops it from
  // overwriting the results for what's actually in the search box.
  const searchRequestIdRef = useRef(0);

  useEffect(() => {
    if (!querySearch.trim()) {
      setResults([]);
      return;
    }

    const requestId = ++searchRequestIdRef.current;

    const query = async () => {
      setProgress("w-[60%]");
      const data = await fetchSearch(querySearch);
      if (searchRequestIdRef.current !== requestId) return; // stale response, ignore
      setResults(data);
      setProgress("w-full");
    };

    query();
  }, [querySearch]);

  if (!querySearch.trim()) {
    return (
      <div className="theme-surface theme-page flex flex-col items-center justify-center min-h-[60vh] text-[var(--theme-muted)] bg-[var(--theme-bg)]">
        <Music size={48} className="mb-4 text-zinc-700" />
        <p className="text-lg">Type something above to start searching</p>
      </div>
    );
  }

  const songs = results.filter((i) => i.type === "SONG");
  const artists = results.filter((i) => i.type === "ARTIST");
  const albums = results.filter((i) => i.type === "ALBUM");
  const topResult = results[0];

  // Only drop the first song from the list if the Top Result card is
  // actually showing that same song — otherwise (top result is an artist
  // or album) every song in `songs` still needs to be listed.
  const displaySongs = topResult?.type === "SONG" ? songs.slice(1) : songs;

  return (
    <div className="theme-surface theme-page min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] select-none">
      {progress !== "w-full" && <Loading progress={progress} />}
      <div className="max-w-7xl mx-auto py-3 px-4 md:px-2 ">
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
        {results.length === 0 && progress === "w-full" ? (
          <div className="text-center py-24 text-[var(--theme-muted)]">
            No results found matching &quot;{querySearch}&quot;
          </div>
        ) : (
          <div className="mt-8">
            {progress === "w-full" && (
              topResult && <div className="grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-2 gap-8">
                {/* Top Result — mobile: 1st, desktop: top-left */}
                <div className="order-1 lg:col-start-1 lg:col-span-2 lg:row-start-1">
                  <TopResult topResult={topResult} />
                </div>

                {/* Songs — mobile: 2nd, desktop: right side, parallel to Top Result + Artists */}
                {(activeFilter === "All" || activeFilter === "Songs") && displaySongs.length > 0 && (
                <div className="order-2 lg:col-start-3 lg:col-span-3 lg:row-start-1 lg:row-span-2">
                  <h2 className="text-xl font-bold mb-4 text-zinc-200">
                    Songs
                  </h2>
                  {displaySongs.map((song, index) => (
                    <SongList key={song?.videoId ?? index} song={song} />
                  ))}
                </div>
                  )}

                {/* Artists — mobile: 3rd, desktop: bottom-left, under Top Result */}
                {(activeFilter === "Artists" || activeFilter === "All") && artists.length > 0 && (
                  <div className="order-3 lg:col-start-1 lg:col-span-2 lg:row-start-2">
                    <h2 className="text-xl font-bold mb-4 text-zinc-200">
                      Artists
                    </h2>
                    <div className="flex flex-col gap-1">
                      {artists.map((artist, idx) => (
                        <ArtistList artsit={artist} key={artist?.browseId ?? idx} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(activeFilter === "All" || activeFilter === "Albums") &&
          albums.length > 0 &&
          progress === "w-full" && (
            <div className="mb-22">
              <h2 className="text-xl font-bold mb-6 text-zinc-200">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {albums.map((al, idx) => (
                  <AlbumList al={al} key={al?.browseId ?? idx} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

// FIX: useSearchParams requires a Suspense boundary in the App Router
export default function SearchResults() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303]" />}>
      <SearchResultsInner />
    </Suspense>
  );
}