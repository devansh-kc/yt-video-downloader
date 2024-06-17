import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import ytdl from "ytdl-core";
export async function POST(request, response) {
  const {url} = await request.json()
  
  try {
    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "The link is invalid" },
        { status: 500 }
      );
    }
    
    const info = await ytdl.getInfo(url);

    const data = info.videoDetails

    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
    });
    ytdl(url, { format: format }).pipe(
      fs.createWriteStream(`${info.videoDetails.title}.mp4`)
    );
    return NextResponse.json({ status: 200,  data});
  } catch (error) {
    throw error;
  }
}
