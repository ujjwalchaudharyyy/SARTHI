import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Vehicle, VehicleCategory } from '../../types';
import { useSimulation } from '../../context/SimulationContext';
import { RISK_ZONES, CORRIDOR_WAYPOINTS } from '../../data/mockData';

interface LeafletTrafficMapProps {
  height?: string;
  filterCategory?: VehicleCategory | 'ALL';
  showCorridorRoute?: boolean;
  showRiskZones?: boolean;
  showIncidents?: boolean;
  onVehicleClick?: (vehicle: Vehicle) => void;
  centerCoords?: [number, number];
  zoomLevel?: number;
}

export const LeafletTrafficMap: React.FC<LeafletTrafficMapProps> = ({
  height = '100%',
  filterCategory = 'ALL',
  showCorridorRoute = true,
  showRiskZones = true,
  showIncidents = true,
  onVehicleClick,
  centerCoords = [29.356, 79.52],
  zoomLevel = 13,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const corridorLayerRef = useRef<L.Polyline | null>(null);
  const highwayNetworkLayerRef = useRef<L.LayerGroup | null>(null);
  const riskLayersRef = useRef<L.LayerGroup | null>(null);
  const checkpointMarkersRef = useRef<L.LayerGroup | null>(null);

  const {
    vehicles,
    emergencyCorridor,
    incidents,
    setSelectedVehicle,
    selectedVehicle,
    setSelectedVehicleForChallan,
    setSurveillanceTarget,
    setCurrentView,
  } = useSimulation();

  // Helper to create category-specific custom HTML markers
  const createMarkerIcon = (vehicle: Vehicle) => {
    let bgClass = 'bg-emerald-600 border-emerald-300 text-white';
    let pulseClass = '';
    let label = `${vehicle.currentSpeed}`;

    switch (vehicle.category) {
      case 'OVERSPEED':
        bgClass = 'bg-red-600 border-red-300 text-white font-bold animate-pulse shadow-lg shadow-red-500/50';
        pulseClass = 'animate-ping absolute inset-0 rounded-full bg-red-400 opacity-40';
        break;
      case 'WARNING':
        bgClass = 'bg-amber-500 border-amber-200 text-black font-semibold';
        break;
      case 'EMERGENCY':
        bgClass = 'bg-cyan-500 border-blue-200 text-white font-black shadow-xl shadow-cyan-500/60';
        pulseClass = 'animate-ping absolute inset-0 rounded-full bg-cyan-400 opacity-60';
        label = vehicle.type === 'Ambulance' ? '🚑 108' : '🚨';
        break;
      case 'STOLEN':
        bgClass = 'bg-purple-600 border-purple-300 text-white font-bold shadow-lg shadow-purple-500/50';
        label = '⚠️ POL';
        break;
      case 'INCIDENT':
        bgClass = 'bg-orange-600 border-orange-300 text-white font-bold';
        label = '⚠️';
        break;
      default:
        bgClass = 'bg-emerald-600 border-emerald-200 text-white font-medium';
        break;
    }

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px; transform: rotate(${vehicle.heading || 0}deg);">
        ${pulseClass ? `<div class="${pulseClass}"></div>` : ''}
        <div class="w-8 h-8 rounded-full border-2 ${bgClass} flex items-center justify-center text-[10px] shadow-md transition-transform duration-300 hover:scale-125">
          <span style="transform: rotate(-${vehicle.heading || 0}deg);">${label}</span>
        </div>
        <div class="absolute -top-7 hidden group-hover:flex items-center px-2 py-0.5 rounded bg-slate-900/95 border border-slate-700 text-[10px] text-slate-100 whitespace-nowrap z-50 shadow-lg pointer-events-none" style="transform: rotate(-${vehicle.heading || 0}deg);">
          ${vehicle.registrationNumber} (${vehicle.currentSpeed} km/h)
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'sarthi-vehicle-marker',
      html,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: centerCoords,
      zoom: zoomLevel,
      zoomControl: false,
      attributionControl: true,
    });

    // Dark Matter tile layer for government command center aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a> | SARTHI GIS TELEMETRY',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw Highway Corridors network layer
    const highwayGroup = L.layerGroup().addTo(map);
    Object.values(CORRIDOR_WAYPOINTS).forEach((corridor) => {
      L.polyline(corridor.points, {
        color: '#334155',
        weight: 4,
        opacity: 0.6,
        dashArray: '4, 4',
      })
        .bindTooltip(`🛣️ ${corridor.name} (Limit: ${corridor.speedLimit} km/h)`, {
          sticky: true,
          className: 'bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono',
        })
        .addTo(highwayGroup);
    });
    highwayNetworkLayerRef.current = highwayGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Vehicle Markers smoothly on simulation ticks
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const filtered = vehicles.filter((v) => {
      if (filterCategory === 'ALL') return true;
      return v.category === filterCategory;
    });

    const activeIds = new Set(filtered.map((v) => v.id));

    // Remove markers not in filter
    Object.keys(markersRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Create or update markers
    filtered.forEach((vehicle) => {
      const latlng: L.LatLngExpression = [vehicle.lat, vehicle.lng];
      const icon = createMarkerIcon(vehicle);

      if (markersRef.current[vehicle.id]) {
        const marker = markersRef.current[vehicle.id];
        marker.setLatLng(latlng);
        marker.setIcon(icon);
      } else {
        const marker = L.marker(latlng, { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedVehicle(vehicle);
          if (onVehicleClick) onVehicleClick(vehicle);
        });

        // Popup with realistic telemetry info
        marker.bindPopup(`
          <div class="text-xs p-1 font-sans min-w-[200px]">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
              <span class="font-mono font-bold text-sky-400 text-sm">${vehicle.registrationNumber}</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                vehicle.category === 'OVERSPEED'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : vehicle.category === 'EMERGENCY'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-emerald-500/20 text-emerald-400'
              }">${vehicle.category}</span>
            </div>
            <div class="space-y-1 text-slate-300 text-[11px]">
              <div>Model: <span class="text-white font-medium">${vehicle.makeModel || vehicle.type}</span></div>
              <div>Owner: <span class="text-slate-200">${vehicle.ownerName || 'Registered Citizen'}</span></div>
              <div class="flex justify-between pt-1 border-t border-slate-800">
                <span>Speed: <strong class="${vehicle.currentSpeed > vehicle.speedLimit ? 'text-red-400' : 'text-emerald-400'}">${vehicle.currentSpeed} km/h</strong></span>
                <span>Limit: <strong class="text-slate-400">${vehicle.speedLimit} km/h</strong></span>
              </div>
              <div class="text-slate-400">Road: <span class="text-slate-200">${vehicle.road}</span></div>
              <div class="text-amber-400/90 font-mono text-[10px]">Challans Logged: ${vehicle.totalChallansCount || 0} notices</div>
            </div>
          </div>
        `);

        markersRef.current[vehicle.id] = marker;
      }
    });
  }, [vehicles, filterCategory]);

  // Center on selected vehicle if changed
  useEffect(() => {
    if (selectedVehicle && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedVehicle.lat, selectedVehicle.lng], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedVehicle]);

  // Emergency Corridor Route Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showCorridorRoute && emergencyCorridor.isActive) {
      if (!corridorLayerRef.current) {
        corridorLayerRef.current = L.polyline(emergencyCorridor.routeCoordinates, {
          color: '#38bdf8',
          weight: 6,
          opacity: 0.85,
          dashArray: '8, 8',
        }).addTo(map);

        corridorLayerRef.current.bindTooltip(
          `🚨 ACTIVE EMERGENCY CORRIDOR: Bhimtal to Nainital District Hospital (ETA ${emergencyCorridor.currentEtaMinutes}m)`,
          { sticky: true, className: 'bg-slate-900 border border-cyan-500 text-cyan-300 text-xs' }
        );
      } else {
        corridorLayerRef.current.setLatLngs(emergencyCorridor.routeCoordinates);
      }

      // Checkpoint markers along the corridor
      if (checkpointMarkersRef.current) {
        checkpointMarkersRef.current.clearLayers();
      } else {
        checkpointMarkersRef.current = L.layerGroup().addTo(map);
      }

      emergencyCorridor.controlPoints.forEach((cp) => {
        const isClear = cp.status === 'CLEAR';
        const isClearing = cp.status === 'CLEARING';
        const badgeColor = isClear ? '#10b981' : isClearing ? '#f59e0b' : '#ef4444';

        const cpHtml = `
          <div class="flex items-center justify-center p-1 rounded-full border-2 border-white shadow-xl cursor-pointer" style="background-color: ${badgeColor}; width: 22px; height: 22px;">
            <div class="text-[9px] font-bold text-black">${cp.id.replace('CP-', '')}</div>
          </div>
        `;
        const icon = L.divIcon({
          className: 'cp-marker',
          html: cpHtml,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const cpMarker = L.marker([cp.lat, cp.lng], { icon });
        cpMarker.bindTooltip(
          `<div><b>${cp.name}</b><br/><span style="color:${badgeColor}">Status: ${cp.status}</span><br/>Assigned: ${cp.officerAssigned}</div>`,
          { className: 'bg-slate-900 border border-slate-700 text-slate-200 text-xs' }
        );
        checkpointMarkersRef.current?.addLayer(cpMarker);
      });
    } else {
      if (corridorLayerRef.current) {
        corridorLayerRef.current.remove();
        corridorLayerRef.current = null;
      }
      if (checkpointMarkersRef.current) {
        checkpointMarkersRef.current.clearLayers();
      }
    }
  }, [emergencyCorridor, showCorridorRoute]);

  // Risk Zones Heatmap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showRiskZones) {
      if (!riskLayersRef.current) {
        riskLayersRef.current = L.layerGroup().addTo(map);

        RISK_ZONES.forEach((zone) => {
          const color =
            zone.status === 'CRITICAL'
              ? '#ef4444'
              : zone.status === 'HIGH'
              ? '#f97316'
              : '#eab308';

          const circle = L.circle(zone.coordinates[0], {
            radius: zone.status === 'CRITICAL' ? 450 : 350,
            color: color,
            fillColor: color,
            fillOpacity: 0.18,
            weight: 2,
          });

          circle.bindTooltip(
            `<div class="text-xs">
              <strong style="color:${color}">${zone.roadName}</strong><br/>
              Risk Score: <b>${zone.riskScore}/100</b> (${zone.status})<br/>
              Accidents: ${zone.accidentsCount} | Overspeed: ${zone.overspeedEventsCount}
            </div>`,
            { className: 'bg-slate-900 border border-slate-700 text-slate-100' }
          );

          riskLayersRef.current?.addLayer(circle);
        });
      }
    } else {
      if (riskLayersRef.current) {
        riskLayersRef.current.remove();
        riskLayersRef.current = null;
      }
    }
  }, [showRiskZones]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Overlay Controls / Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] font-mono shadow-xl space-y-1.5 hidden sm:block">
        <div className="font-bold text-slate-300 border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
          <span>HIGHWAY TELEMETRY</span>
          <span className="text-[9px] text-emerald-400 font-bold animate-pulse">● LIVE 100% ROAD CLAMPED</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Normal Speed (Permissible)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>Overspeeding (&gt;18 km/h Excess)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Priority Emergency (108/Fire/Police)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 border-t border-slate-800/80 pt-1">
          <span className="w-2.5 h-0.5 bg-slate-500 border border-dashed" />
          <span>State Mountain Road Network</span>
        </div>
      </div>
    </div>
  );
};
