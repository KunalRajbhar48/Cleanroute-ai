import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Truck,
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Maximize2,
  X,
} from 'lucide-react';
import { Complaint, CollectionVehicle, PredictiveHotspot, WasteCategory } from '../types';

interface InteractiveWasteMapProps {
  complaints: Complaint[];
  vehicles: CollectionVehicle[];
  hotspots: PredictiveHotspot[];
  onAssignVehicle: (complaintId: string, vehicleId: string) => void;
  onUpdateStatus: (complaintId: string, status: any) => void;
  selectedComplaintId?: string | null;
}

export const InteractiveWasteMap: React.FC<InteractiveWasteMapProps> = ({
  complaints,
  vehicles,
  hotspots,
  onAssignVehicle,
  onUpdateStatus,
  selectedComplaintId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showHotspots, setShowHotspots] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [activeDetailComplaint, setActiveDetailComplaint] = useState<Complaint | null>(null);
  const [activeDetailVehicle, setActiveDetailVehicle] = useState<CollectionVehicle | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around metropolitan center
    const map = L.map(mapContainerRef.current, {
      center: [18.5284, 73.8567],
      zoom: 13,
      zoomControl: true,
    });

    // CartoDB Positron / OSM Minimalist Light tile layer for premium off-white look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers whenever complaints, vehicles, hotspots or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    // 1. Render Predictive Hotspot Radii
    if (showHotspots) {
      hotspots.forEach((hs) => {
        const circle = L.circle([hs.latitude, hs.longitude], {
          color: hs.riskLevel === 'High' ? '#234D3C' : '#6F8F7A',
          fillColor: hs.riskLevel === 'High' ? '#234D3C' : '#8A9A70',
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '4, 6',
          radius: hs.riskLevel === 'High' ? 600 : 450,
        });

        circle.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px; padding: 2px;">
            <strong>${hs.ward} Hotspot</strong><br/>
            Risk: ${hs.riskLevel} (${hs.predictionConfidence}%)<br/>
            ${hs.recommendedAction}
          </div>`,
          { permanent: false, direction: 'top' }
        );

        group.addLayer(circle);
      });
    }

    // 2. Render Complaint Markers
    const filteredComplaints = complaints.filter((c) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Critical') return c.severity === 'Critical';
      return c.category.toLowerCase().includes(activeFilter.toLowerCase());
    });

    filteredComplaints.forEach((c) => {
      const isCritical = c.severity === 'Critical';
      const isResolved = c.status === 'Resolved';

      // Custom HTML Marker matching our aesthetic palette
      const markerHtml = `
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: ${isResolved ? '#6F8F7A' : isCritical ? '#234D3C' : '#8A9A70'};
          border: 2px solid #FAF8F2;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FAF8F2;
          font-weight: 700;
          font-size: 10px;
          cursor: pointer;
        ">
          ${isCritical ? '!' : isResolved ? '✓' : c.id.slice(3, 7)}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: customIcon });

      marker.on('click', () => {
        setActiveDetailComplaint(c);
        setActiveDetailVehicle(null);
      });

      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px;">
          <strong>${c.id} - ${c.category}</strong> (${c.severity})<br/>
          Status: ${c.status}<br/>
          ${c.locationName}
        </div>`,
        { direction: 'top' }
      );

      group.addLayer(marker);
    });

    // 3. Render Collection Vehicles
    if (showVehicles) {
      vehicles.forEach((v) => {
        const vehicleIconHtml = `
          <div style="
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background-color: #234D3C;
            border: 2px solid #DCE7DE;
            box-shadow: 0 4px 12px rgba(35, 77, 60, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FAF8F2;
            cursor: pointer;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-4v9"/>
              <circle cx="7" cy="18" r="2"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          </div>
        `;

        const vehicleIcon = L.divIcon({
          className: 'vehicle-leaflet-icon',
          html: vehicleIconHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const vMarker = L.marker([v.latitude, v.longitude], { icon: vehicleIcon });

        vMarker.on('click', () => {
          setActiveDetailVehicle(v);
          setActiveDetailComplaint(null);
        });

        vMarker.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px;">
            <strong>${v.id}</strong> (${v.driverName})<br/>
            Load: ${v.currentLoadTons}/${v.capacityTons}T (${Math.round((v.currentLoadTons / v.capacityTons) * 100)}%)<br/>
            Status: ${v.status}
          </div>`,
          { direction: 'top' }
        );

        group.addLayer(vMarker);
      });
    }

    // Auto center if selectedComplaintId is passed
    if (selectedComplaintId) {
      const match = complaints.find((c) => c.id === selectedComplaintId);
      if (match) {
        mapInstanceRef.current.setView([match.latitude, match.longitude], 15);
        setActiveDetailComplaint(match);
      }
    }
  }, [complaints, vehicles, hotspots, activeFilter, showHotspots, showVehicles, selectedComplaintId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 text-left">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#234D3C] dark:bg-[#7EA38B] animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-wider text-[#1E2923] dark:text-[#F5F3EA]">
            Live Smart City Waste Map
          </span>
          <span className="text-xs text-[#66736B] dark:text-[#95A89D] hidden sm:inline">
            ({complaints.length} reports · {vehicles.length} active units)
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['All', 'Plastic', 'Organic', 'Mixed', 'Construction', 'Critical'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeFilter === f
                  ? 'bg-[#234D3C] text-[#FAF8F2] shadow-sm'
                  : 'bg-[#EDEDE3]/50 dark:bg-[#233C2F]/40 text-[#66736B] dark:text-[#95A89D] hover:text-[#1E2923]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              showHotspots
                ? 'bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588] border-[#234D3C]/20'
                : 'bg-transparent text-[#66736B] border-transparent'
            }`}
          >
            Hotspots {showHotspots ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              showVehicles
                ? 'bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588] border-[#234D3C]/20'
                : 'bg-transparent text-[#66736B] border-transparent'
            }`}
          >
            Vehicles {showVehicles ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Map Container with Floating Drawer */}
      <div className="relative h-[620px] w-full rounded-3xl overflow-hidden border border-[#234D3C]/12 dark:border-[#8EAD9A]/18 shadow-lg">
        {/* Leaflet DOM Root */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Complaint Detail Inspector Modal / Drawer */}
        {activeDetailComplaint && (
          <div className="absolute top-4 right-4 z-[500] w-80 sm:w-96 p-5 rounded-2xl bg-[#FAF8F2]/95 dark:bg-[#182820]/95 backdrop-blur-md border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                  {activeDetailComplaint.id}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                  {activeDetailComplaint.status}
                </span>
              </div>
              <button
                onClick={() => setActiveDetailComplaint(null)}
                className="p-1 rounded-lg hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#66736B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo preview */}
            <div className="h-32 w-full rounded-xl overflow-hidden bg-[#EDEDE3] dark:bg-[#14221A]">
              <img
                src={activeDetailComplaint.imageUrl}
                alt={activeDetailComplaint.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                {activeDetailComplaint.title}
              </h4>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                {activeDetailComplaint.locationName} ({activeDetailComplaint.ward})
              </p>
            </div>

            {/* AI Diagnostics details */}
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#14221A] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736B] dark:text-[#95A89D]">Waste Type:</span>
                <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                  {activeDetailComplaint.category} ({activeDetailComplaint.aiClassification.confidence}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B] dark:text-[#95A89D]">Severity:</span>
                <span className="font-semibold text-[#234D3C] dark:text-[#7EA38B]">
                  {activeDetailComplaint.severity} Priority
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B] dark:text-[#95A89D]">Assigned Vehicle:</span>
                <span className="font-mono font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                  {activeDetailComplaint.assignedVehicleId || 'Unassigned'}
                </span>
              </div>
              <div className="pt-1 text-[11px] text-[#66736B] dark:text-[#95A89D]">
                Rec: {activeDetailComplaint.aiClassification.recommendedAction}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {activeDetailComplaint.status !== 'Resolved' ? (
                <>
                  <button
                    onClick={() => {
                      onAssignVehicle(activeDetailComplaint.id, 'V-102');
                      setActiveDetailComplaint((prev) => (prev ? { ...prev, assignedVehicleId: 'V-102', status: 'Assigned' } : null));
                    }}
                    className="py-2 px-3 rounded-xl bg-[#234D3C] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Assign V-102
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(activeDetailComplaint.id, 'Resolved');
                      setActiveDetailComplaint((prev) => (prev ? { ...prev, status: 'Resolved' } : null));
                    }}
                    className="py-2 px-3 rounded-xl border border-[#234D3C]/20 text-[#1E2923] dark:text-[#F5F3EA] text-xs font-semibold hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] transition-colors"
                  >
                    Mark Resolved
                  </button>
                </>
              ) : (
                <div className="col-span-2 py-2 text-center text-xs font-semibold text-[#6F8F7A] dark:text-[#A4B588] bg-[#DCE7DE]/50 dark:bg-[#233C2F] rounded-xl">
                  ✓ Verified & Resolved
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Vehicle Inspector */}
        {activeDetailVehicle && (
          <div className="absolute top-4 right-4 z-[500] w-80 p-5 rounded-2xl bg-[#FAF8F2]/95 dark:bg-[#182820]/95 backdrop-blur-md border border-[#234D3C]/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#234D3C]/10">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#234D3C] dark:text-[#7EA38B]" />
                <span className="font-mono font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                  Vehicle {activeDetailVehicle.id}
                </span>
              </div>
              <button
                onClick={() => setActiveDetailVehicle(null)}
                className="p-1 rounded-lg hover:bg-[#EDEDE3] text-[#66736B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#66736B]">Driver:</span>
                <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                  {activeDetailVehicle.driverName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Reg No:</span>
                <span className="font-mono text-[#1E2923] dark:text-[#F5F3EA]">
                  {activeDetailVehicle.registrationNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Assigned Ward:</span>
                <span className="font-semibold">{activeDetailVehicle.currentWard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Status:</span>
                <span className="font-semibold text-[#234D3C] dark:text-[#7EA38B]">
                  {activeDetailVehicle.status}
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="pt-1 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Payload Capacity:</span>
                  <span className="font-mono font-semibold">
                    {activeDetailVehicle.currentLoadTons} / {activeDetailVehicle.capacityTons} Tons
                  </span>
                </div>
                <div className="h-2 w-full bg-[#EDEDE3] dark:bg-[#14221A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#234D3C] dark:bg-[#7EA38B] rounded-full"
                    style={{
                      width: `${(activeDetailVehicle.currentLoadTons / activeDetailVehicle.capacityTons) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
