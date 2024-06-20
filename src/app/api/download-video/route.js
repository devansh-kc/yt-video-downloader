import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";
import ytdl, { validateURL } from "ytdl-core";

export async function POST(request, response) {
  try {
    const { Url } = await request.json();
    if (!validateURL(Url)) {
      return NextResponse.json({
        status: 500,
        messsage: "the Url is not valid",
      });
    }
    const info = await ytdl.getInfo(Url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
    });

    const requestHeader = new Headers();
    requestHeader.set("Content-Type", "application/octet-stream");
    requestHeader.set(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.mp4"`
    );
    const stream = ytdl(url, { format: format }).pipe(request);

    return NextResponse.json(stream, { requestHeader });
  } catch (error) {
    return NextResponse.json({ status: 500, message: error });
  }
}
