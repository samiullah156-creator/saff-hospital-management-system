
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { ProfessionalLogo } from '../components/Layout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Simulate API call
      await dbService.login(email);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white animate-fade-in">
      
      {/* Left Side - Visual Hero */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-hospital-900 overflow-hidden">
         <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1538108149393-fbbd8189718c?auto=format&fit=crop&q=80&w=1920" 
             className="w-full h-full object-cover opacity-40 animate-pulse-slow" 
             alt="Hospital" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-hospital-900 via-hospital-800/80 to-transparent"></div>
         </div>
         <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20 text-white">
            <div className="mb-8">
               {/* Large Professional Logo */}
               <div className="relative w-32 h-32 flex items-center justify-center mb-8 animate-float">
                  <ProfessionalLogo size="w-32 h-32" color="#2DD4BF" />
               </div>
               
               <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in-up">
                 Welcome to <br/>
                 <span className="text-hospital-300">Saff Hospital</span>
               </h1>
               <p className="text-xl text-gray-300 max-w-lg leading-relaxed animate-fade-in-up delay-100">
                 Manage your appointments, view medical history, and consult with our AI health assistant—all in one place.
               </p>
            </div>
            <div className="flex gap-4 animate-fade-in-up delay-200">
               <div className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> 24/7 Support
               </div>
               <div className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Top Specialists
               </div>
            </div>
         </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-gray-50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-hospital-100 rounded-bl-full opacity-30 -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-tr-full opacity-30 -z-10"></div>

        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl space-y-8 border border-gray-100 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-hospital-400 to-hospital-600"></div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hospital-50 mb-6 group transition-transform hover:scale-110 shadow-sm">
               <svg className="w-8 h-8 text-hospital-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Patient Portal</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please sign in to access your dashboard.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-hospital-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
               <div className="flex items-center">
                 <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-hospital-600 focus:ring-hospital-500 border-gray-300 rounded" />
                 <label htmlFor="remember-me" className="ml-2 block text-gray-700">Remember me</label>
               </div>
               {/* Non-functional link for UI completeness */}
               {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
               <a href="#" className="font-medium text-hospital-600 hover:text-hospital-500">Need help?</a>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-hospital-600 to-hospital-500 hover:from-hospital-700 hover:to-hospital-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hospital-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-hospital-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Verifying...
                  </span>
                ) : (
                   <span className="flex items-center">
                      Sign In / Register
                      <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                   </span>
                )}
            </button>
            
            <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-400 uppercase tracking-widest font-bold">Demo Access</span>
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start animate-fade-in relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
               <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               <div className="relative z-10">
                   <p className="text-xs text-blue-800 font-bold mb-1">No Password Required</p>
                   <p className="text-xs text-blue-600 leading-relaxed">
                     You can use any email address to login. <br/>
                     For Admin access: <span className="font-mono bg-blue-100 px-1 rounded text-blue-800 border border-blue-200">admin@saff.com</span>
                   </p>
               </div>
            </div>
          </form>
          
          <div className="mt-6 text-center border-t border-gray-100 pt-6">
             <Link to="/" className="text-sm font-bold text-gray-400 hover:text-hospital-600 transition flex items-center justify-center gap-2 group">
               <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
