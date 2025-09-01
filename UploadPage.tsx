import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Video,
  Zap,
  Sparkles,
  ArrowRight,
  FileVideo,
  Wand2,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  ratio: string;
  description: string;
  gradient: string;
  details: string;
}

// Enhanced Platform Icons
const InstagramIcon = (
  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
  </svg>
);

const YoutubeIcon = (
  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = (
  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'youtube', 'facebook']);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const platforms: Platform[] = [
    { 
      id: 'instagram', 
      name: 'Instagram Reels', 
      icon: InstagramIcon, 
      ratio: '9:16', 
      description: 'Vertical stories & reels', 
      gradient: 'from-pink-500 via-purple-500 to-indigo-500',
      details: 'Optimized for maximum engagement on Instagram Stories and Reels'
    },
    { 
      id: 'youtube', 
      name: 'YouTube Shorts', 
      icon: YoutubeIcon, 
      ratio: '16:9', 
      description: 'Horizontal landscape', 
      gradient: 'from-red-500 via-red-600 to-red-700',
      details: 'Perfect aspect ratio for YouTube videos and shorts'
    },
    { 
      id: 'facebook', 
      name: 'Facebook Feed', 
      icon: FacebookIcon, 
      ratio: '4:5', 
      description: 'Feed optimized', 
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      details: 'Tailored for Facebook feed and story placements'
    }
  ];

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('video/')) return 'Please select a valid video file';
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) return 'File size must be less than 100MB';
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    const videoFile = Array.from(e.dataTransfer.files).find(file => file.type.startsWith('video/'));
    if (videoFile) {
      const validationError = validateFile(videoFile);
      if (validationError) return setError(validationError);
      setSelectedFile(videoFile);
    } else {
      setError('Please drop a video file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    if (file) {
      const validationError = validateFile(file);
      if (validationError) return setError(validationError);
      setSelectedFile(file);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId]);
  };

  const processVideo = async () => {
    if (!selectedFile || selectedPlatforms.length === 0) return;
    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingStatus('Preparing your video for AI processing...');

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('platforms', JSON.stringify(selectedPlatforms));
      formData.append('userId', currentUser?.uid || '');

      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev >= 90 ? 90 : prev + 10;
          if (newProgress <= 30) {
            setProcessingStatus('Uploading your video...');
          } else if (newProgress <= 60) {
            setProcessingStatus('AI is analyzing your content...');
          } else if (newProgress <= 80) {
            setProcessingStatus('Generating platform-specific versions...');
          } else {
            setProcessingStatus('Creating AI captions and hashtags...');
          }
          return newProgress;
        });
      }, 300);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/upload`, {
        method: 'POST',
        body: formData
      });

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      if (result.success) {
        setProcessedVideoUrl(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${result.resizedVideo}`);
        setProcessingStatus('🎉 Processing complete! Your videos are ready!');
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process video.');
      setIsProcessing(false);
      setUploadProgress(0);
      setProcessingStatus('');
    }
  };

  // Success State
  if (processedVideoUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md text-center border border-white/20 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            🎉 Success!
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Your video has been transformed into platform-perfect versions with AI-generated captions!
          </p>
          
          <video className="w-full rounded-2xl shadow-lg mb-6" controls>
            <source src={processedVideoUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
          
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
            onClick={() => navigate('/dashboard')}
          >
            <span>View All Versions</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Processing State
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/20 animate-fade-in">
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            AI is Working Its Magic
          </h3>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            {processingStatus}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{uploadProgress < 100 ? 'Processing...' : 'Finalizing...'}</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-xl transition-all ${uploadProgress > 25 ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-gray-500'}`}>
              <Upload className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Upload</span>
            </div>
            <div className={`p-3 rounded-xl transition-all ${uploadProgress > 60 ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-500'}`}>
              <Zap className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Process</span>
            </div>
            <div className={`p-3 rounded-xl transition-all ${uploadProgress > 90 ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-gray-500'}`}>
              <Sparkles className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Enhance</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <FileVideo className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Video
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto font-light">
            Upload once, get AI-optimized versions for every platform with intelligent captions and hashtags
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <Upload className="h-6 w-6 text-blue-600" />
                <span>Upload Your Video</span>
              </h2>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${
                  isDragging ? 'border-blue-500 bg-blue-50 scale-105' :
                  selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-4 animate-fade-in">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-gray-900">{selectedFile.name}</p>
                      <p className="text-gray-600">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-xl text-gray-700 mb-3 font-semibold">Drag and drop your video here</p>
                    <p className="text-gray-500 mb-6">or</p>
                    <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl cursor-pointer font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 inline-flex items-center space-x-3">
                      <FileVideo className="h-5 w-5" />
                      <span>Choose File</span>
                      <input type="file" className="hidden" accept="video/*" onChange={handleFileSelect} />
                    </label>
                    <p className="text-sm text-gray-500 mt-6">
                      Supports MP4, MOV, AVI, WebM • Max 100MB
                    </p>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center space-x-3 animate-shake">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>

            {/* Platform Selection */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <Target className="h-6 w-6 text-purple-600" />
                <span>Choose Platforms</span>
              </h2>
              
              <div className="space-y-4">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all transform hover:scale-105 text-left ${
                      selectedPlatforms.includes(platform.id)
                        ? `border-transparent bg-gradient-to-r ${platform.gradient} text-white shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedPlatforms.includes(platform.id) ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        <div className={selectedPlatforms.includes(platform.id) ? 'text-white' : 'text-gray-600'}>
                          {platform.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg">{platform.name}</h3>
                          <span className="text-sm font-medium opacity-80">{platform.ratio}</span>
                        </div>
                        <p className="text-sm opacity-75">{platform.details}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlatforms.includes(platform.id) 
                          ? 'border-white bg-white' 
                          : 'border-gray-300'
                      }`}>
                        {selectedPlatforms.includes(platform.id) && (
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Process Button */}
            <div className="text-center">
              <button
                onClick={processVideo}
                disabled={!selectedFile || selectedPlatforms.length === 0}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3 mx-auto animate-fade-in-up animation-delay-400"
              >
                <Wand2 className="h-6 w-6 group-hover:animate-bounce" />
                <span>Transform with AI</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up animation-delay-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
                <span>What You'll Get</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Platform-Perfect Formats</h3>
                    <p className="text-gray-600 text-sm">Automatically resized and optimized for each platform's requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wand2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">AI-Generated Captions</h3>
                    <p className="text-gray-600 text-sm">Intelligent captions created from your video's audio using Whisper AI</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Smart Hashtags</h3>
                    <p className="text-gray-600 text-sm">Platform-specific hashtags generated by Gemini AI for maximum reach</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 animate-fade-in-up animation-delay-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span>Pro Tips</span>
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Upload in the highest quality possible for best results</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Clear audio helps our AI generate better captions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Processing typically takes 1-2 minutes per video</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;