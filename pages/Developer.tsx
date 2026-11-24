
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

const GITHUB_IMG = "https://raw.githubusercontent.com/samiullah156-creator/image/6847d09d96738a1420a6beb25bb5c7ea3922de06/sami_profile.jpg";
const LOCAL_IMG = "/sami_profile.jpg";
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800";

const ROLES = [
  "AI & Machine Learning Engineer",
  "Law Student (LL.B)",
  "Full Stack Developer",
  "Legal Tech Innovator"
];

const STATS = [
  { label: 'Experience', value: '4+ Years' },
  { label: 'Projects', value: '30+' },
  { label: 'AI Models', value: '15+' },
  { label: 'Legal Tech', value: '3 Apps' },
];

const SKILLS = {
  "AI & Data": [
    { name: 'Python', icon: '🐍', level: 95 },
    { name: 'TensorFlow', icon: '🧠', level: 85 },
    { name: 'PyTorch', icon: '🔥', level: 80 },
    { name: 'LangChain', icon: '🦜', level: 90 },
    { name: 'OpenCV', icon: '👁️', level: 85 },
    { name: 'RAG Systems', icon: '📚', level: 88 },
  ],
  "Web Stack": [
    { name: 'React 19', icon: '⚛️', level: 95 },
    { name: 'TypeScript', icon: '📘', level: 90 },
    { name: 'Next.js', icon: '▲', level: 88 },
    { name: 'Tailwind', icon: '🎨', level: 98 },
    { name: 'Node.js', icon: '🟢', level: 92 },
    { name: 'PostgreSQL', icon: '🐘', level: 85 },
  ],
  "Legal & Soft Skills": [
    { name: 'Cyber Law', icon: '⚖️', level: 90 },
    { name: 'IP Rights', icon: '©️', level: 85 },
    { name: 'Legal Research', icon: '📖', level: 92 },
    { name: 'Public Speaking', icon: '🎤', level: 95 },
  ]
};

const PROJECTS = [
  {
    title: "JurisAI Consultant",
    category: "Legal Tech",
    desc: "An advanced LLM-based legal assistant capable of drafting contracts, analyzing case files, and providing citation references from the Pakistan Penal Code.",
    tech: ["Llama-2", "Python", "Vector DB"],
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Saff Hospital CRM",
    category: "Health Tech",
    desc: "Enterprise-grade hospital management system handling patient records, appointments, and inventory with an integrated AI diagnostic assistant.",
    tech: ["React", "Firebase", "Gemini API"],
    color: "from-teal-500 to-emerald-600"
  },
  {
    title: "Veo Studio",
    category: "Generative Media",
    desc: "A creative studio leveraging Google's Veo models to generate cinematic video content from textual prompts for marketing automation.",
    tech: ["GenAI SDK", "Next.js", "FFmpeg"],
    color: "from-purple-500 to-indigo-600"
  }
];

const EXPERIENCE = [
  {
    year: '2023 - Present',
    role: 'AI Automation Engineer',
    company: 'Tech Innovations Global',
    desc: 'Leading the integration of Generative AI models (Gemini, GPT-4) into enterprise workflows. Bridging the gap between complex legal compliance requirements and automated system architecture.'
  },
  {
    year: '2021 - 2023',
    role: 'Senior Full Stack Engineer',
    company: 'Creative Solutions',
    desc: 'Spearheaded frontend architecture using React & TypeScript. Developed secure, compliant data handling protocols for fintech clients.'
  },
];

const EDUCATION = [
  {
    year: '2022 - Present',
    degree: 'Bachelor of Laws (LL.B)',
    school: 'Faculty of Law',
    desc: 'Specializing in Cyber Law, Intellectual Property Rights, and the regulation of Artificial Intelligence.'
  },
  {
    year: '2018 - 2022',
    degree: 'BS Computer Science',
    school: 'University of Engineering & Tech',
    desc: 'Major in Artificial Intelligence and Data Science. Graduated with distinction.'
  },
  {
    year: '2023',
    degree: 'Certified AI Professional',
    school: 'Microsoft',
    desc: 'Advanced certification in Azure AI Solutions and Cognitive Services.'
  }
];

