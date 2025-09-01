import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Play, 
  Calendar, 
  Hash, 
  MessageSquare,
  Upload,
  Video,
  Instagram,
  Youtube,
  Facebook,
  Loader,
  Eye,
  FileVideo,
  Sparkles,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProcessedVideo {
  id: string;
  originalFilename: string;
  platforms: {
    platform: string;
    name: string;
    filename: string;
    downloadUrl: string;
    previewUrl: string;
    thumbnail: string;
    caption: string;
    hashtags: string[];
    aspectRatio: string;
    resolution: string;
  }[];
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
}

const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    fetchUserVideos();
  }, [currentUser]);

  const fetchUserVideos = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${currentUser.uid}`);
      const data = await response.json();
     
      if (data.success) {
        setVideos(data.videos);
      } else {
        setError('Failed to load videos');
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platformId: string) => {
    const icons = {
      instagram: <Instagram className="h-5 w-5" />,
      youtube: <Youtube className="h-5 w-5" />,
      facebook: <Facebook className="h-5 w-5" />
    };
    return icons[platformId as keyof typeof icons] || <Video className="h-5 w-5" />;
  };

  const getPlatformColor = (platformId: string) => {
    const colors = {
      instagram: 'from-pink-500 via-purple-500 to-indigo-500',
      youtube: 'from-red-500 via-red-600 to-red-700',
      facebook: 'from-blue-500 via-blue-600 to-indigo-600'
    };
    return colors[platformId as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
      console.log('Downloading from:', downloadUrl);

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to fetch file');

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleVideoPreview = (url: string) => {
    try {
      const previewUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
      console.log('Previewing video:', previewUrl);
      window.open(previewUrl, '_blank', 'width=800,height=600');
    } catch (error) {
      console.error('Preview error:', error);
      alert('Preview failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Loader className="h-10 w-10 text-white animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Videos</h2>
          <p className="text-gray-600 text-lg">Preparing your creative workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-8 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchUserVideos}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Video className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Creative Journey Starts Here
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your first video and watch as AI transforms it into platform-perfect content 
              with intelligent captions and optimized formatting.
            </p>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 max-w-lg mx-auto border border-gray-100">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">Instagram</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">YouTube</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Facebook className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">Facebook</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">One upload, three perfect formats</p>
            </div>

            <Link
              to="/upload"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              <Upload className="h-6 w-6 group-hover:animate-bounce" />
              <span>Upload Your First Video</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Video Library
            </h1>
            <div className="flex items-center space-x-6 text-lg text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <span>{videos.length} processed video{videos.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>{videos.reduce((acc, video) => acc + video.platforms.length, 0)} total outputs</span>
              </div>
            </div>
          </div>
          <Link
            to="/upload"
            className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-xl"
          >
            <Upload className="h-5 w-5 group-hover:animate-bounce" />
            <span>Upload New</span>
          </Link>
        </div>

        {/* Videos Grid */}
        <div className="space-y-8">
          {videos.map((video, index) => (
            <div key={video.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-fade-in-up hover:shadow-3xl transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Video Header */}
              <div className="p-8 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <FileVideo className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {video.originalFilename}
                      </h3>
                      <p className="text-gray-600 flex items-center space-x-2">
                        <span>{video.platforms.length} platform{video.platforms.length !== 1 ? 's' : ''} processed</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>AI optimized</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm ${
                      video.status === 'completed' ? 'bg-green-100/80 text-green-800' :
                      video.status === 'processing' ? 'bg-yellow-100/80 text-yellow-800' :
                      'bg-red-100/80 text-red-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform Cards */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {video.platforms.map((platform) => (
                    <div key={platform.platform} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                      {/* Video Preview */}
                      <div className="relative bg-gray-900 aspect-video group cursor-pointer overflow-hidden" onClick={() => handleVideoPreview(platform.previewUrl || platform.downloadUrl)}>
                        <img
                          src={platform.thumbnail}
                          alt={`${platform.name} thumbnail`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-200">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Preview</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold">
                          {platform.aspectRatio}
                        </div>
                      </div>

                      {/* Platform Info */}
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${getPlatformColor(platform.platform)} shadow-lg`}>
                            <div className="text-white">
                              {getPlatformIcon(platform.platform)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{platform.name}</h4>
                            <p className="text-sm text-gray-500 font-medium">{platform.resolution}</p>
                          </div>
                        </div>

                        {/* AI Caption */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-700">AI Generated Caption</span>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl line-clamp-3 border border-gray-100">
                            {platform.caption}
                          </p>
                        </div>

                        {/* Hashtags */}
                        <div className="mb-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <Hash className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-700">Smart Hashtags</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {platform.hashtags.map((tag, index) => (
                              <span
                                key={index}
                                className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getPlatformColor(platform.platform)} text-white font-medium shadow-sm hover:shadow-md transition-shadow`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleVideoPreview(platform.previewUrl || platform.downloadUrl)}
                            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => handleDownload(platform.downloadUrl, `${video.originalFilename}-${platform.platform}.mp4`)}
                            className={`flex-1 text-white py-3 px-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 font-semibold bg-gradient-to-r ${getPlatformColor(platform.platform)}`}
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;