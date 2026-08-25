"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlaying,
  setVolumeState,
  nextTrack,
  prevTrack,
} from "../lib/features/playerSlice";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ChevronDown,
  X,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Mic2,
} from "lucide-react";
import Image from "next/image";
import YouTube from "react-youtube";
import { fetchLyricsData } from "@/utils/api";

// Turns whatever fetchLyricsData gives us into a consistent
// [{ time, text }] shape so we can highlight the line that matches
// playback position. If the source already has timestamps (time /
// startTime, common LRC-style fields) those are used as-is for a real
// karaoke sync. If it's just plain strings, we spread them evenly across
// the track's duration — not perfectly accurate, but it still gives a
// moving, "currently singing" line instead of a static wall of text.
function normalizeLyrics(raw, duration) {
  if (!raw || raw.length === 0) return [];

  const first = raw[0];
  const hasTimestamps =
    first && typeof first === "object" && ("time" in first || "startTime" in first);

  if (hasTimestamps) {
    return raw
      .map((line) => ({
        time: Number(line.time ?? line.startTime ?? 0),
        text: line.text ?? line.line ?? "",
      }))
      .sort((a, b) => a.time - b.time);
  }

  const total = duration > 0 ? duration : raw.length * 4; // ~4s/line fallback before duration is known
  const step = total / raw.length;

  return raw.map((line, idx) => ({
    time: idx * step,
    text: typeof line === "string" ? line : line?.text || "",
  }));
}

