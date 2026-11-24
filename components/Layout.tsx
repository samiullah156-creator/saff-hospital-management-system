
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { User, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

// PROFESSIONAL S LOGO - Modern Path-Based Design
export const ProfessionalLogo = ({ size = "w-14 h-14", color = "#0D9488", className = "" }) => (
  <div className={`relative ${size} flex items-center justify-center group shrink-0 select-none ${className}`}>
     <svg 
        className="w-full h-full drop-shadow-sm filter transition-transform duration-500 group-hover:scale-105" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
     >
        {/* Subtle Shield Background */}
        <path 
          d="M50 5 L90 20 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V20 L50 5 Z" 
          fill={color} 
          fillOpacity="0.08" 
        />

        {/* Stylized 'S' Shape */}
        <path 
          d="M65 28C65 12 35 12 35 32C35 50 65 50 65 68C65 88 35 88 35 72" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Heartbeat Line cutting through */}
        <path 
          d="M12 50 H 28 L 38 25 L 52 75 L 62 35 L 72 50 H 88" 
          stroke="#EF4444" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-md"
        />
        
        {/* Endpoint Dot */}
        <circle cx="88" cy="50" r="3" fill="#EF4444" /> 
     </svg>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user: User | null = dbService.getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Chatbot Speech Bubble State
  const [botMessageIndex, setBotMessageIndex] = useState(0);
  const [showBotMessage, setShowBotMessage] = useState(true);
  const botMessages = [
    "👋 Hi there! I'm Dr. AI.",
    "🤒 Feeling unwell?",
    "📅 Need to book a visit?",
    "💊 Ask me about meds!",
    "📋 I can explain reports."
  ];

  const isDevPage = location.pathname === '/developer';

  // --- FIX: Scroll to Top on Route Change (Instant) ---
  useEffect(() => {
    // Force instant scroll to top to prevent "scroll to bottom" behavior
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  useEffect(() => {
    // Cycle bot messages
    const interval = setInterval(() => {
       setShowBotMessage(false);
       setTimeout(() => {
          setBotMessageIndex((prev) => (prev + 1) % botMessages.length);
          setShowBotMessage(true);
       }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await dbService.logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show/Hide Scroll Top Button
      setShowScrollTop(window.scrollY > 300);
      
      // Calculate Scroll Progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      // Simple logic to redirect based on query keywords
      const q = searchQuery.toLowerCase();
      if(q.includes('doctor') || q.includes('dr')) navigate('/doctors');
      else if(q.includes('service') || q.includes('test') || q.includes('lab')) navigate('/services');
      else if(q.includes('contact') || q.includes('location')) navigate('/contact');
      else if(q.includes('job') || q.includes('career')) navigate('/careers');
      else if(q.includes('ambulance') || q.includes('emergency')) navigate('/ambulance');
      // Specific department redirects
      else if(q.includes('heart') || q.includes('cardio')) navigate('/services');
      else if(q.includes('skin') || q.includes('derma')) navigate('/services');
      else if(q.includes('child') || q.includes('pedia')) navigate('/services');
      else navigate('/services'); // Default fallback
      
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }

  const isActive = (path: string) => location.pathname === path ? 'text-hospital-600 font-bold border-b-2 border-hospital-600' : 'text-gray-600 hover:text-hospital-500 font-medium transition hover:translate-y-[-1px]';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${isDevPage ? 'bg-[#0a0f1c]' : 'bg-gray-50'}`}>
      
      {/* Scroll Progress Bar */}
      {!isDevPage && (
        <div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-hospital-400 to-hospital-600 z-[60] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      )}

      {!isDevPage && (
        <>
          {/* TOP UTILITY BAR (Updated Color) - Hidden on Mobile */}
          <div className="bg-teal-700 text-white text-xs md:text-sm py-2 px-4 hidden md:block border-b border-teal-600">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
               <div className="flex space-x-6">
                  <Link to="/reports" className="hover:text-teal-200 transition flex items-center gap-1">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                     Online Reports
                  </Link>
                  <Link to="/careers" className="hover:text-teal-200 transition flex items-center gap-1">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                     Career Opportunities
                  </Link>
                  <Link to="/international" className="hover:text-teal-200 transition flex items-center gap-1">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     Int'l Patients
                  </Link>
               </div>
               <div className="flex space-x-6">
                  <Link to="/ambulance" className="flex items-center gap-1 text-red-200 font-bold animate-pulse hover:text-white transition">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                     Emergency: 1122
                  </Link>
                  <a href="tel:+92681234567" className="hover:text-teal-200 transition">Helpline: +92 68 1234567</a>
               </div>
            </div>
          </div>

          {/* Sticky Navbar */}
          <nav className="sticky top-0 z-50 bg-white/95 shadow-md backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 md:h-20">
                <div className="flex items-center">
                  {/* BRANDING - Mobile optimized size */}
                  <Link to="/" className="flex items-center gap-2 md:gap-3 group relative pl-0" onClick={() => window.scrollTo(0,0)}>
                    <ProfessionalLogo size="w-10 h-10 md:w-14 md:h-14" />
                    
                    {/* Text Block */}
                    <div className="flex flex-col justify-center">
                      <span className="text-lg md:text-3xl font-serif font-bold text-slate-900 tracking-tight group-hover:text-hospital-700 transition leading-none whitespace-nowrap">
                        Saff Hospital
                      </span>
                      <div className="flex items-center mt-0.5 md:mt-1">
                         <div className="h-0.5 w-4 md:w-6 bg-hospital-500 mr-2 group-hover:w-8 md:group-hover:w-10 transition-all duration-300 rounded-full"></div>
                         <span className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-[0.25em] group-hover:text-hospital-600 transition-colors whitespace-nowrap">
                           Rahim Yar Khan
                         </span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden xl:flex items-center space-x-5">
                  <Link to="/" className={isActive('/')}>Home</Link>
                  <Link to="/about" className={isActive('/about')}>About</Link>
                  <Link to="/services" className={isActive('/services')}>Services</Link>
                  <Link to="/doctors" className={isActive('/doctors')}>Doctors</Link>
                  <Link to="/reports" className={isActive('/reports')}>Reports</Link>
                  <Link to="/blog" className={isActive('/blog')}>Blog</Link>
                  <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
                  <Link to="/contact" className={isActive('/contact')}>Contact</Link>
                  
                  {user && user.role === Role.ADMIN && (
                    <Link to="/admin" className={`${isActive('/admin')} text-red-600`}>Admin</Link>
                  )}
                  
                  {user && user.role !== Role.ADMIN && (
                    <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                  )}
                  
                  <Link to="/ai-assistant" className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition duration-300 ${location.pathname === '/ai-assistant' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'}`}>
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">AI</div>
                    <span>Dr. AI</span>
                  </Link>

                  {/* Search Toggle */}
                  <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-500 hover:text-hospital-600 transition p-2 rounded-full hover:bg-gray-100">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </button>

                  {user ? (
                    <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                      <Link to="/profile/edit" className="flex flex-col items-end group cursor-pointer hover:opacity-80 transition" title="Edit Profile">
                        <span className="text-sm font-bold text-gray-800 leading-tight group-hover:text-hospital-600">{user.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{user.role}</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="ml-4 bg-hospital-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-hospital-700 shadow-lg shadow-hospital-500/30 transition transform hover:-translate-y-0.5">
                      Login
                    </Link>
                  )}
                </div>

                {/* Mobile Button - Visible on lg and below */}
                <div className="flex items-center xl:hidden space-x-2">
                  {/* Quick AI button for mobile */}
                  <Link to="/ai-assistant" className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 shadow-sm">
                     <span className="font-bold text-xs">AI</span>
                  </Link>
                  
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Global Search Bar Dropdown */}
            {isSearchOpen && (
               <div className="absolute top-16 md:top-20 left-0 w-full bg-white border-t border-gray-100 shadow-lg p-4 animate-fade-in z-40">
                  <form onSubmit={handleGlobalSearch} className="max-w-3xl mx-auto relative">
                     <input 
                       type="text" 
                       autoFocus
                       placeholder="Search for doctors, services, or health tips..." 
                       className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-hospital-500 text-gray-800 shadow-inner"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                     <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                     <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-3.5 text-gray-400 hover:text-red-500 transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                     </button>
                  </form>
               </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="xl:hidden bg-white/98 backdrop-blur-xl border-t animate-fade-in shadow-2xl h-[calc(100vh-64px)] overflow-y-auto absolute w-full left-0 z-50">
                <div className="flex flex-col p-4 space-y-3">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-800 hover:bg-hospital-50 rounded-xl flex items-center"><span className="w-1 h-6 bg-hospital-500 mr-3 rounded-full"></span>Home</Link>
                  <Link to="/appointment/new" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-bold text-hospital-700 bg-hospital-50 rounded-xl flex items-center border border-hospital-100">📅 Book Appointment</Link>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">About Us</Link>
                  <Link to="/services" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Services</Link>
                  <Link to="/doctors" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Doctors</Link>
                  <Link to="/reports" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Online Reports</Link>
                  <Link to="/ai-assistant" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl flex items-center"><span className="mr-3">🤖</span> Consult Dr. AI</Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link to="/ambulance" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-xl font-bold flex items-center"><span className="mr-3">🚑</span> Ambulance Service</Link>
                  <Link to="/international" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">International Patients</Link>
                  <Link to="/careers" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Careers</Link>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Contact</Link>
                  
                  {user && user.role === Role.ADMIN && (
                     <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-lg font-bold text-red-700 bg-red-50 rounded-xl border border-red-100 mt-2">Admin Panel</Link>
                  )}
                  
                  {user && (
                    <div className="bg-gray-50 rounded-xl p-4 mt-2">
                      <div className="flex items-center mb-3">
                         <div className="w-10 h-10 rounded-full bg-hospital-200 flex items-center justify-center text-hospital-700 font-bold mr-3">{user.name.charAt(0)}</div>
                         <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                         </div>
                      </div>
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-hospital-600">Dashboard</Link>
                      <Link to="/profile/edit" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-hospital-600">My Profile</Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700">Logout</button>
                    </div>
                  )}
                  {!user && (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-4 mt-4 text-lg font-bold bg-hospital-600 text-white rounded-xl shadow-lg">Login / Register</Link>
                  )}
                </div>
              </div>
            )}
          </nav>
        </>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {!isDevPage && (
        <>
          {/* Footer - Redesigned to be Responsive */}
          <footer className="bg-hospital-900 text-white pt-12 md:pt-20 pb-10 border-t border-teal-800 relative">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              
              {/* Column 1: Brand Info & Contact Merged */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                      <ProfessionalLogo size="w-12 h-12 md:w-14 md:h-14" color="#2DD4BF" />
                      <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white whitespace-nowrap">Saff Hospital</span>
                        <span className="text-[10px] text-teal-300 uppercase tracking-[0.2em] font-bold whitespace-nowrap">Rahim Yar Khan</span>
                      </div>
                  </div>
                  <p className="text-teal-100/80 text-sm leading-relaxed max-w-sm">
                    Excellence in healthcare in the heart of Rahim Yar Khan. We combine advanced technology with compassionate care.
                  </p>
                  
                  <div className="flex space-x-3">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                      <a key={social} href="#" className="w-10 h-10 rounded-full bg-white text-teal-900 flex items-center justify-center hover:bg-teal-500 hover:text-white transition duration-300 shadow-lg">
                         <span className="sr-only">{social}</span>
                         {/* Social Icons kept same */}
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-lg md:text-xl font-bold mb-4 text-white font-serif">Contact Us</h4>
                  <div className="space-y-4 text-teal-100/90 text-sm">
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 rounded-full border border-teal-500 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <p>Model Town, Near City Park, Rahim Yar Khan</p>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-3 w-5 h-5 rounded-full border border-teal-500 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <p>+92 68 1234567</p>
                      </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="lg:pl-8">
                <h4 className="text-lg md:text-xl font-bold mb-6 text-white font-serif">Quick Links</h4>
                <div className="p-6 md:p-8 border-2 border-teal-400/30 rounded-3xl relative">
                    <ul className="space-y-4 text-teal-100 text-sm font-medium">
                        <li><Link to="/about" className="hover:text-white transition flex items-center group"><span className="text-teal-500 mr-2">›</span> About Us</Link></li>
                        <li><Link to="/doctors" className="hover:text-white transition flex items-center group"><span className="text-teal-500 mr-2">›</span> Find a Doctor</Link></li>
                        <li><Link to="/reports" className="hover:text-white transition flex items-center group"><span className="text-teal-500 mr-2">›</span> Online Reports</Link></li>
                        <li><Link to="/ambulance" className="text-red-400 hover:text-red-300 font-bold transition flex items-center group"><span className="text-red-500 mr-2">›</span> Ambulance Service</Link></li>
                        <li><Link to="/international" className="hover:text-white transition flex items-center group"><span className="text-teal-500 mr-2">›</span> International Patients</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition flex items-center group"><span className="text-teal-500 mr-2">›</span> Contact Us</Link></li>
                    </ul>
                </div>
              </div>

              {/* Column 3: Newsletter */}
              <div>
                <h4 className="text-lg md:text-xl font-bold mb-6 text-white font-serif">Newsletter</h4>
                <p className="text-teal-100/80 text-sm mb-6 leading-relaxed">Subscribe to get health tips and hospital news updates.</p>
                <form className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Your Email Address" 
                    className="w-full px-5 py-3.5 bg-teal-800/30 border border-teal-600 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm text-white placeholder-teal-400/50" 
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-400 transition text-sm shadow-lg hover:shadow-teal-500/30"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-teal-800 flex flex-col md:flex-row justify-between items-center text-teal-400 text-xs text-center md:text-left">
              <p className="mb-4 md:mb-0">© {new Date().getFullYear()} Saff Hospital. All rights reserved.</p>
              <div className="flex space-x-6">
                 <a href="#" className="hover:text-white transition">Privacy Policy</a>
                 <a href="#" className="hover:text-white transition">Terms of Service</a>
                 <a href="#" className="hover:text-white transition">Sitemap</a>
              </div>
            </div>
          </footer>

          {/* Developer Footer Section */}
          <div className="bg-[#08201e] py-4 border-t border-teal-900/50 relative z-40">
             <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-1">
                <Link to="/developer" className="text-[10px] md:text-[11px] text-teal-500/70 font-mono tracking-wide select-none hover:text-teal-400 transition cursor-pointer flex items-center group text-center">
                  Developed by Sami – AI Automation Engineer & Full-Stack Innovator
                  <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </Link>
             </div>
          </div>

          {/* Floating Buttons */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 items-end pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-end gap-3">
              {showScrollTop && (
                <button 
                  onClick={scrollToTop}
                  className="bg-hospital-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-hospital-700 transition transform hover:-translate-y-1 animate-fade-in"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                </button>
              )}

              {location.pathname !== '/ai-assistant' && (
                <div className="relative flex items-end">
                   <div 
                     className={`absolute bottom-full right-0 mb-3 mr-2 bg-white p-3 rounded-2xl rounded-br-sm shadow-xl border border-gray-100 transform transition-all duration-500 origin-bottom-right w-40 md:w-48 z-40 ${
                       showBotMessage ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
                     }`}
                   >
                     <p className="text-xs font-bold text-gray-800 leading-tight">
                       {botMessages[botMessageIndex]}
                     </p>
                     <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                   </div>

                   <button 
                    onClick={() => navigate('/ai-assistant')}
                    className="group relative flex items-center justify-center transition-transform transform hover:-translate-y-1"
                   >
                    <div className="w-16 h-16 md:w-24 md:h-24 relative filter drop-shadow-2xl cursor-pointer">
                       <img 
                         src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" 
                         alt="Dr AI" 
                         className="w-full h-full object-contain animate-bounce-slight"
                       />
                       <div className="absolute bottom-1 right-2 w-3 h-3 md:w-4 md:h-4 bg-green-50 border-2 border-white rounded-full z-20 shadow-sm animate-ping-slow"></div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
