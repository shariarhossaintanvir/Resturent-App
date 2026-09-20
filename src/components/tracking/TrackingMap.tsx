'use client';

import React from 'react';
import { Order } from '../../data/types';
import { MapPin, Navigation, Store, Home, Compass } from 'lucide-react';

interface TrackingMapProps {
  order: Order;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ order }) => {
  // Normalized progress from 0% (at restaurant) to 100% (delivered at customer)
  const progress = order.status === 'Delivered' ? 100 : Math.max(5, Math.min(95, order.riderLocationProgress || 20));

  // Dynamic coordinates on a 800 x 450 coordinate map
  // Restaurant is at [180, 120]
  // Intermediate waypoint 1 is at [320, 200]
  // Intermediate waypoint 2 is at [480, 180]
  // Customer home is at [660, 340]
  const restCoord = { x: 180, y: 120 };
  const homeCoord = { x: 660, y: 340 };

  // Interpolate rider location along the 3-segment route
  const getRiderPos = (pct: number) => {
    if (pct <= 35) {
      const t = pct / 35;
      return {
        x: restCoord.x + (320 - restCoord.x) * t,
        y: restCoord.y + (200 - restCoord.y) * t,
      };
    } else if (pct <= 70) {
      const t = (pct - 35) / 35;
      return {
        x: 320 + (480 - 320) * t,
        y: 200 + (180 - 200) * t,
      };
    } else {
      const t = (pct - 70) / 30;
      return {
        x: 480 + (homeCoord.x - 480) * t,
        y: 180 + (homeCoord.y - 180) * t,
      };
    }
  };

  const riderCoord = getRiderPos(progress);

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-card select-none">
      {/* Background Styled Map Elements: Roads, Waterways, Green parks */}
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 800 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.6" />
          </pattern>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5A1F" />
            <stop offset="60%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <radialGradient id="rider-radar" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Map Grid Background */}
        <rect width="100%" height="100%" fill="#0A0D14" />
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Gulshan Lake (decorative blue area) */}
        <path
          d="M 280,0 Q 360,180 320,320 T 380,450 L 250,450 Q 300,320 230,180 T 260,0 Z"
          fill="#0C2136"
          opacity="0.75"
        />
        <text x="270" y="240" fill="#1E3A5F" fontSize="11" fontWeight="800" letterSpacing="4">
          GULSHAN LAKE
        </text>

        {/* Major Dhaka Avenues & Grid Roads */}
        {/* Kemal Ataturk Ave */}
        <line x1="0" y1="120" x2="800" y2="120" stroke="#1E293B" strokeWidth="18" />
        <line x1="0" y1="120" x2="800" y2="120" stroke="#475569" strokeWidth="1.5" strokeDasharray="10 8" />
        <text x="30" y="111" fill="#64748B" fontSize="9" fontWeight="700" letterSpacing="1.5">
          KEMAL ATATURK AVENUE
        </text>

        {/* Gulshan Avenue */}
        <line x1="480" y1="0" x2="480" y2="450" stroke="#1E293B" strokeWidth="20" />
        <line x1="480" y1="0" x2="480" y2="450" stroke="#475569" strokeWidth="1.5" strokeDasharray="10 8" />
        <text x="495" y="60" fill="#64748B" fontSize="9" fontWeight="700" letterSpacing="1.5" transform="rotate(90 495 60)">
          GULSHAN AVENUE
        </text>

        {/* Road 11 Banani */}
        <line x1="180" y1="0" x2="180" y2="450" stroke="#1E293B" strokeWidth="14" />
        <text x="195" y="40" fill="#64748B" fontSize="8" fontWeight="700" transform="rotate(90 195 40)">
          BANANI ROAD 11
        </text>

        {/* Secondary Crossings */}
        <line x1="0" y1="200" x2="800" y2="200" stroke="#172033" strokeWidth="12" />
        <line x1="0" y1="340" x2="800" y2="340" stroke="#1E293B" strokeWidth="14" />
        <text x="40" y="331" fill="#64748B" fontSize="9" fontWeight="700" letterSpacing="1">
          MADANI AVENUE
        </text>

        <line x1="660" y1="0" x2="660" y2="450" stroke="#172033" strokeWidth="12" />

        {/* Route Polyline from Restaurant to Customer */}
        {/* Route Underlay Glow */}
        <polyline
          points={`${restCoord.x},${restCoord.y} 320,200 480,180 ${homeCoord.x},${homeCoord.y}`}
          fill="none"
          stroke="#FF5A1F"
          strokeWidth="8"
          strokeOpacity="0.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active Route Polyline */}
        <polyline
          points={`${restCoord.x},${restCoord.y} 320,200 480,180 ${homeCoord.x},${homeCoord.y}`}
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="4.5"
          strokeDasharray="8 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Restaurant Pin (Origin) */}
        <g transform={`translate(${restCoord.x}, ${restCoord.y})`}>
          <circle r="26" fill="#FF5A1F" fillOpacity="0.15" />
          <circle r="18" fill="#FF5A1F" stroke="#FFFFFF" strokeWidth="2.5" />
          <foreignObject x="-9" y="-9" width="18" height="18">
            <Store className="w-4 h-4 text-white" />
          </foreignObject>
        </g>

        {/* Customer Home Pin (Destination) */}
        <g transform={`translate(${homeCoord.x}, ${homeCoord.y})`}>
          <circle r="26" fill="#10B981" fillOpacity="0.15" />
          <circle r="18" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
          <foreignObject x="-9" y="-9" width="18" height="18">
            <Home className="w-4 h-4 text-white" />
          </foreignObject>
        </g>

        {/* Moving Rider Marker on Route */}
        <g
          transform={`translate(${riderCoord.x}, ${riderCoord.y})`}
          className="transition-all duration-700 ease-out"
        >
          {/* Radar Waves */}
          <circle r="36" fill="url(#rider-radar)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <circle r="20" fill="#0A0D14" stroke="#FF5A1F" strokeWidth="3" />
          <foreignObject x="-9" y="-9" width="18" height="18">
            <Navigation className="w-4 h-4 text-primary-400 transform rotate-45" />
          </foreignObject>
        </g>
      </svg>

      {/* Live Map HUD Overlays */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-xs font-black shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live GPS Telemetry</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-primary-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Dhaka North Courier Zone</span>
        </div>
      </div>

      {/* Floating Waypoints Labels */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none gap-4">
        <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs shadow-lg max-w-[48%]">
          <div className="text-[10px] uppercase font-black text-primary-400 tracking-wider">Pickup Kitchen</div>
          <div className="font-extrabold text-white truncate mt-0.5">{order.restaurantName}</div>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs shadow-lg max-w-[48%] text-right">
          <div className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">Delivery Destination</div>
          <div className="font-extrabold text-white truncate mt-0.5">{order.deliveryAddress.area}, Dhaka</div>
        </div>
      </div>
    </div>
  );
};
