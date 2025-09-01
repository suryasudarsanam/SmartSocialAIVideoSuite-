import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';

async function runFFmpegTest() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = await fs.readdir(uploadsDir);

    // Filter to get only .mp4 files
    const videoFiles = files.filter(f => f.toLowerCase().endsWith('.mp4'));

    if (videoFiles.length === 0) {
      console.error('No video files found in uploads folder.');
      return;
    }

    const inputFile = videoFiles[0]; // Pick the first video file found
    const inputPath = path.join(uploadsDir, inputFile);
    const outputPath = path.join(process.cwd(), 'outputs', 'ffmpeg_test_output.mp4');

    ffmpeg(inputPath)
      .outputOptions(['-preset fast', '-crf 23'])
      .on('end', () => {
        console.log('✅ ffmpeg test completed successfully.');
      })
      .on('error', (err) => {
        console.error('❌ ffmpeg test failed:', err.message);
      })
      .save(outputPath);

  } catch (error) {
    console.error('Error reading uploads folder:', error);
  }
}

runFFmpegTest();
