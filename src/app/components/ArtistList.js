import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

export default function ArtistList(artist) {

  const thumbnailUrl = artist?.artsit?.thumbnails?.[1 ||0]?.url

  return (
    <div
      className="flex items-center justify-between p-2 hover:bg-zinc-900 rounded-xl group cursor-pointer"
    >
      <Link href={`/artist?q=${artist?.artsit?.artistId}`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
          {thumbnailUrl ? (
            <Image
          src={thumbnailUrl}
          width={100}
          height={100}
          alt="artist"
          className="rounded-full"
          />
          ) : (
            <User size={22} className="text-zinc-500" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold truncate">{artist?.artsit?.name}</h4>
        </div>
      </div>
      </Link>
    </div>
  );
}
