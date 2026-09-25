"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { fetchSearch } from "@/utils/api";
import { SearchIcon } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const grotesk = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  const searchRequestId = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    const requestId = ++searchRequestId.current;
    const timeoutId = setTimeout(async () => {
      const data = await fetchSearch(trimmedQuery);
      if (searchRequestId.current !== requestId) return;

      setSuggestions(
        (Array.isArray(data) ? data : [])
          .filter((item) => item?.type === "SONG" && item?.name)
          .slice(0, 5),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  function handleSearch(event) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  return (
    <div
      className={` theme-surface theme-page  bg-(--theme-bg) text-(--theme-text) min-h-screen `}
    >
      {/* Hero */}
      <main className="relative overflow-hidden">
        <div className="relative z-20 flex justify-end pt-4 px-8">
          <ThemeToggle />
        </div>

        <section className="relative z-20 max-w-2xl mx-auto px-6 pt-20 sm:pt-28 pb-16 text-center">
          <p className="text-sm tracking-wide text-[#5B5F6E] mb-4">
            Turn a half-remembered feeling into a full-blown playlist.
          </p>

          <h1
            className={`${display.className} text-[2.6rem] sm:text-[3.4rem] leading-[1.08] mb-10`}
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600 font-bold">
              Listen,{" "}
            </span>
            What&rsquo;s looping
            <br />
            in your mind?
          </h1>

          <div className="relative">
            <form
              onSubmit={handleSearch}
              className="group flex items-center gap-3 rounded-full border border-[#DDE1EA] px-5 py-4 shadow-[0_1px_2px_rgba(20,22,31,0.04)] focus-within:border-[#4B3BFF] focus-within:shadow-[0_0_0_4px_rgba(75,59,255,0.12)] transition-shadow theme-surface theme-page  bg-(--theme-bg) text-(--theme-text)"
            >
              <button
                type="submit"
                aria-label="Search"
                className="shrink-0 text-[#5B5F6E] group-focus-within:text-[#4B3BFF]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m20 20-3.2-3.2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <input
                value={query}
                onChange={(e) => {
                  const nextQuery = e.target.value;
                  setQuery(nextQuery);
                  if (!nextQuery.trim()) setSuggestions([]);
                }}
                type="text"
                placeholder="Search what's looping in your mind"
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#9297A8]"
              />
              <div
                className="hidden sm:flex items-end gap-0.75 h-5"
                aria-hidden="true"
              >
                {[6, 14, 9, 18, 7].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.75 rounded-full bg-[#C7CBDA]"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </form>

            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-gray-700 theme-surface theme-page  bg-(--theme-bg) text-(--theme-text) py-2 text-left shadow-[0_12px_30px_rgba(20,22,31,0.12)]">
                {suggestions.map((song, index) => (
                  <button
                    key={song.videoId ?? index}
                    type="button"
                    onClick={() => {
                      setQuery(song.name);
                      router.push(`/search?q=${encodeURIComponent(song.name)}`);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors "
                  >
                    <SearchIcon
                      size={18}
                      className="text-gray-400 shrink-0 group-hover:text-white transition-colors"
                    />
                    <span className="min-w-0 truncate text-sm font-medium text-(--theme-text)">
                      {song.name}
                    </span>
                    <span className="ml-auto shrink-0 truncate text-xs text-[#9297A8]">
                      {song.artist?.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
