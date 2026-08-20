import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

export default function SearchSuggestion({ suggestions, setQuery, setIsOpen }) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-2 sm:mt-2 bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden max-h-[calc(100vh-70px)] sm:max-h-[70vh] overflow-y-auto py-2 z-50 rounded-b-2xl sm:rounded-2xl h-[calc(100vh-60px)] sm:h-auto">
      {suggestions?.map((item, index) => {

        return (
            <Link key={index} href={`/search?q=${item?.name}`}>
        <button
          onClick={() => {
            setQuery(item?.name);
            setIsOpen(false); // Close menu on option selection
          }}
          className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-700 text-left text-gray-200 transition-colors group"
        >
          <SearchIcon size={18} className="text-gray-400 shrink-0 group-hover:text-white transition-colors" />
          <span className="truncate text-sm sm:text-base font-medium text-gray-200 group-hover:text-white">
            {item?.name || item?.artist?.name}
          </span>
        </button>
        </Link> 
        )
      })}
    </div>
  );
}


