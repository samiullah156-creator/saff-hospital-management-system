
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Navigation API Service
const mockNavigationApi = {
  calculateRoute: async (origin: string, destination: string) => {
    return new Promise<{ route: string; traffic: string; distance: string; color: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          route: "Via Canal Road (Fastest)",
          traffic: "Light Traffic",
          distance: "4.8 km",
          color: "#10B981" // Green for clear
        });
      }, 2500); // Simulate API latency
    });
  }
};

const AmbulanceService: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'REQUEST' | 'SEARCHING' | 'TRACKING'>('REQUEST');
  const [formData, setFormData] = useState({ location: '', phone: '', type: 'Medical Emergency' });
  const [eta, setEta] = useState(12);
  const [driver, setDriver] = useState({ name: 'Rashid Ali', vehicle: 'RYK-1122', rating: 4.9 });
  
  // Navigation State
  const [routeInfo, setRouteInfo] = useState<{ route: string; traffic: string; distance: string; color: string } | null>(null);
  
  useEffect(() => {
    let interval: any;
    if (step === 'TRACKING') {
      // Start Countdown
      if (eta > 0) {
        interval = setInterval(() => {
          setEta((prev) => (prev > 0 ? prev - 1 : 0));
        }, 3000);
      }

      // Trigger Navigation API
      const fetchRoute = async () => {
        setRouteInfo(null); // Reset
        const data = await mockNavigationApi.calculateRoute("Hospital", formData.location);
        setRouteInfo(data);
        // Optimize ETA based on "API" data
        setEta(10); 
      };
      fetchRoute();
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('SEARCHING');
    
    // Simulate finding a driver
    setTimeout(() => {
      setStep('TRACKING');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in font-sans">
      
      {/* Emergency Header */}
      <div className="bg-red-600 text-white p-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
           <div className="flex items-center space-x-3">
              <div className="relative">
                 <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                 <div className="bg-white text-red-600 p-2 rounded-full relative z-10">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                 </div>
              </div>
              <div>
                 <h1 className="text-xl font-bold font-serif leading-none">Emergency Response</h1>
                 <p className="text-red-200 text-xs font-bold tracking-wider">SAFF RESCUE 1122</p>
              </div>
           </div>
           <a href="tel:1122" className="bg-white text-red-600 px-6 py-2 rounded-full font-black text-lg hover:bg-red-50 transition shadow-md flex items-center">
              <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
              DIAL 1122
           </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        
        {step === 'REQUEST' && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
             <div className="bg-gray-800 h-48 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-60" alt="Ambulance" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                   <h2 className="text-3xl font-bold mb-1">Request Ambulance</h2>
                   <p className="text-gray-300 text-sm">We locate the nearest unit to your position.</p>
                </div>
             </div>
             
             <form onSubmit={handleRequest} className="p-8 space-y-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Location</label>
                   <div className="relative">
                      <input 
                        type="text" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-lg"
                        placeholder="Enter location or landmark"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                      <svg className="w-6 h-6 text-red-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <button type="button" className="absolute right-4 top-4 text-xs font-bold text-blue-600 hover:underline">Use GPS</button>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="03xx-xxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Type</label>
                      <select 
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                         <option>Medical Emergency</option>
                         <option>Road Accident</option>
                         <option>Cardiac Arrest</option>
                         <option>Pregnancy / Labour</option>
                         <option>Fire / Burn</option>
                      </select>
                   </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl text-yellow-800 text-sm">
                   <strong>Note:</strong> For critical life-threatening situations, please call 1122 directly immediately after requesting.
                </div>

                <button className="w-full bg-red-600 text-white font-black text-xl py-5 rounded-xl shadow-xl hover:bg-red-700 transition transform hover:scale-[1.02] flex items-center justify-center">
                   <span className="relative flex h-3 w-3 mr-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                   </span>
                   DISPATCH AMBULANCE
                </button>
             </form>
          </div>
        )}

        {step === 'SEARCHING' && (
           <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="relative w-32 h-32 mx-auto mb-8">
                 <div className="absolute inset-0 border-4 border-red-100 rounded-full animate-ping"></div>
                 <div className="absolute inset-4 border-4 border-red-200 rounded-full animate-ping delay-150"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                 </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Locating Nearest Unit...</h2>
              <p className="text-gray-500">Connecting to Saff Hospital Fleet Dispatch</p>
           </div>
        )}

        {step === 'TRACKING' && (
           <div className="space-y-6">
              {/* Map Simulation */}
              <div className="bg-gray-200 rounded-3xl h-[450px] relative overflow-hidden shadow-inner border-4 border-white group">
                 {/* Map Background Pattern */}
                 <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Neighborhood_Map_1000x1000.png')] bg-cover"></div>
                 
                 {/* Route Line Simulation (Reversed for Right-to-Left) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <path 
                      d="M90% 20% L 70% 35% L 50% 50% L 30% 65% L 10% 75%" 
                      fill="none" 
                      stroke={routeInfo ? routeInfo.color : "#EF4444"} 
                      strokeWidth="6" 
                      strokeDasharray={routeInfo ? "0" : "12,8"} 
                      strokeLinecap="round" 
                      className={`opacity-60 transition-all duration-1000 ${!routeInfo ? 'animate-pulse' : ''}`}
                    />
                 </svg>

                 {/* Navigation HUD */}
                 <div className="absolute top-4 left-4 z-40">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 text-xs min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="font-bold text-gray-800 uppercase tracking-wider">Live Navigation</span>
                        </div>
                        {routeInfo ? (
                            <div className="animate-fade-in">
                                <p className="font-bold text-xl text-gray-900 leading-none mb-1">{eta} min</p>
                                <p className="text-gray-500 font-medium mb-2">{routeInfo.route}</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-bold flex items-center">
                                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                      {routeInfo.traffic}
                                    </span>
                                    <span className="text-gray-600 font-mono">{routeInfo.distance}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-gray-500 py-2">
                                <svg className="w-5 h-5 animate-spin text-hospital-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-700">Calculating...</span>
                                  <span className="text-[10px]">Optimizing route based on traffic</span>
                                </div>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Hospital Marker (Destination) */}
                 <div className="absolute left-[10%] top-[75%] flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-500">
                       <span className="text-xl">🏥</span>
                    </div>
                    <span className="bg-white px-2 py-1 rounded text-xs font-bold mt-1 shadow border border-gray-200">Hospital</span>
                 </div>

                 {/* 3D Ambulance Marker (Animated Right-to-Left) */}
                 <div className="absolute z-50 animate-drive-map" style={{ width: '320px', height: '320px' }}>
                     <div className="relative w-full h-full flex items-center justify-center">
                        
                        {/* Realistic Mercedes Sprinter 3D Model */}
                        <img 
                            src="https://pngimg.com/d/ambulance_PNG48.png" 
                            className="w-full h-full object-contain relative z-20" 
                            alt="Ambulance" 
                            style={{ 
                                // Enhanced Visuals for visibility and realism
                                filter: 'brightness(1.05) contrast(1.1) drop-shadow(0 25px 25px rgba(0,0,0,0.5))',
                            }} 
                        />
                        
                        {/* Roof Light Bar - Red/Blue Alternating */}
                        {/* Adjusting for PNG48 geometry (Front is Left) */}
                        
                        {/* Front Lightbar (Red) */}
                        <div className="absolute top-[23%] left-[18%] w-10 h-6 bg-red-600 rounded-full animate-ping opacity-70 mix-blend-screen z-30" style={{boxShadow: '0 0 30px 15px rgba(220, 38, 38, 0.8)', animationDuration: '0.6s'}}></div>
                        
                        {/* Rear/Mid Lightbar (Blue) */}
                        <div className="absolute top-[20%] left-[45%] w-10 h-6 bg-blue-600 rounded-full animate-ping opacity-70 mix-blend-screen z-30" style={{boxShadow: '0 0 30px 15px rgba(37, 99, 235, 0.8)', animationDuration: '0.6s', animationDelay: '0.3s'}}></div>

                        {/* Grille Strobe Lights */}
                        <div className="absolute top-[52%] left-[12%] w-2 h-2 bg-white rounded-full animate-pulse z-30" style={{boxShadow: '0 0 15px 5px rgba(255, 255, 255, 1)'}}></div>
                        
                        {/* Headlights (Projecting Forward/Left) */}
                        <div className="absolute top-[55%] right-[80%] w-40 h-24 bg-gradient-to-l from-yellow-200/40 to-transparent transform -rotate-6 blur-xl z-10 rounded-[100%] mix-blend-screen pointer-events-none"></div>

                        {/* Soft Ground Shadow */}
                        <div className="absolute bottom-[20%] left-[10%] right-[10%] h-8 bg-black/50 blur-2xl rounded-[50%] transform scale-y-50 z-10"></div>
                     </div>
                 </div>

                 {/* User Marker (Start Point) */}
                 <div className="absolute left-[90%] top-[20%] flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
                       <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span className="bg-white px-2 py-1 rounded text-xs font-bold mt-1 shadow border border-gray-200">You</span>
                 </div>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                 <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                    <div>
                       <span className="text-green-500 font-bold uppercase tracking-widest text-xs mb-1 block">Status</span>
                       <h2 className="text-2xl font-bold text-gray-900">Ambulance Dispatched</h2>
                       <p className="text-gray-500 text-sm mt-1">Ideally reaching in <span className="text-gray-900 font-bold">{eta} minutes</span></p>
                    </div>
                    <div className="text-right">
                       <div className="text-4xl font-mono font-bold text-gray-900">{eta}<span className="text-sm text-gray-400 font-sans ml-1">min</span></div>
                    </div>
                 </div>

                 <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                       <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-lg text-gray-900">{driver.name}</h3>
                       <div className="flex items-center text-sm text-gray-500 space-x-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono font-bold">{driver.vehicle}</span>
                          <span>•</span>
                          <span className="flex items-center text-yellow-500"><svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> {driver.rating}</span>
                       </div>
                    </div>
                    <a href="tel:03001234567" className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition shadow-sm">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </a>
                 </div>
              </div>
              
              <button 
                onClick={() => setStep('REQUEST')}
                className="w-full py-4 text-gray-400 font-bold hover:text-red-500 transition text-sm"
              >
                 Cancel Request
              </button>
           </div>
        )}

      </div>
      
      {/* Fleet Info Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200 mt-12">
         <h3 className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Our Emergency Fleet</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
               <div className="text-3xl mb-2">🚑</div>
               <h4 className="font-bold text-gray-800">Cardiac Ambulance</h4>
               <p className="text-xs text-gray-500 mt-1">Equipped with Ventilator & Defibrillator</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
               <div className="text-3xl mb-2">🚐</div>
               <h4 className="font-bold text-gray-800">Standard BLS</h4>
               <p className="text-xs text-gray-500 mt-1">Basic Life Support & First Aid</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
               <div className="text-3xl mb-2">🚁</div>
               <h4 className="font-bold text-gray-800">Air Ambulance</h4>
               <p className="text-xs text-gray-500 mt-1">For Critical Inter-City Transport</p>
            </div>
         </div>
      </div>

      <style>{`
        @keyframes driveMap {
          0% { left: 90%; top: 20%; transform: translate(-50%, -50%); }
          25% { left: 70%; top: 35%; transform: translate(-50%, -50%); }
          50% { left: 50%; top: 50%; transform: translate(-50%, -50%); }
          75% { left: 30%; top: 65%; transform: translate(-50%, -50%); }
          100% { left: 10%; top: 75%; transform: translate(-50%, -50%); }
        }
        .animate-drive-map {
           animation: driveMap 12s linear infinite; 
           position: absolute;
           z-index: 999;
        }
      `}</style>
    </div>
  );
};

export default AmbulanceService;
