'use client';

import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import Link from 'next/link';
import manifest from './hero-sequence-manifest.json';

const SCROLL_LENGTH_VH = 400; // total scrollable track the sequence is scrubbed across
const TEXT_FADE_RANGE = 0.16; // fraction of the track over which the hero copy fades out
const MOBILE_BREAKPOINT = 768; // px; matches the tailwind `md` breakpoint used elsewhere
const COARSE_STEP = 4; // load every 4th frame first so scrubbing works before the full set arrives
const VIEWPORT_ROOT_MARGIN = '200px'; // start fetching frames slightly before the hero is on screen

type SetName = 'desktop' | 'mobile';

type Mode = 'sequence' | 'static';

const getFrameSrc = (set: SetName, index: number) =>
  `/hero-sequence/${set}/frame-${String(index + 1).padStart(3, '0')}.webp`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const wantsSaveData = () => {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  return connection?.saveData === true;
};

const HeroSequence = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const setRef = useRef<SetName>('desktop');
  const startedLoadingRef = useRef(false);

  // Server-rendered default is the full sequence experience; a layout effect
  // (below, before paint) flips this for reduced-motion / save-data visitors
  // so nothing in that set is ever fetched.
  const [mode, setMode] = useState<Mode>('sequence');
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);

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

    const total = manifest[setRef.current].count;
    const frameIndex = Math.round(progress * (total - 1));
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

  // Decide the experience (sequence vs. static) and the frame set (desktop vs.
  // mobile) before the browser paints, so there's no visible flash/swap.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || wantsSaveData()) {
      setMode('static');
      return;
    }
    setRef.current = window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop';
  }, []);

  const startLoading = useCallback(() => {
    if (startedLoadingRef.current || mode !== 'sequence') return;
    startedLoadingRef.current = true;

    const set = setRef.current;
    const total = manifest[set].count;

    const images: HTMLImageElement[] = new Array(total);
    const loaded: boolean[] = new Array(total).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;

    const loadFrame = (index: number, onDone?: () => void) => {
      const img = new window.Image();
      images[index] = img;
      img.onload = () => {
        loaded[index] = true;
        if (index === 0) {
          setIsFirstFrameReady(true);
          resizeCanvas();
          drawFrame(0);
        } else if (index === currentFrameRef.current) {
          drawFrame(index);
        }
        onDone?.();
      };
      img.src = getFrameSrc(set, index);
    };

    // Coarse pass first so scrubbing works across the whole track early.
    const coarseIndices: number[] = [];
    for (let i = 0; i < total; i += COARSE_STEP) coarseIndices.push(i);
    if (coarseIndices[coarseIndices.length - 1] !== total - 1) coarseIndices.push(total - 1);

    coarseIndices.forEach((i) => loadFrame(i));

    // Fill in the rest in the background once the coarse pass is underway.
    const fillRemaining = () => {
      for (let i = 0; i < total; i += 1) {
        if (!images[i]) loadFrame(i);
      }
    };

    const schedule =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);
    schedule(fillRemaining);
  }, [mode, drawFrame, resizeCanvas]);

  // Only start fetching frames once the hero is near the viewport (it's
  // already there immediately if the hero sits at the top of the page).
  useEffect(() => {
    if (mode !== 'sequence') return;
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startLoading();
          observer.disconnect();
        }
      },
      { rootMargin: VIEWPORT_ROOT_MARGIN }
    );
    observer.observe(track);

    return () => observer.disconnect();
  }, [mode, startLoading]);

  useEffect(() => {
    if (mode !== 'sequence') return;

    resizeCanvas();

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, requestScrollUpdate, resizeCanvas]);

  const posterSrc = `/hero-sequence/${manifest.poster}`;

  const heroCopy = (
    <>
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
    </>
  );

  if (mode === 'static') {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc}
          alt="A modern home"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 flex h-full max-w-2xl flex-col items-start justify-center px-6 text-left text-white sm:px-10 md:px-20">
          {heroCopy}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      className="relative w-full"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden bg-black">
        {/* Instant-paint poster; the canvas draws over it once the first real frame decodes */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc}
          alt="A modern home"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Image sequence canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full transition-opacity duration-300"
          style={{ opacity: isFirstFrameReady ? 1 : 0 }}
        />

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
            {heroCopy}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSequence;
