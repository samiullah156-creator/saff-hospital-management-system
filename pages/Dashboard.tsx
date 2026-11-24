
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { User, Appointment, AppointmentStatus } from '../types';

type SortKey = 'date' | 'time' | 'doctorName';
type SortDirection = 'asc' | 'desc';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState('');
  
  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: 'asc' });

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // State for managing which calendar dropdown is open
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  // To-Do List State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = dbService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      
      const userAppointments = await dbService.getAppointments(currentUser.id);
      setAppointments(userAppointments);
      setLoading(false);

      // Load Todos from Local Storage
      const savedTodos = localStorage.getItem(`saff_todos_${currentUser.id}`);
      if (savedTodos) {
        try {
            setTodos(JSON.parse(savedTodos));
        } catch (e) {
            console.error("Failed to load todos", e);
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const saveTodos = (updatedTodos: Todo[]) => {
      setTodos(updatedTodos);
      if (user) {
          localStorage.setItem(`saff_todos_${user.id}`, JSON.stringify(updatedTodos));
      }
  };

  const addTodo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodoText.trim()) return;

      // Date Validation
      if (newDueDate) {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          const todayString = `${year}-${month}-${day}`;

          if (newDueDate < todayString) {
              alert("Due date cannot be in the past.");
              return;
          }
      }
      
      const item: Todo = { 
          id: Date.now().toString(), 
          text: newTodoText.trim(), 
          completed: false,
          priority: newPriority,
          dueDate: newDueDate || undefined
      };
      
      saveTodos([item, ...todos]);
      // Reset form
      setNewTodoText('');
      setNewPriority('Medium');
      setNewDueDate('');
  };

  const toggleTodo = (id: string) => {
      const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
      const updated = todos.filter(t => t.id !== id);
      saveTodos(updated);
  };

  const clearCompletedTodos = () => {
      const updated = todos.filter(t => !t.completed);
      saveTodos(updated);
  };

  const handleAiSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(aiQuery.trim()) {
          navigate('/ai-assistant', { state: { initialQuery: aiQuery } });
      }
  };

  const handleAddToCalendar = (app: Appointment, type: 'google' | 'ics') => {
      const start = new Date(app.date);
      const [timeStr, modifier] = app.time.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      start.setHours(hours, minutes, 0);
      
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
      
      const title = `Appointment with Dr. ${app.doctorName}`;
      const details = `Reason: ${app.reason || 'Checkup'}\nNotes: ${app.notes || ''}`;
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
          link.setAttribute('download', `appointment_${app.id}.ics`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
      setCalendarOpen(null);
  };

  const openCancelModal = (appId: string) => {
      setSelectedAppId(appId);
      setCancelReason('');
      setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
      if (!selectedAppId || !cancelReason.trim()) return;
      
      await dbService.cancelAppointment(selectedAppId, cancelReason);
      
      // Update local state
      const updated = await dbService.getAppointments(user!.id);
      setAppointments(updated);
      
      setCancelModalOpen(false);
      setSelectedAppId(null);
  };

  const getFilteredAndSortedAppointments = () => {
      let filtered = appointments;
      
      if (filterStatus !== 'All') {
          filtered = filtered.filter(a => a.status === filterStatus);
      }

      return filtered.sort((a, b) => {
          let valA: any = a[sortConfig.key];
          let valB: any = b[sortConfig.key];

          if (sortConfig.key === 'date' || sortConfig.key === 'time') {
             if (sortConfig.key === 'time') {
                 const dateA = new Date(`${a.date} ${a.time}`);
                 const dateB = new Date(`${b.date} ${b.time}`);
                 return sortConfig.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
             }
             valA = new Date(a.date).getTime();
             valB = new Date(b.date).getTime();
          } else {
             valA = valA.toString().toLowerCase();
             valB = valB.toString().toLowerCase();
          }

          if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  };

  const processedAppointments = getFilteredAndSortedAppointments();

  const getTaskStyles = (priority: string) => {
      switch(priority) {
          case 'High': return 'bg-red-50 border-l-4 border-red-500';
          case 'Medium': return 'bg-orange-50 border-l-4 border-orange-500';
          case 'Low': return 'bg-green-50 border-l-4 border-green-500';
          default: return 'bg-white border-l-4 border-gray-200';
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600 font-bold">Loading Dashboard...</div>;

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in" onClick={() => setCalendarOpen(null)}>
      {/* Page Hero */}
      <div className="bg-teal-900 relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600" alt="Dashboard" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="relative shrink-0 group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
                 <img 
                   src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D9488&color=fff`} 
                   alt={user?.name} 
                   className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-teal-900 shadow-2xl object-cover" 
                 />
                 <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-teal-900 rounded-full z-20"></div>
              </div>

              {/* Text Section */}
              <div className="text-center md:text-left flex-1">
                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 tracking-tight drop-shadow-md">
                    Patient Dashboard
                 </h1>
                 <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 mb-6">
                    <p className="text-teal-100 text-lg">
                       Welcome back, <span className="font-bold text-white border-b border-teal-500/50 pb-0.5">{user?.name}</span>
                    </p>
                    {user?.id && (
                        <p className="text-teal-200/80 text-xs font-medium bg-teal-800/50 px-3 py-1 rounded-full border border-teal-700 uppercase tracking-wider">
                           ID: <span className="font-mono text-teal-100">{user.id.substring(0,8)}</span>
                        </p>
                    )}
                 </div>

                 {/* Action Buttons */}
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Link to="/profile/edit" className="flex items-center px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full backdrop-blur-md transition border border-white/10 hover:border-white/30 group shadow-lg">
                       <svg className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                       Edit Profile
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
         
         {/* Quick Actions AI Bar */}
         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
             <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                     <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="AI" className="w-8 h-8" />
                 </div>
                 <div>
                     <h3 className="font-bold text-gray-900">Consult Dr. AI</h3>
                     <p className="text-xs text-gray-500">Ask about symptoms or reports</p>
                 </div>
             </div>
             <form onSubmit={handleAiSearch} className="flex-1 w-full relative">
                 <input 
                    type="text" 
                    placeholder="e.g. What do my blood test results mean?" 
                    className="w-full pl-5 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                 />
                 <button type="submit" className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                 </button>
             </form>
         </div>

         <div className="grid lg:grid-cols-3 gap-8">
             
             {/* Left Column: Appointments */}
             <div className="lg:col-span-2 space-y-8">
                 
                 {/* Appointments List */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-visible">
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                         <h2 className="text-xl font-bold text-gray-900 font-serif">My Appointments</h2>
                         <Link to="/appointment/new" className="text-teal-600 text-sm font-bold hover:underline bg-teal-50 px-3 py-1 rounded-full">+ Book New</Link>
                     </div>

                     {/* Filters & Sorting */}
                     <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                         <div className="flex-1 min-w-[140px]">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                             <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                             >
                                 <option value="All">All Statuses</option>
                                 <option value={AppointmentStatus.PENDING}>Pending</option>
                                 <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
                                 <option value={AppointmentStatus.COMPLETED}>Completed</option>
                                 <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
                             </select>
                         </div>
                         <div className="flex-1 min-w-[140px]">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Sort By</label>
                             <select 
                                value={sortConfig.key} 
                                onChange={(e) => setSortConfig({...sortConfig, key: e.target.value as any})}
                                className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                             >
                                 <option value="date">Date</option>
                                 <option value="time">Time</option>
                                 <option value="doctorName">Doctor</option>
                             </select>
                         </div>
                         <div className="flex-none flex items-end">
                             <button 
                                onClick={() => setSortConfig({...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}
                                className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition"
                                title={sortConfig.direction === 'asc' ? "Ascending" : "Descending"}
                             >
                                {sortConfig.direction === 'asc' ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" /></svg>
                                )}
                             </button>
                         </div>
                     </div>
                     
                     {processedAppointments.length > 0 ? (
                         <div className="space-y-4">
                             {processedAppointments.map(app => (
                                 <div key={app.id} className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-200 hover:shadow-md transition relative group">
                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                                         <div className="flex items-start gap-4">
                                             <div className="bg-teal-50 p-3 rounded-lg border border-teal-100 text-center min-w-[70px]">
                                                 <span className="block text-xs font-bold text-gray-400 uppercase">{new Date(app.date).toLocaleDateString('en-US', {month:'short'})}</span>
                                                 <span className="block text-2xl font-bold text-teal-700">{new Date(app.date).getDate()}</span>
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-gray-900">Dr. {app.doctorName}</h3>
                                                 <p className="text-sm text-gray-600">{app.doctorSpecialty}</p>
                                                 <div className="flex items-center text-xs text-gray-500 mt-1">
                                                     <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                     {app.time}
                                                 </div>
                                             </div>
                                         </div>
                                         <div className="flex items-center gap-3 mt-3 sm:mt-0 justify-between sm:justify-end">
                                             <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                 app.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 
                                                 app.status === AppointmentStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                                                 app.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-700' : 
                                                 'bg-blue-100 text-blue-700'
                                             }`}>{app.status}</span>
                                             
                                             <div className="flex items-center">
                                                {/* Add to Calendar Button */}
                                                <div className="relative">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCalendarOpen(calendarOpen === app.id ? null : app.id); }}
                                                        className={`p-2 rounded-full hover:bg-teal-50 transition ${calendarOpen === app.id ? 'text-teal-600 bg-teal-50' : 'text-gray-400'}`}
                                                        title="Add to Calendar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    </button>
                                                    {calendarOpen === app.id && (
                                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in origin-top-right">
                                                            <div className="py-1">
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleAddToCalendar(app, 'google'); }}
                                                                    className="flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-teal-700 font-medium"
                                                                >
                                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="G" className="w-4 h-4 mr-2" />
                                                                    Google Calendar
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleAddToCalendar(app, 'ics'); }}
                                                                    className="flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-teal-700 font-medium"
                                                                >
                                                                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"/></svg>
                                                                    Outlook / iCal
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {(app.status === AppointmentStatus.PENDING || app.status === AppointmentStatus.CONFIRMED) && (
                                                    <div className="flex">
                                                        <button 
                                                            onClick={() => navigate('/appointment/new', { state: { editMode: true, appointment: app } })} 
                                                            className="p-2 text-gray-400 hover:text-teal-600 transition" 
                                                            title="Edit Appointment"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => openCancelModal(app.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 transition"
                                                            title="Cancel Appointment"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                                        </button>
                                                    </div>
                                                )}
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Details Row */}
                                     <div className="border-t border-gray-100 pt-3 mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
                                         {app.reason && (
                                             <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                                                 <strong className="mr-1">Reason:</strong> {app.reason}
                                             </span>
                                         )}
                                         {app.dueDate && (
                                             <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                 <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                 <strong className="mr-1">Due:</strong> {new Date(app.dueDate).toLocaleDateString()}
                                             </span>
                                         )}
                                         {app.notes && (
                                             <span className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                                                 <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                                 <strong className="mr-1">Note:</strong> {app.notes}
                                             </span>
                                         )}
                                         {app.cancellationReason && (
                                             <span className="flex items-center bg-red-50 text-red-700 px-2 py-1 rounded w-full mt-1">
                                                 <strong className="mr-1">Cancelled:</strong> {app.cancellationReason}
                                             </span>
                                         )}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ) : (
                         <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                             <p className="text-gray-500 mb-4">No appointments found.</p>
                             <Link to="/appointment/new" className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition">Schedule Now</Link>
                         </div>
                     )}
                 </div>
             </div>

             {/* Right Column: Quick Links & Status */}
             <div className="space-y-8">
                 {/* Quick Links Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                     <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <Link to="/reports" className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-center group">
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 mb-2 shadow-sm group-hover:scale-110 transition">
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                             </div>
                             <span className="text-xs font-bold text-blue-800">Lab Reports</span>
                         </Link>
                         <Link to="/doctors" className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-center group">
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 mb-2 shadow-sm group-hover:scale-110 transition">
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                             </div>
                             <span className="text-xs font-bold text-purple-800">Find Doctor</span>
                         </Link>
                         <Link to="/feedback" className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition text-center group">
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-yellow-600 mb-2 shadow-sm group-hover:scale-110 transition">
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                             </div>
                             <span className="text-xs font-bold text-yellow-800">Feedback</span>
                         </Link>
                         <Link to="/contact" className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition text-center group">
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 mb-2 shadow-sm group-hover:scale-110 transition">
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                             </div>
                             <span className="text-xs font-bold text-red-800">Contact Us</span>
                         </Link>
                     </div>
                 </div>

                 {/* Vitals Summary Card */}
                 <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl -mr-10 -mt-10"></div>
                     <h3 className="font-bold text-lg mb-4 flex items-center">
                         <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                         Health Vitals
                     </h3>
                     <div className="space-y-4 relative z-10">
                         <div className="flex justify-between items-center border-b border-white/20 pb-2">
                             <span className="text-teal-100 text-sm">Blood Pressure</span>
                             <span className="font-bold">120/80</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-white/20 pb-2">
                             <span className="text-teal-100 text-sm">Heart Rate</span>
                             <span className="font-bold">72 bpm</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-teal-100 text-sm">Weight</span>
                             <span className="font-bold">70 kg</span>
                         </div>
                     </div>
                     <button onClick={() => navigate('/ai-assistant')} className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg transition backdrop-blur-md">Update Log</button>
                 </div>

                 {/* Health To-Do List Card (ENHANCED) */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-sm font-bold">✓</span>
                        Health To-Do List
                    </h3>
                    
                    <form onSubmit={addTodo} className="mb-6">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Add a new task (e.g. Morning Meds)" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <select 
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value as any)}
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            >
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="Low">Low Priority</option>
                            </select>
                            <input 
                                type="date"
                                value={newDueDate}
                                onChange={(e) => setNewDueDate(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-2 focus:ring-purple-500 outline-none flex-1"
                            />
                            <button 
                                type="submit" 
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newTodoText.trim()}
                            >
                                Add
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                        {todos.length === 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                <p>No tasks yet.</p>
                                <p className="text-xs mt-1">Stay organized with your health goals.</p>
                            </div>
                        )}
                        {todos.map(todo => (
                            <div key={todo.id} className={`group flex items-start justify-between p-3 rounded-xl transition animate-fade-in ${getTaskStyles(todo.priority)}`}>
                                <div className="flex items-start gap-3 overflow-hidden flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                                    <button 
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${todo.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300 hover:border-purple-400 bg-white'}`}
                                    >
                                        {todo.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm truncate transition-all duration-200 ${todo.completed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800 font-medium'}`}>
                                            {todo.text}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded border bg-white border-gray-200 text-gray-600 font-semibold">
                                                {todo.priority}
                                            </span>
                                            {todo.dueDate && (
                                                <span className="text-[10px] text-gray-500 flex items-center bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    {new Date(todo.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    title="Delete Task"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    {todos.some(t => t.completed) && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={clearCompletedTodos} 
                                className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                Clear Completed
                            </button>
                        </div>
                    )}
                 </div>
             </div>
         </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                  <button 
                    onClick={() => setCancelModalOpen(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                  >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <h3 className="text-xl font-bold text-red-600 mb-2">Cancel Appointment</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide a reason for cancellation. This will be recorded.</p>
                  
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none mb-4"
                    rows={4}
                    placeholder="Reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  ></textarea>

                  <div className="flex gap-3">
                      <button 
                        onClick={() => setCancelModalOpen(false)} 
                        className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition"
                      >
                          Keep Appointment
                      </button>
                      <button 
                        onClick={handleConfirmCancel}
                        disabled={!cancelReason.trim()}
                        className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          Confirm Cancel
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
