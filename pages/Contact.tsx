
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [isListening, setIsListening] = useState(false);
  
  // CAPTCHA State
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
    setCaptchaInput('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format (e.g., user@example.com)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      newErrors.captcha = 'Incorrect answer. Please try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startDictation = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => {
            const updated = { ...prev, message: (prev.message + ' ' + transcript).trim() };
            if (updated.message.length >= 10) {
                 setErrors(curr => ({ ...curr, message: '' }));
            }
            return updated;
        });
      };
      recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
      };
      recognition.start();
    } else {
        alert("Voice input is not supported in this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('SENDING');
    try {
      await dbService.submitContactForm(formData);
      setStatus('SUCCESS');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setCaptchaInput('');
      generateCaptcha();
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, value }: any) => (
      <div className="relative group">
          <input 
            type={type} 
            name={name} 
            value={value}
            onChange={handleChange}
            className={`peer w-full px-5 py-4 pt-6 bg-white border rounded-xl outline-none transition-all duration-300 placeholder-transparent shadow-sm transform focus:scale-[1.01] focus:shadow-md ${
                errors[name] 
                ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100 bg-red-50/10' 
                : 'border-gray-300 focus:border-hospital-500 focus:ring-2 focus:ring-hospital-500/20 hover:border-hospital-400'
            }`} 
            placeholder={placeholder}
            id={name}
          />
          <label 
            htmlFor={name}
            className={`absolute left-5 top-2 text-xs font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-xs pointer-events-none ${
                errors[name] 
                ? 'text-red-500 peer-placeholder-shown:text-red-400' 
                : 'text-gray-500 peer-placeholder-shown:text-gray-400 peer-focus:text-hospital-600'
            }`}
          >
            {label}
          </label>
          {errors[name] && (
              <p className="text-red-500 text-xs mt-1 ml-2 flex items-center animate-fade-in font-medium">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  {errors[name]}
              </p>
          )}
      </div>
  );

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen">
      {/* Professional Hero */}
      <div className="relative py-12 lg:py-0 lg:h-72 overflow-hidden bg-hospital-900">
        <div className="absolute inset-0 opacity-50">
           <img src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=2560" className="w-full h-full object-cover" alt="Contact Us" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-hospital-900 via-hospital-900/40 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-10">
           <span className="text-hospital-300 font-bold uppercase tracking-widest text-sm mb-2 animate-fade-in-up">Help Center</span>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 animate-fade-in-up delay-100">Contact & Information</h1>
           <p className="text-hospital-100 text-lg max-w-xl animate-fade-in-up delay-200">We are here to assist you 24/7. Reach out for appointments, emergencies, or general inquiries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 grid lg:grid-cols-2 gap-8 lg:gap-24 lg:-mt-20 relative z-20">
         
         {/* Left Side: Contact Info & Map */}
         <div className="space-y-8 order-2 lg:order-1 animate-fade-in-up delay-300">
            {/* Cards */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
                <div className="space-y-6">
                   <div className="flex items-start group">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shadow-sm">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                      <div className="ml-5">
                         <h3 className="font-bold text-gray-900 text-lg">Hospital Location</h3>
                         <p className="text-gray-600 leading-relaxed mt-1">Model Town, Near City Park,<br/>Rahim Yar Khan, Punjab, Pakistan</p>
                      </div>
                   </div>
                   <div className="flex items-start group">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-600 group-hover:text-white transition duration-300 shadow-sm">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </div>
                      <div className="ml-5">
                         <h3 className="font-bold text-gray-900 text-lg">Phone Numbers</h3>
                         <p className="text-gray-600 mt-1">Reception: <span className="font-bold text-gray-800">+92 68 1234567</span></p>
                         <p className="text-red-500 font-bold mt-1">Emergency: 1122</p>
                      </div>
                   </div>
                   <div className="flex items-start group">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition duration-300 shadow-sm">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <div className="ml-5">
                         <h3 className="font-bold text-gray-900 text-lg">Email Address</h3>
                         <p className="text-gray-600 mt-1">info@saffhospital.ryk</p>
                         <p className="text-gray-600">careers@saffhospital.ryk</p>
                      </div>
                   </div>
                </div>
            </div>

            {/* Google Map */}
            <div className="h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition duration-500">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55695.53232043642!2d70.2743828906954!3d28.421160492928527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375c713b415613%3A0xa5d3519803024845!2sRahim%20Yar%20Khan%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1709540000000!5m2!1sen!2s" 
                 width="100%" 
                 height="100%" 
                 style={{border:0}} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Saff Hospital Map"
                 className="grayscale hover:grayscale-0 transition duration-700"
               ></iframe>
            </div>
         </div>

         {/* Right Side: Form */}
         <div className="order-1 lg:order-2 bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100 relative overflow-hidden h-fit animate-fade-in-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
            <div className="relative z-10">
                <span className="text-hospital-600 font-bold uppercase tracking-wide text-xs">Message Us</span>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 font-serif">Have Questions?</h2>
                
                {status === 'SUCCESS' ? (
                  <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-100 animate-fade-in">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                     <p className="text-green-700">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                     <button onClick={() => setStatus('IDLE')} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/30">Send Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Your Name" name="name" placeholder="John Doe" value={formData.name} />
                        <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} />
                     </div>
                     <InputField label="Subject (Optional)" name="subject" placeholder="e.g. Appointment Availability" value={formData.subject} />
                     
                     <div className="relative group">
                        <textarea 
                          name="message" 
                          rows={5} 
                          value={formData.message}
                          onChange={handleChange}
                          className={`peer w-full px-5 py-4 pt-6 bg-white border rounded-xl outline-none transition-all duration-300 placeholder-transparent resize-none pr-12 shadow-sm transform focus:scale-[1.01] focus:shadow-md ${
                              errors.message 
                              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100 bg-red-50/10' 
                              : 'border-gray-300 focus:border-hospital-500 focus:ring-2 focus:ring-hospital-500/20 hover:border-hospital-400'
                          }`}
                          placeholder="How can we help you?"
                          id="message"
                        ></textarea>
                        <label 
                          htmlFor="message"
                          className={`absolute left-5 top-2 text-xs font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-xs pointer-events-none ${
                              errors.message 
                              ? 'text-red-500 peer-placeholder-shown:text-red-400' 
                              : 'text-gray-500 peer-placeholder-shown:text-gray-400 peer-focus:text-hospital-600'
                          }`}
                        >
                          Message
                        </label>
                        <button 
                            type="button"
                            onClick={startDictation}
                            className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:text-hospital-600 hover:bg-hospital-50'}`}
                            title="Dictate Message"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                        {errors.message && (
                            <p className="text-red-500 text-xs mt-1 ml-2 flex items-center animate-fade-in font-medium">
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                {errors.message}
                            </p>
                        )}
                     </div>

                     {/* Security Challenge (Simulated CAPTCHA) */}
                     <div className={`bg-gray-50 p-4 rounded-xl border transition-all duration-300 ${errors.captcha ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Check</label>
                            <button type="button" onClick={generateCaptcha} className="text-hospital-600 hover:text-hospital-800 text-xs font-bold flex items-center">
                                Refresh <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 font-mono text-lg font-bold text-gray-700 tracking-widest select-none shadow-inner">
                                {captcha.num1} + {captcha.num2} = ?
                            </div>
                            <input 
                                type="number" 
                                placeholder="Answer"
                                value={captchaInput}
                                onChange={(e) => {
                                    setCaptchaInput(e.target.value);
                                    if(errors.captcha) setErrors(curr => ({...curr, captcha: ''}));
                                }}
                                className={`w-24 px-4 py-2 rounded-lg border focus:outline-none transition ${errors.captcha ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-hospital-500 focus:ring-2 focus:ring-hospital-500/20'}`}
                            />
                        </div>
                        {errors.captcha && <p className="text-red-500 text-xs mt-2 font-medium animate-fade-in">{errors.captcha}</p>}
                     </div>

                     <button 
                       type="submit" 
                       disabled={status === 'SENDING'}
                       className="w-full bg-hospital-600 text-white font-bold py-4 rounded-xl hover:bg-hospital-700 transition shadow-xl shadow-hospital-500/30 flex justify-center items-center transform hover:-translate-y-1 active:translate-y-0"
                     >
                       {status === 'SENDING' ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Sending Message...
                          </>
                       ) : (
                          <>
                            Send Message
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                          </>
                       )}
                     </button>
                  </form>
                )}
            </div>
         </div>
      </div>

      {/* NEW SECTION: VISITING HOURS & GUIDELINES */}
      <div className="bg-white py-16 border-t border-gray-100 reveal-on-scroll">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
               {/* Visiting Hours */}
               <div className="bg-hospital-50 rounded-2xl p-8 border border-hospital-100 transition hover:shadow-lg">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-hospital-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Visiting Hours
                  </h3>
                  <div className="space-y-4">
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-bold text-gray-700">General Wards</span>
                        <span className="text-gray-600">11:00 AM - 1:00 PM & 5:00 PM - 7:00 PM</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-bold text-gray-700">ICU / CCU</span>
                        <span className="text-gray-600">4:00 PM - 5:00 PM (Only 1 Attendant)</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-bold text-gray-700">Private Rooms</span>
                        <span className="text-gray-600">9:00 AM - 9:00 PM</span>
                     </div>
                  </div>
                  <p className="mt-4 text-xs text-gray-500 italic">Please note that visiting hours may change during emergencies or pandemics.</p>
               </div>

               {/* Guidelines */}
               <div className="bg-red-50 rounded-2xl p-8 border border-red-100 transition hover:shadow-lg">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Patient Guidelines
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex items-start text-sm text-gray-700">
                       <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
                       Bring your CNIC and previous medical records for registration.
                     </li>
                     <li className="flex items-start text-sm text-gray-700">
                       <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
                       Children under 12 are not allowed in patient areas to prevent infection.
                     </li>
                     <li className="flex items-start text-sm text-gray-700">
                       <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
                       Smoking is strictly prohibited within hospital premises.
                     </li>
                     <li className="flex items-start text-sm text-gray-700">
                       <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
                       Please maintain silence in corridors and wards.
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>

      {/* Department Directory / Quick Links */}
      <div className="bg-white py-16 reveal-on-scroll">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-gray-900">Department Directory</h2>
                  <p className="text-gray-500 mt-2">Direct lines to specific departments</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                  {[
                      { name: "Emergency / Trauma", ext: "1122", link: "/services" },
                      { name: "Patient Appointment", ext: "+92 68 1230001", link: "/appointment/new" },
                      { name: "Laboratory Reports", ext: "+92 68 1230002", link: "/services" },
                      { name: "Pharmacy", ext: "+92 68 1230003", link: "/services" },
                      { name: "Blood Bank", ext: "+92 68 1230004", link: "/services" },
                      { name: "Admin Office", ext: "+92 68 1230005", link: "/about" },
                      { name: "Careers / HR", ext: "+92 68 1230006", link: "/about" },
                      { name: "AI Help Desk", ext: "Online", link: "/ai-assistant" },
                  ].map((dept, idx) => (
                      <div key={idx} className="border border-gray-100 p-4 rounded-xl hover:shadow-md transition bg-gray-50 hover:bg-white text-center transform hover:-translate-y-1">
                          <h4 className="font-bold text-gray-800">{dept.name}</h4>
                          <p className="text-hospital-600 font-mono text-sm my-2">{dept.ext}</p>
                          <Link to={dept.link} className="text-xs text-gray-400 hover:text-hospital-500 underline font-bold">Visit Section</Link>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Contact;
