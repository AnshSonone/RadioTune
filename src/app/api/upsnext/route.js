import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('q');

    if (videoId?.trim() === "") {
        return NextResponse.json({error: "Received empty string not allwoed"}, {status: 400});
    };

    try{

        const ytmusic = await new YTMusic();
        await ytmusic.initialize();

        const nextSongs = await ytmusic.getUpNexts(videoId);

        if (nextSongs?.length < 0) {
            return NextResponse.json({error: "No Queue found"}, {status: 404});
        };

        return NextResponse.json(nextSongs);

    }catch (error){
        console.log(error)
        return NextResponse.json({error: "Error while fetching next songs"}, {status: 500})
    };
 };