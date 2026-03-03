"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Eye, Heart, Share2, Volume2, VolumeX } from "lucide-react";

interface VideoCardProps {
  src: string;
  index: number;
}

export default function VideoCard({ src, index }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentViews, setCurrentViews] = useState(() => Math.floor(Math.random() * 900000 + 100000));
  const videoRef = useRef<HTMLVideoElement>(null);

  const baseViews = currentViews;
  const fakeLikes = Math.floor(baseViews * (Math.random() * 0.3 + 0.1));

  // Organic view growth simulation
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setCurrentViews(prev => {
        const growthRate = Math.random() * 0.002 + 0.001; // 0.1% to 0.3% growth per interval
        const additionalViews = Math.floor(prev * growthRate);
        return prev + additionalViews;
      });
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(growthInterval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const websiteUrl = window.location.origin;
    const videoTitle = `Macarena x War Edit #${index}`;
    const twitterText = `🔥 ${videoTitle}\n\nThe sound that defines the era — $MACARENA\n\nWatch more viral videos: ${websiteUrl}\n\n#Macarena #ViralVideo #Trending`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  return (
    <div
      className="video-card group relative rounded-2xl overflow-hidden bg-card border border-border cursor-pointer"
      onClick={togglePlay}
    >
      {/* Trending Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        TRENDING #{index}
      </div>

      {/* Video */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
            "opacity-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" fill="white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-foreground leading-tight">
          Macarena x War Edit #{index} 🔥
        </h3>
        <p className="text-xs text-muted">
          The sound that defines the era — $MACARENA
        </p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(baseViews)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isLiked ? "text-primary fill-primary" : ""
                }`}
              />
              {formatNumber(isLiked ? fakeLikes + 1 : fakeLikes)}
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
