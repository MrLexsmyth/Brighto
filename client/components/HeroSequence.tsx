'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const TOTAL_FRAMES = 240;
const SCROLL_LENGTH_VH = 400; // total scrollable track the sequence is scrubbed across
const TEXT_FADE_RANGE = 0.16; // fraction of the track over which the hero copy fades out

const getFrameSrc = (index: number) =>
  `/hero-sequence/frame-${String(index + 1).padStart(3, '0')}.jpg`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const HeroSequence = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const [isReady, setIsReady] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth: number;
    let drawHeight: number;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / imgRatio;
    }

    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    currentFrameRef.current = index;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    canvasSizeRef.current = { width: cssWidth, height: cssHeight };

    if (currentFrameRef.current >= 0) {
      drawFrame(currentFrameRef.current);
    }
  }, [drawFrame]);

  const updateOnScroll = useCallback(() => {
    rafRef.current = null;

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    const scrolled = -rect.top;
    const progress = maxScroll > 0 ? clamp(scrolled / maxScroll, 0, 1) : 0;

    const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));
    if (frameIndex !== currentFrameRef.current) {
      drawFrame(frameIndex);
    }

    const fadeProgress = clamp(progress / TEXT_FADE_RANGE, 0, 1);
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.opacity = String(1 - fadeProgress);
      overlay.style.transform = `translate3d(0, ${-fadeProgress * 60}px, ${-fadeProgress * 220}px) scale(${1 - fadeProgress * 0.2})`;
      overlay.style.pointerEvents = fadeProgress > 0.6 ? 'none' : 'auto';
    }

    const scrim = scrimRef.current;
    if (scrim) {
      scrim.style.opacity = String(1 - fadeProgress);
    }
  }, [drawFrame]);

  const requestScrollUpdate = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(updateOnScroll);
  }, [updateOnScroll]);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    const firstImage = new window.Image();
    firstImage.src = getFrameSrc(0);
    images[0] = firstImage;

    const markReady = () => {
      if (cancelled) return;
      setIsReady(true);
      resizeCanvas();
      drawFrame(0);
    };

    if (firstImage.complete) {
      markReady();
    } else {
      firstImage.onload = markReady;
    }

    for (let i = 1; i < TOTAL_FRAMES; i += 1) {
      const img = new window.Image();
      img.src = getFrameSrc(i);
      images[i] = img;
    }

    return () => {
      cancelled = true;
    };
  }, [drawFrame, resizeCanvas]);

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [requestScrollUpdate, resizeCanvas]);

  return (
    <section
      ref={trackRef}
      className="relative w-full"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden bg-black">
        {/* Image sequence canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Loading state until the first frame is decoded */}
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        {/* Legibility scrim, fades with the hero copy so the sequence reads clearly on scroll */}
        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent"
        />

        {/* Hero copy + CTA */}
        <div
          className="relative z-20 flex h-full flex-col items-start justify-center px-6 text-left text-white sm:px-10 md:px-20"
          style={{ perspective: '1200px' }}
        >
          <div ref={overlayRef} className="max-w-2xl will-change-transform">
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
              Discover the Perfect Place to Call Home.
            </h1>
            <p className="mb-6 max-w-lg text-base text-white/90 sm:text-lg md:text-xl">
              Explore premium homes available for purchase or lease in your preferred areas.
            </p>
            <Link href="/listings">
              <button className="rounded-md bg-[#004274] px-6 py-3 font-semibold text-white transition duration-300 hover:bg-[#0090d2]">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSequence;
