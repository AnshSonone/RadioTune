'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, ArrowLeft, X } from 'lucide-react';
import SearchSuggestion from './SearchSuggestion';
import Link from 'next/link';
import { fetchSearch } from '@/utils/api';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const containerRef = useRef(null);
  const router = useRouter()
  const pathname = usePathname();

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

  
useEffect(() => {
  const trimmedQuery = query.toLowerCase().trim();
  
  if (!trimmedQuery) {
    setSuggestions([]);
    return;
  }

  const delayDebounceFn = setTimeout(async () => {
    try {
      const data = await fetchSearch(trimmedQuery);
      
      // 1. Force the response to be an array so loop filters don't crash
      const rawItems = Array.isArray(data) ? data : [];
      
      // 2. Safely parse matching records 
      const activeSongs = rawItems.filter(i => i?.type === "SONG");
      const filtered = activeSongs.filter(item => 
        item?.name?.toLowerCase().includes(trimmedQuery)
      );

      // 3. CRITICAL FIX: Only dispatch a clean serializable array copy to Redux
      // if (rawItems.length > 0) {
      //   dispatch(addSuggestion(JSON.parse(JSON.stringify(rawItems))));
      // }
      
      setSuggestions(filtered);
    } catch (err) {
      console.error("Failed to parse search payloads:", err);
      setSuggestions([]);
    }
  }, 100);

  return () => clearTimeout(delayDebounceFn);
}, [query]);

  if (pathname === '/') return null;


  const handleInput = (e) => {
    setQuery(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && query !== "") {
      router.push(`/search?q=${query.trim()}`)
      setIsOpen(false)
    }
  }

  return (
    <nav className="theme-nav theme-surface backdrop-blur-md border-b px-4 sm:px-6 py-3 relative min-h-16 flex items-center">
      <div className="flex items-center sm:justify-between w-full max-w-7xl mx-auto gap-4">
        
        {/* LOGO */}
        <Link href={'/'}>
          <div className={`theme-logo shrink-0 flex items-center gap-1.5 select-none ${isOpen ? 'hidden sm:flex' : 'flex'}`}>
            <Image
              src="/backgroun.svg"
              alt="Radio Tune"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="hidden text-lg sm:inline font-semibold">Radio Tune</span>
          </div>
        </Link>
        {/* CORE INTERACTIVE SEARCH ELEMENT */}
        <div 
          ref={containerRef} 
          className={`relative z-50 transition-all duration-200 ${
            isOpen 
              ? 'absolute inset-x-4 top-5 -translate-x-2 -translate-y-1/2 sm:static sm:translate-y-0 flex-1 max-w-2xl mx-auto' 
              : 'flex-1 max-w-xs ml-auto sm:ml-auto sm:max-w-2xl sm:mx-auto'
          }`}
        >
          {/* Main Visual Capsule Input Bar */}
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors duration-200 ${
              isOpen ? 'theme-search-open' : 'theme-search border hover:brightness-95'
            }`}
          >
            {isOpen ? (
              <button 
                onClick={() => setIsOpen(false)} 
                className="theme-muted hover:brightness-75 p-1 rounded-full transition shrink-0"
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
              onKeyDown={handleEnter}
              onFocus={() => setIsOpen(true)}
              className="theme-input w-full bg-transparent focus:outline-none text-base"
            />

            {query && (
              <button 
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }} 
                className="theme-muted hover:brightness-75 p-1 rounded-full transition shrink-0"
                aria-label="Clear text input"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* YT Music Overlay Dropdown Controller */}
          {isOpen && (
            <>
              {query.trim() !== '' && (
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
        <div className={`shrink-0 items-center justify-end sm:w-27.5 ${isOpen ? 'hidden sm:flex' : 'flex'}`}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
