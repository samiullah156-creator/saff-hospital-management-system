
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

const getAiStudio = (): AIStudioClient | undefined => {
  return (window as any).aistudio;
}

const VeoStudio: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Cinematic drone shot, highly detailed, 4k, slow motion movement');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (location.state?.imageSrc) {
      setImageSrc(location.state.imageSrc);
    }
    checkKey();
  }, [location]);

  const checkKey = async () => {
    const aiStudio = getAiStudio();
    if (aiStudio) {
      try {
        const selected = await aiStudio.hasSelectedApiKey();
        setHasKey(selected);
      } catch (e) {
        console.warn("AI Studio check failed, defaulting to env key");
        setHasKey(true);
      }
    } else {
      // If running outside of the specific environment, assume key is present in env
      setHasKey(true); 
    }
  };

  const handleSelectKey = async () => {
    const aiStudio = getAiStudio();
    if (aiStudio) {
      await aiStudio.openSelectKey();
      // Assume success to avoid race conditions
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!imageSrc) return;
    setLoading(true);
    setVideoUrl(null);
    setStatusMsg("Initializing Veo model...");

    try {
      // Double check key before call
      const aiStudio = getAiStudio();
      if (aiStudio) {
         const hasKey = await aiStudio.hasSelectedApiKey();
         if (!hasKey) await handleSelectKey();
      }
      
      setStatusMsg("Generating video frames (this may take 1-2 minutes)...");
      const url = await geminiService.generateVideoFromImage(imageSrc, prompt);
      
      if (url) {
        setVideoUrl(url);
        setStatusMsg("Video generated successfully!");
      } else {
        setStatusMsg("Generation failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      setStatusMsg(`Error: ${error.message || "Failed to generate video"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white animate-fade-in font-sans">
      
      {/* Header */}
      <div className="border-b border-gray-800 p-4 flex items-center justify-between bg-gray-900/95 backdrop-blur sticky top-0 z-20">
         <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/gallery')} className="p-2 hover:bg-gray-800 rounded-full transition">
               <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7"/></svg>
            </button>
            <div>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Veo Studio</h1>
               <p className="text-xs text-gray-500">AI Video Generation</p>
            </div>
         </div>
         
         {!hasKey && getAiStudio() && (
            <button 
              onClick={handleSelectKey}
              className="text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 px-3 py-1.5 rounded-full hover:bg-yellow-600/30 transition flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
              Select API Key
            </button>
         )}
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8 items-start">
         
         {/* Left: Source Preview / Result */}
         <div className="space-y-6">
            <div className="bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative min-h-[300px] flex items-center justify-center">
               {loading ? (
                  <div className="text-center p-8">
                     <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                     <p className="text-purple-300 font-bold animate-pulse">{statusMsg}</p>
                     <p className="text-gray-500 text-sm mt-2">AI is dreaming up your video...</p>
                  </div>
               ) : videoUrl ? (
                  <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-contain"
                  />
               ) : imageSrc ? (
                  <img src={imageSrc} alt="Source" className="w-full h-full object-contain" />
               ) : (
                  <div className="text-gray-600 flex flex-col items-center">
                     <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                     <span>No Image Selected</span>
                  </div>
               )}
            </div>
            
            {/* Tips */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
               <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Pro Tips
               </h3>
               <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
                  <li>Use "Cinematic", "4k", "Slow motion" for better quality.</li>
                  <li>Describe the movement you want (e.g., "Camera pans left").</li>
                  <li>Video generation costs money; ensure you have a billing-enabled project.</li>
               </ul>
            </div>
         </div>

         {/* Right: Controls */}
         <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">Generation Settings</h2>
            
            <div className="mb-6">
               <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Prompt</label>
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none h-32 text-sm"
                 placeholder="Describe how the image should move..."
               ></textarea>
            </div>

            <button 
               onClick={handleGenerate}
               disabled={loading || !hasKey || !imageSrc}
               className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center ${
                  loading || !hasKey || !imageSrc
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/30'
               }`}
            >
               {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating...
                  </>
               ) : !hasKey ? (
                  'Select API Key to Enable'
               ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Generate Video
                  </>
               )}
            </button>

            {!hasKey && getAiStudio() && (
               <p className="text-center mt-4 text-xs text-red-400">
                  * Veo models require a paid billing project.
                  <button onClick={handleSelectKey} className="underline ml-1 font-bold">Select Key</button>
               </p>
            )}
         </div>
      </div>
    </div>
  );
};

export default VeoStudio;
