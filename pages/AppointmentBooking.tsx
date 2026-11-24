
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Doctor, User, Appointment, AppointmentStatus } from '../types';

const steps = ['Select Doctor', 'Choose Time', 'Confirm', 'Confirmed'];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
  '04:00 PM', '04:30 PM', '05:00 PM'
];

const getNextDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      fullDate: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), // Changed to short to match DB
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  return days;
};

const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableDates, setAvailableDates] = useState<ReturnType<typeof getNextDays>>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingSlot, setCheckingSlot] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const u = dbService.getCurrentUser();
      if (!u) { navigate('/login'); } else { setUser(u); }
    };
    checkAuth();

    const fetchDocs = async () => {
      const data = await dbService.getDoctors();
      setDoctors(data);
      setLoading(false);

      if (location.state) {
        const { doctorId, preSelectedDate, preSelectedTime, preSelectedReason, editMode, appointment } = location.state as any;
        
        if (editMode && appointment) {
           setIsEditMode(true);
           setExistingAppointment(appointment);
           const editDoc = data.find(d => d.id === appointment.doctorId);
           if (editDoc) setSelectedDoctor(editDoc);
           setSelectedDate(appointment.date);
           setSelectedTime(appointment.time);
           setReason(appointment.reason);
           setNotes(appointment.notes || '');
           setDueDate(appointment.dueDate || '');
           setCurrentStep(0);
        } else if (doctorId) {
          const preDoc = data.find(d => d.id === doctorId);
          if (preDoc) {
            setSelectedDoctor(preDoc);
            if (preSelectedDate) {
               setSelectedDate(preSelectedDate);
               if (preSelectedTime) setSelectedTime(preSelectedTime);
               if (preSelectedReason) setReason(preSelectedReason);
               setCurrentStep(1);
            }
          }
        }
      }
    };
    fetchDocs();
    setAvailableDates(getNextDays(14));
  }, [navigate, location.state]);

  useEffect(() => {
    const fetchAvailability = async () => {
        if (selectedDoctor && selectedDate) {
            setCheckingSlot(true);
            try {
                const taken = await dbService.getBookedSlots(
                    selectedDoctor.id, 
                    selectedDate, 
                    isEditMode && existingAppointment ? existingAppointment.id : undefined
                );
                setBookedSlots(taken);
            } catch (error) {
                console.error("Failed to fetch slots", error);
            } finally {
                setCheckingSlot(false);
            }
        } else {
            setBookedSlots([]);
        }
    };
    fetchAvailability();
  }, [selectedDoctor, selectedDate, isEditMode, existingAppointment]);

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
        setReason(prev => (prev + ' ' + transcript).trim());
      };
      recognition.onerror = (event: any) => { console.error("Speech recognition error", event.error); setIsListening(false); };
      recognition.start();
    } else { alert("Voice input is not supported in this browser."); }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
        if (!selectedDoctor) return alert('Please select a doctor');
        setCurrentStep(1);
    } else if (currentStep === 1) {
        if (!selectedDate || !selectedTime) return alert('Please select date and time');
        setCheckingSlot(true);
        const isAvailable = await dbService.checkAvailability(selectedDoctor!.id, selectedDate, selectedTime, isEditMode && existingAppointment ? existingAppointment.id : undefined);
        setCheckingSlot(false);
        if (!isAvailable) {
            alert('Sorry, this time slot was just booked by someone else. Please choose another.');
            // Refresh booked slots
            const taken = await dbService.getBookedSlots(selectedDoctor!.id, selectedDate);
            setBookedSlots(taken);
            setSelectedTime('');
            return;
        }
        setCurrentStep(2);
    }
  };

  const handleBack = () => { setCurrentStep((prev) => prev - 1); };

  const handleSubmit = async () => {
    if (!user || !selectedDoctor) return;
    setSubmitting(true);
    try {
      if (isEditMode && existingAppointment) {
         await dbService.updateAppointment({ ...existingAppointment, doctorId: selectedDoctor.id, doctorName: selectedDoctor.name, doctorSpecialty: selectedDoctor.specialty, date: selectedDate, time: selectedTime, reason: reason || existingAppointment.reason, notes, dueDate });
      } else {
         await dbService.createAppointment({ patientId: user.id, patientName: user.name, doctorId: selectedDoctor.id, doctorName: selectedDoctor.name, doctorSpecialty: selectedDoctor.specialty, date: selectedDate, time: selectedTime, reason: reason || 'General Checkup', notes, dueDate });
      }
      setCurrentStep(3);
    } catch (e) { console.error(e); alert('Failed to save appointment.'); } finally { setSubmitting(false); }
  };

  const handleAddToCalendar = (type: 'google' | 'ics') => {
      // (Keep calendar logic same)
      if (!selectedDoctor || !selectedDate || !selectedTime) return;
      const start = new Date(selectedDate);
      const [timeStr, modifier] = selectedTime.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      start.setHours(hours, minutes, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
      const title = `Appointment with ${selectedDoctor.name}`;
      const details = `Reason: ${reason || 'Checkup'}\nNotes: ${notes || 'N/A'}`;
      const location = 'Saff Hospital, Rahim Yar Khan';
      if (type === 'google') {
          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(start)}/${format(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
          window.open(url, '_blank');
      } else {
          const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${format(start)}
DTEND:${format(end)}
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
          const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.setAttribute('download', 'appointment.ics');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  if (loading) return <div className="p-10 text-center text-hospital-600 font-bold">Loading booking system...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-hospital-800 py-10 text-center text-white mb-8">
         <h1 className="text-2xl md:text-3xl font-serif font-bold">{isEditMode ? 'Reschedule Appointment' : 'Book Your Appointment'}</h1>
         <p className="text-hospital-200 mt-2 text-sm">Professional Care at Saff Hospital</p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 md:mb-10">
          {/* Responsive Steps - Stack numbers and labels vertically on mobile */}
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {steps.map((step, index) => (
              <div key={step} className={`flex flex-col items-center p-2 bg-gray-50 rounded-lg ${index <= currentStep ? 'text-hospital-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold mb-1 transition-colors duration-300 shadow-sm ${index <= currentStep ? 'bg-hospital-600 text-white shadow-lg' : 'bg-gray-300 text-gray-600'}`}>
                  {index + 1}
                </div>
                <span className="text-[10px] md:text-sm font-medium text-center leading-tight max-w-[60px] md:max-w-none">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-5 md:p-10 min-h-[400px]">
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-lg md:text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-3">Select a Specialist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 flex items-center space-x-4 transition duration-200 hover:shadow-lg ${selectedDoctor?.id === doc.id ? 'border-hospital-500 bg-hospital-50 ring-1 ring-hospital-500' : 'border-gray-100 hover:border-hospital-300'}`}
                  >
                    <img src={doc.image} alt={doc.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg">{doc.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500 font-medium">{doc.specialty}</p>
                      <p className="text-[10px] text-hospital-600 mt-1 bg-white border border-hospital-100 inline-block px-2 py-0.5 rounded-full">{doc.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && selectedDoctor && (
            <div className="animate-fade-in">
               <div className="flex items-center mb-8 p-4 bg-hospital-50 rounded-2xl border border-hospital-100">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4 border-2 border-white shadow-sm shrink-0" />
                  <div>
                     <h2 className="text-base md:text-xl font-bold text-gray-800">{selectedDoctor.name}</h2>
                     <p className="text-xs md:text-sm text-hospital-600 font-medium">{selectedDoctor.specialty}</p>
                  </div>
               </div>
               
               <div className="space-y-8">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-3">Select Date</label>
                   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                     {selectedDate && !availableDates.find(d => d.fullDate === selectedDate) && (
                        <button className="flex-shrink-0 w-24 md:w-28 p-3 md:p-4 rounded-2xl border-2 text-center transition border-hospital-600 bg-hospital-600 text-white shadow-md">
                           <div className="text-[10px] font-medium uppercase mb-1">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                           <div className="text-xl md:text-2xl font-bold">{new Date(selectedDate).getDate()}</div>
                           <div className="text-[10px]">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short' })}</div>
                        </button>
                     )}

                     {availableDates.map((dateObj) => {
                       const isAvailableDay = selectedDoctor.availability.includes(dateObj.dayName);
                       return (
                         <button
                           key={dateObj.fullDate}
                           disabled={!isAvailableDay}
                           onClick={() => { setSelectedDate(dateObj.fullDate); if (selectedDate !== dateObj.fullDate) setSelectedTime(''); }}
                           className={`flex-shrink-0 w-24 md:w-28 p-3 md:p-4 rounded-2xl border text-center transition-all snap-start ${
                             selectedDate === dateObj.fullDate
                               ? 'border-hospital-600 bg-hospital-600 text-white shadow-lg transform scale-105 font-bold ring-2 ring-hospital-200 ring-offset-2'
                               : !isAvailableDay
                               ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60'
                               : 'border-gray-200 hover:border-hospital-400 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
                           }`}
                         >
                           <div className="text-[10px] font-medium uppercase mb-1 opacity-80">{dateObj.dayName}</div>
                           <div className="text-xl md:text-2xl font-bold mb-1">{dateObj.displayDate.split(' ')[1]}</div>
                           <div className="text-[10px] opacity-80">{dateObj.displayDate.split(' ')[0]}</div>
                         </button>
                       );
                     })}
                   </div>
                 </div>

                 <div className={`transition-all duration-500 ${selectedDate ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-gray-700">Select Time Slot</label>
                        {checkingSlot && <span className="text-xs text-hospital-600 animate-pulse bg-hospital-50 px-2 py-1 rounded">Checking availability...</span>}
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                            <button
                              key={slot}
                              disabled={isBooked}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-3 px-1 md:px-2 text-[11px] md:text-sm rounded-xl border transition relative overflow-hidden font-medium ${
                                selectedTime === slot
                                  ? 'bg-hospital-600 text-white border-hospital-600 shadow-md ring-2 ring-hospital-200 ring-offset-2 scale-105'
                                  : isBooked 
                                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                    : 'border-gray-200 hover:border-hospital-400 hover:bg-hospital-50 text-gray-700 hover:text-hospital-700 hover:shadow-sm'
                              }`}
                            >
                              {selectedTime === slot && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></span>}
                              <span className={isBooked ? 'line-through decoration-gray-300' : ''}>{slot}</span>
                            </button>
                        );
                      })}
                    </div>
                 </div>
               </div>
               
               <div className="mt-8 space-y-6 pt-6 border-t border-gray-100">
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Visit</label>
                    <textarea 
                        className="w-full bg-white border border-gray-300 rounded-2xl p-4 pr-12 focus:ring-4 focus:ring-hospital-500/10 focus:border-hospital-500 outline-none transition resize-none text-gray-800 shadow-sm text-sm"
                        rows={4}
                        placeholder="Please briefly describe your symptoms or reason for visiting..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                    <button 
                        type="button"
                        onClick={startDictation}
                        className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-400 hover:text-hospital-600 shadow-sm border border-gray-200'}`}
                        title="Dictate Reason"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Due Date <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                          <input type="date" className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500 outline-none text-sm transition text-gray-700" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Private Notes <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                          <input type="text" className="w-full bg-white border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-hospital-500 focus:border-hospital-500 outline-none text-sm transition text-gray-700" placeholder="Notes for yourself..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
                  </div>
                  
                  <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <label className="block text-sm font-bold text-blue-900">Get Reminders?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-hospital-600 rounded focus:ring-hospital-500 border-gray-300" defaultChecked /><span className="text-blue-800 text-sm font-medium">Email</span></label>
                            <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-hospital-600 rounded focus:ring-hospital-500 border-gray-300" defaultChecked /><span className="text-blue-800 text-sm font-medium">SMS</span></label>
                        </div>
                   </div>
               </div>
            </div>
          )}

          {/* Step 2 Confirm */}
          {currentStep === 2 && selectedDoctor && user && (
            <div className="text-center animate-fade-in">
               <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">{isEditMode ? 'Update Appointment' : 'Confirm Appointment'}</h2>
               <p className="text-gray-500 mb-8">Please review your booking details below.</p>
               <div className="bg-gray-50 rounded-2xl p-6 md:p-8 max-w-lg mx-auto text-left shadow-inner border border-gray-100 relative">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-bl-full opacity-50 pointer-events-none"></div>
                 <div className="grid grid-cols-2 gap-8 border-b border-gray-200 pb-6 mb-6">
                   <div><span className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1 block">Patient</span><span className="font-bold text-gray-900 block text-base md:text-lg">{user.name}</span><span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded inline-block mt-1">ID: {user.id}</span></div>
                   <div className="text-right"><span className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1 block">Doctor</span><span className="font-bold text-gray-900 block text-base md:text-lg">{selectedDoctor.name}</span><span className="text-sm text-hospital-600 font-medium">{selectedDoctor.specialty}</span></div>
                 </div>
                 <div className="flex justify-between items-center"><span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Date & Time</span><div className="text-right"><span className="font-bold text-gray-900 block text-base md:text-lg">{new Date(selectedDate).toDateString()}</span><span className="text-hospital-600 font-bold bg-white px-2 py-1 rounded shadow-sm inline-block mt-1 text-sm">{selectedTime}</span></div></div>
               </div>
            </div>
          )}

          {/* Step 3 Success */}
          {currentStep === 3 && (
            <div className="text-center animate-fade-in py-8">
                <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce">
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Your appointment has been successfully scheduled. You can add it to your calendar below.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                    <button onClick={() => handleAddToCalendar('google')} className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm hover:shadow-md hover:border-hospital-200 group text-sm"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-5 h-5 mr-3 group-hover:scale-110 transition" />Google Calendar</button>
                    <button onClick={() => handleAddToCalendar('ics')} className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm hover:shadow-md hover:border-hospital-200 group text-sm"><svg className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Outlook / iCal</button>
                </div>
                <button onClick={() => navigate('/dashboard')} className="px-10 py-3 bg-hospital-600 text-white rounded-xl font-bold hover:bg-hospital-700 shadow-lg shadow-hospital-500/30 transition transform hover:-translate-y-0.5 w-full md:w-auto">Go to Dashboard</button>
            </div>
          )}

          {currentStep < 3 && (
            <div className="mt-10 flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
               <button onClick={handleBack} disabled={currentStep === 0 || submitting} className={`px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition text-sm w-full sm:w-auto ${currentStep === 0 ? 'invisible' : ''}`}>&larr; Back</button>
               {currentStep === 2 ? (
                 <button onClick={handleSubmit} disabled={submitting} className="px-8 md:px-10 py-3 bg-hospital-600 text-white rounded-xl font-bold hover:bg-hospital-700 disabled:opacity-50 shadow-lg shadow-hospital-500/30 transition transform hover:-translate-y-0.5 text-sm w-full sm:w-auto">{submitting ? 'Processing...' : (isEditMode ? 'Update Appointment' : 'Confirm Booking')}</button>
               ) : (
                 <button onClick={handleNext} disabled={checkingSlot} className="px-8 md:px-10 py-3 bg-hospital-600 text-white rounded-xl font-bold hover:bg-hospital-700 shadow-lg shadow-hospital-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center text-sm w-full sm:w-auto">{checkingSlot ? 'Checking...' : 'Next Step'} {!checkingSlot && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>}</button>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
