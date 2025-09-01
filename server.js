import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { spawn } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
console.log("✅ Firebase Admin initialized successfully");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
console.log("✅ Gemini AI initialized successfully");

const validModelName = 'models/gemini-2.5-flash'; // Replace with your valid model name

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const OUTPUT_DIR = path.join(process.cwd(), 'outputs');
fs.ensureDirSync(UPLOAD_DIR);
fs.ensureDirSync(OUTPUT_DIR);

console.log('Serving videos from directory:', OUTPUT_DIR);
app.use('/outputs', express.static(OUTPUT_DIR));

/* ----------- DOWNLOAD ROUTE (forces download) ----------- */
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(OUTPUT_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, req.params.filename, (err) => {
      if (err) {
        console.error('❌ Download error:', err);
        res.status(500).send('Error downloading file');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Helper functions (resizeVideo, transcribeWithWhisper, getVideoResolution, escapeSubtitlePath, burnSubtitles, generateContentWithGemini):

function resizeVideo(inputPath, outputPath, sizeStr) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size(sizeStr)
      .outputOptions('-preset fast')
      .on('end', () => {
        console.log('✅ Video resized successfully:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ Video resizing failed:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
}

function transcribeWithWhisper(videoPath, outputDir) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['whisper_script.py', videoPath, outputDir]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => errorOutput += data.toString());

    python.on('close', (code) => {
      if (code === 0) {
        const lines = output.trim().split('\n');
        const transcript = lines.slice(0, -1).join('\n');
        const srtPath = lines[lines.length - 1];
        console.log("✅ Whisper transcription complete");
        resolve({ transcript, srtPath });
      } else {
        console.error("❌ Whisper transcription failed:", errorOutput);
        reject(new Error(errorOutput));
      }
    });
  });
}

function getVideoResolution(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      const stream = metadata.streams.find(s => s.codec_type === 'video');
      if (!stream) return reject(new Error("No video stream found"));
      const resolution = `${stream.width}x${stream.height}`;
      resolve(resolution);
    });
  });
}

function escapeSubtitlePath(filePath) {
  let escaped = filePath.replace(/\\/g, '/');
  escaped = escaped.replace(/^([A-Za-z]):/, '$1\\:');
  return escaped;
}

function burnSubtitles(videoPath, srtPath, outputPath, videoSize) {
  return new Promise((resolve, reject) => {
    const escapedSrtPath = escapeSubtitlePath(srtPath);
    const filterStr = `subtitles='${escapedSrtPath}':original_size=${videoSize}`;

    ffmpeg(videoPath)
      .videoFilter(filterStr)
      .outputOptions('-c:a copy')
      .on('end', () => {
        console.log('✅ Subtitles burned successfully:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ Burning subtitles failed:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
}

async function generateContentWithGemini(transcript, platform) {
  if (!validModelName) {
    throw new Error('No valid Gemini model available for content generation');
  }

  const prompt = `
You are a social media content generator.
Generate a JSON object with two properties:
- "caption": a short caption (max 100 words)
- "hashtags": an array of 5 trending hashtags for platform "${platform}"

Video transcript: """${transcript}"""
Respond ONLY with JSON.
`;

  try {
    const model = genAI.getGenerativeModel({ model: validModelName });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Raw Gemini response:', text);

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.warn('⚠️ Gemini response JSON parse failed, returning raw text as caption');
    }

    return {
      caption: text.trim(),
      hashtags: []
    };
  } catch (err) {
    console.error('❌ Gemini generateContent error:', err);
    throw err;
  }
}

// === Data store for user videos (replace with DB in production) ===
const userVideos = {};

// --- New GET API to fetch videos for a user ---
app.get('/api/videos/:userId', (req, res) => {
  const userId = req.params.userId;
  const videos = userVideos[userId] || [];
  res.json({ success: true, videos });
});

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const file = req.file;
    const { platforms, userId } = req.body;

    if (!file || !platforms || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const platformsArray = typeof platforms === 'string' ? JSON.parse(platforms) : platforms;
    const inputPath = file.path;

    console.log("📁 Processing video:", file.originalname);
    console.log("🎯 Target platforms:", platformsArray);
    console.log("👤 User ID:", userId);

    // Step 1: Transcribe audio and get subtitle file path
    const { transcript, srtPath } = await transcribeWithWhisper(inputPath, OUTPUT_DIR);

    // Platform-specific sizes (width x height)
    const platformSizes = {
      instagram: { width: 720, height: 1280 },  // 9:16 vertical
      youtube: { width: 1280, height: 720 },    // 16:9 horizontal
      twitter: { width: 720, height: 900 },     // 4:5 portrait
      linkedin: { width: 720, height: 900 },    // 4:5 portrait
      facebook: { width: 1280, height: 720 },   // example, same as youtube
    };

    const platformsInfo = [];

    // For each platform: resize, burn subtitles, generate content
    for (const platform of platformsArray) {
      const size = platformSizes[platform] || { width: 720, height: 720 };

      const sizeStr = `${size.width}x${size.height}`;
      const resizedPlatformFilename = `${platform}-resized-${file.filename}`;
      const resizedPlatformPath = path.join(OUTPUT_DIR, resizedPlatformFilename);

      // Resize video for platform
      await resizeVideo(inputPath, resizedPlatformPath, sizeStr);

      // Burn subtitles on resized video
      const captionedPlatformFilename = `captioned-${platform}-${file.filename}`;
      const captionedPlatformPath = path.join(OUTPUT_DIR, captionedPlatformFilename);

      await burnSubtitles(resizedPlatformPath, srtPath, captionedPlatformPath, sizeStr);

      // Generate AI content
      const genContent = await generateContentWithGemini(transcript, platform);

      platformsInfo.push({
        platform,
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
        filename: captionedPlatformFilename,
        downloadUrl: `/download/${captionedPlatformFilename}`,  // UPDATED
        previewUrl: `/outputs/${captionedPlatformFilename}`,
        thumbnail: `/outputs/${captionedPlatformFilename}`,
        caption: genContent.caption || '',
        hashtags: genContent.hashtags || [],
        aspectRatio: `${size.width}:${size.height}`,
        resolution: sizeStr
      });

      // Remove intermediate resized video
      await fs.remove(resizedPlatformPath);
    }

    // Save video metadata for user
    const videoMeta = {
      id: uuidv4(),
      originalFilename: file.originalname,
      platforms: platformsInfo,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };

    if (!userVideos[userId]) {
      userVideos[userId] = [];
    }
    userVideos[userId].push(videoMeta);

    // Cleanup uploaded and subtitle files
    await fs.remove(inputPath);
    await fs.remove(srtPath);

    res.json({
      success: true,
      message: '✅ Video processed successfully with subtitles burned per platform',
      transcript,
      generatedContent: platformsInfo.reduce((acc, p) => {
        acc[p.platform] = { caption: p.caption, hashtags: p.hashtags };
        return acc;
      }, {}),
    });

  } catch (error) {
    console.error("❌ Upload processing failed:", error.message || error);
    res.status(500).json({ error: 'Video processing failed', details: error.message || error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
