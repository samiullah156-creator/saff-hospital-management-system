
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YouTubeShortPlayer from '../components/YouTubeShortPlayer';

const CATEGORIES = ['All', 'Facilities', 'Medical', 'Rooms', 'Events', 'Exterior'];

const IMAGES = [
  { id: 1, cat: 'Facilities', src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200', title: 'Main Reception' },
  { id: 2, cat: 'Medical', src: 'https://images.unsplash.com/photo-1579684385136-1f140541250e?auto=format&fit=crop&q=80&w=1200', title: 'MRI Scan Room' },
  { id: 3, cat: 'Rooms', src: 'https://images.unsplash.com/photo-1516549655169-df83a0921226?auto=format&fit=crop&q=80&w=1200', title: 'Private Ward' },
  { id: 4, cat: 'Medical', src: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200', title: 'Operation Theater' },
  { id: 5, cat: 'Facilities', src: 'https://images.unsplash.com/photo-1538108149393-fbbd8189718c?auto=format&fit=crop&q=80&w=1200', title: 'Waiting Area' },
  { id: 6, cat: 'Events', src: 'https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&q=80&w=1200', title: 'Free Medical Camp' },
  { id: 7, cat: 'Medical', src: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4e60?auto=format&fit=crop&q=80&w=1200', title: 'ICU Department' },
  { id: 8, cat: 'Rooms', src: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&q=80&w=1200', title: 'VIP Room' },
  { id: 9, cat: 'Exterior', src: 'https://images.unsplash.com/photo-1587351021759-3e566b9af9ef?auto=format&fit=crop&q=80&w=1200', title: 'Hospital Exterior' },
  { id: 10, cat: 'Facilities', src: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=1200', title: 'Pharmacy' },
  { id: 11, cat: 'Facilities', src: 'https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=1200', title: 'Cafeteria' },
  { id: 12, cat: 'Exterior', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', title: 'New Wing Building' },
  { id: 13, cat: 'Medical', src: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=1200', title: 'Advanced Laboratory' },
  { id: 14, cat: 'Exterior', src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200', title: 'Garden View' },
  { id: 15, cat: 'Rooms', src: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200', title: 'Patient Lounge' },
];

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);

  const filteredImages = filter === 'All' ? IMAGES : IMAGES.filter(img => img.cat === filter);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"; // Gallery fallback
    e.currentTarget.onerror = null;
  };

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-hospital-900 relative py-16 md:py-20 overflow-hidden">
         <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1538108149393-fbbd8189718c?auto=format&fit=crop&q=80&w=1920" 
                className="w-full h-full object-cover opacity-30" 
                alt="Gallery" 
                onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hospital-900 to-transparent"></div>
         </div>
         <div className="relative z-10 text-center max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 animate-fade-in-up">Saff Hospital Gallery</h1>
            <p className="text-hospital-200 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-up delay-100 px-2">
               Explore our state-of-the-art facilities, advanced medical technology, and comfortable patient accommodations.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* Featured Video Section */}
        <div className="mb-16 animate-fade-in-up delay-200">
           <div className="flex items-center space-x-2 mb-6 border-b border-gray-200 pb-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 uppercase tracking-wide">Featured Video Tour</h2>
           </div>
           <div className="bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-gray-900 relative aspect-video transform hover:scale-[1.01] transition duration-500">
              <iframe 
                src="https://www.youtube.com/embed/gB8pWRBqTwk?rel=0" 
                className="absolute inset-0 w-full h-full"
                title="Saff Hospital Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
           </div>
           <p className="mt-4 text-gray-600 text-center italic text-sm">Take a visual journey through Saff Hospital.</p>
        </div>

        {/* Quick Highlights (Shorts) */}
        <div className="mb-16 animate-fade-in-up delay-300">
           <div className="flex items-center space-x-2 mb-6 border-b border-gray-200 pb-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 uppercase tracking-wide">Quick Highlights</h2>
           </div>
           {/* Optimized padding for mobile: p-4 instead of p-6/8 */}
           <div className="bg-gray-100 rounded-3xl p-4 md:p-8 shadow-inner border border-gray-200">
              <YouTubeShortPlayer />
           </div>
           <p className="mt-4 text-gray-600 text-center italic text-sm">Short stories from our daily life at Saff Hospital.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
           {CATEGORIES.map(cat => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                 filter === cat 
                   ? 'bg-hospital-600 text-white shadow-lg ring-2 ring-offset-2 ring-hospital-600' 
                   : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-hospital-300 hover:text-hospital-600'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredImages.map((img, index) => (
             <div 
               key={img.id} 
               onClick={() => setSelectedImage({ src: img.src, title: img.title })}
               className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-64 md:h-72 animate-fade-in-up"
               style={{ animationDelay: `${index * 100}ms` }}
             >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                   <div className="p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                      <span className="text-hospital-300 text-xs font-bold uppercase tracking-wider">{img.cat}</span>
                      <h3 className="text-white text-xl font-bold font-serif mt-1">{img.title}</h3>
                   </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-white/40">
                   <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
           <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-red-500 p-2 z-50 transition transform hover:scale-110 bg-black/20 rounded-full">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
           <div className="flex flex-col items-center max-w-6xl w-full p-2" onClick={(e) => e.stopPropagation()}>
             <img 
               src={selectedImage.src} 
               alt={selectedImage.title} 
               className="max-h-[70vh] max-w-full rounded-lg shadow-2xl mb-6 border border-gray-800 object-contain" 
               onError={handleImageError}
             />
             <div className="animate-fade-in-up text-center w-full">
                <h3 className="text-white text-2xl md:text-3xl font-serif font-bold tracking-wide drop-shadow-lg px-4">
                  {selectedImage.title}
                </h3>
                <div className="h-1 w-24 bg-hospital-500 mx-auto mt-3 rounded-full opacity-80 mb-6"></div>
                
                {/* ACTIVATE/ANIMATE BUTTON */}
                <button
                   onClick={() => navigate('/veo-studio', { state: { imageSrc: selectedImage.src } })}
                   className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition transform hover:shadow-purple-500/50"
                >
                   <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                   Animate this Picture
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
