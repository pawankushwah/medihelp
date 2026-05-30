import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' or 'register'
  const [role, setRole] = useState('patient'); // 'patient', 'doctor', 'institution'
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');

  // Patient profile fields
  const [bloodType, setBloodType] = useState('O+');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [isAvailableToDonate, setIsAvailableToDonate] = useState(false);

  // Doctor profile fields
  const [specialization, setSpecialization] = useState('');
  const [availabilitySlots, setAvailabilitySlots] = useState({
    mornings: false,
    afternoons: false,
    evenings: false,
    weekends: false,
  });

  // Institution profile fields
  const [institutionType, setInstitutionType] = useState('Hospital');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRoleSelection = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  const handleAvailabilityChange = (key) => {
    setAvailabilitySlots(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'signin') {
        const response = await api.post('/auth/login', {
          email,
          password
        });

        if (response.data.status === 'success') {
          const { token, role, name, email: userEmail, _id } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('name', name);
          localStorage.setItem('email', userEmail);
          localStorage.setItem('userId', _id);

          setSuccessMsg('Logged in successfully!');
          setTimeout(() => {
            if (role === 'patient') navigate('/patient');
            else if (role === 'doctor') navigate('/doctor');
            else if (role === 'institution') navigate('/institution');
          }, 800);
        }
      } else {
        // Register mode
        const payload = {
          name,
          email,
          phone,
          city,
          password,
          role
        };

        if (role === 'patient') {
          payload.patientProfile = {
            bloodType,
            isAvailableToDonate,
            lastDonationDate: lastDonationDate || null
          };
        } else if (role === 'doctor') {
          // Construct availability slots string from checkboxes
          const slots = [];
          if (availabilitySlots.mornings) slots.push("Mornings (8-12)");
          if (availabilitySlots.afternoons) slots.push("Afternoons (12-16)");
          if (availabilitySlots.evenings) slots.push("Evenings (16-20)");
          if (availabilitySlots.weekends) slots.push("Weekends");
          
          payload.doctorProfile = {
            specialization,
            availabilitySlots: slots.join(", ") || "By appointment"
          };
        } else if (role === 'institution') {
          // Map to correct capitalization expected by backend enum (Hospital, Clinic)
          let mappedType = "Hospital";
          if (institutionType === "Public Hospital") mappedType = "Hospital";
          else if (institutionType === "Private Clinic" || institutionType === "Clinic") mappedType = "Clinic";
          else if (institutionType === "Research Lab" || institutionType === "Diagnostic Center") mappedType = "Hospital"; // fallback

          payload.institutionProfile = {
            institutionType: mappedType,
            registrationNumber
          };
        }

        const response = await api.post('/auth/register', payload);

        if (response.data.status === 'success') {
          setSuccessMsg('Account created successfully! Redirecting...');
          
          // Log user in directly using token from registration response
          const { token, role: userRole } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('role', userRole);
          localStorage.setItem('name', name);
          localStorage.setItem('email', email);

          setTimeout(() => {
            if (userRole === 'patient') navigate('/patient');
            else if (userRole === 'doctor') navigate('/doctor');
            else if (userRole === 'institution') navigate('/institution');
          }, 1200);
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Authentication failed. Please verify your details.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-md md:p-xl min-h-screen medical-pattern">
      <div className="w-full max-w-[600px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_8px_24px_rgba(0,61,155,0.04)] overflow-hidden my-lg">
        {/* Header Section */}
        <div className="p-lg bg-surface border-b border-outline-variant flex flex-col items-center text-center">
          <div className="mb-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[32px]">health_and_safety</span>
            <h1 className="font-headline-sm text-headline-sm text-primary">Medihelp</h1>
          </div>
          <p class="font-body-md text-on-surface-variant max-w-[400px]">Secure access to modern clinical data management and patient care services.</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex border-b border-outline-variant">
          <button 
            type="button"
            className={`flex-1 py-md font-label-md text-label-md border-r border-outline-variant transition-colors hover:bg-surface-container-high ${
              mode === 'signin' ? 'bg-surface-container text-primary font-bold' : 'text-on-surface-variant'
            }`} 
            onClick={() => handleModeSwitch('signin')}
          >
            SIGN IN
          </button>
          <button 
            type="button"
            className={`flex-1 py-md font-label-md text-label-md transition-colors hover:bg-surface-container-high ${
              mode === 'register' ? 'bg-surface-container text-primary font-bold' : 'text-on-surface-variant'
            }`}
            onClick={() => handleModeSwitch('register')}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Role Selector (Only for Register) */}
        {mode === 'register' && (
          <div className="px-lg pt-lg">
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-sm">I AM A...</label>
            <div className="flex gap-sm p-xs bg-surface-container rounded-lg">
              <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-xs py-sm rounded-md transition-all font-label-md text-label-md ${
                  role === 'patient' 
                    ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                onClick={() => handleRoleSelection('patient')}
              >
                <span className="material-symbols-outlined text-[18px]">person</span> Patient
              </button>
              <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-xs py-sm rounded-md transition-all font-label-md text-label-md ${
                  role === 'doctor' 
                    ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                onClick={() => handleRoleSelection('doctor')}
              >
                <span className="material-symbols-outlined text-[18px]">medical_services</span> Doctor
              </button>
              <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-xs py-sm rounded-md transition-all font-label-md text-label-md ${
                  role === 'institution' 
                    ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                onClick={() => handleRoleSelection('institution')}
              >
                <span className="material-symbols-outlined text-[18px]">domain</span> Institution
              </button>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        <div className="px-lg pt-md">
          {errorMsg && (
            <div className="p-md bg-error-container text-on-error-container rounded-lg border border-error/20 font-body-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-md bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg border border-tertiary/20 font-body-sm">
              {successMsg}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          {/* Shared Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {mode === 'register' && (
              <div className="md:col-span-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Full Name</label>
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="Your Name" 
                  type="text"
                />
              </div>
            )}
            
            <div className={mode === 'register' ? 'md:col-span-2' : 'md:col-span-2'}>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Email Address</label>
              <input 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="name@medihelp.org" 
                type="email"
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Phone Number</label>
                  <input 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder="+91 00000 00000" 
                    type="tel"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">City</label>
                  <input 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder="Indore" 
                    type="text"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Password</label>
              <input 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="••••••••" 
                type="password"
              />
            </div>
          </div>

          {/* Dynamic Patient Fields */}
          {mode === 'register' && role === 'patient' && (
            <div className="space-y-md border-t border-outline-variant pt-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className={isAvailableToDonate ? "" : "md:col-span-2"}>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Blood Type</label>
                  <select 
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-container-lowest"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {isAvailableToDonate && (
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Last Donation Date</label>
                    <input 
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                      type="date"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-md bg-secondary-container/10 rounded-lg border border-secondary/20">
                <div>
                  <p className="font-label-md text-label-md text-on-secondary-container">Available for Donation</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Your profile will be visible for emergency blood requests.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    checked={isAvailableToDonate}
                    onChange={(e) => setIsAvailableToDonate(e.target.checked)}
                    className="sr-only peer" 
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          )}

          {/* Dynamic Doctor Fields */}
          {mode === 'register' && role === 'doctor' && (
            <div className="space-y-md border-t border-outline-variant pt-md">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Specialization</label>
                <input 
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="e.g. Cardiology, Neurology" 
                  type="text"
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Weekly Availability Slots</label>
                <div className="grid grid-cols-2 gap-sm">
                  <label className="flex items-center gap-sm p-sm border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input 
                      checked={availabilitySlots.mornings}
                      onChange={() => handleAvailabilityChange('mornings')}
                      className="rounded text-primary focus:ring-primary" 
                      type="checkbox"
                    />
                    <span className="font-body-sm text-body-sm">Mornings (8-12)</span>
                  </label>
                  <label className="flex items-center gap-sm p-sm border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input 
                      checked={availabilitySlots.afternoons}
                      onChange={() => handleAvailabilityChange('afternoons')}
                      className="rounded text-primary focus:ring-primary" 
                      type="checkbox"
                    />
                    <span className="font-body-sm text-body-sm">Afternoons (12-16)</span>
                  </label>
                  <label className="flex items-center gap-sm p-sm border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input 
                      checked={availabilitySlots.evenings}
                      onChange={() => handleAvailabilityChange('evenings')}
                      className="rounded text-primary focus:ring-primary" 
                      type="checkbox"
                    />
                    <span className="font-body-sm text-body-sm">Evenings (16-20)</span>
                  </label>
                  <label className="flex items-center gap-sm p-sm border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input 
                      checked={availabilitySlots.weekends}
                      onChange={() => handleAvailabilityChange('weekends')}
                      className="rounded text-primary focus:ring-primary" 
                      type="checkbox"
                    />
                    <span className="font-body-sm text-body-sm">Weekends</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Institution Fields */}
          {mode === 'register' && role === 'institution' && (
            <div className="space-y-md border-t border-outline-variant pt-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Institution Type</label>
                  <select 
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-surface-container-lowest"
                  >
                    <option>Public Hospital</option>
                    <option>Private Clinic</option>
                    <option>Research Lab</option>
                    <option>Diagnostic Center</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Reg. Number</label>
                  <input 
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder="MD-12345-REG" 
                    type="text"
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-[0_4px_12px_rgba(0,61,155,0.2)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm disabled:opacity-75"
            type="submit"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Processing...
              </>
            ) : (
              'CONTINUE'
            )}
          </button>

          <div className="flex items-center justify-between pt-sm" id="footer-links">
            <a className="text-primary font-label-sm text-label-sm hover:underline" href="#">Forgot password?</a>
            <p className="text-on-surface-variant font-body-sm text-body-sm">Need help? <a className="text-secondary hover:underline" href="#">Contact Support</a></p>
          </div>
        </form>
      </div>

      {/* Visual Accents */}
      <div className="fixed bottom-lg right-lg hidden lg:block opacity-20 pointer-events-none">
        <span className="material-symbols-outlined text-[240px] text-primary">clinical_notes</span>
      </div>
    </main>
  );
};

export default AuthPage;
