import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";
import ytdl, { validateURL } from "ytdl-core";
import fs from "fs";
import path from "path";
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
    const title = info.videoDetails.title;
    // const videoPath = path.join( "temp", `${title}.mp4`); // Specify the path to save the video
    const videoWriteStream = fs.createWriteStream(`${title}`); //create the writestream
    ytdl(Url, format).pipe(videoWriteStream);

    videoWriteStream.on("finish", () => {
      request.download(videoPath, `${title}.mp4`, () => {
        fs.unlinkSync(videoPath);
      });
    });
    return NextResponse.json({ status: 200, message: "done" });
  } catch (error) {
    console.log(error)
  }
}
