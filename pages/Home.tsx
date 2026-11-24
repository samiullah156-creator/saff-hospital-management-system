
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { BlogPost } from '../types';
import YouTubeShortPlayer from '../components/YouTubeShortPlayer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const VIDEO_IDS = [
  "WjILHS4--o0", 
  "gB8pWRBqTwk", 
  "dEo9mZc65Bc", 
  "LXb3EKWsInQ", 
  "Kw_WZOg-6zM", 
  "pM0vH5J7z98", 
  "ysz5S6PUM-U"  
];

const PARTNERS = [
  { name: 'State Life', color: 'text-blue-600' },
  { name: 'Jubilee Life', color: 'text-red-600' },
  { name: 'EFU Life', color: 'text-green-600' },
  { name: 'Adamjee Insurance', color: 'text-blue-800' },
  { name: 'Pak Qatar Takaful', color: 'text-purple-700' },
  { name: 'Sehat Sahulat Card', color: 'text-green-500' },
  { name: 'Askari Life', color: 'text-yellow-600' },
  { name: 'United Insurance', color: 'text-indigo-700' }
];

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2560",
    badge: "#1 Healthcare Facility",
    title: "Saff Hospital",
    highlight: "Rahim Yar Khan",
    desc: "Where compassion meets technology. Experience world-class healthcare with our advanced medical technology and expert staff.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0921226?auto=format&fit=crop&q=80&w=2560",
    badge: "Patient Comfort",
    title: "Luxury",
    highlight: "Private Wards",
    desc: "Experience healing in comfort with our VIP rooms and dedicated nursing staff ensuring 24/7 care.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1579684385136-1f140541250e?auto=format&fit=crop&q=80&w=2560",
    badge: "Heart Care Center",
    title: "Advanced",
    highlight: "Cardiology",
    desc: "State-of-the-art Cath Lab and 24/7 cardiac emergency services dedicated to keeping your heart healthy.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2560",
    badge: "Surgical Excellence",
    title: "Modern",
    highlight: "Operation Theaters",
    desc: "Modular OTs equipped with HEPA filters and latest surgical equipment for infection-free procedures.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=2560",
    badge: "Child Care",
    title: "Specialized",
    highlight: "Pediatric Unit",
    desc: "Comprehensive child care services with dedicated NICU and expert pediatricians for your little ones.",
  }
];

const LEADERSHIP_TEAM = [
  { 
    name: "Dr. Saff-ur-Rehman", 
    role: "CEO & Founder", 
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    bio: "Pioneering healthcare excellence in RYK for over 25 years. A visionary leader committed to patient-first care.",
    link: "/about"
  },
  { 
    name: "Dr. Sarah Ahmed", 
    role: "Medical Director", 
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
    bio: "Ensuring top-tier clinical standards, patient safety protocols, and leading our team of specialists.",
    link: "/doctors"
  },
  { 
    name: "Mr. Kamran Ali", 
    role: "Head of Operations", 
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    bio: "Managing hospital logistics, infrastructure, and seamless service delivery for a smooth patient experience.",
    link: "/contact"
  },
  { 
    name: "Mrs. Fatima Noor", 
    role: "Head of Nursing", 
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    bio: "Leading our compassionate nursing staff with dedication, ensuring every patient feels cared for.",
    link: "/careers"
  }
];

const FEATURED_DEPARTMENTS = [
  { 
    id: 'liver', 
    name: 'Liver Transplant', 
    img: 'https://images.unsplash.com/photo-1606859191214-25806e8e2423?auto=format&fit=crop&q=80&w=800', 
    desc: 'Specialized care for liver diseases including complex transplant surgeries led by expert surgeons.' 
  },
  { 
    id: 'kidney', 
    name: 'Kidney Transplant', 
    img: 'https://images.unsplash.com/photo-1579684385136-1f140541250e?auto=format&fit=crop&q=80&w=800', 
    desc: 'Advanced nephrology and urology services providing dialysis and state-of-the-art kidney transplants.' 
  },
  { 
    id: 'cardiac', 
    name: 'Cardiac Centre', 
    img: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800', 
    desc: 'Complete heart care facility featuring Angiography, Angioplasty, and Open Heart Surgery.' 
  },
  { 
    id: 'dialysis', 
    name: 'Dialysis Centre', 
    img: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=800', 
    desc: 'Modern dialysis stations with comfortable beds and 24/7 monitoring by nephrologists.' 
  }
];

