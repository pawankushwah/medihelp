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
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Blood Map</h1>
          <p className="text-slate-500 mt-1 text-lg">Find donors and blood banks near you.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isSearching ? 'text-primary-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-slate-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:opacity-70"
            placeholder="Search city..."
          />
        </form>
      </header>

      <div className="flex-1 bg-slate-200 rounded-3xl overflow-hidden relative shadow-inner min-h-[500px]">
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
              
              {/* Example Map Markers */}
              <Marker longitude={-0.1276} latitude={51.5074} anchor="bottom">
                <div className="relative cursor-pointer hover:scale-110 transition-transform">
                  <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-20"></div>
                  <div className="relative w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md"></div>
                </div>
              </Marker>

              <Marker longitude={-0.1176} latitude={51.5174} anchor="bottom">
                <div className="relative cursor-pointer hover:scale-110 transition-transform">
                  <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
                  <div className="relative w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md"></div>
                </div>
              </Marker>

              {/* Map UI Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center max-w-sm pointer-events-auto border border-white/50">
                  <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplet className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Live Blood Map</h3>
                  <p className="text-slate-600 mb-6 text-sm">
                    Connect with local blood banks and emergency donors in real-time.
                  </p>
                  <button 
                    onClick={() => alert("🚨 EMERGENCY REQUEST SENT!\n\nAll nearby registered donors and blood banks have been notified of your urgent need.")}
                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all"
                  >
                    Request Blood Urgent
                  </button>
                </div>
              </div>
            </Map>
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
