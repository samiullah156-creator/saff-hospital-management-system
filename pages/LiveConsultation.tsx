
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

type GenerativeBlob = {
  data: string;
  mimeType: string;
};

const getApiKey = (): string => {
  const key = process.env.GEMINI_API_KEY;
  
  if (!key || key.includes('YOUR_API_KEY')) {
    console.error("Live Consultation: API Key invalid or missing.");
    throw new Error("GEMINI_API_KEY is missing. Please configure it in Vercel.");
  }
  return key;
};

const LiveConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [bgBlur, setBgBlur] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  
  // Transcription State
  const [transcript, setTranscript] = useState<{role: 'User' | 'AI', text: string}[]>([]);
  const [liveCaption, setLiveCaption] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Buffers
  const currentInputTransRef = useRef("");
  const currentOutputTransRef = useRef("");
  const bgBlurRef = useRef(false);

  useEffect(() => {
    bgBlurRef.current = bgBlur;
  }, [bgBlur]);

  useEffect(() => {
    let interval: any;
    if (connected) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [connected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data: Float32Array): GenerativeBlob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return {
      data: arrayBufferToBase64(int16.buffer),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startSession = async () => {
    setHasStarted(true);
    setError(null);
    try {
      const apiKey = getApiKey();
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      inputAudioContextRef.current = inputAudioContext;
      
      const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      if (inputAudioContext.state === 'suspended') await inputAudioContext.resume();
      if (outputAudioContext.state === 'suspended') await outputAudioContext.resume();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        audioStreamRef.current = stream;
      } catch (err: any) {
        console.error("Media Access Error:", err);
        throw new Error("Could not access microphone/camera. Please check permissions.");
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setConnected(true);
            console.log("Connected to Gemini Live");

            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch(() => {});
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            if (canvasRef.current && videoRef.current) {
               const ctx = canvasRef.current.getContext('2d');
               const videoEl = videoRef.current;
               
               videoIntervalRef.current = window.setInterval(() => {
                  if (ctx && videoEl.readyState === 4) {
                      canvasRef.current!.width = videoEl.videoWidth / 4;
                      canvasRef.current!.height = videoEl.videoHeight / 4;
                      
                      if (bgBlurRef.current) {
                          ctx.filter = 'blur(8px)';
                      } else {
                          ctx.filter = 'none';
                      }

                      ctx.drawImage(videoEl, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                      
                      const base64Data = canvasRef.current!.toDataURL('image/jpeg', 0.5).split(',')[1];
                      
                      sessionPromise.then((session) => {
                          session.sendRealtimeInput({
                             media: { data: base64Data, mimeType: 'image/jpeg' }
                          });
                      }).catch(() => {});
                  }
               }, 1000); 
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              setIsSpeaking(true);
              setTimeout(() => setIsSpeaking(false), 800); 

              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContext.currentTime,
              );
              
              const audioBuffer = await decodeAudioData(
                base64ToUint8Array(base64EncodedAudioString),
                outputAudioContext,
                24000,
                1,
              );
              
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                    setIsSpeaking(false);
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            const outputTrans = message.serverContent?.outputTranscription;
            const inputTrans = message.serverContent?.inputTranscription;

            if (outputTrans?.text) {
                currentOutputTransRef.current += outputTrans.text;
                setLiveCaption(currentOutputTransRef.current);
            }
            if (inputTrans?.text) {
                currentInputTransRef.current += inputTrans.text;
                setLiveCaption(currentInputTransRef.current);
            }

            if (message.serverContent?.turnComplete) {
                if (currentInputTransRef.current.trim()) {
                    setTranscript(prev => [...prev, { role: 'User', text: currentInputTransRef.current.trim() }]);
                    currentInputTransRef.current = "";
                }
                if (currentOutputTransRef.current.trim()) {
                    setTranscript(prev => [...prev, { role: 'AI', text: currentOutputTransRef.current.trim() }]);
                    currentOutputTransRef.current = "";
                }
                setLiveCaption('');
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
              currentOutputTransRef.current = "";
              setLiveCaption('');
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            console.log("Session Disconnected");
            setConnected(false);
          },
          onerror: (e) => {
             console.error("Live API Error:", e);
             const msg = (e as any).message || "Connection Error";
             setError(`Live Session Failed: ${msg}`);
             setHasStarted(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO], 
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are Dr. AI, an empathetic senior doctor at Saff Hospital. Speak naturally and concisely (1-3 sentences). Ask clarifying questions about symptoms one by one. If you see the patient, acknowledge visual cues.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      sessionPromise.catch(err => {
          console.error("Connection Failed:", err);
          setError(`Connection Failed: ${err.message}`);
          setHasStarted(false);
          setConnected(false);
      });

    } catch (e: any) {
       console.error(e);
       setError(e.message || "Failed to start consultation.");
       setHasStarted(false);
    }
  };

  const toggleMic = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCamera = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
      setCameraEnabled(!cameraEnabled);
    }
  };

  const endCall = () => {
      if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (inputAudioContextRef.current) {
          inputAudioContextRef.current.close();
      }
      if (audioContextRef.current) {
          audioContextRef.current.close();
      }
      if (videoIntervalRef.current) {
          clearInterval(videoIntervalRef.current);
      }
      setConnected(false);
      setHasStarted(false);
      navigate('/dashboard');
  };

  useEffect(() => {
      startSession();
      
      return () => {
          if (audioStreamRef.current) {
              audioStreamRef.current.getTracks().forEach(track => track.stop());
          }
          if (videoIntervalRef.current) {
              clearInterval(videoIntervalRef.current);
          }
      };
  }, []);

  const saveAsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Saff Hospital - Live Consultation Transcript", 10, 15);
    doc.setFontSize(12);
    let y = 35;
    transcript.forEach((t) => {
        const role = t.role === 'AI' ? 'Dr. AI' : 'Patient';
        doc.setFont("helvetica", "bold");
        doc.text(role + ":", 10, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(t.text, 180);
        doc.text(splitText, 10, y);
        y += splitText.length * 6 + 4;
        if (y > 280) { doc.addPage(); y = 15; }
    });
    doc.save(`Consultation_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const saveAsJpg = async () => {
    const element = document.getElementById('transcript-container');
    const controls = document.getElementById('transcript-controls');
    if(element) {
        if (controls) controls.style.display = 'none';
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.download = `Consultation_${new Date().getTime()}.jpg`;
            link.click();
        } catch (err) {
            console.error("Screenshot failed:", err);
        } finally {
            if (controls) controls.style.display = 'flex';
        }
    }
  };

  return (
    <div className="min-h-screen bg-teal-900 flex flex-col relative overflow-hidden font-sans text-white">
        {!connected && !error && (
            <div className="absolute inset-0 z-50 bg-teal-900/90 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-t-hospital-500 border-r-transparent border-b-hospital-700 border-l-transparent animate-spin"></div>
                </div>
                <p className="text-hospital-300 font-bold animate-pulse tracking-widest uppercase text-sm">Establishing Secure Link...</p>
            </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
             <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${connected ? 'bg-green-500 text-green-500 animate-pulse' : 'bg-yellow-500 text-yellow-500'}`}></div>
                 <span className="font-bold text-xs tracking-wider uppercase text-white/90">
                    {connected ? 'Live Session' : 'Connecting'}
                 </span>
                 <div className="w-px h-3 bg-white/20"></div>
                 <span className="text-xs font-mono text-hospital-300 tabular-nums min-w-[3rem]">
                     {formatTime(duration)}
                 </span>
             </div>
             
             <button onClick={() => setShowTranscript(!showTranscript)} className="p-2.5 rounded-full backdrop-blur-md border bg-black/20 text-white border-white/10 hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
             </button>
        </div>

        <div className="flex-1 relative flex flex-col items-center justify-center p-4">
             <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                      {isSpeaking && (
                        <>
                            <div className="absolute inset-0 bg-hospital-500/20 rounded-full animate-ping duration-[2000ms]"></div>
                            <div className="absolute inset-4 bg-hospital-400/20 rounded-full animate-ping duration-[1500ms] delay-150"></div>
                        </>
                      )}
                      <div className={`relative z-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-teal-800 to-teal-900 border-4 flex items-center justify-center transition-all duration-300 shadow-2xl ${isSpeaking ? 'border-hospital-400 scale-105' : 'border-teal-700'}`}>
                          <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Dr AI" className={`w-20 h-20 md:w-24 md:h-24 object-contain ${isSpeaking ? 'opacity-100' : 'opacity-70 grayscale-[0.3]'}`} />
                      </div>
                  </div>
                  <div className="mt-8 text-center space-y-2 h-16">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">Dr. AI</h2>
                      {isSpeaking ? (
                          <div className="flex justify-center items-center gap-1 h-6">
                              {[...Array(5)].map((_, i) => (
                                  <div key={i} className="w-1 bg-hospital-400 rounded-full animate-[bounce_0.8s_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: `${10 + Math.random() * 20}px` }}></div>
                              ))}
                          </div>
                      ) : (
                          <p className="text-teal-400 text-sm font-medium animate-pulse">{connected ? 'Listening...' : 'Initializing...'}</p>
                      )}
                  </div>
             </div>

             {liveCaption && (
                <div className="absolute bottom-32 left-0 right-0 z-20 flex justify-center px-6 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md text-white/90 px-6 py-4 rounded-2xl text-base font-medium shadow-lg max-w-2xl text-center border border-white/10">
                        "{liveCaption}"
                    </div>
                </div>
             )}

             <div className="absolute bottom-24 right-4 md:bottom-8 md:right-8 w-32 md:w-64 aspect-[3/4] md:aspect-video bg-teal-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-20 transition-all hover:scale-105 group">
                 <video ref={videoRef} className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-300 ${!cameraEnabled ? 'hidden' : ''} ${bgBlur ? 'blur-md' : ''}`} muted playsInline />
                 {!cameraEnabled && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-teal-800 text-teal-500">
                        <span className="text-[10px] uppercase font-bold tracking-widest">Camera Off</span>
                    </div>
                 )}
             </div>

             <canvas ref={canvasRef} className="hidden"></canvas>
             
             {error && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-lg font-bold z-50 flex items-center border border-red-400 max-w-sm text-center">
                    <span className="text-sm">{error}</span>
                </div>
             )}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
             <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
                 <button onClick={toggleMic} className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${micEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/80 text-white hover:bg-red-600 border border-red-400'}`}>
                    {micEnabled ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>}
                 </button>
                 
                 <button onClick={toggleCamera} className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${cameraEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/80 text-white hover:bg-red-600 border border-red-400'}`}>
                    {cameraEnabled ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>}
                 </button>

                 <button onClick={() => setBgBlur(!bgBlur)} className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${bgBlur ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 border border-teal-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                 </button>

                 <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full shadow-lg shadow-red-600/30 transform hover:scale-105 active:scale-95 transition-all duration-200 group font-bold tracking-wide flex items-center">
                    End
                 </button>
             </div>
        </div>

        {showTranscript && (
            <div id="transcript-container" className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200 z-40 animate-slide-in-right flex flex-col font-sans">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white/50">
                    <h3 className="text-gray-800 font-bold text-lg font-serif">Transcript</h3>
                    <button onClick={() => setShowTranscript(false)} className="text-gray-400 hover:text-red-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {transcript.map((t, i) => (
                        <div key={i} className={`text-sm rounded-xl p-3.5 shadow-sm border ${t.role === 'AI' ? 'bg-hospital-50 text-hospital-900 border-hospital-100' : 'bg-white text-slate-700 border-gray-200'}`}>
                            <strong className={`block text-xs uppercase tracking-wider mb-1 ${t.role === 'AI' ? 'text-hospital-600' : 'text-slate-500'}`}>{t.role === 'AI' ? 'Dr. AI' : 'You'}</strong>
                            {t.text}
                        </div>
                    ))}
                </div>
                <div id="transcript-controls" className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur flex justify-between gap-3">
                    <button onClick={saveAsPdf} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-50">Save PDF</button>
                    <button onClick={saveAsJpg} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-50">Save Image</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default LiveConsultation;