const DEPARTMENTS_DIRECTORY = [
  { name: "Cardiology", icon: "❤️" },
  { name: "Neurology", icon: "🧠" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Gynecology", icon: "🤰" },
  { name: "ENT", icon: "👂" },
  { name: "Dermatology", icon: "✨" },
  { name: "Psychiatry", icon: "🧩" },
  { name: "Ophthalmology", icon: "👁️" },
  { name: "Physiotherapy", icon: "🏃" },
  { name: "Nutrition", icon: "🥗" },
  { name: "Radiology", icon: "📸" },
  { name: "Pathology Lab", icon: "🔬" },
  { name: "Emergency", icon: "🚑" },
  { name: "Dental", icon: "🦷" },
  { name: "Oncology", icon: "🎗️" },
  { name: "Urology", icon: "💧" },
  { name: "Gastroenterology", icon: "🥘" }
];

const SHOWCASE_ITEMS = [
  { 
    id: 1, 
    title: "Executive Private Room", 
    category: "Rooms", 
    img: "https://images.unsplash.com/photo-1516549655169-df83a0921226?auto=format&fit=crop&q=80&w=800", 
    link: "/services",
    description: "Premium furnished rooms with dedicated nursing staff and 24/7 room service for maximum comfort."
  },
  { 
    id: 2, 
    title: "Modern Dental Clinic", 
    category: "Clinics", 
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800", 
    link: "/services",
    description: "State-of-the-art dental units for advanced procedures including implants and cosmetic dentistry."
  },
  { 
    id: 3, 
    title: "Advanced MRI & CT", 
    category: "Services", 
    img: "https://images.unsplash.com/photo-1516574187841-693083f69802?auto=format&fit=crop&q=80&w=800", 
    link: "/reports",
    description: "High-resolution imaging for accurate diagnosis featuring the latest 1.5 Tesla MRI."
  },
  { 
    id: 4, 
    title: "Emergency & Trauma", 
    category: "Facilities", 
    img: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=800", 
    link: "/contact",
    description: "Rapid response emergency unit equipped with ventilators and life support systems."
  },
  { 
    id: 5, 
    title: "Operation Theater", 
    category: "Services", 
    img: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800", 
    link: "/services",
    description: "Modular operation theaters with HEPA filters ensuring a sterile environment for surgeries."
  },
  { 
    id: 6, 
    title: "Hospital Cafeteria", 
    category: "Facilities", 
    img: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=800", 
    link: "/about",
    description: "Hygienic and healthy dining options for patients and visitors with a comfortable ambiance."
  },
  { 
    id: 7, 
    title: "Pediatric Ward", 
    category: "Departments", 
    img: "https://images.unsplash.com/photo-1602052738558-762be1d2cf1f?auto=format&fit=crop&q=80&w=800", 
    link: "/services",
    description: "Colorful and child-friendly environment to make healing less stressful for our little patients."
  },
  { 
    id: 8, 
    title: "Physiotherapy Rehab", 
    category: "Clinics", 
    img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800", 
    link: "/services",
    description: "Comprehensive rehabilitation services to help patients regain mobility and strength."
  },
  { 
    id: 9, 
    title: "Main Reception", 
    category: "Facilities", 
    img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=800", 
    link: "/contact",
    description: "Welcoming reception area with digital queuing system for smooth patient registration."
  },
];

const TESTIMONIALS = [
  { name: "Ahmed Raza", role: "Patient", rating: 5, text: "The care I received at Saff Hospital was exceptional. Dr. Ayesha's team in Cardiology saved my life. The facilities are truly world-class right here in RYK.", date: "Feb 15, 2024" },
  { name: "Sana Malik", role: "Mother", rating: 5, text: "The Pediatrics department is amazing. Dr. Bilal was so gentle with my son during his vaccination. The waiting area is clean and kid-friendly.", date: "Jan 10, 2024" },
  { name: "Kamran Akmal", role: "Local Resident", rating: 5, text: "I visited the Emergency at 3 AM and was attended to immediately. The staff is professional and compassionate. Highly recommended.", date: "Mar 2, 2024" },
  { name: "Fatima Bibi", role: "Patient", rating: 4, text: "Very modern hospital with great doctors. The online appointment system saved me a lot of time. Pharmacy services are also very convenient.", date: "Dec 5, 2023" },
];

const FAQS = [
  {
    question: "What are the general visiting hours?",
    answer: "General Ward visiting hours are 11:00 AM - 1:00 PM and 5:00 PM - 7:00 PM. For ICU/CCU, visiting is restricted to 4:00 PM - 5:00 PM with only one attendant allowed. Private rooms allow visitors from 9:00 AM - 9:00 PM."
  },
  {
    question: "Which insurance companies do you partner with?",
    answer: "We are on the panel of major insurance providers including State Life, Jubilee Life, EFU Life, Adamjee Insurance, and Askari Life. We also accept the Sehat Sahulat Card for eligible patients."
  },
  {
    question: "How can I book an appointment?",
    answer: "You can book an appointment through our website's 'Find a Doctor' section, use the Saff Hospital mobile app, or call our 24/7 helpline at +92 68 1234567. Walk-in appointments are also available but subject to doctor availability."
  },
  {
    question: "Do you have emergency services?",
    answer: "Yes, our Emergency & Trauma Center operates 24/7, 365 days a year. It is equipped with state-of-the-art life support systems and staffed by specialized emergency physicians. Dial 1122 for ambulance services."
  },
  {
    question: "How can I view my lab reports online?",
    answer: "You can access your reports via the 'Online Reports' tab in the navigation menu. Enter your Patient ID/MR Number or Phone Number to view and download your diagnostic results securely."
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('gB8pWRBqTwk');
  const [videoType, setVideoType] = useState<'youtube' | 'custom'>('youtube');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sliderIntervalRef = useRef<any>(null);

  useScrollAnimation();

  // Auto-play hero slider
  useEffect(() => {
    const startSlider = () => {
      sliderIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 5000);
    };
    startSlider();
    return () => clearInterval(sliderIntervalRef.current);
  }, []);

  const pauseSlider = () => clearInterval(sliderIntervalRef.current);
  const resumeSlider = () => {
    clearInterval(sliderIntervalRef.current);
    sliderIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const posts = await dbService.getBlogPosts();
      setLatestBlogs(posts.slice(0, 3));
    };
    fetchBlogs();

    const handleResize = () => {
        setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenSpecificVideo = () => {
     setCurrentVideoId('gB8pWRBqTwk');
     setVideoType('youtube');
     setIsVideoOpen(true);
  }

  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isVideoOpen]);

  const nextShowcase = () => {
    const maxIndex = Math.max(0, SHOWCASE_ITEMS.length - itemsPerPage);
    setShowcaseIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevShowcase = () => {
    const maxIndex = Math.max(0, SHOWCASE_ITEMS.length - itemsPerPage);
    setShowcaseIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Image fallback handler - Updated to use reliable static image and high resolution
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200"; 
    e.currentTarget.onerror = null; 
  };

  return (
    <div className="font-sans overflow-hidden bg-white">
      
      {/* 1. HERO SLIDER SECTION - Adjusted height for mobile */}
      <div 
        className="relative h-[100dvh] md:h-[90vh] min-h-[500px] overflow-hidden group"
        onMouseEnter={pauseSlider}
        onMouseLeave={resumeSlider}
      >
        <div 
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div key={slide.id} className="relative w-full h-full flex-shrink-0">
               <img 
                 src={slide.image} 
                 className="w-full h-full object-cover transform scale-105" 
                 alt={slide.title}
                 loading={index === 0 ? "eager" : "lazy"}
                 onError={handleImageError} 
               />
               {/* Lighter Gradient for Better Visibility */}
               <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 via-teal-800/40 to-transparent"></div>
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 z-10 pointer-events-none">
           <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white pointer-events-auto">
                <div key={currentSlide} className="animate-fade-in-up">
                    <div className="flex items-center space-x-2 mb-6">
                       <span className="w-2 h-2 bg-hospital-400 rounded-full animate-ping"></span>
                       <span className="inline-block py-1 px-3 rounded-full bg-hospital-500/20 border border-hospital-400/30 text-hospital-300 font-bold text-xs backdrop-blur-md uppercase tracking-wider">
                         {HERO_SLIDES[currentSlide].badge}
                       </span>
                    </div>
                    {/* Adjusted Heading Size for Mobile */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-6 drop-shadow-lg">
                      {HERO_SLIDES[currentSlide].title} <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-hospital-300 to-white">
                        {HERO_SLIDES[currentSlide].highlight}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white mb-8 font-medium leading-relaxed max-w-lg border-l-4 border-hospital-500 pl-4 drop-shadow-md hidden sm:block">
                      {HERO_SLIDES[currentSlide].desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/appointment/new" className="px-8 py-4 bg-hospital-500 hover:bg-hospital-400 text-white font-bold rounded-full shadow-lg shadow-hospital-500/30 transition transform hover:-translate-y-1 text-center flex items-center justify-center">
                        <span>Book Appointment</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </Link>
                      <button onClick={handleOpenSpecificVideo} className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold rounded-full hover:bg-white/30 transition text-center flex items-center justify-center group shadow-md">
                        <div className="w-8 h-8 rounded-full bg-white text-hospital-700 flex items-center justify-center mr-3 group-hover:scale-110 transition">
                           <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        Watch Tour
                      </button>
                    </div>
                </div>
              </div>
           </div>
        </div>
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/80'}`} />
          ))}
        </div>
      </div>

      {/* NEW CTA SECTION */}
      <div className="bg-teal-600 py-10 relative overflow-hidden reveal-on-scroll">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div>
               <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">Ready to prioritize your health?</h2>
               <p className="text-teal-100 text-lg">Our specialists are ready to provide the care you deserve.</p>
            </div>
            <Link to="/appointment/new" className="bg-white text-teal-700 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1 hover:shadow-2xl flex items-center group">
               Book Appointment
               <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
         </div>
      </div>

      {/* 2. DOCTOR / CEO ABOUT SECTION */}
      <div className="py-12 md:py-24 max-w-7xl mx-auto px-4 border-b border-gray-100 reveal-on-scroll">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative group">
             <div className="absolute top-4 left-4 w-full h-full border-4 border-hospital-100 rounded-2xl -z-10 transform -rotate-2 group-hover:rotate-0 transition duration-500"></div>
             <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 relative h-[400px] md:h-[500px]">
               <img 
                 src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800" 
                 alt="Dr. Saff-ur-Rehman" 
                 className="w-full h-full object-cover object-top hover:scale-105 transition duration-700" 
                 loading="lazy"
                 onError={handleImageError}
               />
             </div>
             <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/95 backdrop-blur p-5 rounded-xl shadow-lg border-l-4 border-hospital-600">
                <p className="font-bold text-gray-900 text-xl font-serif">Dr. Saff-ur-Rehman</p>
                <p className="text-hospital-600 text-sm font-bold uppercase tracking-wide">CEO & Chief Consultant</p>
                <p className="text-gray-400 text-xs mt-1">FCPS (Cardiology), MBBS</p>
             </div>
          </div>
          <div className="md:w-1/2">
             <span className="text-hospital-600 font-bold tracking-wide uppercase text-sm mb-2 block flex items-center">
                <span className="w-8 h-0.5 bg-hospital-600 mr-3"></span> Leadership & Vision
             </span>
             <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
               Dedicated to <br/><span className="text-hospital-600">Healing Lives.</span>
             </h2>
             <p className="text-gray-700 text-lg mb-6 leading-relaxed italic border-l-4 border-hospital-100 pl-6">
               "My journey in medicine began with a simple promise: to provide compassionate care that treats the person, not just the disease. At Saff Hospital, we combine cutting-edge medical science with the warmth of traditional care."
             </p>
             <p className="text-gray-600 mb-8 leading-relaxed">
               With over 25 years of experience in Cardiology and Internal Medicine, Dr. Saff-ur-Rehman has led the transformation of healthcare in Rahim Yar Khan. Under his guidance, Saff Hospital has introduced advanced cardiac procedures and set new benchmarks for patient safety.
             </p>
             <div className="flex gap-4">
                <Link to="/doctors/d1" className="px-8 py-3 bg-hospital-600 text-white rounded-full font-bold shadow-lg hover:bg-hospital-700 transition transform hover:-translate-y-1 text-center">
                   Book Appointment
                </Link>
                <Link to="/about" className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:border-hospital-600 hover:text-hospital-600 transition text-center">
                   Read Biography
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* 2.5 LEADERSHIP TEAM */}
      <div className="bg-white py-12 md:py-24 relative overflow-hidden reveal-on-scroll">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center mb-16 md:mb-20">
                  <span className="text-hospital-600 font-bold uppercase tracking-widest text-xs mb-3 block">Executive Team</span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Our Leadership</h2>
                  <div className="w-24 h-1.5 bg-hospital-500 mx-auto mt-6 rounded-full opacity-80"></div>
                  <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                      Guiding Saff Hospital towards excellence with a shared vision of compassionate care and medical innovation.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {LEADERSHIP_TEAM.map((leader, idx) => (
                      <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-[420px]">
                          <div className="h-full w-full relative">
                              <img 
                                  src={leader.image} 
                                  alt={leader.name} 
                                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                                  loading="lazy"
                                  onError={handleImageError}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-hospital-900/95 via-hospital-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                      <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed line-clamp-4">
                                          {leader.bio}
                                      </p>
                                      <Link to={leader.link} className="inline-flex items-center bg-white text-hospital-900 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full hover:bg-hospital-50 transition shadow-lg w-full justify-center">
                                          View Profile <svg className="w-3 h-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                      </Link>
                                  </div>
                              </div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-6 bg-white/95 backdrop-blur-sm border-t border-gray-100 transition-transform duration-300 group-hover:translate-y-full">
                              <h3 className="text-xl font-bold text-gray-900 font-serif mb-1 truncate">{leader.name}</h3>
                              <p className="text-hospital-600 text-xs font-bold uppercase tracking-wider">{leader.role}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 3. FACILITIES SHOWCASE CAROUSEL */}
      <div className="bg-teal-50/30 py-16 md:py-20 overflow-hidden relative reveal-on-scroll">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-white skew-x-12 opacity-50 z-0"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                  <span className="text-hospital-600 font-bold uppercase tracking-widest text-xs mb-2 block">World Class Infrastructure</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Explore Our Facilities</h2>
               </div>
               <div className="flex space-x-3 mt-6 md:mt-0">
                  <button onClick={prevShowcase} className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-hospital-600 hover:text-white hover:border-hospital-600 transition shadow-sm">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button onClick={nextShowcase} className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-hospital-600 hover:text-white hover:border-hospital-600 transition shadow-sm">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </button>
               </div>
            </div>
            <div className="relative overflow-hidden">
               <div 
                 className="flex transition-transform duration-500 ease-out"
                 style={{ transform: `translateX(-${showcaseIndex * (100 / itemsPerPage)}%)` }}
               >
                  {SHOWCASE_ITEMS.map((item) => (
                     <div key={item.id} className="w-full md:w-1/3 flex-shrink-0 px-3">
                        <div className="block group relative rounded-2xl overflow-hidden shadow-lg bg-white h-full flex flex-col cursor-default">
                           <div className="relative aspect-[4/3] overflow-hidden">
                               <img 
                                 src={item.img} 
                                 alt={item.title} 
                                 className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
                                 loading="lazy"
                                 onError={handleImageError}
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition"></div>
                               <div className="absolute top-4 left-4 bg-hospital-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                                   {item.category}
                               </div>
                           </div>
                           <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-hospital-600 transition">{item.title}</h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                              <div className="mt-auto">
                                <Link to={item.link} className="inline-flex items-center text-sm font-bold text-hospital-600 hover:text-hospital-800 transition uppercase tracking-wide group/btn">
                                    Explore
                                    <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 4. FEATURED DEPARTMENTS SECTION */}
      <div className="bg-white py-12 md:py-20 border-b border-gray-100 reveal-on-scroll">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <span className="text-hospital-600 font-bold uppercase tracking-widest text-xs mb-2 block">Our Specialties</span>
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 relative inline-block">
                  Centers of Excellence
                  <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-20 h-1 bg-hospital-500 rounded-full"></div>
               </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {FEATURED_DEPARTMENTS.map((dept) => (
                  <div key={dept.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 group border border-gray-100">
                     <div className="relative h-48 overflow-hidden">
                        <img 
                          src={dept.img} 
                          alt={dept.name} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
                          loading="lazy"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent opacity-20 group-hover:opacity-10 transition"></div>
                     </div>
                     <div className="p-6 relative">
                        <div className="absolute -top-8 right-6 w-14 h-14 bg-hospital-500 rounded-lg flex items-center justify-center text-white shadow-lg transform rotate-3 group-hover:rotate-0 transition">
                           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-hospital-600 transition">{dept.name}</h3>
                        <div className="w-10 h-1 bg-gray-200 mb-4 rounded-full group-hover:w-full group-hover:bg-hospital-200 transition-all duration-500"></div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 h-20 overflow-hidden">{dept.desc}</p>
                        <Link to="/services" className="inline-block text-sm font-bold text-hospital-600 uppercase tracking-wider hover:underline">
                           Read More &rarr;
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
            <div className="text-center mt-12">
               <Link to="/services" className="inline-block px-10 py-3 border-2 border-hospital-600 text-hospital-600 font-bold rounded-full hover:bg-hospital-600 hover:text-white transition uppercase tracking-wide text-xs">
                  View All Departments
               </Link>
            </div>
         </div>
      </div>

      {/* 4.5. DEPARTMENT DIRECTORY GRID */}
      <div className="bg-teal-50/10 py-16 border-b border-gray-100 reveal-on-scroll">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
               <span className="text-hospital-600 font-bold uppercase tracking-widest text-xs mb-2 block">Comprehensive Care</span>
               <h2 className="text-3xl font-serif font-bold text-gray-900">Complete Medical Directory</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {DEPARTMENTS_DIRECTORY.map((dept, index) => (
                  <Link 
                    key={index} 
                    to="/services" 
                    className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-1 hover:border-hospital-200 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                     <div className="text-4xl mb-3 transform transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {dept.icon}
                     </div>
                     <span className="font-bold text-gray-800 text-sm group-hover:text-hospital-600 transition">
                        {dept.name}
                     </span>
                  </Link>
               ))}
            </div>
         </div>
      </div>

      {/* 5. STATS SECTION */}
      <div className="bg-white relative z-10 mx-4 md:mx-auto max-w-7xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-12 reveal-on-scroll">
         <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {[
              { num: '15k+', label: 'Happy Patients', icon: '😊' },
              { num: '50+', label: 'Expert Doctors', icon: '👨‍⚕️' },
              { num: '24/7', label: 'Emergency Service', icon: '🚑' },
              { num: '20+', label: 'Years Experience', icon: '🏥' }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 md:p-8 text-center hover:bg-gray-50 transition group">
                 <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition transform duration-300 inline-block">{stat.icon}</div>
                 <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.num}</div>
                 <div className="text-hospital-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
         </div>
      </div>

      {/* 6. TESTIMONIALS SECTION */}
      <div className="bg-white py-16 md:py-24 overflow-hidden relative border-t border-gray-100 reveal-on-scroll">
         <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
               <span className="text-hospital-600 font-bold uppercase tracking-wide text-sm mb-2 block">Patient Feedback</span>
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">What our patients<br/>are saying.</h2>
               <p className="text-gray-600 leading-relaxed mb-8">
                  We take pride in providing exceptional care. Read stories from patients who have experienced Saff Hospital's dedication first-hand.
               </p>
               <Link to="/feedback" className="inline-block px-8 py-3 bg-hospital-600 text-white rounded-full font-bold shadow-lg hover:bg-hospital-700 transition">
                  Share Your Story
               </Link>
            </div>
            <div className="lg:w-2/3 h-[500px] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent z-10"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scroll-vertical">
                   {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((testi, idx) => (
                      <div key={idx} className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 relative group transition hover:shadow-lg">
                         <div className="absolute top-4 right-4 text-red-500 opacity-20 transform rotate-12 group-hover:scale-110 transition duration-500">
                            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                         </div>
                         <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                               {testi.name.charAt(0)}
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-900 text-sm">{testi.name}</h4>
                               <p className="text-xs text-gray-500">{testi.role}</p>
                            </div>
                         </div>
                         <div className="flex text-yellow-400 mb-3 text-xs">
                            {[...Array(testi.rating)].map((_, i) => <span key={i}>★</span>)}
                         </div>
                         <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                            "{testi.text}"
                         </p>
                         <p className="text-gray-400 text-xs mt-3 text-right">{testi.date}</p>
                      </div>
                   ))}
                </div>
            </div>
         </div>
      </div>

      {/* 7. BLOG SECTION */}
      <div className="bg-teal-50/20 py-20 relative overflow-hidden reveal-on-scroll">
         <div className="absolute top-1/2 left-0 w-full h-64 -translate-y-1/2 bg-white -skew-y-3 z-0"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                  <span className="text-hospital-600 font-bold uppercase tracking-wider text-xs mb-2 block">Updates & News</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Latest from the Blog</h2>
               </div>
               <Link to="/blog" className="hidden md:flex items-center text-hospital-600 font-bold hover:text-hospital-800 transition">
                  View All Posts <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
               </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {latestBlogs.map((post, idx) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-2 transition duration-300">
                     <div className="h-48 overflow-hidden relative">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
                          loading="lazy"
                          onError={handleImageError}
                        />
                        <div className="absolute top-4 left-4 bg-hospital-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{post.category}</div>
                     </div>
                     <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center text-xs text-gray-400 mb-3">
                           <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                           {post.date}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-hospital-600 transition line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                        <Link to={`/blog/${post.id}`} className="text-hospital-600 font-bold text-xs uppercase tracking-wider hover:underline pt-4 border-t border-gray-100 flex items-center">
                           Read Full Story <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-8 text-center md:hidden">
               <Link to="/blog" className="text-hospital-600 font-bold hover:text-hospital-800 transition text-sm">
                  View All Posts &rarr;
               </Link>
            </div>
         </div>
      </div>

      {/* 9. CAREER OPPORTUNITY SECTION */}
      <div className="bg-teal-900 py-24 relative overflow-hidden reveal-on-scroll">
         <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=100&w=1920" 
              className="w-full h-full object-cover opacity-10" 
              alt="Team" 
              loading="lazy"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-transparent"></div>
         </div>
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
               <span className="text-hospital-400 font-bold uppercase tracking-widest text-xs mb-3 block">Join Our Team</span>
               <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                  Be a Part of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-hospital-300 to-white">Medical Excellence</span>
               </h2>
               <p className="text-hospital-100 text-lg mb-8 leading-relaxed max-w-lg">
                  We are looking for passionate professionals to join the Saff Hospital family. Build a rewarding career in an environment that values growth, compassion, and innovation.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/careers" className="px-8 py-3 bg-white text-teal-900 font-bold rounded-full hover:bg-gray-100 transition shadow-lg text-center transform hover:-translate-y-1">
                     Explore Openings
                  </Link>
                  <Link to="/about" className="px-8 py-3 border border-hospital-500 text-white font-bold rounded-full hover:bg-hospital-800 transition text-center">
                     Life at Saff
                  </Link>
               </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
               <div className="relative">
                  <div className="absolute -inset-4 bg-hospital-500/20 rounded-full blur-xl animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=100&w=600" 
                    className="relative rounded-2xl shadow-2xl border-4 border-hospital-700 w-80 md:w-96 transform rotate-3 hover:rotate-0 transition duration-500" 
                    alt="Doctors" 
                    loading="lazy"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-hospital-600 text-white p-4 rounded-xl shadow-lg">
                     <p className="font-bold text-2xl">50+</p>
                     <p className="text-xs uppercase tracking-wider">Expert Doctors</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 10. HOSPITAL VIDEO SECTION */}
      <div className="bg-indigo-900 py-16 md:py-24 relative overflow-hidden group border-t border-indigo-800 reveal-on-scroll">
         <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=100&w=1920" 
              className="w-full h-full object-cover" 
              alt="bg" 
              loading="lazy"
              onError={handleImageError}
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/80 to-indigo-900/40"></div>
         <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 md:mb-8">See Inside Saff Hospital</h2>
            <p className="text-indigo-200 text-base md:text-lg mb-12 max-w-2xl mx-auto">
              Take a virtual tour of our modern facilities, comfortable patient rooms, and advanced operation theaters designed for your safety and recovery.
            </p>
            <button onClick={handleOpenSpecificVideo} className="relative w-20 h-20 md:w-24 md:h-24 bg-hospital-500 rounded-full flex items-center justify-center text-white mx-auto hover:scale-110 transition duration-300 shadow-2xl shadow-hospital-500/50">
               <span className="absolute w-full h-full rounded-full bg-hospital-50 opacity-75 animate-ping"></span>
               <svg className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <p className="text-white mt-6 font-bold tracking-widest uppercase text-sm">Play Video Tour</p>
         </div>
      </div>

      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
           <button onClick={() => setIsVideoOpen(false)} className="absolute top-6 right-6 text-white hover:text-red-500 transition">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
           <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
              {videoType === 'youtube' ? (
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0`} title="Hospital Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              ) : (
                <video className="w-full h-full object-contain" controls autoPlay src="https://assets.mixkit.co/videos/preview/mixkit-team-of-doctors-walking-in-hospital-corridor-4966-large.mp4">Your browser does not support the video tag.</video>
              )}
           </div>
        </div>
      )}

      {/* 11. INSURANCE PARTNERS SECTION (Marquee) */}
      <div className="py-24 bg-white border-b border-gray-100 overflow-hidden reveal-on-scroll">
         <div className="text-center mb-16">
            <h3 className="text-hospital-500 font-bold uppercase tracking-[0.25em] text-xs mb-4">Trusted By</h3>
            <p className="text-4xl font-serif font-bold text-gray-900">Our Insurance Partners</p>
         </div>
         
         <div className="relative w-full space-y-8">
            {/* Gradient Masks for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
            
            {/* Scrolling Track Row 1 */}
            <div className="flex animate-scroll w-max space-x-8 hover:[animation-play-state:paused]">
               {[...Array(8)].map((_, idx) => (
                  <React.Fragment key={idx}>
                    {PARTNERS.slice(0, 4).map((partner, i) => (
                        <div key={`r1-${idx}-${i}`} className="flex-shrink-0 w-72 h-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-lg hover:border-hospital-100 group cursor-default hover:scale-105">
                            <span className={`text-xl md:text-2xl font-bold font-serif ${partner.color} text-center transition-transform duration-300 group-hover:scale-105`}>
                                {partner.name}
                            </span>
                            <div className="h-1 w-10 bg-gray-100 mt-4 rounded-full group-hover:w-16 group-hover:bg-gray-200 transition-all duration-500"></div>
                        </div>
                    ))}
                  </React.Fragment>
               ))}
            </div>

            {/* Scrolling Track Row 2 */}
            <div className="flex animate-scroll w-max space-x-8 hover:[animation-play-state:paused]">
               {[...Array(8)].map((_, idx) => (
                  <React.Fragment key={idx}>
                    {PARTNERS.slice(4, 8).map((partner, i) => (
                        <div key={`r2-${idx}-${i}`} className="flex-shrink-0 w-72 h-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-lg hover:border-hospital-100 group cursor-default hover:scale-105">
                            <span className={`text-xl md:text-2xl font-bold font-serif ${partner.color} text-center transition-transform duration-300 group-hover:scale-105`}>
                                {partner.name}
                            </span>
                            <div className="h-1 w-10 bg-gray-100 mt-4 rounded-full group-hover:w-16 group-hover:bg-gray-200 transition-all duration-500"></div>
                        </div>
                    ))}
                  </React.Fragment>
               ))}
            </div>
         </div>
      </div>

      {/* 12. FAQ SECTION */}
      <div className="bg-white py-20 reveal-on-scroll">
          <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                  <span className="text-hospital-600 font-bold uppercase tracking-widest text-xs mb-2 block">Common Questions</span>
                  <h2 className="text-4xl font-serif font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                  {FAQS.map((faq, index) => (
                      <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                          <button className="w-full text-left p-6 flex justify-between items-center focus:outline-none" onClick={() => toggleFaq(index)}>
                              <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                              <span className={`transform transition-transform duration-300 text-hospital-600 bg-hospital-50 rounded-full p-2 ${openFaq === index ? 'rotate-180' : ''}`}>
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </span>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="p-6 pt-0 text-gray-600 text-base leading-relaxed border-t border-gray-50 mt-2">
                                  {faq.answer}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 13. EMERGENCY SECTION (Simple Red Design) */}
      <div className="bg-red-600 py-12 relative overflow-hidden reveal-on-scroll">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
         
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
               <div className="bg-white/20 p-4 rounded-full animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white font-serif tracking-tight">EMERGENCY?</h2>
                  <p className="text-red-100 font-medium text-lg">24/7 Trauma Center & Ambulance</p>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right hidden md:block">
                  <span className="block text-red-200 text-xs font-bold uppercase tracking-widest">Helpline</span>
                  <span className="block text-5xl font-black text-white leading-none">1122</span>
               </div>
               <a href="tel:1122" className="bg-white text-red-600 px-8 py-4 rounded-full font-black text-xl shadow-xl hover:bg-red-50 hover:scale-105 transition transform flex items-center">
                  <svg className="w-6 h-6 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.27-.27.35-.65.24-1.01-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.75c0 9.06 7.33 16.39 16.39 16.39.51 0 .76-.65.76-1.19v-2.58c0-.55-.45-.99-.99-.99z"/></svg>
                  CALL NOW
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;
