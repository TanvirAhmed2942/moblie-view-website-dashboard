"use client";
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface VideoLandingProps {
  onComplete: () => void;
}

export default function VideoLanding({ onComplete }: VideoLandingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  console.log("VideoLanding - Component rendered");

  useGSAP(
    () => {
      // Initial setup - container is visible
      gsap.set(containerRef.current, {
        opacity: 1,
        scale: 1,
        zIndex: 9999,
      });

      // Auto-play video when component mounts
      if (videoRef.current) {
        console.log("VideoLanding - Attempting to play video");
        videoRef.current.play().catch((error) => {
          console.error("VideoLanding - Video play failed:", error);
        });
      }
    },
    { scope: containerRef }
  );

  const handleVideoEnd = () => {
    // Animate video container out
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        onComplete();
      },
    });
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleVideoEnd();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          onLoadedData={() => {
            console.log("VideoLanding - Video loaded successfully");
            setVideoLoaded(true);
          }}
          onEnded={handleVideoEnd}
          onError={(e) => {
            console.error("VideoLanding - Video failed to load:", e);
            handleVideoEnd();
          }}
          onPlay={() => {
            console.log("VideoLanding - Video started playing");
          }}
        >
          <source src="/launch.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 font-medium"
        >
          Skip
        </button>

        {/* Loading indicator for video */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
