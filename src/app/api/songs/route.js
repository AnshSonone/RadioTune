import { NextResponse } from "next/server";
import YTMUSIC from "ytmusic-api";

export async function GET(request) {
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (query.trim === "") return;

    try {

        const ytmusic = new YTMUSIC();
        await ytmusic.initialize();

        const songsData = await ytmusic.getSong(encodeURIComponent(query))

        if (songsData.length < 0) {
            return NextResponse.json({error: "Songs not found"}, {status: 404})
        }

        return NextResponse.json(songsData)
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Error while fetching songs"}, {status: 500})
    }
}