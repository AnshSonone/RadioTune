'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, ArrowLeft, X, Clock, TrendingUp } from 'lucide-react';
import SearchSuggestion from './SearchSuggestion';
import { useDispatch } from 'react-redux';
import { addSuggestion } from '../lib/features/suggestionSlice';
import Link from 'next/link';
import { fetchSongs } from '@/utils/api';

const RECENT_SEARCHES = ['Linkin Park', 'Chill Lofi Beats', 'Kendrick Lamar'];
const TRENDING_SEARCHES = ['Blinding Lights Remix', 'Acoustic Hits 2026'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  // Close interface when clicking outside panel boundaries
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ MERGED FIX: Debounce API requests and calculate suggestions immediately on response
  // ✅ REPLACED EFFECT: Cleanly handles fetching, filtering, and safe global state updates
useEffect(() => {
  const trimmedQuery = query.toLowerCase().trim();
  
  if (!trimmedQuery) {
    setSuggestions([]);
    return;
  }

  const delayDebounceFn = setTimeout(async () => {
    try {
      const data = await fetchSongs(trimmedQuery);
      
      // 1. Force the response to be an array so loop filters don't crash
      const rawItems = Array.isArray(data) ? data : [];
      
      // 2. Safely parse matching records 
      const activeSongs = rawItems.filter(i => i?.type === "SONG");
      const filtered = activeSongs.filter(item => 
        item?.name?.toLowerCase().includes(trimmedQuery)
      );

      // 3. CRITICAL FIX: Only dispatch a clean serializable array copy to Redux
      if (rawItems.length > 0) {
        dispatch(addSuggestion(JSON.parse(JSON.stringify(rawItems))));
      }
      
      setSuggestions(filtered);
    } catch (err) {
      console.error("Failed to parse search payloads:", err);
      setSuggestions([]);
    }
  }, 400);

  return () => clearTimeout(delayDebounceFn);
}, [query, dispatch]);


  const handleInput = (e) => {
    setQuery(e.target.value);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 relative min-h-[64px] flex items-center">
      <div className="flex items-center sm:justify-between w-full max-w-7xl mx-auto gap-4">
        
        {/* LOGO */}
        <Link href={'/'}>
          <div className={`shrink-0 text-white select-none ${isOpen ? 'hidden sm:block' : 'block'}`}>
            <h2 className="text-3xl font-bold inline">R</h2>
            <span className="hidden text-lg sm:inline">adio Tune</span>
          </div>
        </Link>

        {/* CORE INTERACTIVE SEARCH ELEMENT */}
        <div 
          ref={containerRef} 
          className={`relative z-50 transition-all duration-200 ${
            isOpen 
              ? 'absolute inset-x-4 top-5 -translate-y-1/2 sm:static sm:translate-y-0 flex-1 max-w-2xl mx-auto' 
              : 'flex-1 max-w-xs ml-auto sm:ml-auto sm:max-w-2xl sm:mx-auto'
          }`}
        >
          {/* Main Visual Capsule Input Bar */}
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors duration-200 ${
              isOpen ? 'bg-gray-800' : 'bg-gray-950 border border-gray-800 hover:bg-gray-800/60'
            }`}
          >
            {isOpen ? (
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition shrink-0"
                aria-label="Back button"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <SearchIcon size={20} className="text-gray-400 ml-1 shrink-0" />
            )}

            <input
              type="text"
              placeholder="Search songs, albums, artists"
              value={query}
              onChange={handleInput}
              onFocus={() => setIsOpen(true)}
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
            />

            {query && (
              <button 
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }} 
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition shrink-0"
                aria-label="Clear text input"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* YT Music Overlay Dropdown Controller */}
          {isOpen && (
            <>
              {query.trim() === '' ? (
                <div className="absolute top-full left-0 right-0 mt-2 sm:mt-2 bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden max-h-[calc(100vh-70px)] sm:max-h-[70vh] overflow-y-auto py-2 rounded-b-2xl sm:rounded-2xl h-[calc(100vh-60px)] sm:h-auto">
                  {RECENT_SEARCHES.map((item, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => setQuery(item)}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-700 text-left text-gray-200 transition-colors"
                    >
                      <Clock size={18} className="text-gray-400 shrink-0" />
                      <span className="truncate text-sm sm:text-base font-medium">{item}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-700 my-2" />
                  {TRENDING_SEARCHES.map((item, index) => (
                    <button
                      key={`trending-${index}`}
                      onClick={() => setQuery(item)}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-700 text-left text-gray-200 transition-colors"
                    >
                      <TrendingUp size={18} className="text-gray-400 shrink-0" />
                      <span className="truncate text-sm sm:text-base font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              ) : (
                suggestions && suggestions.length > 0 && (
                  <SearchSuggestion 
                    suggestions={suggestions} 
                    setQuery={setQuery} 
                    setIsOpen={setIsOpen} 
                  />
                )
              )}
            </>
          )}
        </div>

        {/* Desktop Layout Spacer Balance Block */}
        <div className="w-27.5 hidden sm:block shrink-0" />
      </div>
    </nav>
  );
}
