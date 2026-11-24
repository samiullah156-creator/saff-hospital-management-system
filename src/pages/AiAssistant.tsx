import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { ChatMessage, AppointmentStatus, Doctor, Vitals, Attachment } from '../types';

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex space-x-1.5 items-center p-4 bg-white rounded-2xl rounded-tl-none border border-gray-200 w-fit shadow-sm">
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
  </div>
);

// Helper for Vitals Persistence
const vitalsHelper = {
  save: (userId: string, data: Vitals) => {
    localStorage.setItem(`saff_vitals_${userId}`, JSON.stringify(data));
  },
  get: (userId: string): Vitals | null => {
    const data = localStorage.getItem(`saff_vitals_${userId}`);
    return data ? JSON.parse(data) : null;
  }
};

const FEATURES = [
    { id: 'symptom', label: 'Symptom Checker', icon: '🤒', prompt: 'I want to check my symptoms. Please ask clarifying questions, then provide a detailed explanation of potential causes and suggest effective home remedies.' },
    { id: 'report', label: 'Analyze Report', icon: '📄', prompt: 'I want to upload a medical report (PDF or Image). Please analyze the findings, explain what they indicate in simple terms, and suggest next steps.' },
    { id: 'diet', label: 'Diet Plan', icon: '🥗', prompt: 'Can you create a healthy diet plan for me? Ask me about my dietary preferences and health goals first.' },
    { id: 'mental', label: 'Mental Wellness', icon: '🧘', prompt: 'I am feeling stressed and anxious. Can you help me with some coping strategies?' },
    { id: 'medicine', label: 'Medicine Info', icon: '💊', prompt: 'I need information about a specific medicine. I will tell you the name.' },
    { id: 'child', label: 'Child Care', icon: '👶', prompt: 'I need advice regarding pediatric care or vaccination.' },
];

const SUGGESTIONS = [
    "I have a headache and fever.",
    "Analyze this blood report for me.",
    "Create a diet plan for weight loss.",
    "Book an appointment with a Cardiologist.",
    "What are the symptoms of Dengue?",
    "Side effects of Panadol"
];

