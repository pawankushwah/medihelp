import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SideNavBar = ({ onAddRecordClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'patient';
  const name = localStorage.getItem('name') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const getDashboardPath = () => {
    if (role === 'patient') return '/patient';
    if (role === 'doctor') return '/doctor';
    return '/institution';
  };

  const roleLabel = role === 'patient' 
    ? 'Patient Account' 
    : role === 'doctor' 
      ? 'Healthcare Provider' 
      : 'Medical Institution';

  return (
    <aside className="h-full w-64 fixed left-0 top-0 flex flex-col py-lg px-md bg-surface-container-lowest border-r border-outline-variant z-50">
      <div className="mb-xl px-sm">
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
            onClick={() => navigate(role === 'patient' ? '/patient' : '/doctor')}
            className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="font-body-md text-body-md">Health Records</span>
          </button>
        )}

        {/* Patient Search (Doctor & Institution see this) */}
        {role !== 'patient' && (
          <button 
            onClick={() => navigate(role === 'doctor' ? '/doctor' : '/institution')}
            className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined">person_search</span>
            <span className="font-body-md text-body-md">{role === 'doctor' ? 'Patient Search' : 'Blood Donors'}</span>
          </button>
        )}

        {/* Profile Link */}
        <button 
          onClick={() => navigate(getDashboardPath())}
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
          onClick={() => navigate(getDashboardPath())}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;
