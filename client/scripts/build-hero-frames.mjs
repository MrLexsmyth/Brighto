#!/usr/bin/env node
/**
 * Builds the desktop/mobile hero image sequences from the source JPEG frames.
 *
 * Reads:  client/assets-src/hero-sequence/frame-*.jpg
 * Writes: client/public/hero-sequence/desktop/frame-*.webp
 *         client/public/hero-sequence/mobile/frame-*.webp
 *         client/public/hero-sequence/poster.webp
 *         client/components/hero-sequence-manifest.json
 *
 * Re-run with: npm run build:hero
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, '..');

const SOURCE_DIR = path.join(CLIENT_ROOT, 'assets-src', 'hero-sequence');
const OUTPUT_DIR = path.join(CLIENT_ROOT, 'public', 'hero-sequence');
const DESKTOP_DIR = path.join(OUTPUT_DIR, 'desktop');
const MOBILE_DIR = path.join(OUTPUT_DIR, 'mobile');
const MANIFEST_PATH = path.join(CLIENT_ROOT, 'components', 'hero-sequence-manifest.json');

// Desktop keeps every deduped unique frame (no further thinning) so the
// scrub stays as smooth as the original — dedup alone still saves bytes
// over the source JPEGs. Mobile is where the real data savings come from.
const DESKTOP_TARGET_COUNT = Infinity;
const DESKTOP_QUALITY = 80;

const MOBILE_TARGET_COUNT = 48;
const MOBILE_WIDTH = 480;
const MOBILE_QUALITY = 65;

const POSTER_WIDTH = 480;
const POSTER_QUALITY = 72;

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

async function readSourceFrames() {
  const files = (await readdir(SOURCE_DIR))
    .filter((f) => /^frame-\d+\.jpe?g$/i.test(f))
    .sort();

  if (files.length === 0) {
    throw new Error(`No source frames found in ${SOURCE_DIR}`);
  }

  const frames = [];
  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const buffer = await readFile(filePath);
    frames.push({ file, buffer, size: buffer.length });
  }
  return frames;
}

/** Drops exact duplicate frames, verified by content hash (not size). */
function dedupeByHash(frames) {
  const seen = new Set();
  const unique = [];
  let duplicateCount = 0;
  let duplicateBytes = 0;

  for (const frame of frames) {
    const hash = createHash('sha256').update(frame.buffer).digest('hex');
    if (seen.has(hash)) {
      duplicateCount += 1;
      duplicateBytes += frame.size;
      continue;
    }
    seen.add(hash);
    unique.push(frame);
  }

  return { unique, duplicateCount, duplicateBytes };
}

/** Evenly samples `count` indices across [0, n-1], always including the first and last. */
function sampleIndices(n, count) {
  if (count >= n) return Array.from({ length: n }, (_, i) => i);
  const indices = [];
  for (let i = 0; i < count; i += 1) {
    const idx = Math.round((i * (n - 1)) / (count - 1));
    if (indices[indices.length - 1] !== idx) indices.push(idx);
  }
  return indices;
}

async function resetDir(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

async function writeSet({ frames, indices, dir, quality, width }) {
  await resetDir(dir);
  let totalSize = 0;
  const pad = String(indices.length).length < 3 ? 3 : String(indices.length).length;

  for (let i = 0; i < indices.length; i += 1) {
    const frame = frames[indices[i]];
    let pipeline = sharp(frame.buffer);
    if (width) pipeline = pipeline.resize({ width });
    const outBuffer = await pipeline.webp({ quality }).toBuffer();

    const outName = `frame-${String(i + 1).padStart(pad, '0')}.webp`;
    await writeFile(path.join(dir, outName), outBuffer);
    totalSize += outBuffer.length;
  }

  return { count: indices.length, totalSize };
}

async function main() {
  console.log('Reading source frames from', SOURCE_DIR);
  const sourceFrames = await readSourceFrames();
  const sourceTotalSize = sourceFrames.reduce((sum, f) => sum + f.size, 0);

  const { unique, duplicateCount, duplicateBytes } = dedupeByHash(sourceFrames);

  console.log('\n--- Source ---');
  console.log(`Frames: ${sourceFrames.length}, size: ${formatBytes(sourceTotalSize)}`);
  console.log(
    `Exact duplicates removed (by SHA-256): ${duplicateCount} frames, ${formatBytes(duplicateBytes)}`
  );
  console.log(`Unique frames: ${unique.length}`);

  const meta = await sharp(unique[0].buffer).metadata();
  const sourceWidth = meta.width;
  const sourceHeight = meta.height;

  const desktopIndices = sampleIndices(unique.length, DESKTOP_TARGET_COUNT);
  const mobileIndices = sampleIndices(unique.length, MOBILE_TARGET_COUNT);

  console.log('\nEncoding desktop set...');
  const desktop = await writeSet({
    frames: unique,
    indices: desktopIndices,
    dir: DESKTOP_DIR,
    quality: DESKTOP_QUALITY,
  });

  console.log('Encoding mobile set...');
  const mobile = await writeSet({
    frames: unique,
    indices: mobileIndices,
    dir: MOBILE_DIR,
    quality: MOBILE_QUALITY,
    width: MOBILE_WIDTH,
  });

  console.log('Encoding poster...');
  const posterBuffer = await sharp(unique[0].buffer)
    .resize({ width: POSTER_WIDTH })
    .webp({ quality: POSTER_QUALITY })
    .toBuffer();
  await writeFile(path.join(OUTPUT_DIR, 'poster.webp'), posterBuffer);

  const mobileHeight = Math.round((MOBILE_WIDTH / sourceWidth) * sourceHeight);

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: { frames: sourceFrames.length, uniqueFrames: unique.length },
    desktop: {
      dir: 'desktop',
      count: desktop.count,
      width: sourceWidth,
      height: sourceHeight,
    },
    mobile: {
      dir: 'mobile',
      count: mobile.count,
      width: MOBILE_WIDTH,
      height: mobileHeight,
    },
    poster: 'poster.webp',
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\n--- Desktop set ---');
  console.log(`Frames: ${desktop.count} (from ${sourceFrames.length} source), size: ${formatBytes(desktop.totalSize)}`);
  console.log('\n--- Mobile set ---');
  console.log(`Frames: ${mobile.count} (from ${sourceFrames.length} source), size: ${formatBytes(mobile.totalSize)}`);
  console.log(`\nPoster: ${formatBytes(posterBuffer.length)}`);
  console.log(`\nManifest written to ${path.relative(CLIENT_ROOT, MANIFEST_PATH)}`);

  console.log('\n--- Per-visitor payload (each visitor downloads exactly one set + the poster) ---');
  const mobileVisitorBytes = mobile.totalSize + posterBuffer.length;
  const desktopVisitorBytes = desktop.totalSize + posterBuffer.length;
  console.log(
    `Mobile visitor:  ${formatBytes(mobileVisitorBytes)} (vs ${formatBytes(sourceTotalSize)} original, ${(
      (1 - mobileVisitorBytes / sourceTotalSize) *
      100
    ).toFixed(0)}% smaller)`
  );
  console.log(
    `Desktop visitor: ${formatBytes(desktopVisitorBytes)} (vs ${formatBytes(sourceTotalSize)} original, ${(
      (1 - desktopVisitorBytes / sourceTotalSize) *
      100
    ).toFixed(0)}% smaller)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
