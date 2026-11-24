
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import Doctors from './pages/Doctors';
import AiAssistant from './pages/AiAssistant';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import ServicesPage from './pages/ServicesPage';
import DoctorProfile from './pages/DoctorProfile';
import Gallery from './pages/Gallery';
import BlogPage from './pages/BlogPage';
import BlogPostDetail from './pages/BlogPostDetail';
import OnlineReports from './pages/OnlineReports';
import Careers from './pages/Careers';
import Feedback from './pages/Feedback';
import InternationalPatients from './pages/InternationalPatients';
import VeoStudio from './pages/VeoStudio';
import LiveConsultation from './pages/LiveConsultation';
import AmbulanceService from './pages/AmbulanceService';
import Developer from './pages/Developer';

const App: React.FC = () => {
  // Future flags configuration for React Router v7
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  return (
    <HashRouter {...({ future: futureFlags } as any)}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/appointment/new" element={<AppointmentBooking />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/live-consultation" element={<LiveConsultation />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          
          {/* New Feature Routes */}
          <Route path="/reports" element={<OnlineReports />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/international" element={<InternationalPatients />} />
          <Route path="/veo-studio" element={<VeoStudio />} />
          <Route path="/ambulance" element={<AmbulanceService />} />
          
          {/* Developer Page */}
          <Route path="/developer" element={<Developer />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
