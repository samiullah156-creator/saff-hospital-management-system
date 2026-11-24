
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useScrollAnimation();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1538108149393-fbbd8189718c?auto=format&fit=crop&q=80&w=1200";
    e.currentTarget.onerror = null;
  };

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

  return (
    <div className="animate-fade-in bg-white font-sans">
      {/* Professional Hero */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2560" 
            alt="Hospital Building" 
            className="w-full h-full object-cover" 
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-hospital-900 via-hospital-800/90 to-transparent"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center px-4 max-w-7xl mx-auto">
          <span className="text-hospital-300 font-bold uppercase tracking-widest text-sm mb-4 animate-fade-in-up">About Us</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up delay-100">Excellence in <br/>Healthcare Since 1995</h1>
          <p className="text-xl text-hospital-100 max-w-2xl animate-fade-in-up delay-200 leading-relaxed border-l-4 border-hospital-400 pl-6">
            Serving the community of Rahim Yar Khan with compassion, integrity, and medical innovation.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24 reveal-on-scroll">
           <div className="order-2 md:order-1">
              <span className="text-hospital-600 font-bold uppercase tracking-wide text-sm mb-2 block">Who We Are</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">A Legacy of Healing</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg text-justify">
                 <p>
                    Saff Hospital was founded in 1995 by Dr. Saff-ur-Rehman with a vision to bring world-class healthcare to Southern Punjab. What started as a small clinic in Model Town has now grown into a 200-bed multi-specialty tertiary care hospital.
                 </p>
                 <p>
                    Over the decades, we have pioneered numerous medical procedures in Rahim Yar Khan, including the first successful open-heart surgery and the establishment of the region's first dedicated cancer care unit. Our facility integrates modern medical technology with human expertise to deliver the best possible outcomes.
                 </p>
                 <div className="mt-8">
                   <Link to="/gallery" className="text-hospital-600 font-bold hover:text-hospital-800 flex items-center group">
                      View Our Facilities 
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                   </Link>
                 </div>
              </div>
           </div>
           <div className="relative order-1 md:order-2 group">
              <div className="absolute -inset-4 bg-hospital-100 rounded-xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200" 
                alt="Hospital Building" 
                className="relative rounded-lg shadow-2xl transition duration-500 transform group-hover:scale-[1.02]" 
                onError={handleImageError}
              />
           </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 reveal-on-scroll">
           <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300 transform hover:-translate-y-2 hover:bg-white group">
              <div className="w-14 h-14 bg-hospital-100 text-hospital-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-hospital-700 transition">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">To provide affordable, accessible, and high-quality healthcare services to all segments of society without discrimination.</p>
           </div>
           <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300 transform hover:-translate-y-2 hover:bg-white group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">To be the leading healthcare provider in Pakistan, recognized for clinical excellence and patient-centric care.</p>
           </div>
           <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-xl transition duration-300 transform hover:-translate-y-2 hover:bg-white group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition">Core Values</h3>
              <p className="text-gray-600 leading-relaxed">Compassion, Integrity, Innovation, Teamwork, and Excellence form the foundation of our work culture.</p>
           </div>
        </div>

        {/* NEW SECTION: Accreditations */}
        <div className="mb-24 text-center reveal-on-scroll">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">Accreditations & Quality Assurance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { title: "ISO 9001:2015", desc: "Certified Quality Management", icon: "🏆" },
                 { title: "Punjab Healthcare Commission", desc: "Licensed & Approved", icon: "🏥" },
                 { title: "JCI Accredited", desc: "Gold Standard in Safety", icon: "🌍" },
                 { title: "Waste Management", desc: "Eco-Friendly Practices", icon: "♻️" }
               ].map((acc, i) => (
                 <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <div className="text-4xl mb-3">{acc.icon}</div>
                    <h4 className="font-bold text-gray-900">{acc.title}</h4>
                    <p className="text-sm text-gray-500">{acc.desc}</p>
                 </div>
               ))}
            </div>
        </div>

        {/* Leadership */}
        <div className="text-center mb-24 reveal-on-scroll">
           <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">Our Leadership</h2>
           <div className="grid md:grid-cols-4 gap-8 mb-12">
              {[
                { name: "Dr. Saff-ur-Rehman", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800" },
                { name: "Dr. Sarah Ahmed", role: "Medical Director", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" },
                { name: "Mr. Kamran Ali", role: "Head of Operations", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" },
                { name: "Mrs. Fatima Noor", role: "Head of Nursing", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800" }
              ].map((leader, i) => (
                <div key={i} className="group">
                   <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg bg-gray-100">
                      <img 
                        src={leader.img} 
                        alt={leader.name} 
                        className="w-full h-64 object-cover group-hover:scale-110 transition duration-500" 
                        onError={handleImageError}
                      />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 group-hover:text-hospital-600 transition">{leader.name}</h3>
                   <p className="text-hospital-600 text-sm font-medium">{leader.role}</p>
                </div>
              ))}
           </div>
           
           {/* CTA Buttons */}
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/appointment/new" className="px-8 py-3 bg-hospital-600 text-white font-bold rounded-full shadow-lg hover:bg-hospital-700 transition transform hover:-translate-y-1">
                 Book Appointment
              </Link>
              <Link to="/doctors" className="px-8 py-3 bg-white text-hospital-600 border-2 border-hospital-600 font-bold rounded-full hover:bg-hospital-50 transition transform hover:-translate-y-1">
                 Find a Doctor
              </Link>
           </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-24 max-w-3xl mx-auto reveal-on-scroll">
            <div className="text-center mb-12">
                <span className="text-hospital-600 font-bold uppercase tracking-wide text-sm mb-2 block">Common Questions</span>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
                {FAQS.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                        <div 
                            key={index} 
                            className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-hospital-200 shadow-lg ring-1 ring-hospital-100' : 'border-gray-200 hover:border-hospital-200 hover:shadow-sm'}`}
                        >
                            <button 
                                className="w-full text-left p-5 flex justify-between items-center focus:outline-none group"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={isOpen}
                            >
                                <span className={`font-bold text-lg transition-colors duration-300 ${isOpen ? 'text-hospital-700' : 'text-gray-800 group-hover:text-hospital-600'}`}>
                                    {faq.question}
                                </span>
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-in-out shrink-0 ml-4 ${isOpen ? 'bg-hospital-100 text-hospital-600 rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-hospital-50 group-hover:text-hospital-500'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            <div 
                                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-5 pt-0 text-gray-600 text-base leading-relaxed border-t border-transparent">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* NEW SECTION: Community Outreach */}
        <div className="bg-gray-50 rounded-3xl p-12 mb-20 relative overflow-hidden reveal-on-scroll">
           <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
           <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
           
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Community Outreach</h2>
                 <p className="text-gray-600 mb-4 leading-relaxed">
                   Saff Hospital is committed to giving back. Through our "Health for All" initiative, we organize monthly free medical camps in rural areas surrounding Rahim Yar Khan.
                 </p>
                 <ul className="space-y-3 mt-6">
                    <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Free Cataract Surgeries</li>
                    <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Diabetes Screening Camps</li>
                    <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>School Health Programs</li>
                 </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <img 
                    src="https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&q=80&w=800" 
                    className="rounded-xl shadow-lg transform rotate-2 hover:rotate-0 transition duration-300 hover:scale-105" 
                    alt="Camp 1" 
                    onError={handleImageError}
                 />
                 <img 
                    src="https://images.unsplash.com/photo-1542736667-069246bdbc6d?auto=format&fit=crop&q=80&w=800" 
                    className="rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition duration-300 translate-y-8 hover:scale-105" 
                    alt="Camp 2" 
                    onError={handleImageError}
                 />
              </div>
           </div>
        </div>

        {/* Patient Rights */}
        <div className="text-center max-w-3xl mx-auto reveal-on-scroll">
           <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Patient Rights & Responsibilities</h2>
           <p className="text-gray-600 mb-8">
             We believe in transparency and mutual respect. Every patient at Saff Hospital has the right to considerate care, privacy, and clear communication about their treatment options.
           </p>
           <Link to="/contact" className="inline-block border-2 border-hospital-600 text-hospital-600 font-bold px-8 py-3 rounded-full hover:bg-hospital-600 hover:text-white transition transform hover:-translate-y-1">
             Contact Patient Relations
           </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
