import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import ytdl from "ytdl-core";
export async function POST(request, response) {
  const requestHeader = new Headers(NextRequest.headers);
  const { url } = await request.json();

  try {
    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "The link is invalid" },
        { status: 500 }
      );
    }

    const info = await ytdl.getInfo(url);

    const data = info.videoDetails;

    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
    });
    requestHeader.set(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.mp4"`
    );
    ytdl(url, { format: format }).pipe(request);

    return NextResponse.json({ status: 200, data });
  } catch (error) {
    throw error;
  }
}
