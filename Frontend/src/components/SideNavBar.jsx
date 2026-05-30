import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BloodRequestModal from './BloodRequestModal';
import api, { urlBase64ToUint8Array } from '../api';

const SideNavBar = ({ onAddRecordClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'patient';
  const name = localStorage.getItem('name') || 'User';

  const [isBloodModalOpen, setIsBloodModalOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState('');

  const enablePush = async () => {
    try {
        setPushStatus('Requesting Permission...');
        
        if (Notification.permission === 'denied') {
            alert("You have blocked notifications for this site. Please click the site settings icon (usually a lock) next to the URL in your browser and change Notifications to 'Allow'.");
            setPushStatus('Notifications Blocked');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert("Notification permission was denied. If you want to receive alerts, please enable them in your browser settings.");
            setPushStatus('Permission Denied');
            return;
        }

        setPushStatus('Registering Service Worker...');
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        setPushStatus('Fetching VAPID key...');
        const vapidRes = await api.get('/notifications/vapidPublicKey');
        const vapidPublicKey = vapidRes.data.publicKey;

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        setPushStatus('Subscribing to Push...');
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        setPushStatus('Saving to Server...');
        await api.post('/notifications/subscribe', subscription);
        setPushStatus('Notifications Enabled!');
    } catch (error) {
        console.error(error);
        setPushStatus('Error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const getDashboardPath = () => {
    if (role === 'patient') return '/patient';
    if (role === 'doctor') return '/doctor';
    return '/institution';
  };

  const handleNavClick = (id, path) => {
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback for missing elements
        window.scrollBy({ top: 500, behavior: 'smooth' });
      }
    }
  };

  const roleLabel = role === 'patient' 
    ? 'Patient Account' 
    : role === 'doctor' 
      ? 'Healthcare Provider' 
      : 'Medical Institution';

  return (
    <aside className="h-full w-64 fixed left-0 top-0 flex flex-col py-lg px-md bg-surface-container-lowest border-r border-outline-variant z-50">
      <div className="mb-xl px-sm text-left">
        <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Medihelp</h1>
        <p className="text-on-surface-variant font-body-sm capitalize">{roleLabel}</p>
      </div>

      <nav className="flex-1 space-y-xs">
        {/* Dashboard Link */}
        <button 
          onClick={() => navigate(getDashboardPath())}
          className={`w-full flex items-center gap-md px-md py-sm rounded-lg transition-colors text-left ${
            location.pathname === getDashboardPath() 
              ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' 
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-body-md text-body-md">Dashboard</span>
        </button>

        {/* Health Records (Patient & Doctor see this) */}
        {role !== 'institution' && (
          <button 
            onClick={() => handleNavClick('health-records', role === 'patient' ? '/patient' : '/doctor')}
            className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="font-body-md text-body-md">Health Records</span>
          </button>
        )}

        {/* Patient Search (Doctor & Institution see this) */}
        {role !== 'patient' && (
          <button 
            onClick={() => handleNavClick('patient-search', role === 'doctor' ? '/doctor' : '/institution')}
            className={`w-full flex items-center gap-md px-md py-sm rounded-lg transition-colors text-left ${
              location.pathname !== '/live-map' && location.pathname !== '/patient' 
                ? 'text-primary font-bold bg-surface-container-high' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">person_search</span>
            <span className="font-body-md text-body-md">{role === 'doctor' ? 'Patient Search' : 'Blood Donors'}</span>
          </button>
        )}

        {/* Global Live Map Link */}
        <button 
          onClick={() => navigate('/live-map')}
          className={`w-full flex items-center gap-md px-md py-sm rounded-lg transition-colors text-left ${
            location.pathname === '/live-map' 
              ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' 
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined">map</span>
          <span className="font-body-md text-body-md">Live Map</span>
        </button>

        {/* Profile Link */}
        <button 
          onClick={() => handleNavClick('profile', getDashboardPath())}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-body-md text-body-md">Profile</span>
        </button>
      </nav>

      <div className="mt-auto pt-lg border-t border-outline-variant space-y-xs">
        {/* Action Button - Only for Patient (Add record) or Doctor (Create review) */}
        {role === 'patient' && onAddRecordClick && (
          <button 
            onClick={onAddRecordClick}
            className="w-full flex items-center justify-center gap-md px-md py-sm mb-md rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Record
          </button>
        )}

        <button 
          onClick={() => alert('Settings module is currently under development. Stay tuned for future updates!')}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </button>
        <button 
          onClick={enablePush}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-tertiary hover:bg-tertiary-fixed/30 transition-colors text-left font-bold border border-tertiary/20"
        >
          <span className="material-symbols-outlined">{pushStatus.includes('Enabled') ? 'notifications_active' : 'notifications'}</span>
          <span className="font-body-md text-body-md truncate">{pushStatus || 'Enable Notifications'}</span>
        </button>

        <button 
          onClick={() => setIsBloodModalOpen(true)}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-error hover:bg-error-container transition-colors text-left font-bold"
        >
          <span className="material-symbols-outlined">bloodtype</span>
          <span className="font-body-md text-body-md">Request Blood</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left mt-md border-t border-outline-variant pt-md"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </button>
      </div>

      {/* Global Blood Request Modal */}
      <BloodRequestModal 
        isOpen={isBloodModalOpen} 
        onClose={() => setIsBloodModalOpen(false)} 
      />
    </aside>
  );
};

export default SideNavBar;
