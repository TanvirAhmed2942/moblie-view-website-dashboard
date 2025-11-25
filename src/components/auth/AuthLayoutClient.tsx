"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface AuthLayoutClientProps {
  children: React.ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Initial positions - images off screen
      gsap.set(topLeftRef.current, {
        x: -800,
        y: -600,
        opacity: 0,
        scale: 0.8,
      });

      gsap.set(bottomRightRef.current, {
        x: 800,
        y: 600,
        opacity: 0,
        scale: 0.8,
      });

      gsap.set(formRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.9,
      });

      // Animation sequence
      tl.to(topLeftRef.current, {
        x: 0,
        y: 0,
        opacity: 0.6,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      })
        .to(
          bottomRightRef.current,
          {
            x: 0,
            y: 0,
            opacity: 0.6,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6"
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#cfc7d6] flex items-center justify-center w-full h-[100vh] relative overflow-hidden"
    >
      {/* Top-left decorative image */}
      <div ref={topLeftRef} className="absolute top-5 left-20">
        <Image
          src="/auth/top_left.png"
          alt="auth-bg"
          width={1000}
          height={1000}
          className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] grayscale -translate-x-20 xl:-translate-x-30 -translate-y-20 xl:-translate-y-30 xl:scale-90 2xl:scale-100 object-contain"
          priority
        />
      </div>

      {/* Bottom-right decorative image */}
      <div ref={bottomRightRef} className="absolute -bottom-10 right-24">
        <Image
          src="/auth/bottom_right.png"
          alt="auth-bg"
          width={1000}
          height={1000}
          className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] grayscale translate-x-20 xl:translate-x-34 translate-y-30 object-contain xl:scale-90 2xl:scale-110"
          priority
        />
      </div>

      {/* Form content - positioned on top */}
      <div
        ref={formRef}
        className="relative z-10 w-full flex items-center justify-center px-4"
      >
        {children}
      </div>
    </div>
  );
}
