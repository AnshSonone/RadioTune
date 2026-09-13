import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

export async function GET(request) {
    try {
        const ytmusic = new YTMusic();
        await ytmusic.initialize();

        const homeData = await ytmusic.getHomeSections();

        if (homeData.lenght < 0) return NextResponse.json({error: "No home data found"}, { status: 404 });

        return NextResponse.json(homeData);
    } catch (error) {
        console.error("Error fetching home data:", error);
        return NextResponse.json({ error: "Failed to fetch home data" }, { status: 500 });
    }
}