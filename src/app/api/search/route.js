import { NextResponse } from 'next/server';
// Make sure this package is installed via npm install yt-music-api
import YTMusic from "ytmusic-api"; 


export async function GET(request) {
  // Extract the search query from the URL parameters (e.g., ?q=song+name)
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || "";
  
  if (query.length <= 0) return
  
  try {
    
    const ytmusic = new YTMusic();
    await ytmusic.initialize();
    
    const songs = await ytmusic.search(query);

    if (songs.length < 0) {
      return NextResponse.json({error: "Songs not found"}, {status: 404})
    }
    
    return NextResponse.json(songs);
  } catch (error) {
    console.error("YouTube Music API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

