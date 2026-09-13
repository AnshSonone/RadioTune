import { Play, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SingleList({single}) {

  const thumbnailUrl = single?.thumbnails?.[1]?.url;

  return (
    <Link
      href={`/album?q=${single?.aibumId}`}
    >
      <div className="w-full bg-[#121212]/40 border border-zinc-900 p-3 sm:p-4 rounded-xl hover:bg-zinc-900 transition-colors group cursor-pointer">
        <div className="relative w-full aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-3">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
              alt={single?.name || "single"}
              className="object-cover"
            />
          ) : (
            <Music2 size= {30} className="text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={14} fill="black" className="ml-0.5" />
          </div>
        </div>
        <h4 className="text-sm font-semibold truncate text-white">
          {single?.name}
        </h4>
        <p className="text-xs text-zinc-400 truncate">{single?.year}</p>
      </div>
    </Link>
  );
}
