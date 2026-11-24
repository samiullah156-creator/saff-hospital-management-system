
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Doctor } from '../types';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [specialties, setSpecialties] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  const days = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getDoctors();
      setDoctors(data);
      
      // Extract unique specialties and sort them alphabetically
      const uniqueSpecialties = ['All', ...Array.from(new Set(data.map(d => d.specialty))).sort()];
      setSpecialties(uniqueSpecialties);
      
      // Get favorites
      const favDocs = await dbService.getFavoriteDoctors();
      setFavorites(favDocs.map(d => d.id));
      
      setLoading(false);
    };
    fetch();
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      await dbService.toggleFavoriteDoctor(id);
      if (favorites.includes(id)) {
          setFavorites(favorites.filter(favId => favId !== id));
      } else {
          setFavorites([...favorites, id]);
      }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = filter === 'All' || doc.specialty === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === 'All' || doc.availability.includes(selectedDay);
    
    return matchesSpecialty && matchesSearch && matchesDay;
  }).sort((a, b) => {
      if (sortOption === 'experience') {
          return parseInt(b.experience) - parseInt(a.experience);
      }
      return 0; // Default order
  });

  const navigateToProfile = (id: string) => {
      navigate(`/doctors/${id}`);
  };

  // Fallback for broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"; // Generic Doctor Image
    e.currentTarget.onerror = null;
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-hospital-600 font-bold">Loading Doctors...</div>;

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in">
      {/* Professional Hero */}
      <div className="bg-hospital-900 relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2560" className="w-full h-full object-cover" alt="Doctors" onError={handleImageError} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-hospital-900 via-hospital-800/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center md:text-left">
           <span className="text-hospital-300 font-bold uppercase tracking-widest text-xs mb-2 block animate-fade-in-up">World Class Care</span>
           <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up delay-100">Our Medical Specialists</h1>
           <p className="text-hospital-100 text-lg max-w-2xl leading-relaxed animate-fade-in-up delay-200">
             Meet the expert team at Saff Hospital Rahim Yar Khan. Our doctors are leaders in their fields, dedicated to providing compassionate and advanced healthcare.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
        
        {/* Controls Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-12 border border-gray-100 flex flex-col gap-4">
           {/* Search - Full width on mobile */}
           <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search by Doctor Name or Specialty..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>

           {/* Filters - Stack vertically on mobile, row on tablet/desktop */}
           <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="relative w-full md:w-auto md:flex-1">
                 <select 
                   value={sortOption} 
                   onChange={(e) => setSortOption(e.target.value)}
                   className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-hospital-500 outline-none cursor-pointer font-medium text-gray-700"
                 >
                    <option value="default">Sort by: Default</option>
                    <option value="experience">Years of Experience</option>
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>

              <div className="relative w-full md:w-auto md:flex-1">
                 <select 
                   value={selectedDay} 
                   onChange={(e) => setSelectedDay(e.target.value)}
                   className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-hospital-500 outline-none cursor-pointer font-medium text-gray-700"
                 >
                    <option value="" disabled>Availability Day</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>

              <div className="relative w-full md:w-auto md:flex-1">
                 <select 
                   value={filter} 
                   onChange={(e) => setFilter(e.target.value)}
                   className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-hospital-500 outline-none cursor-pointer font-medium text-gray-700"
                 >
                    <option value="" disabled>Select Department</option>
                    {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>
           </div>
        </div>

        {filteredDoctors.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No doctors found matching your criteria.</p>
              <button onClick={() => {setFilter('All'); setSearchTerm(''); setSelectedDay('All');}} className="mt-4 text-hospital-600 font-bold hover:underline">Clear All Filters</button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredDoctors.map((doc, idx) => (
              <div 
                key={doc.id} 
                onClick={() => navigateToProfile(doc.id)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 flex flex-col group animate-fade-in-up cursor-pointer border border-transparent hover:border-hospital-100" 
                style={{animationDelay: `${idx * 50}ms`}}
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" 
                    onError={handleImageError}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12 opacity-100">
                    <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] px-2 py-1 rounded-full mb-2 font-bold uppercase tracking-wide shadow-sm">
                      {doc.specialty}
                    </span>
                    <div className="flex justify-between items-center">
                        <h3 className="text-white text-xl font-bold font-serif leading-tight">{doc.name}</h3>
                        <button 
                            onClick={(e) => toggleFavorite(e, doc.id)}
                            className="text-white hover:text-red-500 transition focus:outline-none"
                        >
                            <svg className={`w-6 h-6 transition-colors duration-300 ${favorites.includes(doc.id) ? 'fill-red-500 text-red-500' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center text-gray-600 mb-3 text-sm">
                    <svg className="w-4 h-4 mr-2 text-hospital-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{doc.experience} Experience</span>
                  </div>
                  
                  <div className="mb-6 flex-grow">
                     <h4 className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">OPD Days</h4>
                     <div className="flex flex-wrap gap-1.5">
                       {doc.availability.map((day) => (
                         <span key={day} className="bg-hospital-50 text-hospital-700 border border-hospital-100 text-[10px] font-bold px-2 py-1 rounded-md">
                           {day.substring(0,3)}
                         </span>
                       ))}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button
                      className="flex items-center justify-center w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-lg transition text-xs uppercase tracking-wide"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate('/appointment/new', { state: { doctorId: doc.id } }); }}
                      className="flex items-center justify-center w-full text-center bg-hospital-600 hover:bg-hospital-700 text-white font-bold py-2.5 rounded-lg transition shadow-md shadow-hospital-500/20 text-xs uppercase tracking-wide"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
