import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Doctor } from '../types';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getDoctors();
      setDoctors(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-20 text-center">Loading Doctors...</div>;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Our Medical Specialists</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the expert team at Saff Hospital Rahim Yar Khan, dedicated to providing the best healthcare services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="inline-block bg-hospital-600 text-white text-xs px-2 py-1 rounded-md mb-1">{doc.specialty}</span>
                  <h3 className="text-white text-xl font-bold">{doc.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-5 h-5 mr-2 text-hospital-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Experience: {doc.experience}</span>
                </div>
                <div className="mb-6">
                   <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Availability:</h4>
                   <div className="flex flex-wrap gap-2">
                     {doc.availability.map((day) => (
                       <span key={day} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{day}</span>
                     ))}
                   </div>
                </div>
                <Link 
                  to="/appointment/new"
                  className="block w-full text-center bg-hospital-600 hover:bg-hospital-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
