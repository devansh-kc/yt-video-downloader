"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [URL, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [Duration, setDuration] = useState("");

  async function DownloadVideo(e) {
    e.preventDefault();

    try {
      const result = await axios.post("/api/download", {
        url: URL,
      });
      setTitle(result.data.data.title);
      setImage(result.data.data.thumbnails[0].url);
      
    } catch (error) {
      throw error
      
    }
  }

  useEffect(()=>{

    setImage("")
    setTitle("")
  },[URL])
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">YouTube Video Downloader</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Download your favorite YouTube videos with ease.
          </p>
        </div>
        <form
          className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-4"
          onSubmit={DownloadVideo}
        >
          <div>
            <Label
              htmlFor="video-url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Video URL
            </Label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                type="text"
                autoComplete="off"
                name="video-url"
                id="video-url"
                className="flex-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                placeholder="Enter YouTube video URL"
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
              <Button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Get Info
              </Button>
            </div>
          </div>
        </form>
        { URL && title && image ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <img src={image} alt="Video Thumbnail" className="rounded-lg" />
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                  {title}
                </h3>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
