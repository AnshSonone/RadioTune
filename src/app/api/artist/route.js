import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (query.trim() === 0) return;
  

  try {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();

    const artistInfo = await ytmusic.getArtist(query);

    if (artistInfo.length <= 0) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

    return NextResponse.json(artistInfo)
  } catch (error) {
    console.error("YouTube Music API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}