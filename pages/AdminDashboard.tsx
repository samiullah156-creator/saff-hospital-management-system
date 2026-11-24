
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Appointment, User, Role, InventoryItem, Invoice, Doctor, AppointmentStatus } from '../types';
import { geminiService } from '../services/geminiService';
import { ProfessionalLogo } from '../components/Layout';

type Tab = 'dashboard' | 'patients' | 'appointments' | 'billing' | 'inventory' | 'staff' | 'ai';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [remindersLoading, setRemindersLoading] = useState(false);

  // Modal States
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState<{name: string, age: string, gender: string, phone: string, status: string}>({ name: '', age: '', gender: 'Male', phone: '', status: 'Outpatient' });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingPatient, setEditingPatient] = useState<User | null>(null);

  // AI State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{role: string, text: string}[]>([
      {role: 'model', text: 'Hello Admin. I am your CRM Assistant. Ask me to summarize patient data, check stock, or draft announcements.'}
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
        const u = dbService.getCurrentUser();
        if (!u || u.role !== Role.ADMIN) {
            navigate('/login');
            return;
        }
        setCurrentUser(u);
        await loadData();
    };
    checkUser();
  }, [navigate]);

  const loadData = async () => {
      const [apps, inv, invs, docs, users] = await Promise.all([
          dbService.getAllAppointments(),
          dbService.getInventory(),
          dbService.getInvoices(),
          dbService.getDoctors(),
          dbService.getAllUsers()
      ]);
      
      setAppointments(apps.reverse());
      setInventory(inv);
      setInvoices(invs);
      setDoctors(docs);
      setPatients(users.filter(u => u.role === Role.PATIENT));
      setLoading(false);
  };

  // --- Handlers ---

  const handleStockUpdate = async (id: number, change: number) => {
      await dbService.updateStock(id, change);
      const updated = await dbService.getInventory();
      setInventory(updated);
  };

  const handleUpdateInventoryItem = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingItem) return;
      
      await dbService.updateInventoryItem(editingItem);
      const updated = await dbService.getInventory();
      setInventory(updated);
      setEditingItem(null);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      await dbService.createInvoice({
          patientName: formData.get('patientName') as string,
          service: formData.get('service') as string,
          amount: Number(formData.get('amount')),
          status: 'Pending'
      });
      const updated = await dbService.getInvoices();
      setInvoices(updated);
      form.reset();
      alert("Invoice Created!");
  };

  const handleAddPatient = async (e: React.FormEvent) => {
      e.preventDefault();
      await dbService.addPatient({
          name: newPatient.name,
          age: Number(newPatient.age),
          gender: newPatient.gender,
          phone: newPatient.phone,
          status: newPatient.status
      });
      const updatedUsers = await dbService.getAllUsers();
      setPatients(updatedUsers.filter(u => u.role === Role.PATIENT));
      setShowAddPatient(false);
      setNewPatient({ name: '', age: '', gender: 'Male', phone: '', status: 'Outpatient' });
  };

  const handleDeletePatient = async (id: string) => {
      if (confirm('Are you sure you want to delete this patient record? This action cannot be undone.')) {
          await dbService.deleteUser(id);
          const updatedUsers = await dbService.getAllUsers();
          setPatients(updatedUsers.filter(u => u.role === Role.PATIENT));
      }
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingPatient) return;
      
      await dbService.updateUser(editingPatient);
      const updatedUsers = await dbService.getAllUsers();
      setPatients(updatedUsers.filter(u => u.role === Role.PATIENT));
      setEditingPatient(null);
  };

  const handleSendReminder = async (appId: string, method: 'SMS' | 'EMAIL') => {
      if(confirm(`Send ${method} reminder to patient?`)) {
          await dbService.sendReminder(appId, method);
          alert(`${method} reminder sent successfully!`);
      }
  };

  const handleBatchReminders = async () => {
      setRemindersLoading(true);
      try {
          const result = await dbService.sendBatchReminders();
          alert(`Successfully sent ${result.count} reminders for appointments on ${result.date}.`);
      } catch (e) {
          alert("Failed to process reminders.");
      } finally {
          setRemindersLoading(false);
      }
  };

  const handleAiSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!aiInput.trim()) return;
      
      const userMsg = aiInput;
      setAiMessages(prev => [...prev, {role: 'user', text: userMsg}]);
      setAiInput('');
      setAiLoading(true);

      const context = `
      You are a Hospital Admin Assistant.
      Current Data:
      - Patients: ${patients.length}
      - Appointments Today: ${appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
      - Low Stock: ${inventory.filter(i => i.stock < 20).map(i => i.name).join(', ')}
      - Revenue: ${invoices.reduce((acc, curr) => acc + curr.amount, 0)} PKR
      
      User Query: ${userMsg}
      Keep answer professional and concise.
      `;

      try {
          const response = await geminiService.askAdminAssistant(context);
          setAiMessages(prev => [...prev, {role: 'model', text: response}]);
      } catch (e) {
          setAiMessages(prev => [...prev, {role: 'model', text: "System Error. Please try again."}]);
      } finally {
          setAiLoading(false);
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-teal-900 text-teal-200 font-bold">Loading CRM Dashboard...</div>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
        
        {/* Sidebar - Changed from slate-900 to teal-900 */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-teal-900 text-white transition-all duration-300 flex flex-col border-r border-teal-800 shrink-0 z-20`}>
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center border-b border-teal-800">
                <div className="flex items-center gap-3" onClick={() => navigate('/')}>
                    <ProfessionalLogo size="w-10 h-10" color="#2DD4BF" />
                    {sidebarOpen && (
                        <div>
                            <h1 className="font-bold text-lg leading-tight tracking-tight">Saff Hospital</h1>
                            <p className="text-xs text-teal-400">CRM v2.0</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                    { id: 'patients', label: 'Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { id: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                    { id: 'staff', label: 'Doctors', icon: 'M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z' },
                    { id: 'billing', label: 'Billing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { id: 'inventory', label: 'Pharmacy / Inv', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
                    { id: 'ai', label: 'AI Assistant', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center px-6 py-3 transition-colors duration-200 group ${activeTab === item.id ? 'bg-teal-800 text-teal-300 border-r-4 border-teal-500' : 'text-teal-100 hover:bg-teal-800 hover:text-white'}`}
                    >
                        <svg className={`w-6 h-6 shrink-0 transition ${activeTab === item.id ? 'text-teal-300' : 'text-teal-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                        {sidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Bottom Panel */}
            <div className="p-4 border-t border-teal-800">
                <button onClick={() => navigate('/')} className="flex items-center text-teal-300 hover:text-white w-full group">
                    <svg className="w-5 h-5 group-hover:text-teal-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {sidebarOpen && <span className="ml-3 text-sm font-medium">Exit Dashboard</span>}
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm shrink-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-teal-600 mr-4 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab} Overview</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">{currentUser?.name}</p>
                        <p className="text-xs text-slate-500 uppercase">Administrator</p>
                    </div>
                    <div className="w-10 h-10 bg-teal-800 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-200 shadow-sm">
                        {currentUser?.name?.charAt(0) || 'A'}
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
                
                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Patients', val: patients.length, icon: 'users', color: 'bg-teal-500', trend: '+12%' },
                                { label: 'Appointments', val: appointments.length, icon: 'calendar', color: 'bg-blue-500', trend: '+5%' },
                                { label: 'Revenue (PKR)', val: invoices.reduce((a,c)=>a+c.amount,0).toLocaleString(), icon: 'cash', color: 'bg-indigo-500', trend: '+8%' },
                                { label: 'Low Stock', val: inventory.filter(i=>i.stock<20).length, icon: 'alert', color: 'bg-red-500', trend: 'Alert' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-slate-800">{stat.val}</h3>
                                        <span className={`text-xs font-bold mt-2 inline-block ${stat.trend === 'Alert' ? 'text-red-500' : 'text-green-500'}`}>{stat.trend} from last month</span>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-gray-200 text-xl`}>
                                        {i===0 && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                                        {i===1 && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
                                        {i===2 && <span className="font-serif">₨</span>}
                                        {i===3 && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800">Recent Appointments</h3>
                                    <button onClick={() => setActiveTab('appointments')} className="text-teal-600 text-sm font-bold hover:underline">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {appointments.slice(0, 4).map((app) => (
                                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                                                    {app.patientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-700 text-sm">{app.patientName}</h4>
                                                    <p className="text-xs text-gray-500">with {app.doctorName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-600">{app.time}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${app.status==='CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-teal-900 p-6 rounded-2xl text-white relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Admin AI Insights</h3>
                                    <p className="text-teal-100 text-sm mb-6 leading-relaxed">
                                        Dr. Ayesha's slots are 90% booked for next week. Consider opening Saturday slots.
                                        Also, 'Panadol Extra' stock is critically low.
                                    </p>
                                    <button onClick={() => setActiveTab('ai')} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-lg transition text-sm">
                                        Ask AI Assistant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PATIENTS TAB */}
                {activeTab === 'patients' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Patient Records</h3>
                            <button onClick={() => setShowAddPatient(true)} className="bg-teal-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-teal-800 transition flex items-center shadow-lg">
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                                Add Patient
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Age / Gender</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {patients.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-mono text-xs text-gray-400">#{p.id.substring(0,6)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{p.age} / {p.gender}</td>
                                            <td className="p-4 text-gray-600">{p.phone || 'N/A'}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Admitted' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => setEditingPatient(p)} className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded transition mr-2" title="Edit Patient">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDeletePatient(p.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* INVENTORY TAB */}
                {activeTab === 'inventory' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Pharmacy & Inventory</h3>
                                <p className="text-sm text-gray-500">Manage medicine stocks and supplies.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Low Stock: {inventory.filter(i=>i.stock<20).length}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {inventory.map(item => (
                                <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition relative group">
                                    <button 
                                      onClick={() => setEditingItem(item)} 
                                      className="absolute top-4 right-4 p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition opacity-0 group-hover:opacity-100"
                                      title="Edit Item"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    
                                    <div className="flex justify-between items-start mb-4 pr-10">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.category}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : item.stock < 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-slate-700">{item.stock}</p>
                                            <p className="text-xs text-gray-400">{item.unit}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStockUpdate(item.id, -10)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold transition flex items-center justify-center">-</button>
                                            <button onClick={() => handleStockUpdate(item.id, 10)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-teal-100 text-gray-600 hover:text-teal-600 font-bold transition flex items-center justify-center">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BILLING TAB */}
                {activeTab === 'billing' && (
                    <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">New Invoice</h3>
                            <form onSubmit={handleCreateInvoice} className="space-y-4">
                                <input name="patientName" required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Patient Name" />
                                <input name="service" required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Service (e.g. Checkup)" />
                                <input name="amount" type="number" required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Amount (PKR)" />
                                <button className="w-full bg-teal-900 text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition shadow-lg">Generate Invoice</button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                                <button className="text-teal-600 text-xs font-bold hover:underline">Export CSV</button>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="p-4">Invoice ID</th>
                                        <th className="p-4">Patient</th>
                                        <th className="p-4">Service</th>
                                        <th className="p-4 text-right">Amount</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.map(inv => (
                                        <tr key={inv.id}>
                                            <td className="p-4 font-mono text-xs text-gray-400">{inv.id}</td>
                                            <td className="p-4 font-bold text-slate-700">{inv.patientName}</td>
                                            <td className="p-4 text-gray-600">{inv.service}</td>
                                            <td className="p-4 text-right font-bold text-slate-800">Rs {inv.amount.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* AI TAB */}
                {activeTab === 'ai' && (
                    <div className="animate-fade-in-up h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">AI</div>
                                <div>
                                    <h3 className="font-bold">Admin Assistant</h3>
                                    <p className="text-xs text-teal-200">Powered by Gemini</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {aiMessages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-teal-800 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {aiLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleAiSend} className="flex gap-3">
                                <input 
                                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="Ask about revenue, patient trends, or draft a report..."
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                />
                                <button type="submit" disabled={aiLoading} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg disabled:opacity-50">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* STAFF & APPOINTMENTS (Reuse existing components logic simply for now) */}
                {activeTab === 'staff' && (
                    <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map(doc => (
                            <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition text-center group">
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:border-teal-100 transition">
                                    <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">{doc.name}</h3>
                                <p className="text-teal-600 text-sm font-medium mb-2">{doc.specialty}</p>
                                <p className="text-xs text-gray-500">{doc.experience} Exp</p>
                                <button className="mt-4 w-full border border-gray-200 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition">View Schedule</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Appointments Management</h3>
                                <p className="text-xs text-gray-500">View and manage all scheduled visits</p>
                            </div>
                            <button 
                                onClick={handleBatchReminders} 
                                disabled={remindersLoading}
                                className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition flex items-center shadow-lg shadow-indigo-500/20 disabled:opacity-70"
                            >
                                {remindersLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Send Daily Reminders
                                    </>
                                )}
                            </button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4">Date & Time</th>
                                    <th className="p-4">Doctor</th>
                                    <th className="p-4">Patient</th>
                                    <th className="p-4">Reason</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-700">{app.date}</div>
                                            <div className="text-xs text-gray-500">{app.time}</div>
                                        </td>
                                        <td className="p-4 text-gray-700">{app.doctorName}</td>
                                        <td className="p-4 font-bold text-slate-700">{app.patientName}</td>
                                        <td className="p-4 text-gray-500 truncate max-w-xs">{app.reason}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleSendReminder(app.id, 'SMS')}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Send SMS Reminder"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleSendReminder(app.id, 'EMAIL')}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    title="Send Email Reminder"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </main>

            {/* Add Patient Modal */}
            {showAddPatient && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Register New Patient</h3>
                        <form onSubmit={handleAddPatient} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input 
                                    required 
                                    placeholder="Full Name" 
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500"
                                    value={newPatient.name}
                                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                                    <input 
                                        required 
                                        type="number" 
                                        placeholder="Age" 
                                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500"
                                        value={newPatient.age}
                                        onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                        value={newPatient.gender}
                                        onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    required 
                                    placeholder="Phone Number" 
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500"
                                    value={newPatient.phone}
                                    onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                    value={newPatient.status}
                                    onChange={e => setNewPatient({...newPatient, status: e.target.value})}
                                >
                                    <option value="Outpatient">Outpatient</option>
                                    <option value="Admitted">Admitted</option>
                                    <option value="Discharged">Discharged</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddPatient(false)} className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Inventory Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Edit Inventory Item</h3>
                        <form onSubmit={handleUpdateInventoryItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                                <input 
                                    value={editingItem.name} 
                                    onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                                    <input 
                                        type="number"
                                        value={editingItem.stock} 
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 0;
                                            let status: any = editingItem.status;
                                            if(val === 0) status = 'Out of Stock';
                                            else if(val < 20) status = 'Low Stock';
                                            else status = 'In Stock';
                                            setEditingItem({...editingItem, stock: val, status});
                                        }}
                                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Unit</label>
                                    <input 
                                        value={editingItem.unit} 
                                        onChange={e => setEditingItem({...editingItem, unit: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <input 
                                    value={editingItem.category} 
                                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select 
                                    value={editingItem.status}
                                    onChange={e => setEditingItem({...editingItem, status: e.target.value as any})}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Patient Modal (Enhanced) */}
            {editingPatient && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Edit Patient Details</h3>
                            <button onClick={() => setEditingPatient(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdatePatient} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input 
                                    value={editingPatient.name}
                                    onChange={e => setEditingPatient({...editingPatient, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition" 
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                                    <input 
                                        type="number"
                                        value={editingPatient.age || ''}
                                        onChange={e => setEditingPatient({...editingPatient, age: parseInt(e.target.value) || 0})}
                                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                                    <select 
                                        value={editingPatient.gender || 'Male'}
                                        onChange={e => setEditingPatient({...editingPatient, gender: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    value={editingPatient.phone || ''}
                                    onChange={e => setEditingPatient({...editingPatient, phone: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select 
                                    value={editingPatient.status || 'Outpatient'}
                                    onChange={e => setEditingPatient({...editingPatient, status: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 bg-white transition"
                                >
                                    <option value="Outpatient">Outpatient</option>
                                    <option value="Admitted">Admitted</option>
                                    <option value="Discharged">Discharged</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingPatient(null)} className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg transition transform hover:-translate-y-0.5">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default AdminDashboard;
