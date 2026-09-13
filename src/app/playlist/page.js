"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"


function PlaylistResultInner() {

    const searchParams = useSearchParams()
    const querySearch = searchParams.get("q")



    return (
        <div>
            {querySearch}
        </div>
    )
}

export default function AlbumResult() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303]" />}>
      <PlaylistResultInner />
    </Suspense>
  )
}