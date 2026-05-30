import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api';
import SideNavBar from '../components/SideNavBar';
import TopAppBar from '../components/TopAppBar';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const donorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const requestIcon = new L.Icon({
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

const LiveMapPage = () => {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default SF
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async (lng, lat) => {
    try {
      setLoading(true);
      // Fetch donors and requests simultaneously using a very large radius (50,000km) to see all demo data
      const [donorsRes, requestsRes] = await Promise.all([
        api.get(`/blood-request/donors?lng=${lng}&lat=${lat}&distance=50000000`),
        api.get(`/blood-request/nearby?lng=${lng}&lat=${lat}&distance=50000000`)
      ]);

      if (donorsRes.data.status === 'success') {
        setDonors(donorsRes.data.data);
      }
      if (requestsRes.data.status === 'success') {
        setRequests(requestsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
      setErrorMsg('Failed to load live map data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setMapCenter([latitude, longitude]);
          fetchData(longitude, latitude);
        },
        (error) => {
          console.warn("Geolocation denied/failed. Using default coordinates.");
          // Fallback to default coordinates
          fetchData(-122.4194, 37.7749);
        }
      );
    } else {
      fetchData(-122.4194, 37.7749);
    }
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex">
      {/* Side Navigation */}
      <SideNavBar />

      <div className="flex-1 flex flex-col ml-64">
        {/* Top Header */}
        <TopAppBar />

        <main className="pt-16 flex-grow flex flex-col h-screen">
            {/* Header Banner */}
            <div className="bg-surface px-lg py-sm border-b border-outline-variant flex justify-between items-center z-10 clinic-shadow relative">
                <div>
                    <h2 className="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-xs">
                        <span className="material-symbols-outlined">map</span>
                        Live Emergency Map
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-xs">Real-time view of nearby blood requests and available donors.</p>
                </div>
                <div className="flex gap-md">
                    <div className="flex items-center gap-xs bg-surface-container py-xs px-sm rounded-lg text-label-sm border border-outline-variant/30">
                        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="red" className="h-4" />
                        <span className="font-bold text-error">Requests ({requests.length})</span>
                    </div>
                    <div className="flex items-center gap-xs bg-surface-container py-xs px-sm rounded-lg text-label-sm border border-outline-variant/30">
                        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="green" className="h-4" />
                        <span className="font-bold text-tertiary">Donors ({donors.length})</span>
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-error-container text-on-error-container p-sm text-center text-label-sm">
                    {errorMsg}
                </div>
            )}

            {/* Map Container */}
            <div className="flex-grow w-full relative z-0">
                {loading && (
                    <div className="absolute inset-0 z-[1000] bg-surface/50 backdrop-blur-sm flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-[48px] text-primary animate-spin">refresh</span>
                        <p className="mt-md font-label-md text-primary">Fetching Live Data...</p>
                    </div>
                )}

                <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={mapCenter} />

                    {/* Render Donors */}
                    {donors.map(donor => {
                        if (!donor.location?.coordinates) return null;
                        const [lng, lat] = donor.location.coordinates;
                        return (
                            <Marker key={`donor-${donor._id}`} position={[lat, lng]} icon={donorIcon}>
                                <Popup className="custom-popup">
                                    <div className="p-xs min-w-[150px]">
                                        <div className="flex items-center gap-sm border-b border-outline-variant pb-xs mb-xs">
                                            <span className="bg-tertiary text-on-tertiary px-sm py-xs rounded font-bold text-[14px]">
                                                {donor.patientProfile?.bloodType || 'O+'}
                                            </span>
                                            <span className="font-bold text-on-surface">Available Donor</span>
                                        </div>
                                        <p className="font-body-sm mb-xs"><strong>Name:</strong> {donor.name}</p>
                                        <p className="font-body-sm mb-xs"><strong>Location:</strong> {donor.city}</p>
                                        <a href={`tel:${donor.phone}`} className="text-primary hover:underline font-label-sm flex items-center gap-xs">
                                            <span className="material-symbols-outlined text-[16px]">call</span> Call Donor
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Render Requests */}
                    {requests.map(req => {
                        if (!req.location?.coordinates) return null;
                        const [lng, lat] = req.location.coordinates;
                        return (
                            <Marker key={`req-${req._id}`} position={[lat, lng]} icon={requestIcon}>
                                <Popup className="custom-popup">
                                    <div className="p-xs min-w-[150px]">
                                        <div className="flex items-center gap-sm border-b border-error/20 pb-xs mb-xs">
                                            <span className="bg-error text-on-error px-sm py-xs rounded font-bold text-[14px] animate-pulse">
                                                {req.bloodGroupRequired}
                                            </span>
                                            <span className="font-bold text-error uppercase text-[12px]">{req.priority} Request</span>
                                        </div>
                                        <p className="font-body-sm mb-xs text-on-surface"><strong>Units Needed:</strong> {req.unitsRequired}</p>
                                        {req.patientId && (
                                            <p className="font-body-sm mb-xs text-on-surface"><strong>Contact:</strong> {req.patientId.name}</p>
                                        )}
                                        <p className="text-[10px] text-on-surface-variant mt-sm">Posted: {formatDate(req.createdAt)}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </main>
      </div>
    </div>
  );
};

export default LiveMapPage;
