
import React from 'react';
import { Link } from 'react-router-dom';

const InternationalPatients: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
        {/* Hero */}
        <div className="relative h-[60vh] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2560" className="w-full h-full object-cover" alt="Travel" />
            <div className="absolute inset-0 bg-gradient-to-r from-hospital-900/90 to-transparent"></div>
            <div className="absolute inset-0 flex items-center px-4">
                <div className="max-w-7xl mx-auto w-full">
                    <span className="bg-white/20 backdrop-blur text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Medical Tourism</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">World Class Care,<br/>Away From Home</h1>
                    <p className="text-xl text-hospital-100 max-w-xl leading-relaxed">
                        Saff Hospital welcomes patients from across the globe. We provide seamless assistance with visas, travel, and accommodation for your medical journey.
                    </p>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Dedicated International Desk</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        Traveling for medical treatment can be stressful. Our dedicated International Patient Services team is here to handle every detail, ensuring your focus remains solely on recovery.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Online Consultation before arrival",
                            "Visa Assistance Letter",
                            "Airport Pickup & Drop-off",
                            "Interpretation Services",
                            "Accommodation arrangements for attendants"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-gray-700 font-medium p-3 bg-gray-50 rounded-xl hover:bg-hospital-50 transition">
                                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Enhanced Quote Form */}
                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden ring-1 ring-black/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-50 rounded-bl-[80px] -mr-8 -mt-8 opacity-60 pointer-events-none"></div>
                    <div className="relative z-10">
                        <span className="text-hospital-600 font-bold text-xs uppercase tracking-wider mb-2 block">Get Started</span>
                        <h3 className="font-bold text-3xl mb-8 text-gray-900 font-serif">Request a Quote</h3>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input type="text" placeholder="Enter your full name" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 outline-none transition text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input type="email" placeholder="email@address.com" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 outline-none transition text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                                <input type="text" placeholder="Country of residence" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 outline-none transition text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Medical Condition</label>
                                <textarea placeholder="Describe your medical condition..." rows={4} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 outline-none transition resize-none text-gray-800"></textarea>
                            </div>
                            <button className="w-full bg-hospital-600 text-white font-bold py-4 rounded-xl hover:bg-hospital-700 transition shadow-xl shadow-hospital-500/30 transform hover:-translate-y-1">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="text-center bg-hospital-50 rounded-[3rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-hospital-400 to-transparent opacity-50"></div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 relative z-10">Why Choose Saff Hospital?</h2>
                <div className="grid md:grid-cols-3 gap-8 mt-12 relative z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-2">
                        <div className="text-5xl mb-4 bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">💲</div>
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Cost Effective</h4>
                        <p className="text-gray-500">Premium healthcare at a fraction of international costs.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-2">
                        <div className="text-5xl mb-4 bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">👨‍⚕️</div>
                        <h4 className="font-bold text-xl text-gray-900 mb-2">Expert Doctors</h4>
                        <p className="text-gray-500">Board-certified specialists with international experience.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-2">
                        <div className="text-5xl mb-4 bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">⚡</div>
                        <h4 className="font-bold text-xl text-gray-900 mb-2">No Waiting Time</h4>
                        <p className="text-gray-500">Immediate priority appointments for international guests.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InternationalPatients;
