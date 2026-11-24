
import React, { useState } from 'react';

const Feedback: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in py-16">
        <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="text-hospital-600 font-bold uppercase tracking-widest text-xs bg-hospital-50 px-3 py-1 rounded-full border border-hospital-100">We Value Your Opinion</span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-4">Patient Feedback</h1>
                <p className="text-gray-500 mt-2 text-lg">Help us improve our services by sharing your experience.</p>
            </div>

            {submitted ? (
                <div className="bg-white p-12 rounded-[2rem] shadow-xl text-center border border-green-100 animate-fade-in-up transform transition-all">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-sm border border-green-100">
                        <span className="animate-bounce">🥰</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
                    <p className="text-gray-600 text-lg max-w-md mx-auto">Your feedback has been submitted successfully. We appreciate your time and will review your comments.</p>
                    <button onClick={() => window.location.reload()} className="mt-8 text-hospital-600 font-bold hover:underline hover:text-hospital-700 transition">Submit another response</button>
                </div>
            ) : (
                <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-hospital-50 rounded-bl-[100px] -mr-10 -mt-10 opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-tr-[80px] -ml-8 -mb-8 opacity-60"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="text-center mb-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <label className="block text-gray-800 font-bold text-xl mb-4 font-serif">How was your experience?</label>
                            <div className="flex justify-center gap-3 sm:gap-5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      type="button"
                                      key={star}
                                      onClick={() => setRating(star)}
                                      className={`text-4xl sm:text-6xl transition-all transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400 drop-shadow-md scale-110' : 'text-gray-200 hover:text-yellow-200'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <p className={`text-lg font-bold mt-4 transition-all duration-300 h-6 ${rating > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${rating >= 4 ? 'text-green-600' : rating === 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                                {rating === 5 ? "Excellent! 🎉" : rating === 4 ? "Good! 🙂" : rating === 3 ? "Average 😐" : rating === 2 ? "Poor 😞" : "Very Poor 😠"}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Name (Optional)</label>
                                <input type="text" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 transition outline-none placeholder-gray-400 text-gray-800" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone / Email</label>
                                <input type="text" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 transition outline-none placeholder-gray-400 text-gray-800" placeholder="contact@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Which department did you visit?</label>
                            <div className="relative">
                                <select className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 transition outline-none appearance-none cursor-pointer text-gray-700">
                                    <option value="" disabled selected>Select a Department</option>
                                    <option>OPD / Consultation</option>
                                    <option>Emergency / Trauma</option>
                                    <option>Laboratory</option>
                                    <option>Pharmacy</option>
                                    <option>Ward / In-Patient</option>
                                    <option>Administration</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-gray-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Comments</label>
                            <textarea rows={5} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 transition outline-none resize-none placeholder-gray-400 text-gray-800" placeholder="Please tell us more about your experience..."></textarea>
                        </div>

                        <button type="submit" className="w-full bg-hospital-600 text-white font-bold py-4 rounded-xl hover:bg-hospital-700 transition shadow-xl shadow-hospital-500/30 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center">
                            Submit Feedback
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    </div>
  );
};

export default Feedback;
