
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { User } from '../types';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const currentUser = dbService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setName(currentUser.name);
    setAvatarUrl(currentUser.avatarUrl || '');
    setPhone(currentUser.phone || '');
    setGender(currentUser.gender || '');
    setLoading(false);
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!window.confirm("Are you sure you want to save these changes?")) {
        return;
    }

    setSaving(true);
    try {
      const updatedUser: User = {
        ...user,
        name,
        avatarUrl: avatarUrl || undefined,
        phone,
        gender,
      };
      
      await dbService.updateUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-hospital-600 font-bold">Loading Profile Editor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative h-64 bg-hospital-900 overflow-hidden">
         <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-30" alt="Profile" />
            <div className="absolute inset-0 bg-gradient-to-r from-hospital-900 to-transparent"></div>
         </div>
         <div className="relative z-10 max-w-4xl mx-auto px-4 h-full flex items-center">
            <h1 className="text-4xl font-serif font-bold text-white">Profile Settings</h1>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row">
             
             {/* Left Panel: Preview */}
             <div className="bg-hospital-50 p-8 md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
                <h3 className="text-hospital-800 font-bold uppercase tracking-widest text-xs mb-6">Preview</h3>
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg overflow-hidden">
                     <img 
                       src={avatarUrl || `https://ui-avatars.com/api/?name=${name || 'User'}&background=0D9488&color=fff`} 
                       alt="Profile Preview" 
                       className="w-full h-full rounded-full object-cover"
                     />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center">{name || 'Your Name'}</h2>
                <p className="text-gray-500 text-sm mt-1">{user.role}</p>
                {phone && <p className="text-gray-500 text-sm mt-1">{phone}</p>}
                {gender && <p className="text-hospital-600 text-xs mt-1 font-bold bg-white px-2 py-0.5 rounded-full border border-hospital-100">{gender}</p>}
                <p className="text-gray-400 text-xs mt-4 break-all text-center px-4">{user.email}</p>
             </div>

             {/* Right Panel: Form */}
             <div className="p-8 md:w-2/3">
                <div className="mb-6">
                   <h2 className="text-2xl font-serif font-bold text-gray-900">Edit Details</h2>
                   <p className="text-gray-500 text-sm">Update your personal information below.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          id="phone"
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                        <div className="relative">
                            <select
                              id="gender"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition bg-white appearance-none"
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                      </div>
                  </div>

                  <div>
                    <label htmlFor="avatar" className="block text-sm font-bold text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex flex-col gap-2">
                       <label className="flex items-center justify-center w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-hospital-500 transition group">
                           <div className="flex flex-col items-center">
                               <svg className="w-6 h-6 text-gray-400 group-hover:text-hospital-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                               <span className="text-sm text-gray-500 group-hover:text-hospital-600">Click to upload image</span>
                           </div>
                           <input
                             id="avatar"
                             type="file"
                             accept="image/*"
                             className="hidden"
                             onChange={handleFileChange}
                           />
                       </label>
                       {avatarUrl && !avatarUrl.includes('ui-avatars.com') && (
                           <p className="text-xs text-green-600 flex items-center">
                               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                               Image selected
                           </p>
                       )}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center space-x-4 border-t border-gray-100 mt-8">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 px-4 bg-hospital-600 text-white rounded-xl font-bold hover:bg-hospital-700 shadow-lg shadow-hospital-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none flex justify-center"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
