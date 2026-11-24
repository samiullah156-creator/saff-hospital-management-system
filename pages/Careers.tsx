
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Careers: React.FC = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', linkedin: '' });

  const jobs = [
    { id: 1, title: 'Senior Staff Nurse', dept: 'ICU / CCU', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 2, title: 'Medical Officer', dept: 'Emergency', type: 'Night Shift', location: 'Rahim Yar Khan' },
    { id: 3, title: 'IT Support Specialist', dept: 'IT Department', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 4, title: 'Pharmacist', dept: 'Pharmacy', type: 'Rotation', location: 'Rahim Yar Khan' },
    { id: 5, title: 'General Surgeon', dept: 'Surgery', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 6, title: 'Lab Technician', dept: 'Pathology', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 7, title: 'Receptionist', dept: 'Front Desk', type: 'Shift Based', location: 'Rahim Yar Khan' },
    { id: 8, title: 'Accountant', dept: 'Finance', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 9, title: 'Marketing Manager', dept: 'Marketing', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 10, title: 'Security Supervisor', dept: 'Security', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 11, title: 'Housekeeping Staff', dept: 'Maintenance', type: 'Shift Based', location: 'Rahim Yar Khan' },
    { id: 12, title: 'Ambulance Driver', dept: 'Emergency', type: '24/7 Shift', location: 'Rahim Yar Khan' },
    { id: 13, title: 'HR Coordinator', dept: 'Human Resources', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 14, title: 'Biomedical Engineer', dept: 'Engineering', type: 'Full Time', location: 'Rahim Yar Khan' },
    { id: 15, title: 'Patient Relations Officer', dept: 'Admin', type: 'Full Time', location: 'Rahim Yar Khan' }
  ];

  const handleApply = (jobTitle: string) => {
      setSelectedJob(jobTitle);
      setShowApplyModal(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Application submitted for ${selectedJob}! We will contact you shortly.`);
      setShowApplyModal(false);
      setFormData({ name: '', email: '', phone: '', linkedin: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in">
        {/* Updated Hero with Teal Gradient */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 py-20 text-center text-white relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&q=80&w=1600')] bg-cover opacity-20"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Join Our Team</h1>
                <p className="text-xl text-teal-100">Build a rewarding career at the leading healthcare facility in Southern Punjab.</p>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-4 gap-8">
                {/* Job List */}
                <div className="md:col-span-3 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Current Openings ({jobs.length})</h2>
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row justify-between items-start md:items-center transform hover:-translate-y-1">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition">{job.title}</h3>
                                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md"><svg className="w-4 h-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>{job.dept}</span>
                                        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md"><svg className="w-4 h-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{job.type}</span>
                                        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md"><svg className="w-4 h-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>{job.location}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleApply(job.title)}
                                    className="mt-4 md:mt-0 px-6 py-2.5 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Why Saff Hospital?</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start"><span className="text-teal-500 mr-2 font-bold">✔</span> Competitive Salary Packages</li>
                            <li className="flex items-start"><span className="text-teal-500 mr-2 font-bold">✔</span> Health Insurance for Family</li>
                            <li className="flex items-start"><span className="text-teal-500 mr-2 font-bold">✔</span> Continuous Medical Education</li>
                            <li className="flex items-start"><span className="text-teal-500 mr-2 font-bold">✔</span> State-of-the-art Environment</li>
                            <li className="flex items-start"><span className="text-teal-500 mr-2 font-bold">✔</span> Paid Leaves & Bonuses</li>
                        </ul>
                        
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-lg text-teal-800 mb-2">Internships</h3>
                            <p className="text-sm text-gray-600 mb-4">We offer house job and internship programs for medical graduates and nursing students.</p>
                            <Link to="/contact" className="text-teal-600 font-bold text-sm underline hover:text-teal-800">Contact HR Dept</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Application Modal - Enhanced */}
        {showApplyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative border border-gray-100 transform transition-all scale-100 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[100px] pointer-events-none opacity-50"></div>
                    <button onClick={() => setShowApplyModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition z-10">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    
                    <div className="mb-8 border-b border-gray-100 pb-4 relative z-10">
                        <span className="text-teal-600 font-bold text-xs uppercase tracking-wider mb-2 block">Application Form</span>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">{selectedJob}</h2>
                    </div>
                    
                    <form onSubmit={handleSubmitApplication} className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-gray-800" 
                                placeholder="Enter your full name"
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-gray-800" 
                                placeholder="name@example.com"
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                <input 
                                    type="tel" 
                                    required 
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-gray-800" 
                                    placeholder="+92 3xx..."
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn (Optional)</label>
                                <input 
                                    type="url" 
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-gray-800" 
                                    placeholder="Profile URL"
                                    value={formData.linkedin} 
                                    onChange={e => setFormData({...formData, linkedin: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Resume (PDF)</label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition focus:outline-none cursor-pointer" 
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5 mt-4">
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Careers;
