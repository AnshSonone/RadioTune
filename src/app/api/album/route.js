import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";


export async function GET(request) {

    const { searchParams } = new URL(request.url)

    const albumId = searchParams.get('q')

    if (albumId.trim() === "" ) return

    try{

        const ytmusic = new YTMusic()
        await ytmusic.initialize()

        const albumData = await ytmusic.getAlbum(albumId)

        if (albumData.length < 0) {
            return NextResponse.json({error: "Album not found"}, {status: 404})
        }

        return NextResponse.json(albumData)

    }catch(error){
        console.log(error.message)
        return NextResponse.json({error: "Error while fetching albums"}, {status: 500})
    }
}