# Smart Social AI - Automated Multi-Platform Video Processing

A full-stack application that automatically processes videos for multiple social media platforms with AI-generated captions and hashtags.

## Features

- **Multi-Platform Optimization**: Automatically resize videos for Instagram Reels (9:16), YouTube Shorts (16:9), and Facebook (4:5)
- **AI-Powered Captions**: Extract audio with Whisper AI and generate platform-specific captions
- **Smart Hashtags**: AI-generated hashtags optimized for each platform
- **Persistent History**: Access all processed videos with complete metadata
- **Professional UI**: Modern, responsive design with smooth animations
- **Secure Authentication**: Firebase authentication with username support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Firebase Authentication
- Lucide React icons

### Backend
- Node.js with Express
- FFmpeg for video processing
- Whisper AI for audio transcription
- Gemini AI for content generation
- Firebase Admin SDK
- Multer for file uploads

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ with pip
- FFmpeg installed on system
- Firebase project with Authentication enabled
- Google AI Studio API key (Gemini)

## Setup Instructions

### 1. Clone and Install Frontend

```bash
# Install frontend dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Frontend Environment

Edit `.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

### 3. Setup Backend

```bash
cd backend

# Run the installation script
node install-dependencies.js

# Or manually install:
npm install
python -m pip install openai-whisper

# Copy environment template
cp .env.example .env
```

### 4. Configure Backend Environment

Edit `backend/.env`:

```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GEMINI_API_KEY=your_gemini_api_key
MAX_FILE_SIZE=104857600
```

### 5. Install System Dependencies

#### FFmpeg Installation:

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
- Download from https://ffmpeg.org/download.html
- Add to system PATH

#### Whisper Requirements:
```bash
# Install required Python packages
pip install openai-whisper
pip install torch torchvision torchaudio
```

## Running the Application

### Development Mode

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Build

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

## Firebase Configuration

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication with Email/Password

### 2. Get Configuration Keys
1. Project Settings → General → Web apps
2. Copy the configuration object
3. Add to frontend `.env`

### 3. Generate Service Account Key
1. Project Settings → Service Accounts
2. Generate new private key
3. Add JSON content to backend `.env`

### 4. Enable Firestore (Optional)
1. Firestore Database → Create database
2. Start in test mode
3. Used for video metadata storage

## Gemini AI Setup

1. Visit https://aistudio.google.com/app/apikey
2. Create new API key
3. Add to backend `.env` as `GEMINI_API_KEY`

## API Endpoints

### POST /api/upload
Upload and process video for selected platforms
- **Body**: FormData with video file and platform selections
- **Response**: Processing status and video ID

### GET /api/videos/:userId
Get user's processed video history
- **Response**: List of processed videos with metadata

### GET /api/download/:userId/:filename
Download processed video file
- **Response**: Video file stream

### GET /api/health
Health check endpoint
- **Response**: Server status

## Deployment

### Frontend (Vercel)

```bash
# Build the project
npm run build

# Deploy to Vercel
npm install -g vercel
vercel --prod
```

Environment variables needed on Vercel:
- All `VITE_*` variables from `.env`
- Set `VITE_API_URL` to your backend URL

### Backend (Render)

1. Create new Web Service on Render
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `backend/.env`

## File Structure

```
crosspost-ai/
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── config/             # Configuration files
│   └── App.tsx             # Main app component
├── backend/
│   ├── uploads/            # Temporary file storage
│   ├── outputs/            # Processed video outputs
│   ├── temp/               # Temporary processing files
│   └── server.js           # Express server
├── public/                 # Static assets
└── README.md
```

## Troubleshooting

### Common Issues

**1. Whisper Installation Fails**
```bash
# Try installing with conda
conda install -c conda-forge whisper

# Or use alternative installation
pip install git+https://github.com/openai/whisper.git
```

**2. FFmpeg Not Found**
- Ensure FFmpeg is installed and in system PATH
- Test with: `ffmpeg -version`

**3. Firebase Connection Issues**
- Verify all environment variables are set
- Check Firebase project permissions
- Ensure Authentication is enabled

**4. Video Processing Fails**
- Check file format is supported
- Ensure file size is under limit
- Verify FFmpeg installation

**5. Gemini AI Errors**
- Verify API key is valid
- Check API quota limits
- Ensure correct model name

### Performance Tips

- Use smaller video files during development
- Consider video compression for large files
- Enable Firebase Storage for production file handling
- Implement video thumbnail generation
- Add progress tracking for long processing jobs

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper error handling
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase and Gemini AI documentation
3. Open GitHub issue with detailed error information