const AiAssistant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // TTS State
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  // Modals
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  
  // BMI State
  const [bmiData, setBmiData] = useState({ weight: '', height: '' });
  
  // Vitals State
  const [vitalsData, setVitalsData] = useState({ bpSystolic: '', bpDiastolic: '', heartRate: '', temp: '' });

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasProcessedInitialQuery = useRef(false);
  const recognitionRef = useRef<any>(null);

  // Enhanced Scroll Logic
  const scrollToBottom = () => {
    setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    const user = dbService.getCurrentUser();
    if (user) {
      const history = dbService.getChatHistory(user.id);
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Empty state handled by rendering Features Grid
        setMessages([]); 
      }
      const savedVitals = vitalsHelper.get(user.id);
      if (savedVitals) {
          setVitalsData({
              bpSystolic: savedVitals.bpSystolic,
              bpDiastolic: savedVitals.bpDiastolic,
              heartRate: savedVitals.heartRate,
              temp: savedVitals.temp
          });
      }
    } else {
       setMessages([{ role: 'model', text: 'Hello! I am Dr. AI. Please log in to save your chat history and access all features.' }]);
    }
    dbService.getDoctors().then(setDoctors);
  }, []);

  useEffect(() => {
    const user = dbService.getCurrentUser();
    if (user && messages.length > 0) {
      dbService.saveChatHistory(user.id, messages);
    }
    scrollToBottom();
  }, [messages, loading]); 

  useEffect(() => {
    const state = location.state as { initialQuery?: string } | null;
    if (state?.initialQuery && !hasProcessedInitialQuery.current) {
        hasProcessedInitialQuery.current = true;
        handleFeatureClick(state.initialQuery);
    }
  }, [location.state]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            const dataUrl = reader.result as string;
            setSelectedAttachments(prev => [...prev, {
                data: dataUrl,
                mimeType: file.type,
                name: file.name
            }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const parseDateSafe = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const startListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
      
      recognition.onresult = (event: any) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) setInput(prev => (prev + ' ' + final).trim());
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
          if (event.error === 'no-speech' || event.error === 'aborted') { 
              setIsListening(false); 
              return; 
          }
          console.error("Speech Recognition Error", event.error);
          setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in your browser.");
    }
  };

  const speakText = (text: string) => {
    const cleanText = text.replace(/[*#]/g, '').replace(/```json[\s\S]*?```/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to delete your entire conversation history?")) {
      const user = dbService.getCurrentUser();
      setMessages([]);
      if (user) {
        dbService.clearChatHistory(user.id);
      }
    }
  };

  const calculateBMI = async () => {
    const w = parseFloat(bmiData.weight);
    const h = parseFloat(bmiData.height) / 100;
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      setShowBmiModal(false);
      const userMsg = `I just calculated my BMI. It is ${bmi}. (Weight: ${w}kg, Height: ${bmiData.height}cm). Is this healthy?`;
      handleFeatureClick(userMsg);
      setBmiData({ weight: '', height: '' });
    } else {
      alert("Please enter valid weight and height.");
    }
  };

  const logVitals = async () => {
    const { bpSystolic, bpDiastolic, heartRate, temp } = vitalsData;
    if (!bpSystolic || !bpDiastolic || !heartRate || !temp) {
        alert("Please fill all fields.");
        return;
    }
    const user = dbService.getCurrentUser();
    if (user) {
        vitalsHelper.save(user.id, {
            ...vitalsData,
            timestamp: new Date().toISOString()
        });
    }
    setShowVitalsModal(false);
    const vitalString = `Current Vitals Log:\nBP: ${bpSystolic}/${bpDiastolic} mmHg\nHeart Rate: ${heartRate} bpm\nTemperature: ${temp}°F`;
    const userMsg = `I am logging my current vitals: ${vitalString}. Please analyze these values and tell me if they are within normal range for an adult.`;
    handleFeatureClick(userMsg);
  };

  const handleFeatureClick = async (promptText: string) => {
      const userMsg: ChatMessage = { role: 'user', text: promptText };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);
      
      try {
          const response = await geminiService.askHealthAssistant(promptText);
          setMessages(prev => [...prev, { role: 'model', text: response }]);
          if (autoSpeak) speakText(response);
      } catch (e) {
          setMessages(prev => [...prev, { role: 'model', text: "Sorry, I couldn't process that request." }]);
      } finally {
          setLoading(false);
      }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && selectedAttachments.length === 0) || loading) return;

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: input,
      attachments: selectedAttachments.length > 0 ? [...selectedAttachments] : undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const attachmentsToSend = [...selectedAttachments];
    setSelectedAttachments([]);
    setLoading(true);

    const lowerInput = userMsg.text.toLowerCase();
    if (attachmentsToSend.length === 0 && (lowerInput.includes('my appointment') || lowerInput.includes('check appointment') || lowerInput.includes('schedule') || lowerInput.includes('history'))) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const response = await generateAppointmentResponse();
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        if (autoSpeak) speakText(response);
        setLoading(false);
        return;
    }

    try {
        const promptToSend = userMsg.text.trim() || "Please analyze these uploaded medical documents/images.";
        const response = await geminiService.askHealthAssistant(promptToSend, attachmentsToSend);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        if (autoSpeak) speakText(response);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'model', text: "I encountered an error processing your request. Please try again." }]);
    } finally {
        setLoading(false);
    }
  };

  const generateAppointmentResponse = async (): Promise<string> => {
    const user = dbService.getCurrentUser();
    if (!user) return "Please log in to view your appointments.";
    try {
      const apps = await dbService.getAppointments(user.id);
      if (apps.length === 0) {
        return "I checked our records, and you don't have any appointments scheduled at the moment.";
      }
      const upcoming = apps.filter(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING).sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
      
      let responseText = "";
      if (upcoming.length > 0) {
        responseText += "📅 **Upcoming Appointments**\n";
        upcoming.forEach(a => {
          const dateObj = parseDateSafe(a.date);
          const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          responseText += `• **${dateStr} at ${a.time}** with Dr. ${a.doctorName} (${a.status})\n`;
        });
      } else {
        responseText += "You have no upcoming appointments.";
      }
      return responseText;
    } catch (error) {
      return "I'm having trouble accessing the appointment database right now.";
    }
  };

  const renderMessageText = (text: string) => {
    const jsonMatch = text.match(/```json\s*(\{[\s\S]*?"booking"[\s\S]*?\})\s*```/);
    let displayContent = text;
    let bookingData = null;
    if (jsonMatch) {
        try {
            const data = JSON.parse(jsonMatch[1]);
            bookingData = data.booking;
            displayContent = text.replace(jsonMatch[0], '').trim();
        } catch (e) {
            console.error("Failed to parse AI booking JSON", e);
        }
    }
    const lines = displayContent.split('\n');
    const isError = text.startsWith("System Error:") || text.startsWith("Connection Error:") || text.startsWith("I'm sorry");
    
    return (
        <div className={isError ? "text-red-600" : ""}>
            {isError && (
                <div className="flex items-center gap-2 mb-2 font-bold">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>Attention</span>
                </div>
            )}
            
            {lines.map((line, i) => {
                if (line.trim().startsWith('•')) {
                    const content = line.trim().substring(1).trim();
                    const parts = content.split(/(\*\*.*?\*\*)/g);
                    return (
                    <div key={i} className="flex items-start mb-2 pl-2">
                        <span className="text-hospital-500 mr-2 mt-1.5 text-[10px]">●</span>
                        <p className="flex-1 text-gray-700 text-sm">
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                            return <span key={j}>{part}</span>;
                        })}
                        </p>
                    </div>
                    );
                }
                if (line.trim().match(/^[\u{1F300}-\u{1F6FF}|📅|🗂️]/u)) {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                        <h3 key={i} className="mt-4 mb-3 font-bold text-hospital-800 flex items-center text-sm uppercase tracking-wide border-b border-gray-100 pb-1">
                            {parts.map((part, j) => {
                                const clean = part.startsWith('**') ? part.slice(2, -2) : part;
                                return <span key={j}>{clean}</span>
                            })}
                        </h3>
                    )
                }
                if (line.trim() === '') return <div key={i} className="h-1"></div>;
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={i} className="mb-2 leading-relaxed text-gray-700">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                        return <span key={j}>{part}</span>;
                    })}
                    </p>
                );
            })}
            {bookingData && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm animate-message-appear">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center"><span className="mr-2">📅</span> Booking Request</h4>
                    <p className="text-sm text-green-700 mb-1"><strong>Doctor:</strong> {bookingData.doctorName}</p>
                    <p className="text-sm text-green-700 mb-1"><strong>Date:</strong> {bookingData.date}</p>
                    <p className="text-sm text-green-700 mb-4"><strong>Reason:</strong> {bookingData.reason}</p>
                    <button 
                        onClick={() => {
                            const doc = doctors.find(d => d.name.toLowerCase().includes(bookingData.doctorName.toLowerCase()) || d.specialty.toLowerCase().includes(bookingData.doctorName.toLowerCase()));
                            navigate('/appointment/new', { state: { doctorId: doc?.id, preSelectedDate: bookingData.date, preSelectedReason: bookingData.reason } });
                        }}
                        className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition text-sm shadow-md"
                    >
                        Proceed to Book
                    </button>
                </div>
            )}
        </div>
    );
  };

  const renderAttachments = (msg: ChatMessage) => {
      // Backward compatibility for old "images" array
      if (msg.images && msg.images.length > 0) {
          return (
              <div className="flex gap-2 mb-2 flex-wrap">
                  {msg.images.map((img, i) => (
                      <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-white/20" alt="upload" />
                  ))}
              </div>
          );
      }
      
      // New generic attachments
      if (msg.attachments && msg.attachments.length > 0) {
          return (
              <div className="flex gap-2 mb-3 flex-wrap">
                  {msg.attachments.map((att, i) => (
                      <div key={i} className="relative group">
                          {att.mimeType.startsWith('image/') ? (
                              <img src={att.data} className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" alt="upload" />
                          ) : (
                              <div className="w-24 h-24 flex flex-col items-center justify-center bg-red-50 text-red-600 rounded-lg border border-red-200 shadow-sm p-2 text-center">
                                  <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                  <span className="text-[10px] font-bold truncate w-full">{att.name || 'PDF Document'}</span>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          );
      }
      return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 px-4 md:px-6 shadow-sm z-30 flex items-center justify-between shrink-0">
         <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="md:hidden text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/ai-assistant')}>
               <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                  <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Dr AI" className="w-8 h-8 object-contain animate-bounce-slight" />
               </div>
               <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center group-hover:text-indigo-700 transition-colors">
                    Dr. AI <span className="hidden sm:inline ml-1">Consultant</span>
                    {/* Animated Online Status Dot - Slowed Down */}
                    <span className="relative flex h-3 w-3 ml-2">
                        <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-sm shadow-green-400"></span>
                    </span>
                  </h1>
                  <p className="text-gray-500 text-xs group-hover:text-gray-700 transition-colors">Saff Hospital • <span className="text-indigo-600 font-bold">24/7 AI Support</span></p>
               </div>
            </div>
         </div>
         <div className="flex items-center space-x-2">
            <button onClick={() => setAutoSpeak(!autoSpeak)} className={`hidden md:flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition border ${autoSpeak ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-indigo-600'}`}>
                {autoSpeak ? '🔊 On' : '🔇 Off'}
            </button>
            <button onClick={() => navigate('/appointment/new')} className="hidden sm:flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition shadow-md shadow-indigo-500/30">
                <span className="mr-1.5">📅</span> Book
            </button>
            <button onClick={() => navigate('/live-consultation')} className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition shadow-md shadow-red-500/30 animate-pulse hover:animate-none">
                <span className="mr-1.5 text-lg">📹</span> <span className="hidden sm:inline">Live Call</span>
            </button>
            <button onClick={clearChat} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition" title="Clear Chat">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
         </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-72 flex-col border-r border-gray-200 bg-white p-6 space-y-6 overflow-y-auto">
            {/* Animated Health Tools Card */}
            <div className="text-center bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 hover:shadow-lg transition-all duration-300 group cursor-default transform hover:scale-105">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm p-3 group-hover:scale-110 transition-transform duration-300">
                   <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Dr AI" className="w-full h-full object-contain animate-float" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Health Tools</h2>
                <p className="text-xs text-gray-500 mt-1">Quick calculators & logs</p>
            </div>
            
            <div className="space-y-3">
                <button onClick={() => setShowBmiModal(true)} className="w-full flex items-center p-3 rounded-xl border border-indigo-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition group shadow-sm">
                   <span className="text-2xl mr-3 bg-indigo-100 p-2 rounded-lg group-hover:bg-white transition">⚖️</span>
                   <div className="text-left">
                      <div className="text-sm font-bold text-gray-800">BMI Calculator</div>
                      <div className="text-[10px] text-gray-500">Check ideal weight</div>
                   </div>
                </button>
                <button onClick={() => setShowVitalsModal(true)} className="w-full flex items-center p-3 rounded-xl border border-red-100 bg-white hover:bg-red-50 hover:border-red-200 transition group shadow-sm">
                   <span className="text-2xl mr-3 bg-red-100 p-2 rounded-lg group-hover:bg-white transition">❤️</span>
                   <div className="text-left">
                      <div className="text-sm font-bold text-gray-800">Log Vitals</div>
                      <div className="text-[10px] text-gray-500">Track BP & Heart Rate</div>
                   </div>
                </button>
                <button onClick={() => handleFeatureClick("Show me my recent appointments")} className="w-full flex items-center p-3 rounded-xl border border-teal-100 bg-white hover:bg-teal-50 hover:border-teal-200 transition group shadow-sm">
                   <span className="text-2xl mr-3 bg-teal-100 p-2 rounded-lg group-hover:bg-white transition">📅</span>
                   <div className="text-left">
                      <div className="text-sm font-bold text-gray-800">Appointments</div>
                      <div className="text-[10px] text-gray-500">View upcoming visits</div>
                   </div>
                </button>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative shadow-inner">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
            
            {/* WELCOME / EMPTY STATE */}
            {messages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full space-y-8 py-10 animate-fade-in-up">
                  <div className="text-center max-w-lg mx-auto">
                     <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-3">How can I help you today?</h2>
                     <p className="text-gray-500">I'm Dr. AI, your personal health assistant. Select a topic or type your question below.</p>
                  </div>
                  
                  {/* Quick Action Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl px-4">
                     {FEATURES.map((feature) => (
                        <button 
                           key={feature.id}
                           onClick={() => handleFeatureClick(feature.prompt)}
                           className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group"
                        >
                           <span className="text-4xl mb-3 group-hover:scale-110 transition duration-300">{feature.icon}</span>
                           <span className="font-bold text-gray-800 text-sm group-hover:text-indigo-600">{feature.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            ) : (
               <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-appear group`}>
                      {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                           <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="AI" className="w-6 h-6" />
                        </div>
                      )}
                      <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}`}>
                        {/* Render Attachments (Images/PDFs) */}
                        {renderAttachments(msg)}
                        
                        {msg.role === 'user' ? <p>{msg.text}</p> : renderMessageText(msg.text)}
                        
                        {/* Message Actions (AI only) */}
                        {msg.role === 'model' && (
                           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex space-x-1">
                              <button onClick={() => speakText(msg.text)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-indigo-600" title="Read Aloud">
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 0 0 0 7.072m2.828-9.9a9 9 0 0 1 0 12.728M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                              </button>
                           </div>
                        )}
                      </div>
                    </div>
                  ))}
               </>
            )}
            
            {loading && <div className="flex justify-start"><TypingIndicator /></div>}
            <div ref={bottomRef} className="h-1"></div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            {/* Suggestions Chips */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-1">
                {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => setInput(s)} className="flex-shrink-0 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition">
                        {s}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSend} className="relative flex items-center bg-gray-50 border border-gray-200 rounded-[2rem] p-1.5 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition" title="Upload Report/Image">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </button>
                
                {/* Attachments Preview in Input */}
                {selectedAttachments.length > 0 && (
                   <div className="flex -space-x-2 mr-2">
                      {selectedAttachments.map((att, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative bg-gray-100 flex items-center justify-center">
                            {att.mimeType.startsWith('image/') ? (
                                <img src={att.data} alt="thumb" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[8px] font-bold text-red-500">PDF</span>
                            )}
                            <button type="button" onClick={() => removeAttachment(i)} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[8px] opacity-0 hover:opacity-100">✕</button>
                         </div>
                      ))}
                   </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,application/pdf" multiple className="hidden" />
                <input 
                   type="text" 
                   value={input} 
                   onChange={(e) => setInput(e.target.value)} 
                   placeholder={isListening ? "Listening..." : "Type a query or upload PDF/Image..."} 
                   className="flex-1 bg-transparent px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none text-sm" 
                />
                
                <button type="button" onClick={startListening} className={`p-2 rounded-full transition mx-1 ${isListening ? 'bg-red-100 text-red-600 animate-pulse shadow-inner' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`} title="Voice Input">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                <button type="submit" disabled={loading} className="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                   <svg className="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
          </div>
        </div>
      </div>

      {/* BMI Modal */}
      {showBmiModal && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-sm relative overflow-hidden border border-gray-100 transform transition-all scale-100">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[80px] -mr-10 -mt-10 pointer-events-none opacity-50"></div>
               <button onClick={() => setShowBmiModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
               <h3 className="text-2xl font-bold font-serif mb-8 text-gray-900 flex items-center">
                  <span className="text-3xl mr-3 bg-indigo-100 rounded-xl p-2">⚖️</span> BMI Calculator
               </h3>
               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                     <input type="number" value={bmiData.weight} onChange={e => setBmiData({...bmiData, weight: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition text-lg font-medium text-gray-800" placeholder="e.g. 70" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height (cm)</label>
                     <input type="number" value={bmiData.height} onChange={e => setBmiData({...bmiData, height: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition text-lg font-medium text-gray-800" placeholder="e.g. 175" />
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button onClick={calculateBMI} className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5">Calculate</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Vitals Modal */}
      {showVitalsModal && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md relative overflow-hidden border border-gray-100 transform transition-all scale-100">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[80px] -mr-10 -mt-10 pointer-events-none opacity-50"></div>
               <button onClick={() => setShowVitalsModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
               <h3 className="text-2xl font-bold font-serif mb-8 text-gray-900 flex items-center">
                  <span className="text-3xl mr-3 bg-red-100 rounded-xl p-2 text-red-500">❤️</span> Log Vitals
               </h3>
               <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">BP Systolic</label>
                         <input type="number" value={vitalsData.bpSystolic} onChange={e => setVitalsData({...vitalsData, bpSystolic: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition text-lg text-gray-800" placeholder="120" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">BP Diastolic</label>
                         <input type="number" value={vitalsData.bpDiastolic} onChange={e => setVitalsData({...vitalsData, bpDiastolic: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition text-lg text-gray-800" placeholder="80" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Heart Rate</label>
                         <input type="number" value={vitalsData.heartRate} onChange={e => setVitalsData({...vitalsData, heartRate: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition text-lg text-gray-800" placeholder="72" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Temp (°F)</label>
                         <input type="number" value={vitalsData.temp} onChange={e => setVitalsData({...vitalsData, temp: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition text-lg text-gray-800" placeholder="98.6" />
                      </div>
                  </div>
                  
                  <div className="pt-6">
                     <button onClick={logVitals} className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition transform hover:-translate-y-0.5">Analyze & Save</button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default AiAssistant;