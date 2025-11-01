'use client';

import React from 'react';
import { Play } from 'lucide-react';

const MarketingVideo: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See How We Transform Businesses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our video to learn how we help entrepreneurs build professional websites that
            drive growth and credibility.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative aspect-video bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Placeholder Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Video Player Overlay */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 hover:bg-white/30 transition-all cursor-pointer group mb-4">
                  <Play className="h-10 w-10 text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-white text-lg font-medium">Watch Our Story</p>
              </div>
            </div>

            {/* Optional: Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0xMCAwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTAgMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse" />
            </div>

            {/* TODO: Replace with actual video element */}
            {/*
            <video
              className="w-full h-full object-cover"
              controls
              poster="/path/to/video-thumbnail.jpg"
            >
              <source src="/path/to/marketing-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            */}
          </div>

          {/* Video Caption */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Video placeholder - Replace with your marketing video
            </p>
          </div>
        </div>

        {/* Optional: Key Stats Below Video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
            <div className="text-gray-600">Websites Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">98%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingVideo;
