import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Installing backend dependencies...');

// Install Node.js dependencies
const npmInstall = spawn('npm', ['install'], { 
  cwd: __dirname,
  stdio: 'inherit' 
});

npmInstall.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Backend dependencies installed successfully');
    
    // Install Whisper
    console.log('Installing Whisper AI...');
    const whisperInstall = spawn('python', ['-m', 'pip', 'install', 'openai-whisper'], {
      stdio: 'inherit'
    });
    
    whisperInstall.on('close', (whisperCode) => {
      if (whisperCode === 0) {
        console.log('✅ Whisper AI installed successfully');
        console.log('\n🎉 Backend setup complete!');
        console.log('\nNext steps:');
        console.log('1. Copy .env.example to .env');
        console.log('2. Configure your environment variables');
        console.log('3. Run: npm run dev');
      } else {
        console.error('❌ Whisper installation failed');
        console.log('Please install manually: pip install openai-whisper');
      }
    });
    
    whisperInstall.on('error', (error) => {
      console.error('❌ Whisper installation error:', error.message);
      console.log('Please install manually: pip install openai-whisper');
    });
    
  } else {
    console.error('❌ Backend dependency installation failed');
  }
});

npmInstall.on('error', (error) => {
  console.error('❌ NPM install error:', error.message);
});