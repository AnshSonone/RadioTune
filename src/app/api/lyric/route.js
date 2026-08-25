import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(request) {

    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')

    if(query.trim() === "") return;

    try {

        const ytmusic = new YTMusic()
        await ytmusic.initialize()

        const lyrics = await ytmusic.getLyrics(query)

        if (lyrics.length < 0) {
            return NextResponse.json({error: "Lyrics not found"}, {status: 404})
        }

        return NextResponse.json(lyrics)
        
    } catch (errro) {
        console.log(error)
        return NextResponse.json({error: "Error while fetching the lyrics"}, {status: 500})
    }
    
}