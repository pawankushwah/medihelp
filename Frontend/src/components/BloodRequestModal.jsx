import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically set map center if user allows location
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
};

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
};

const BloodRequestModal = ({ isOpen, onClose }) => {
    const [patientName, setPatientName] = useState('');
    const [bloodType, setBloodType] = useState('O+');
    const [quantity, setQuantity] = useState(1);
    const [urgency, setUrgency] = useState('medium');
    const [contactPhone, setContactPhone] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [initialCenter, setInitialCenter] = useState([37.7749, -122.4194]); // Default SF

    useEffect(() => {
        if (isOpen && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setSelectedLocation(latlng);
                    setInitialCenter([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => console.warn('Geolocation blocked or failed.')
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        if (!selectedLocation) {
            setErrorMsg('Please click on the map to select the location for this blood request.');
            setSubmitting(false);
            return;
        }

        const payload = {
            bloodGroupRequired: bloodType,
            priority: urgency,
            unitsRequired: Number(quantity),
            coordinates: [selectedLocation.lng, selectedLocation.lat]
        };

        try {
            const response = await api.post('/blood-request', payload);
            if (response.data.status === 'success') {
                setSuccessMsg('Blood request broadcasted successfully! Compatible nearby donors will receive a push notification if urgency is High or Urgent.');
                setTimeout(() => {
                    onClose();
                    setSuccessMsg('');
                }, 2500);
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to submit blood request.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-[500px] w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-lg bg-surface border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-headline-sm text-headline-sm text-error flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[26px]">bloodtype</span>
                        Emergency Blood Request
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-on-surface-variant hover:text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-container"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Alert Box */}
                {errorMsg && (
                    <div className="mx-lg mt-md p-md bg-error-container text-on-error-container rounded-lg border border-error/20 font-body-sm">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mx-lg mt-md p-md bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg border border-tertiary/20 font-body-sm">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-lg space-y-md max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Patient Name</label>
                        <input
                            required
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                        <div>
                            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Blood Type</label>
                            <select
                                value={bloodType}
                                onChange={(e) => setBloodType(e.target.value)}
                                className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
                            >
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                                    <option key={bt} value={bt} className="bg-surface">{bt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Quantity (Units)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="10"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                        <div>
                            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Urgency</label>
                            <select
                                value={urgency}
                                onChange={(e) => setUrgency(e.target.value)}
                                className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
                            >
                                <option value="low" className="bg-surface">Low</option>
                                <option value="medium" className="bg-surface">Medium</option>
                                <option value="high" className="bg-surface">High</option>
                                <option value="urgent" className="bg-surface text-error">Urgent (Critical)</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Contact Phone</label>
                            <input
                                required
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="+1 234 567 8900"
                                className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Hospital / Clinic Name</label>
                        <input
                            required
                            type="text"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            placeholder="City General Hospital"
                            className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
                            Request Location <span className="text-error">*</span> 
                            <span className="font-normal opacity-70 ml-2">(Click on the map to adjust)</span>
                        </label>
                        <div className="h-48 w-full border border-outline-variant rounded-lg overflow-hidden relative z-0">
                            <MapContainer 
                                center={initialCenter} 
                                zoom={12} 
                                style={{ height: '100%', width: '100%', zIndex: 0 }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapController center={initialCenter} />
                                <LocationMarker position={selectedLocation} setPosition={setSelectedLocation} />
                            </MapContainer>
                        </div>
                    </div>
                    <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Additional Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Room 402, requires immediate transfusion..."
                            className="w-full p-md h-20 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none font-body-sm bg-transparent"
                        />
                    </div>

                    <div className="flex gap-md pt-md border-t border-outline-variant">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 border border-outline text-on-surface hover:bg-surface-container font-label-md rounded-lg active:scale-[0.98] transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 h-12 bg-error text-on-error font-label-md rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs disabled:opacity-75"
                        >
                            {submitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    BROADCASTING...
                                </>
                            ) : (
                                'BROADCAST REQUEST'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BloodRequestModal;
