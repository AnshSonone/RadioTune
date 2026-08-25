import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(request) {

    const { searchParams } = new URL(request)
    const query = searchParams.get('q')

    if (!query.trim()) return;

    try {
        const ytmusic = new YTMusic()
        await ytmusic.initialize()

        const playlistData = await ytmusic.getPlaylist(encodeURIComponent(query))

        if (playlistData.length < 0) {
            return NextResponse.json({error: "Playlist not found"}, {status: 404})
        }

        return NextResponse.json(playlistData)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Error while fetching playlist"}, {status: 500})
    }
    
}