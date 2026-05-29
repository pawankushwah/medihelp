'use client';

import { useState, useRef } from 'react';
import { MapPin, Search, Droplet } from 'lucide-react';
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function BloodMapPage() {
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  const mapRef = useRef<MapRef>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Dynamic markers state
  const [requests, setRequests] = useState([
    { id: 1, lng: -0.1276, lat: 51.5074, type: 'urgent', delay: '0s' },
    { id: 2, lng: -0.1176, lat: 51.5174, type: 'urgent', delay: '1s' }
  ]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O-');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !apiKey) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${apiKey}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const map = mapRef.current?.getMap();
        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 12, duration: 2000 });
        }
      } else {
        alert("Location not found. Please try another city.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Check your internet connection or API key.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Blood Map</h1>
          <p className="text-slate-500 mt-1 text-base md:text-lg">Find donors and blood banks near you.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isSearching ? 'text-primary-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            className="block w-full md:w-80 pl-10 pr-3 py-3 md:py-2 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:opacity-70 text-base"
            placeholder="Search city..."
          />
        </form>
      </header>

      <div className="flex-1 bg-slate-200 rounded-2xl md:rounded-3xl overflow-hidden relative shadow-inner min-h-[65vh] md:min-h-[500px]">
        {apiKey ? (
          <div className="absolute inset-0">
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: -0.1276, // Change to your default location
                latitude: 51.5074,
                zoom: 12
              }}
              mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`}
              style={{ width: '100%', height: '100%' }}
            >
              <NavigationControl position="top-right" />
              
              {/* Dynamic Map Markers */}
              {requests.map(req => (
                <Marker key={req.id} longitude={req.lng} latitude={req.lat} anchor="bottom">
                  <div className="relative cursor-pointer hover:scale-110 transition-transform">
                    <div className={`absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-20`} style={{ animationDelay: req.delay }}></div>
                    <div className="relative w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md"></div>
                  </div>
                </Marker>
              ))}
            </Map>

            {/* Map UI Overlay (Moved OUTSIDE Map component so it doesn't block interactivity) */}
            <div className="absolute inset-x-0 bottom-4 md:bottom-10 flex justify-center pointer-events-none z-10 px-2 sm:px-4">
              <div className="bg-white/95 backdrop-blur-xl px-3 py-3 md:px-6 md:py-4 rounded-full shadow-2xl pointer-events-auto border border-white flex items-center gap-3 md:gap-4 max-w-lg w-full transform transition-all hover:scale-[1.02]">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5 md:w-6 md:h-6 text-red-500 fill-current animate-pulse" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">Emergency Blood</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-tight truncate hidden sm:block">Broadcast a request to donors near you.</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-red-500 text-white font-bold text-xs sm:text-sm md:text-base py-2.5 px-4 md:px-6 rounded-full shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all whitespace-nowrap shrink-0"
                >
                  Request
                </button>
              </div>
            </div>

            {/* Confirmation Modal (Moved OUTSIDE Map component) */}
            {showModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-slate-100 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Droplet className="w-6 h-6 text-red-500 fill-current" />
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Confirm Request</h2>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm">This will alert all registered donors near your current map location.</p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group Needed</label>
                    <select 
                      value={selectedBloodGroup}
                      onChange={(e) => setSelectedBloodGroup(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        const map = mapRef.current?.getMap();
                        const center = map ? map.getCenter() : { lng: -0.1276, lat: 51.5074 };
                        
                        setRequests(prev => [...prev, {
                          id: Date.now(),
                          lng: center.lng,
                          lat: center.lat,
                          type: 'urgent',
                          delay: '0s'
                        }]);
                        setShowModal(false);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all"
                    >
                      Broadcast
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-slate-300 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Map Configuration Required</h3>
            <p className="text-slate-600 max-w-md">
              Please add your <code>NEXT_PUBLIC_MAPTILER_API_KEY</code> to the <code>.env.local</code> file to enable the interactive map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
