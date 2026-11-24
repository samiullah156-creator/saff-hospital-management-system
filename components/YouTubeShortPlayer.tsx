import React from 'react';

const YouTubeShortPlayer: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-2">
      {/* Centered container with max-width constraint for desktop but full width (safe) on mobile */}
      <div style={{ maxWidth: '56vh', width: '100%' }} className="mx-auto relative group">
        <div style={{ left: 0, width: '100%', height: 0, position: 'relative', paddingBottom: '177.7778%' }} className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-900 bg-black">
          <iframe 
            src="https://www.youtube.com/embed/WjILHS4--o0?rel=0" 
            style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', border: 0 }} 
            allowFullScreen 
            scrolling="no" 
            allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;" 
            referrerPolicy="strict-origin"
            title="Saff Hospital Short"
            className="w-full h-full"
          ></iframe>
        </div>
        
        {/* Mobile decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-hospital-500 rounded-full blur-xl opacity-50 -z-10"></div>
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500 rounded-full blur-xl opacity-50 -z-10"></div>
      </div>
    </div>
  );
};

export default YouTubeShortPlayer;