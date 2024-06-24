import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";
import ytdl, { validateURL } from "ytdl-core";
import fs from "fs";
import path from "path";
export async function POST(request, response) {
  try {
    const { Url } = await request.json();
    console.log(validateURL(Url))
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
    // const videoWriteStream = fs.createWriteStream(`${video}.mp4`); //create the writestream

    const outputFilePath = `${info.videoDetails.title}.${format.container}`;
    // const outputStream = fs.createWriteStream(outputFilePath);
    const data = ytdl
      .downloadFromInfo(info, { format })
    // console.log(data);
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.${format.container}"`
    );
    headers.set("Content-Type", "video/mp4");

    return NextResponse.json({ status: 200, data, headers });
  } catch (error) {
    console.log(error);
  }
}
