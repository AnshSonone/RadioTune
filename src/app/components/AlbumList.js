import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function AlbumList(al) {

    return (
      <Link href={`/album?q=${al?.al?.albumId}`}>
  <div className="w-full bg-[#121212]/40 border border-zinc-900 p-3 sm:p-4 rounded-xl hover:bg-zinc-900 transition-colors group cursor-pointer">
    <div className="relative w-full aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-3">
      {al?.al?.thumbnails?.[1]?.url && (
        <Image
          src={al.al.thumbnails[1].url}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
          alt={al?.al?.name || "album"}
          className="object-cover"
        />
      )}
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={14} fill="black" className="ml-0.5" />
      </div>
    </div>
    <h4 className="text-sm font-semibold truncate text-white">
      {al?.al?.name}
    </h4>
    <p className="text-xs text-zinc-400 truncate">
      {al?.al?.year}
    </p>
  </div>
</Link>
    )
};