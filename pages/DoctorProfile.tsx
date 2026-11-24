
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Doctor, Appointment, AppointmentStatus } from '../types';

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayDate, setDisplayDate] = useState(new Date());
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const [doc, apps] = await Promise.all([
            dbService.getDoctorById(id),
            dbService.getAllAppointments()
        ]);
        setDoctor(doc || null);
        setAppointments(apps);
        setIsFavorite(dbService.isDoctorFavorite(id));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setDisplayDate(newDate);
  };

  const handleDateClick = (dateStr: string) => {
    if (doctor) {
      navigate('/appointment/new', { state: { doctorId: doctor.id, preSelectedDate: dateStr } });
    }
  };

  const toggleFavorite = async () => {
      if (!doctor) return;
      const newState = await dbService.toggleFavoriteDoctor(doctor.id);
      setIsFavorite(newState);
  };

  // Image fallback handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"; // Reliable Generic Doctor Image
    e.currentTarget.onerror = null;
  };

  const renderCalendar = () => {
    if (!doctor) return null;

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Check if displayed month is current month
    const currentDate = new Date();
    const isCurrentMonth = currentDate.getMonth() === month && currentDate.getFullYear() === year;
    
    const days = [];
    
    // Previous month filler
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100/50"></div>);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      // Changed to short to match DB format (e.g., 'Mon', 'Tue')
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const isAvailable = doctor.availability.includes(dayName);
      const isToday = new Date().toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0,0,0,0));

      // Calculate availability based on 15 slots per day
      const dailyApps = appointments.filter(a => 
          a.doctorId === doctor.id && 
          a.date === dateStr && 
          a.status !== AppointmentStatus.CANCELLED
      );
      const totalSlots = 15;
      const slotsTaken = dailyApps.length;
      const isFull = slotsTaken >= totalSlots;
      const slotsLeft = totalSlots - slotsTaken;

      days.push(
        <div 
          key={day}
          onClick={() => {
            if (isAvailable && !isPast && !isFull) {
               handleDateClick(dateStr);
            }
          }}
          className={`h-24 border border-gray-100 p-2 relative transition group flex flex-col justify-between ${
            isAvailable && !isPast && !isFull 
                ? 'bg-green-50 hover:bg-green-100 cursor-pointer hover:shadow-md' 
                : isFull && isAvailable && !isPast
                    ? 'bg-red-50 cursor-not-allowed opacity-80'
                    : 'bg-white'
          } ${isPast ? 'bg-gray-100 opacity-60 cursor-default' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span 
              className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                isToday ? 'bg-hospital-600 text-white shadow-md' : 'text-gray-700'
              }`}
            >
              {day}
            </span>
          </div>
          
          {isAvailable && !isPast && (
            <div className="mt-1 text-center w-full">
              {isFull ? (
                  <span className="block w-full py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded shadow-sm border border-red-200">
                    Full
                  </span>
              ) : (
                  <>
                    <span className={`block w-full py-1 text-[10px] font-bold rounded shadow-sm border group-hover:hidden ${slotsLeft <= 5 ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-200 text-green-800 border-green-300'}`}>
                        {slotsLeft} slots
                    </span>
                    <div className="hidden group-hover:block">
                        <button className="text-[10px] bg-hospital-600 text-white py-1 rounded hover:bg-hospital-700 block w-full shadow-sm font-bold tracking-wide">
                            Book
                        </button>
                    </div>
                  </>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Calendar Header */}
        <div className="bg-hospital-600 p-4 flex justify-between items-center text-white">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/20 rounded-full transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-serif tracking-wide">
              {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            {isCurrentMonth && (
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Current</span>
            )}
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/20 rounded-full transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-hospital-600 font-bold">Loading Profile...</div>;
  if (!doctor) return <div className="min-h-screen flex items-center justify-center text-red-500">Doctor not found.</div>;

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-hospital-800 h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600" 
          alt="Background" 
          className="w-full h-full object-cover opacity-50" 
          onError={handleImageError}
        />
        <Link to="/doctors" className="absolute top-6 left-6 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold flex items-center transition">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Doctors
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Doctor Info */}
            <div className="md:w-1/3 bg-white p-8 border-r border-gray-100 flex flex-col items-center text-center relative">
              
              {/* Favorite Button */}
              <button 
                onClick={toggleFavorite}
                className="absolute top-6 right-6 p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition shadow-sm group"
                title={isFavorite ? "Remove from Favorites" : "Mark as Favorite"}
              >
                 <svg 
                    className={`w-6 h-6 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400'}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                 >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                 </svg>
              </button>

              <div className="w-48 h-48 rounded-full p-2 bg-white shadow-xl -mt-24 mb-6">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full rounded-full object-cover border-4 border-hospital-50" 
                  onError={handleImageError}
                />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{doctor.name}</h1>
              <span className="bg-hospital-100 text-hospital-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                {doctor.specialty} Specialist
              </span>
              
              <div className="w-full space-y-4 mt-4 text-left px-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-hospital-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span>Experience: <span className="font-bold text-gray-800">{doctor.experience}</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-hospital-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>Saff Hospital, Rahim Yar Khan</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-hospital-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <span className="block mb-1">Availability:</span>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availability.map(day => (
                        <span key={day} className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Areas of Expertise */}
              {doctor.expertise && doctor.expertise.length > 0 && (
                <div className="w-full mt-8 px-4 text-left border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center">
                    <span className="w-1 h-4 bg-hospital-500 mr-2 rounded-full"></span>
                    Areas of Expertise
                  </h4>
                  <ul className="space-y-2">
                    {doctor.expertise.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-hospital-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 w-full">
                <button 
                  onClick={() => navigate('/appointment/new', { state: { doctorId: doctor.id } })}
                  className="block w-full bg-hospital-600 text-white font-bold py-3 rounded-xl hover:bg-hospital-700 transition shadow-lg shadow-hospital-500/30"
                >
                  Book Appointment Now
                </button>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="md:w-2/3 p-8 bg-gray-50/50">
               <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Monthly Schedule</h2>
                    <p className="text-gray-500 text-sm">Select an available date below to proceed.</p>
                 </div>
                 <div className="flex gap-4 text-xs mt-4 md:mt-0">
                    <div className="flex items-center"><div className="w-3 h-3 bg-green-200 rounded mr-1"></div> Available</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-orange-100 rounded mr-1"></div> Few Slots</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-red-100 rounded mr-1"></div> Full</div>
                 </div>
               </div>
               {renderCalendar()}
               
               <div className="mt-6 flex gap-4 text-sm bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p className="text-xs">
                      <strong>Note:</strong> Online booking closes 2 hours before the slot time. For urgent appointments, please visit the emergency counter.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
