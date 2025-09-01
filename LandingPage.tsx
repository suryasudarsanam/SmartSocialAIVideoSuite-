import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 text-center px-6 relative">
        <div className="max-w-4xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 leading-tight">
            Create Once. Post Everywhere.
          </h1>
          <p className="text-lg lg:text-2xl text-gray-700 mb-8">
            Transform your videos into platform-optimized content with AI-powered captions,
            resizing, and formatting – all in one seamless workflow.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            Get Started
          </button>
        </div>
        <div className="absolute bottom-4 text-sm text-gray-500">
          Powered by FFmpeg, Whisper, and Gemini AI
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Engineered for{" "}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Creative Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light">
              Every feature crafted with obsessive attention to detail, powered by cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6 text-2xl">
                🎯
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Multi-Platform Output</h3>
              <p className="text-gray-600">
                Generate optimized video versions for YouTube Shorts, Instagram Reels, and Facebook Reels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6 text-2xl">
                🧠
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI-Powered Captions</h3>
              <p className="text-gray-600">
                Auto-generate intelligent, platform-specific captions using Gemini AI for better engagement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-6 text-2xl">
                🎥
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">FFmpeg Video Processing</h3>
              <p className="text-gray-600">
                Automatically resize, convert, and format your video content with powerful FFmpeg processing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