interface RevealProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, className = "", delay = 0, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AnimatedProgressBar = ({ level, color }: { level: number, color: string }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(level), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={ref} className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
      <div 
        className={`h-full bg-gradient-to-r ${color} transition-all duration-1500 ease-out`} 
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

const TypingEffect = () => {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      } else {
        setText(currentRole.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 font-bold min-h-[1.5em] inline-block">
      {text}<span className="text-white animate-pulse">|</span>
    </span>
  );
};

const Developer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(LOCAL_IMG);

  const stars = useMemo(() => Array.from({ length: 70 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100, 
    size: Math.random() * 2 + 1, 
    durationFly: Math.random() * 40 + 30, 
    durationBlink: Math.random() * 3 + 1, 
    delay: Math.random() * -60, 
  })), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('SENDING');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('SENT');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('IDLE'), 5000);
  };

  const handleImgError = () => {
      if (imgSrc === LOCAL_IMG) setImgSrc(GITHUB_IMG);
      else if (imgSrc === GITHUB_IMG) setImgSrc(PLACEHOLDER_IMG);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <style>{`
            @keyframes space-fly {
               from { left: 100%; }
               to { left: -10%; }
            }
            @keyframes twinkle {
               0%, 100% { opacity: 0.3; transform: scale(0.8); }
               50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 4px rgba(255,255,255,0.8); }
            }
         `}</style>
         {stars.map((star) => (
            <div 
               key={star.id}
               className="absolute bg-white rounded-full"
               style={{
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animation: `space-fly ${star.durationFly}s linear infinite, twinkle ${star.durationBlink}s ease-in-out infinite`,
                  animationDelay: `${star.delay}s`,
               }}
            />
         ))}
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
         <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/60 border-b border-white/5 transition-all duration-300">
         <Link to="/" className="flex items-center text-slate-400 hover:text-white transition group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition border border-white/10">
                <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
            <span className="font-bold text-sm tracking-wide font-mono">BACK_TO_HOSPITAL</span>
         </Link>
         <div className="hidden md:flex space-x-1">
            {['Overview', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(item.toLowerCase())} 
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  {item}
                </button>
            ))}
         </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-12">
         <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
               <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 animate-pulse"></div>
                  <div 
                    className="aspect-square rounded-2xl overflow-hidden mb-6 border-2 border-white/5 relative cursor-zoom-in group/img"
                    onClick={() => setLightboxOpen(true)}
                  >
                     <img 
                       src={imgSrc} 
                       onError={handleImgError}
                       alt="Sami Profile" 
                       className="w-full h-full object-cover transition duration-700 group-hover/img:scale-110 filter grayscale-[20%] group-hover/img:grayscale-0"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                     <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider rounded border border-teal-500/30 backdrop-blur-md">AI Engineer</span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-500/30 backdrop-blur-md">Law Student</span>
                     </div>
                  </div>
                  <div className="text-center mb-6">
                     <h1 className="text-3xl font-serif font-bold text-white mb-1">Sami</h1>
                     <p className="text-slate-400 text-sm font-medium">@samiullah156-creator</p>
                  </div>
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group/item">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-teal-500 mr-3 group-hover/item:text-white transition">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <div className="text-left overflow-hidden">
                           <p className="text-[10px] uppercase text-slate-500 font-bold">Email</p>
                           <p className="text-sm text-white font-medium truncate">info@lexvaxa.com</p>
                        </div>
                     </div>
                     <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group/item">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-purple-500 mr-3 group-hover/item:text-white transition">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] uppercase text-slate-500 font-bold">Phone</p>
                           <p className="text-sm text-white font-medium">+92 307 0879156</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-center gap-3">
                     {['github', 'linkedin', 'twitter'].map((social) => (
                        <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition border border-white/5">
                           <img src={`https://cdn.simpleicons.org/${social}/white`} alt={social} className="w-4 h-4" />
                        </a>
                     ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-8 space-y-16">
               <section id="overview" className="relative pt-8">
                  <Reveal>
                    <div className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mb-4">
                        Available for Projects
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                        Bridging Law & <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Artificial Intelligence</span>
                    </h1>
                    <div className="text-xl md:text-2xl text-slate-400 font-light mb-8 h-10">
                        I am a <TypingEffect />
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl border-l-2 border-purple-500/50 pl-6 italic">
                        "Combining the analytical rigor of legal studies with the innovative power of AI engineering. I build systems that are not just intelligent, but compliant, ethical, and scalable."
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/10">
                        {STATS.map((s, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">{s.value}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider group-hover:text-slate-300 transition-colors">{s.label}</div>
                            </div>
                        ))}
                    </div>
                  </Reveal>
               </section>

               <section>
                  <Reveal delay={200}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="w-8 h-1 bg-teal-500 mr-3 rounded-full"></span>
                            Journey
                        </h2>
                        <div className="flex bg-white/5 rounded-lg p-1">
                            <button 
                                onClick={() => setActiveTab('experience')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition ${activeTab === 'experience' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Experience
                            </button>
                            <button 
                                onClick={() => setActiveTab('education')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition ${activeTab === 'education' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Education
                            </button>
                        </div>
                    </div>
                    <div className="relative border-l border-white/10 ml-3 space-y-8 pl-8">
                        {(activeTab === 'experience' ? EXPERIENCE : EDUCATION).map((item: any, idx) => (
                            <div key={idx} className="relative group">
                                <span className={`absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-4 border-black transition-colors duration-300 ${activeTab === 'experience' ? 'bg-teal-500 group-hover:bg-teal-400' : 'bg-purple-500 group-hover:bg-purple-400'}`}></span>
                                <div className="bg-[#0f172a]/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition hover:bg-[#0f172a]/60">
                                    <div className="flex flex-col md:flex-row justify-between mb-2">
                                        <h3 className="text-lg font-bold text-white">{item.role || item.degree}</h3>
                                        <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded self-start md:self-center">{item.year}</span>
                                    </div>
                                    <p className={`text-sm font-bold mb-2 ${activeTab === 'experience' ? 'text-teal-400' : 'text-purple-400'}`}>{item.company || item.school}</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                  </Reveal>
               </section>

               <section id="skills">
                  <Reveal delay={300}>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                        <span className="w-8 h-1 bg-blue-500 mr-3 rounded-full"></span>
                        Technical Arsenal
                    </h2>
                    <div className="space-y-8">
                        {Object.entries(SKILLS).map(([category, skills]) => (
                            <div key={category}>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">{category}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {skills.map((skill, idx) => (
                                        <div key={idx} className="bg-[#1e293b]/30 border border-white/5 p-4 rounded-xl flex items-center hover:bg-white/5 hover:border-white/10 transition group">
                                            <span className="text-2xl mr-3 grayscale group-hover:grayscale-0 transition">{skill.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-bold text-slate-200">{skill.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-mono">{skill.level}%</span>
                                                </div>
                                                <AnimatedProgressBar level={skill.level} color="from-teal-500 to-purple-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                  </Reveal>
               </section>

               <section id="projects">
                  <Reveal delay={400}>
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                        <span className="w-8 h-1 bg-purple-500 mr-3 rounded-full"></span>
                        Featured Work
                    </h2>
                    <div className="grid gap-6">
                        {PROJECTS.map((project, idx) => (
                            <div key={idx} className="group relative bg-[#0f172a] rounded-2xl p-1 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl">
                                <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-100 transition duration-500 blur-xl`}></div>
                                <div className="relative bg-[#0a0f1c] rounded-xl p-6 h-full border border-white/10 group-hover:border-transparent">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-gradient-to-r ${project.color} bg-clip-text text-transparent border border-white/10`}>
                                                {project.category}
                                            </span>
                                            <h3 className="text-xl font-bold text-white mt-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{project.title}</h3>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-full text-slate-400 group-hover:text-white transition">
                                            <svg className="w-5 h-5 transform group-hover:rotate-45 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">{project.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t, i) => (
                                            <span key={i} className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/5">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  </Reveal>
               </section>

               <section id="contact" className="bg-gradient-to-br from-[#0f172a] to-[#0a0f1c] p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                  <div className="relative z-10">
                     <Reveal delay={500}>
                        <h2 className="text-2xl font-serif font-bold text-white mb-2">Let's Innovate Together</h2>
                        <p className="text-slate-400 text-sm mb-8">Ready to build the next generation of intelligent systems?</p>
                        {status === 'SENT' ? (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-xl flex items-center justify-center gap-3 animate-fade-in">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                <span className="font-bold">Message sent successfully!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Name" 
                                        className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                    />
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder="Email" 
                                        className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                                        value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                    />
                                </div>
                                <textarea 
                                    required 
                                    rows={4} 
                                    placeholder="Your Message..." 
                                    className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition resize-none"
                                    value={form.message}
                                    onChange={e => setForm({...form, message: e.target.value})}
                                ></textarea>
                                <button 
                                    type="submit" 
                                    disabled={status === 'SENDING'}
                                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === 'SENDING' ? (
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <>Send Message <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></>
                                    )}
                                </button>
                            </form>
                        )}
                     </Reveal>
                  </div>
               </section>
            </div>
         </div>
      </div>

      {lightboxOpen && (
         <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out p-4"
            onClick={() => setLightboxOpen(false)}
         >
            <img 
               src={imgSrc} 
               onError={handleImgError}
               alt="Sami - Full View" 
               className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10"
               onClick={(e) => e.stopPropagation()} 
            />
         </div>
      )}
    </div>
  );
};

export default Developer;
