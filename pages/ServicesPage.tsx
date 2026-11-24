
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  useScrollAnimation();

  const departments = [
    {
      title: "Cardiology",
      description: "Comprehensive heart care including Angiography, Angioplasty, and Cardiac Surgery.",
      icon: "❤️",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
      features: ["24/7 Cath Lab", "Echo & ECG", "CCU", "Angioplasty"]
    },
    {
      title: "Neurology",
      description: "Treatment for stroke, epilepsy, migraines, and complex brain surgeries.",
      icon: "🧠",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
      features: ["EEG & EMG", "Brain Tumor Surgery", "Stroke Center", "Neuro-Rehab"]
    },
    {
      title: "Orthopedics",
      description: "Expert care for bone and joint issues, sports injuries, and joint replacements.",
      icon: "🦴",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
      features: ["Arthroscopy", "Trauma Center", "Physiotherapy", "Joint Replacement"]
    },
    {
      title: "Pediatrics",
      description: "Dedicated care for infants and children with a specialized Neonatal ICU.",
      icon: "👶",
      image: "https://images.unsplash.com/photo-1602052738558-762be1d2cf1f?auto=format&fit=crop&q=80&w=800",
      features: ["NICU", "Vaccination Center", "Pediatric Surgery", "Child Nutrition"]
    },
    {
      title: "Gynecology",
      description: "Complete maternity care, high-risk pregnancy management, and fertility treatments.",
      icon: "🤰",
      image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
      features: ["Labor Rooms", "C-Section", "Fertility Clinic", "Women's Health"]
    },
    {
      title: "ENT",
      description: "Ear, Nose, and Throat specialists providing medical and surgical treatment.",
      icon: "👂",
      image: "https://images.unsplash.com/photo-1609188076864-c35269136b09?auto=format&fit=crop&q=80&w=800",
      features: ["Audiometry", "Sinus Surgery", "Hearing Aids", "Throat Cancer Care"]
    },
    {
      title: "Dermatology",
      description: "Expert skin care, laser treatments, and cosmetic procedures.",
      icon: "✨",
      image: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&q=80&w=800",
      features: ["Laser Therapy", "Acne Treatment", "Hair Transplant", "Botox & Fillers"]
    },
    {
      title: "Psychiatry",
      description: "Mental health services including counseling, therapy, and medication management.",
      icon: "🧩",
      image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800",
      features: ["Counseling", "Addiction Rehab", "Child Psychology", "Depression Care"]
    },
    {
      title: "Ophthalmology",
      description: "Complete eye care including cataract surgery and vision correction.",
      icon: "👁️",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
      features: ["Cataract Surgery", "Laser Vision", "Glaucoma Care", "Retina Clinic"]
    },
    {
      title: "Physiotherapy",
      description: "Rehabilitation services to restore movement and function.",
      icon: "🏃",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800",
      features: ["Sports Rehab", "Pain Management", "Post-Op Care", "Manual Therapy"]
    },
    {
      title: "Nutrition",
      description: "Dietary planning and weight management programs.",
      icon: "🥗",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
      features: ["Weight Loss", "Diabetic Diet", "Child Nutrition", "Clinical Dietetics"]
    },
    {
      title: "Diagnostic Imaging",
      description: "High-resolution imaging services for accurate diagnosis.",
      icon: "📸",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0921226?auto=format&fit=crop&q=80&w=800",
      features: ["MRI (1.5 Tesla)", "CT Scan (128 Slice)", "Digital X-Ray", "Ultrasound"]
    },
    {
      title: "Laboratory",
      description: "Fully automated pathology lab providing accurate results 24/7.",
      icon: "🔬",
      image: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=800",
      features: ["Hematology", "Microbiology", "Biochemistry", "Molecular Bio"]
    },
    {
      title: "Emergency Care",
      description: "Rapid response trauma center equipped to handle all critical emergencies.",
      icon: "🚑",
      image: "https://images.unsplash.com/photo-1516574187841-693083f69802?auto=format&fit=crop&q=80&w=800",
      features: ["Trauma Team", "Ventilators", "Minor OT", "Ambulance"]
    },
    {
      title: "Dental Care",
      description: "Complete dental hygiene, root canals, and cosmetic dentistry.",
      icon: "🦷",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
      features: ["Scaling", "Implants", "Braces", "Root Canal"]
    },
    {
      title: "Oncology",
      description: "Comprehensive cancer care with chemotherapy and radiation services.",
      icon: "🎗️",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800",
      features: ["Chemotherapy", "Tumor Markers", "Palliative Care", "Radiation Therapy"]
    },
    {
      title: "Urology",
      description: "Diagnosis and treatment of urinary tract and male reproductive system.",
      icon: "💧",
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800",
      features: ["Kidney Stones", "Prostate Care", "Dialysis Support", "Bladder Surgery"]
    },
    {
      title: "Gastroenterology",
      description: "Treatment for digestive system disorders including stomach and liver.",
      icon: "🥘",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800",
      features: ["Endoscopy", "Liver Disease", "Colonoscopy", "Acid Reflux"]
    },
    {
      title: "Nephrology",
      description: "Specialized care for kidney diseases and hypertension.",
      icon: "🫘",
      image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800",
      features: ["Kidney Transplant", "Dialysis", "Renal Biopsy", "Electrolyte Imbalance"]
    },
    {
      title: "Pulmonology",
      description: "Respiratory medicine for asthma, COPD, and lung infections.",
      icon: "🌬️",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
      features: ["Spirometry", "Bronchoscopy", "Sleep Apnea", "TB Treatment"]
    },
    {
      title: "Endocrinology",
      description: "Hormonal treatments for diabetes, thyroid, and metabolic disorders.",
      icon: "🩸",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800",
      features: ["Diabetes Care", "Thyroid Clinic", "Hormonal Therapy", "Obesity Mgmt"]
    },
    {
      title: "Rheumatology",
      description: "Treatment for arthritis, autoimmune diseases, and musculoskeletal pain.",
      icon: "🤲",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800",
      features: ["Arthritis Care", "Lupus Treatment", "Joint Injections", "Autoimmune Disease"]
    },
    {
      title: "Plastic Surgery",
      description: "Reconstructive and cosmetic surgical procedures.",
      icon: "🎭",
      image: "https://images.unsplash.com/photo-1598300188391-8575043026a0?auto=format&fit=crop&q=80&w=800",
      features: ["Burn Reconstruction", "Cosmetic Surgery", "Hand Surgery", "Scar Revision"]
    },
    {
      title: "Vascular Surgery",
      description: "Surgery for arteries, veins, and lymphatic circulation.",
      icon: "🔴",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
      features: ["Varicose Veins", "Aneurysm Repair", "Bypass Surgery", "Diabetic Foot"]
    },
    {
      title: "Infectious Diseases",
      description: "Diagnosis and treatment of complex infections.",
      icon: "🦠",
      image: "https://images.unsplash.com/photo-1584036561566-b93a50208c3c?auto=format&fit=crop&q=80&w=800",
      features: ["Fever Clinic", "HIV Care", "Tropical Diseases", "Travel Medicine"]
    },
    {
      title: "Pain Management",
      description: "Holistic approach to managing chronic pain.",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?auto=format&fit=crop&q=80&w=800",
      features: ["Nerve Blocks", "Back Pain", "Migraine Relief", "Palliative Support"]
    },
    {
      title: "Audiology",
      description: "Diagnostic hearing tests and balance assessments.",
      icon: "🎧",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0921226?auto=format&fit=crop&q=80&w=800",
      features: ["Hearing Aids", "Cochlear Implants", "Tinnitus Mgmt", "Newborn Screening"]
    },
    {
      title: "Sleep Medicine",
      description: "Diagnosis for sleep disorders like insomnia and apnea.",
      icon: "💤",
      image: "https://images.unsplash.com/photo-1541781777621-cf13028198f3?auto=format&fit=crop&q=80&w=800",
      features: ["Sleep Study", "Insomnia Therapy", "CPAP Support", "Narcolepsy Care"]
    },
    {
      title: "Thoracic Surgery",
      description: "Surgical treatment of chest organs.",
      icon: "🫁",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
      features: ["Lung Surgery", "Esophageal Surgery", "Chest Trauma", "Mediastinoscopy"]
    },
    {
      title: "Geriatrics",
      description: "Specialized care for the elderly population.",
      icon: "👴",
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=800",
      features: ["Elderly Care", "Dementia Support", "Fall Prevention", "Chronic Mgmt"]
    }
  ];

  const filteredDepts = departments.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Improved Image Fallback Handler - Replaces broken images with a high-quality medical placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200"; 
    e.currentTarget.onerror = null; 
  };

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen">
       {/* Hero Section - Dark Background like Footer */}
       <div className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center text-center text-white bg-hospital-900">
          <div className="absolute inset-0">
             <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2560" 
                alt="Medical Services" 
                className="w-full h-full object-cover transform scale-105 opacity-60"
                onError={handleImageError}
             />
             {/* Dark Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-hospital-900/60 to-hospital-900"></div>
             <div className="absolute inset-0 bg-hospital-900/20 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 px-4 max-w-4xl mx-auto">
             <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg tracking-tight animate-fade-in-up">Medical Services</h1>
             <p className="text-lg md:text-2xl mb-10 font-light drop-shadow-md opacity-95 text-hospital-100 animate-fade-in-up delay-100">
                World-class treatments and advanced diagnostics available 24/7.
             </p>
             
             {/* Search Bar - Centered in Hero */}
             <div className="max-w-2xl mx-auto relative animate-fade-in-up delay-200">
                <input 
                  type="text" 
                  placeholder="Search specialist or service..." 
                  className="w-full py-4 md:py-5 px-6 md:px-8 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-hospital-500/50 shadow-2xl transition bg-white/95 backdrop-blur placeholder-gray-500 text-base md:text-lg border border-white/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
                <div className="absolute right-3 top-2 md:top-2.5 bg-hospital-900 p-2 md:p-2.5 rounded-full text-white shadow-md hover:bg-hospital-800 transition cursor-pointer">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          {filteredDepts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-100 reveal-on-scroll">
               <p className="text-xl mb-4">No services found matching "{searchTerm}"</p>
               <button onClick={() => setSearchTerm('')} className="text-hospital-600 underline font-bold hover:text-hospital-700">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
               {filteredDepts.map((dept, idx) => (
                 <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 border border-gray-100 flex flex-col group hover:-translate-y-2 reveal-on-scroll" style={{animationDelay: `${Math.min(idx * 50, 1000)}ms`}}>
                    
                    {/* NEW: Image Section */}
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={dept.image} 
                            alt={dept.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 flex items-center text-white">
                            <div className="text-2xl mr-3 bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center border border-white/30 shadow-lg">{dept.icon}</div>
                            <h3 className="text-xl font-bold font-serif shadow-black drop-shadow-md">{dept.title}</h3>
                        </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                        <p className="text-gray-600 mb-6 flex-grow leading-relaxed text-sm">{dept.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-6">
                        {dept.features.map((feature, i) => (
                            <div key={i} className="flex items-center text-[11px] font-bold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 group-hover:border-hospital-100 transition">
                            <svg className="w-3 h-3 text-hospital-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            <span className="truncate">{feature}</span>
                            </div>
                        ))}
                        </div>

                        <Link to="/appointment/new" className="text-center w-full py-3.5 rounded-xl bg-hospital-600 text-white font-bold hover:bg-hospital-700 transition shadow-md shadow-hospital-500/20 uppercase text-xs tracking-wider transform active:scale-95">
                        Book Appointment
                        </Link>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* Promo Section - Darker Theme */}
          <div className="mt-16 md:mt-24 bg-hospital-900 rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl reveal-on-scroll">
             <div className="relative z-10">
               <span className="bg-white/10 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block border border-white/10 shadow-lg">Preventive Care</span>
               <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 drop-shadow-md">Need a specialized checkup?</h2>
               <p className="mb-10 text-hospital-200 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                 We offer comprehensive health packages including Whole Body Checkups, Cardiac Screenings, and Diabetic Packages at affordable rates designed to keep you healthy.
               </p>
               <Link to="/contact" className="px-10 py-4 bg-white text-hospital-900 font-bold rounded-full hover:bg-gray-100 transition shadow-xl inline-flex items-center transform hover:scale-105 duration-300">
                  <span>Contact for Packages</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
               </Link>
             </div>
             
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-hospital-800 rounded-full opacity-30 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-hospital-800 rounded-full opacity-20"></div>
          </div>
       </div>
    </div>
  );
};

export default ServicesPage;