export default function AudioPlayerBar() {
  const dispatch = useDispatch();

  // 1. YouTube API Configuration Options
  const opts = {
    height: "1",
    width: "1",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      playsinline: 1,
    },
  };

  const { currentTrack, isPlaying, volume } = useSelector(
    (state) => state.player,
  );

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState([]);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  // ---- new local UI state (not in redux yet) ----
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("queue");
  const [liked, setLiked] = useState(() => new Set());
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false); // visual only — see note near handleNextClick
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "one" — implemented locally
  const [queueScrolled, setQueueScrolled] = useState(false); // shrinks artwork while scrolling the queue list

  const ytPlayerRef = useRef(null);
  const lyricsRequestIdRef = useRef(0); // guards against stale/out-of-order lyric responses
  const queueScrollRef = useRef(null); // scroll container for the queue list (drives the artwork shrink)
  const lyricsBoxRef = useRef(null); // scroll container for the small in-place lyrics box
  const lyricLineRefs = useRef([]); // DOM refs for each lyric line, so the active one can be scrolled into view

  useEffect(() => {
    let interval;

    if (isPlaying && ytPlayerRef.current) {
      interval = setInterval(() => {
        if (
          ytPlayerRef.current &&
          typeof ytPlayerRef.current.getCurrentTime === "function"
        ) {
          setCurrentTime(ytPlayerRef.current.getCurrentTime());
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const player = ytPlayerRef.current;
    if (!player || typeof player.playVideo !== "function") return;
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const player = ytPlayerRef.current;
    if (!player || typeof player.setVolume !== "function") return;
    player.setVolume(Math.round(volume * 100));
  }, [volume]);

  useEffect(() => {
    const player = ytPlayerRef.current;
    if (!player || typeof player.setVolume !== "function") return;
    player.setVolume(muted ? 0 : Math.round(volume * 100));
  }, [muted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onFreeze = () => console.log("Page frozen by browser");
    const onResume = () => console.log("Page resumed");
    document.addEventListener("freeze", onFreeze);
    document.addEventListener("resume", onResume);
    return () => {
      document.removeEventListener("freeze", onFreeze);
      document.removeEventListener("resume", onResume);
    };
  }, []);

  // Lyrics now follow whichever track is actually playing: as soon as the
  // track changes we clear the old lyrics, and if the lyrics tab is open we
  // immediately fetch the new track's lyrics. A request id guards against a
  // slow response for a previous song landing after the user has skipped on.
  useEffect(() => {
    setLyrics([]);
    setLyricsLoading(false);

    if (activeTab !== "lyrics" || !currentTrack?.videoId) return;

    const requestId = ++lyricsRequestIdRef.current;
    setLyricsLoading(true);

    fetchLyricsData(currentTrack.videoId)
      .then((data) => {
        if (lyricsRequestIdRef.current !== requestId) return; // stale response, ignore
        setLyrics(data || []);
      })
      .catch(() => {
        if (lyricsRequestIdRef.current !== requestId) return;
        setLyrics([]);
      })
      .finally(() => {
        if (lyricsRequestIdRef.current !== requestId) return;
        setLyricsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.videoId, activeTab]);

  // Reset the "scrolled" state whenever the queue isn't in view, so the
  // artwork always comes back to full size the next time it's opened.
  useEffect(() => {
    if (activeTab !== "queue" || !expanded) setQueueScrolled(false);
  }, [activeTab, expanded]);

  const normalizedLyrics = useMemo(
    () => normalizeLyrics(lyrics, duration),
    [lyrics, duration],
  );

  // Which line is being sung right now, based on playback position.
  const activeLyricIndex = useMemo(() => {
    if (!normalizedLyrics.length) return -1;
    let idx = 0;
    for (let i = 0; i < normalizedLyrics.length; i++) {
      if (normalizedLyrics[i].time <= currentTime) idx = i;
      else break;
    }
    return idx;
  }, [normalizedLyrics, currentTime]);

  // Keep the active line centered in view as it advances, karaoke-style.
  useEffect(() => {
    if (activeTab !== "lyrics") return;
    const container = lyricsBoxRef.current;
    const activeEl = lyricLineRefs.current[activeLyricIndex];
    if (!container || !activeEl) return;

    const targetTop =
      activeEl.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;
    container.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
  }, [activeLyricIndex, activeTab]);

  if (!currentTrack) return null;

  const onPlayerReady = (event) => {
    ytPlayerRef.current = event.target;
    setDuration(event.target.getDuration());
    event.target.setVolume(muted ? 0 : Math.round(volume * 100));
    if (isPlaying) {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) {
      setDuration(event.target.getDuration());
    }
    if (event.data === 0) {
      // ENDED
      if (repeatMode === "one") {
        event.target.seekTo(0, true);
        event.target.playVideo();
        return;
      }
      dispatch(nextTrack());
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (
      ytPlayerRef.current &&
      typeof ytPlayerRef.current.seekTo === "function"
    ) {
      ytPlayerRef.current.seekTo(time, true);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setMuted(false);
    dispatch(setVolumeState(val));
  };

  // Scroll handler for the queue list — once the user scrolls past a small
  // threshold we shrink the artwork to make more room; scrolling back to the
  // top restores it.
  const handleQueueScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    setQueueScrolled((prev) => {
      if (top > 12 && !prev) return true;
      if (top <= 12 && prev) return false;
      return prev;
    });
  };

  // NOTE: shuffle is a visual toggle for now. Once playerSlice has a
  // queue/order concept, wire this to actually randomize next-track order
  // (e.g. dispatch(setShuffle(!shuffle)) and branch inside nextTrack's reducer).
  const handleNextClick = () => dispatch(nextTrack());

  const cycleRepeat = () => setRepeatMode((m) => (m === "off" ? "one" : "off"));

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTrackBackground = (value, max) => {
    const percent = max > 0 ? (value / max) * 100 : 0;
    return `linear-gradient(to right, #001c53 ${percent}%, #27272a ${percent}%)`;
  };

  const getVoluneBackground = (value, max) => {
    const percent = max > 0 ? (value / max) * 100 : 0;
    return `linear-gradient(to right, #001c53 ${percent}%, #27272a ${percent}%)`;
  };

  const thumbnailUrl =
    currentTrack?.thumbnails?.[1 || 0]?.url ||
    currentTrack?.thumbnails?.url ||
    "";

  const VolIcon =
    muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      <style>{`
        @keyframes eqBar { 0%, 100% { height: 30%; } 50% { height: 100%; } }
        .eq-bar { animation: eqBar 0.9s ease-in-out infinite; }
      `}</style>

      {/* HIDDEN AUDIO ENGINE ELEMENT — unchanged */}
      <div className="pointer-events-none fixed left-[9999px] top-0 h-px w-px overflow-hidden">
        <YouTube
          key="persistent-yt-player"
          videoId={currentTrack?.videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

      {/* ===== MINI BAR ===== */}
      <div className="fixed bottom-0 inset-x-0 z-70 h-16 sm:h-20 bg-zinc-950 border-t border-zinc-900 text-white">
        {/* thin progress line, mobile only */}
        <div className="sm:hidden absolute top-0 left-0 right-0 h-0.75 bg-zinc-800">
          <div
            className="h-full bg-white"
            style={{
              width: `${duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
            }}
          />
        </div>

        <div className="flex items-center h-full px-3 sm:px-6 gap-3 sm:gap-4">
          {/* Track info — tap to expand on mobile, static on desktop */}
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-3 min-w-0 flex-1 sm:w-1/4 sm:flex-none text-left"
          >
            {thumbnailUrl && (
              <div className="relative w-11 h-11 sm:w-15 sm:h-15 rounded overflow-hidden shrink-0 bg-zinc-800">
                <Image
                  src={thumbnailUrl}
                  fill
                  sizes="60px"
                  className="object-cover"
                  alt="SongTrackImage"
                />
              </div>
            )}
            <div className="truncate">
              <p className="text-sm font-medium truncate">
                {currentTrack?.name}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {currentTrack?.artist?.name}
              </p>
            </div>
          </button>

          {/* Desktop transport + seek — hidden once the panel is open, so
              controls only live in one place at a time (avoids duplicate
              play/pause/skip in both the bar and the floating panel) */}
          {!expanded && (
            <div className="hidden sm:flex flex-col items-center gap-1.5 flex-1 max-w-xl">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShuffle((s) => !s)}
                  className={
                    shuffle ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }
                >
                  <Shuffle size={16} />
                </button>
                <button
                  onClick={() => dispatch(prevTrack())}
                  className="text-zinc-400 hover:text-white"
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={() => dispatch(setPlaying(!isPlaying))}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
                >
                  {isPlaying ? (
                    <Pause size={16} fill="black" />
                  ) : (
                    <Play size={16} fill="black" className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNextClick}
                  className="text-zinc-400 hover:text-white"
                >
                  <SkipForward size={18} />
                </button>
                <button
                  onClick={cycleRepeat}
                  className={
                    repeatMode !== "off"
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }
                >
                  {repeatMode === "one" ? (
                    <Repeat1 size={16} />
                  ) : (
                    <Repeat size={16} />
                  )}
                </button>
              </div>

              <div className="w-full flex items-center gap-2 text-xs text-zinc-400">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime ?? 0}
                  onChange={handleSeek}
                  style={{
                    background: getTrackBackground(currentTime, duration),
                  }}
                  className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-white"
                />
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* When collapsed on desktop, this spacer keeps the track info
              pinned left and the right controls pinned right, same as before */}
          {expanded && <div className="hidden sm:block flex-1" />}

          {/* Mobile play button */}
          <button
            onClick={() => dispatch(setPlaying(!isPlaying))}
            className="sm:hidden w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shrink-0"
          >
            {isPlaying ? (
              <Pause size={16} fill="black" />
            ) : (
              <Play size={16} fill="black" className="ml-0.5" />
            )}
          </button>

          {/* Desktop right controls — volume always lives here (the panel
              has no volume slider), transport/like collapse away when the
              panel is open since the panel already covers them */}
          <div className="hidden sm:flex items-center justify-end gap-3 w-1/4">
            {!expanded && (
              <button onClick={() => toggleLike(currentTrack?.videoId)}>
                <Heart
                  size={18}
                  className={
                    liked.has(currentTrack?.videoId)
                      ? "text-red-500"
                      : "text-zinc-400 hover:text-white"
                  }
                  fill={
                    liked.has(currentTrack?.videoId) ? "currentColor" : "none"
                  }
                />
              </button>
            )}
            <button
              onClick={() => setMuted((m) => !m)}
              className="text-zinc-400 hover:text-white"
            >
              <VolIcon size={16} />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              style={{ background: getVoluneBackground(muted ? 0 : volume, 1) }}
              className="w-20 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-white"
            />
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-zinc-400 hover:text-white"
            >
              {expanded ? <ChevronDown size={18} /> : <ListMusic size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== EXPANDED NOW PLAYING ===== */}
      <div
        className={`fixed z-60 inset-0 sm:inset-auto sm:right-4 sm:top-4 sm:bottom-24 sm:w-100 sm:rounded-2xl overflow-hidden transition-transform duration-300 ease-out  ${
          expanded ? "translate-y-0" : "translate-y-full sm:translate-y-[110%]"
        }`}
      >
        <div className="relative w-full h-full bg-zinc-950 sm:shadow-2xl sm:border sm:border-zinc-800">
          {thumbnailUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-150 blur-3xl opacity-40 saturate-150 transition-[background-image] duration-700"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative h-full flex flex-col text-white">
            <div className="flex items-center justify-between px-4 pt-4 sm:pt-3 shrink-0">
              <button
                onClick={() => setExpanded(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                <ChevronDown size={20} className="sm:hidden" />
                <X size={18} className="hidden sm:block" />
              </button>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-300">
                Now Playing
              </p>
              <div className="w-8" />
            </div>

            <div className="flex flex-col items-center px-6 pt-6 sm:pt-4 shrink-0">
              {activeTab === "queue" ? (
                thumbnailUrl && (
                  <div
                    className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
                      queueScrolled
                        ? "w-24 h-24 sm:w-21 sm:h-21 mb-2 sm:mb-1.5"
                        : "w-48 h-48 sm:w-42 sm:h-42 mb-5 sm:mb-3"
                    }`}
                  >
                    <Image
                      src={thumbnailUrl}
                      fill
                      sizes="192px"
                      className="object-cover"
                      alt="SongTrackImage"
                    />
                  </div>
                )
              ) : (
                <div
                  ref={lyricsBoxRef}
                  className="w-48 h-48 sm:w-40 sm:h-40 mx-auto rounded-xl overflow-y-auto no-scrollbar mb-5 sm:mb-3 px-3 py-3 shrink-0"
                >
                  {(() => {
                    lyricLineRefs.current = [];
                    return lyricsLoading ? (
                      <p className="text-sm text-zinc-500 text-center mt-8">
                        Loading lyrics...
                      </p>
                    ) : normalizedLyrics.length !== 0 ? (
                      normalizedLyrics.map((line, idx) => {
                        const distance = Math.abs(idx - activeLyricIndex);
                        const isActive = idx === activeLyricIndex;
                        return (
                          <p
                            key={idx}
                            ref={(el) => (lyricLineRefs.current[idx] = el)}
                            className={`text-center py-0.5 transition-all duration-300 ease-out ${
                              isActive
                                ? "text-white font-bold text-sm scale-105"
                                : distance === 1
                                  ? "text-zinc-300 text-sm"
                                  : "text-zinc-600 text-sm"
                            }`}
                          >
                            {line.text}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-sm text-zinc-500 text-center mt-8">
                        Lyrics aren't available for this track yet.
                      </p>
                    );
                  })()}
                </div>
              )}
              <div className="w-full flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-base font-bold truncate">
                    {currentTrack?.name}
                  </h3>
                  <p className="text-sm text-zinc-400 truncate">
                    {currentTrack?.artist?.name}
                  </p>
                </div>
                <button
                  onClick={() => toggleLike(currentTrack?.videoId)}
                  className="shrink-0"
                >
                  <Heart
                    size={22}
                    className={
                      liked.has(currentTrack?.videoId)
                        ? "text-red-500"
                        : "text-zinc-400 hover:text-white"
                    }
                    fill={
                      liked.has(currentTrack?.videoId) ? "currentColor" : "none"
                    }
                  />
                </button>
              </div>

              <div className="w-full mt-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime ?? 0}
                  onChange={handleSeek}
                  style={{
                    background: getTrackBackground(currentTime, duration),
                  }}
                  className="w-full h-1 rounded appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4">
                <button
                  onClick={() => setShuffle((s) => !s)}
                  className={
                    shuffle ? "text-white" : "text-zinc-400 hover:text-white"
                  }
                >
                  <Shuffle size={18} />
                </button>
                <button
                  onClick={() => dispatch(prevTrack())}
                  className="text-white hover:scale-105 transition"
                >
                  <SkipBack size={24} fill="currentColor" />
                </button>
                <button
                  onClick={() => dispatch(setPlaying(!isPlaying))}
                  className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition"
                >
                  {isPlaying ? (
                    <Pause size={24} fill="black" />
                  ) : (
                    <Play size={24} fill="black" className="ml-1" />
                  )}
                </button>
                <button
                  onClick={handleNextClick}
                  className="text-white hover:scale-105 transition"
                >
                  <SkipForward size={24} fill="currentColor" />
                </button>
                <button
                  onClick={cycleRepeat}
                  className={
                    repeatMode !== "off"
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  }
                >
                  {repeatMode === "one" ? (
                    <Repeat1 size={18} />
                  ) : (
                    <Repeat size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-6 mt-6 shrink-0">
              <button
                onClick={() => setActiveTab("queue")}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  activeTab === "queue"
                    ? "bg-white text-black"
                    : "bg-white/10 text-zinc-300 hover:bg-white/20"
                }`}
              >
                <ListMusic size={14} /> Queue
              </button>
              <button
                onClick={() => setActiveTab("lyrics")}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  activeTab === "lyrics"
                    ? "bg-white text-black"
                    : "bg-white/10 text-zinc-300 hover:bg-white/20"
                }`}
              >
                <Mic2 size={14} /> Lyrics
              </button>
            </div>

            <div
              ref={queueScrollRef}
              onScroll={handleQueueScroll}
              className="flex-1 min-h-0 mt-3 px-3 pb-6 overflow-y-auto no-scrollbar"
            >
              {activeTab === "queue" && (
                <div className="flex flex-col">
                  {/* Only the current track is known right now — no queue in redux yet.
                      Once playerSlice has a queue array, map over it here and dispatch
                      a "playTrackAt(index)" style action on click. */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10">
                    {thumbnailUrl && (
                      <div className="relative w-9 h-9 rounded overflow-hidden shrink-0 bg-zinc-800">
                        <Image src={thumbnailUrl} fill sizes="36px" className="object-cover" alt="" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-semibold truncate">{currentTrack?.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{currentTrack?.artist?.name}</p>
                    </div>
                    <div className="flex items-end gap-0.5 h-3 w-4">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="eq-bar w-0.75 bg-white rounded-sm"
                          style={{
                            animationDelay: `${i * 0.15}s`,
                            animationPlayState: isPlaying ? "running" : "paused",
                            height: isPlaying ? undefined : "30%",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 text-center mt-6 px-4">
                    Nothing queued yet. Songs you add next will show up here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}