
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

// Custom marker icons using Leaflet's divIcon and Tailwind for reliable styling
const createCustomIcon = (type: string, status: string) => {
  const color = 
    type === 'Hospital' ? 'bg-blue-500' : 
    type === 'Clinic' ? 'bg-emerald-500' : 
    'bg-purple-500';
  
  const ring = status === 'Open' ? 'ring-white ring-2' : 'ring-red-400 ring-2';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-6 h-6 ${color} ${ring} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

interface HealthFacility {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Barangay Center';
  lat: number;
  lng: number;
  status: 'Open' | 'Closed';
  address: string;
}

const PASIG_FACILITIES: HealthFacility[] = [
  { id: '1', name: 'Pasig City General Hospital', type: 'Hospital', lat: 14.5685, lng: 121.0967, status: 'Open', address: 'M. Eusebio Ave, Pasig' },
  { id: '2', name: "Pasig City Children's Hospital", type: 'Hospital', lat: 14.5606, lng: 121.0601, status: 'Open', address: 'Industries St, Kapasigan, Pasig' },
  { id: '3', name: 'Rizal Medical Center', type: 'Hospital', lat: 14.5714, lng: 121.0607, status: 'Open', address: 'Pasig Blvd, Pasig' },
  { id: '4', name: 'Kapasigan Health Center', type: 'Barangay Center', lat: 14.5615, lng: 121.0620, status: 'Open', address: 'Kapasigan, Pasig' },
  { id: '5', name: 'San Nicolas Health Center', type: 'Barangay Center', lat: 14.5580, lng: 121.0650, status: 'Closed', address: 'San Nicolas, Pasig' },
  { id: '6', name: 'Ortigas Medical Clinic', type: 'Clinic', lat: 14.5833, lng: 121.0617, status: 'Open', address: 'Ortigas Center, Pasig' },
  { id: '7', name: 'Caniogan Barangay Health Station', type: 'Barangay Center', lat: 14.5693, lng: 121.0694, status: 'Open', address: 'Caniogan, Pasig' },
  { id: '8', name: 'Bambang Health Center', type: 'Barangay Center', lat: 14.5540, lng: 121.0770, status: 'Closed', address: 'Bambang, Pasig' },
];

interface PasigMapProps {
  onClose: () => void;
}

export const PasigMap: React.FC<PasigMapProps> = ({ onClose }) => {
  const pasigCenter: [number, number] = [14.5733, 121.0617];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pasig City Health Network</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">UHC Navigator • Pasig City Scope</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-tight text-slate-400">
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-blue-500" /> Hospital
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-emerald-500" /> Clinic
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-purple-500" /> Barangay Center
           </div>
           <div className="ml-auto flex items-center gap-4">
             <div className="flex items-center gap-1">
               <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Currently Open
             </div>
             <div className="flex items-center gap-1">
               <AlertCircle className="w-3 h-3 text-red-500" /> Closed
             </div>
           </div>
        </div>

        {/* Map */}
        <div className="flex-grow relative">
          <MapContainer 
            center={pasigCenter} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {PASIG_FACILITIES.map(facility => (
               <Marker 
                  key={facility.id} 
                  position={[facility.lat, facility.lng]}
                  icon={createCustomIcon(facility.type, facility.status)}
                  eventHandlers={{
                    click: () => {
                      console.log('Clicked facility:', facility.name);
                    },
                  }}
               >
                 <Popup className="custom-popup">
                   <div className="p-1 min-w-[150px]">
                     <div className="flex justify-between items-start mb-1">
                       <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                         facility.type === 'Hospital' ? 'bg-blue-100 text-blue-700' : 
                         facility.type === 'Clinic' ? 'bg-emerald-100 text-emerald-700' :
                         'bg-purple-100 text-purple-700'
                       }`}>
                         {facility.type}
                       </span>
                       <span className={`flex items-center gap-0.5 text-[8px] font-bold ${facility.status === 'Open' ? 'text-emerald-500' : 'text-red-500'}`}>
                         {facility.status === 'Open' ? <Clock className="w-2 h-2" /> : <AlertCircle className="w-2 h-2" />}
                         {facility.status}
                       </span>
                     </div>
                     <h3 className="text-xs font-bold text-slate-900 leading-tight mb-1">{facility.name}</h3>
                     <p className="text-[9px] text-slate-500 font-medium">
                       <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                       {facility.address}
                     </p>
                   </div>
                 </Popup>
               </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
