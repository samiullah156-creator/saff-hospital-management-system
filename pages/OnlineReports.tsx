
import React, { useState } from 'react';

const OnlineReports: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId && !phone) return;
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
        setLoading(false);
        setShowResult(true);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in font-sans">
        {/* Hero Section - Dark Background like Footer */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center bg-hospital-900">
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1581093458791-9f302e6d8359?auto=format&fit=crop&q=80&w=1920" 
                    alt="Lab Reports" 
                    className="w-full h-full object-cover transform scale-105 opacity-40" 
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-hospital-900 via-hospital-900/60 to-transparent"></div>
                <div className="absolute inset-0 bg-hospital-900/30 mix-blend-multiply"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white mt-[-50px]">
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg tracking-tight">
                    Online Lab Reports
                </h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light drop-shadow-md text-hospital-50 opacity-90">
                    Access your diagnostic reports securely from anywhere.
                </p>
            </div>
        </div>

        {/* Main Content Area - Floating Card */}
        <div className="max-w-xl mx-auto px-4 -mt-32 relative z-20 pb-24">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 ring-1 ring-black/5">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Patient ID / MR Number</label>
                        <div className="relative group">
                            <input
                              type="text"
                              placeholder="e.g. Saff-12345"
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-hospital-500/20 focus:border-hospital-500 outline-none transition text-gray-800 font-bold placeholder-gray-400 text-lg group-hover:border-hospital-200"
                              value={patientId}
                              onChange={(e) => setPatientId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">CNIC / Phone Number</label>
                        <div className="relative group">
                            <input
                              type="text"
                              placeholder="e.g. 0300-1234567"
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-hospital-500/20 focus:border-hospital-500 outline-none transition text-gray-800 font-bold placeholder-gray-400 text-lg group-hover:border-hospital-200"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-hospital-600 text-white font-bold py-4 rounded-xl hover:bg-hospital-700 transition shadow-xl shadow-hospital-500/30 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center text-lg group"
                    >
                      {loading ? (
                          <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Searching...
                          </span>
                      ) : (
                          <>
                            View Reports
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                          </>
                      )}
                    </button>
                </form>

                {showResult && (
                    <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in-up">
                        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            </div>
                            <p className="font-bold text-lg mb-1">No records found</p>
                            <p className="text-sm opacity-80">Please check your details or contact the lab reception at <a href="tel:+92681230002" className="underline font-bold hover:text-red-700">+92 68 1230002</a>.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default OnlineReports;
