// "use client"

import Image from "next/image";
import { Play, Clock } from "lucide-react";

const secondsIntoMinutes = (args) => {
    const timeInMinute = String(args / 60)
    return timeInMinute.slice(0, 4).replace(".", ':')
  }

export default function SongTiles({item, keys}) {

    return (
        <div key={keys} className="flex items-center space-x-4">
                <div className="w-14 h-14 relative overflow-hidden rounded-lg">
                  <Image
                    src={item.imageUrl}
                    fill
                    alt="Songtile"
                    className="object-cover"
                  />
                </div>
                {
                  <Play width={20}/>
                }
                <div>
                  <h2>{item.title}</h2>
                  <div className="space-x-2 flex items-center text-gray-500">
                    <span className="text-sm">{item.artist}</span>
                    <div className="flex items-center space-x-0.5">
                      <Clock width={13}/>
                  <span>{secondsIntoMinutes(item.durationSeconds)}</span>
                    </div>
                  </div>
                </div>
              </div>
    )
}