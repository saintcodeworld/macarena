"use client";

import VideoCard from "./VideoCard";

const VIDEO_COUNT = 33;

const videos = Array.from({ length: VIDEO_COUNT }, (_, i) => ({
  id: i + 1,
  src: `/videos/vid${i + 1}.MP4`,
}));

export default function VideoGrid() {
  return (
    <div
      id="videos"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
    >
      {videos.map((video) => (
        <VideoCard key={video.id} src={video.src} index={video.id} />
      ))}
    </div>
  );
}
