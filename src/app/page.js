'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import { fetchSearch } from '@/utils/api';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const grotesk = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const MOODS = ['Lo-fi', 'Indie', '90s Rock', 'Piano', 'Late Night'];

const TRENDING = [
  { rank: '01', title: 'Midnight City', artist: 'M83', duration: '4:04', live: true },
  { rank: '02', title: 'Electric Feel', artist: 'MGMT', duration: '3:49' },
  { rank: '03', title: 'Heat Waves', artist: 'Glass Animals', duration: '3:58' },
  { rank: '04', title: 'Space Song', artist: 'Beach House', duration: '5:23' },
  { rank: '05', title: 'Redbone', artist: 'Childish Gambino', duration: '5:27' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeMood, setActiveMood] = useState(null);
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
          .filter((item) => item?.type === 'SONG' && item?.name)
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
    <div className={`${grotesk.className} min-h-screen bg-[#F3F5F9] text-[#14161F]`}>
      {/* Hero */}
      <main className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60 bg-[repeating-linear-gradient(90deg,#E7E9F1_0px,#E7E9F1_1px,transparent_1px,transparent_16px)]"
        />

        <section className="relative max-w-2xl mx-auto px-6 pt-20 sm:pt-28 pb-16 text-center">
          <p className="text-sm tracking-wide text-[#5B5F6E] mb-4">
            Turn a half-remembered feeling into a full-blown playlist.
          </p>

          <h1 className={`${display.className} text-[2.6rem] sm:text-[3.4rem] leading-[1.08] mb-10`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold">Listen, </span>
            What&rsquo;s looping
            <br />
            in your mind?
          </h1>

          <div className="relative">
            <form onSubmit={handleSearch} className="group flex items-center gap-3 rounded-full bg-white border border-[#DDE1EA] px-5 py-4 shadow-[0_1px_2px_rgba(20,22,31,0.04)] focus-within:border-[#4B3BFF] focus-within:shadow-[0_0_0_4px_rgba(75,59,255,0.12)] transition-shadow">
              <button
                type="submit"
                aria-label="Search"
                className="shrink-0 text-[#5B5F6E] group-focus-within:text-[#4B3BFF]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              <div className="hidden sm:flex items-end gap-[3px] h-5" aria-hidden="true">
                {[6, 14, 9, 18, 7].map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-[#C7CBDA]"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </form>

            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-[#DDE1EA] bg-white py-2 text-left shadow-[0_12px_30px_rgba(20,22,31,0.12)]">
                {suggestions.map((song, index) => (
                  <button
                    key={song.videoId ?? index}
                    type="button"
                    onClick={() => {
                      setQuery(song.name);
                      router.push(`/search?q=${encodeURIComponent(song.name)}`);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-[#F3F5F9]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9297A8]">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="min-w-0 truncate text-sm font-medium text-[#3C3F4C]">{song.name}</span>
                    <span className="ml-auto shrink-0 truncate text-xs text-[#9297A8]">{song.artist?.name}</span>
                  </button>
                ))}
              </div>
            )}
            </div>

          {/* <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-sm text-[#9297A8] mr-1">Try</span>
            {MOODS.map((mood) => {
              const active = activeMood === mood;
              return (
                <button
                  key={mood}
                  onClick={() => setActiveMood(active ? null : mood)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-[#14161F] border-[#14161F] text-[#F3F5F9]'
                      : 'border-[#DDE1EA] text-[#3C3F4C] hover:border-[#4B3BFF] hover:text-[#4B3BFF]'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div> */}
        </section>

        {/* Trending list */}
        {/* <section className="relative max-w-2xl mx-auto px-6 pb-24">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className={`${display.className} text-xl`}>Trending right now</h2>
            <a href="#" className="text-sm text-[#5B5F6E] hover:text-[#4B3BFF] transition-colors">
              See all
            </a>
          </div>

          <ol className="divide-y divide-[#E1E4ED] border-t border-b border-[#E1E4ED]">
            {TRENDING.map((track) => (
              <li
                key={track.rank}
                className="group flex items-center gap-4 py-4 px-2 -mx-2 rounded-xl hover:bg-white transition-colors"
              >
                <span className="w-6 text-sm text-[#9297A8] tabular-nums">{track.rank}</span>

                <button
                  aria-label={`Play ${track.title}`}
                  className="shrink-0 w-9 h-9 rounded-full border border-[#DDE1EA] flex items-center justify-center group-hover:border-[#4B3BFF] group-hover:text-[#4B3BFF] transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                <div className="flex-1 min-w-0 text-left">
                  <p className="truncate">{track.title}</p>
                  <p className="text-sm text-[#9297A8] truncate">{track.artist}</p>
                </div>

                {track.live && (
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#FF6B4A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
                    Live now
                  </span>
                )}

                <span className="text-sm text-[#9297A8] tabular-nums">{track.duration}</span>
              </li>
            ))}
          </ol>
        </section> */}
      </main>
    </div>
  );
}