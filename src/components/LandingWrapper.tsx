"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import VideoLanding from "./VideoLanding";

interface LandingWrapperProps {
  children: React.ReactNode;
}

export default function LandingWrapper({ children }: LandingWrapperProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show video when user lands on login page
    const hasSeenVideo = sessionStorage.getItem("hasSeenLandingVideo");

    console.log("LandingWrapper - pathname:", pathname);
    console.log("LandingWrapper - hasSeenVideo:", hasSeenVideo);

    if (!hasSeenVideo && pathname === "/auth/login") {
      console.log("LandingWrapper - Setting showVideo to true");
      setShowVideo(true);
      setVideoCompleted(false);
    } else {
      console.log("LandingWrapper - Setting videoCompleted to true");
      setVideoCompleted(true);
    }
  }, [pathname]);

  const handleVideoComplete = () => {
    console.log("LandingWrapper - Video completed");
    setShowVideo(false);
    setVideoCompleted(true);
    sessionStorage.setItem("hasSeenLandingVideo", "true");
  };

  console.log(
    "LandingWrapper - showVideo:",
    showVideo,
    "videoCompleted:",
    videoCompleted
  );

  if (showVideo && !videoCompleted) {
    console.log("LandingWrapper - Rendering VideoLanding");
    return <VideoLanding onComplete={handleVideoComplete} />;
  }

  console.log("LandingWrapper - Rendering children");
  return <>{children}</>;
}
