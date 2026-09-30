import React from 'react';
import {
  Truck,
  Fuel,
  Weight,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CollectionVehicle, Complaint } from '../types';

interface VehicleFleetPageProps {
  vehicles: CollectionVehicle[];
  complaints: Complaint[];
  onNavigateToMap: () => void;
  onNavigateToRoutes: () => void;
}

export const VehicleFleetPage: React.FC<VehicleFleetPageProps> = ({
  vehicles,
  complaints,
  onNavigateToMap,
  onNavigateToRoutes,
}) => {
  const getStatusColor = (status: CollectionVehicle['status']) => {
    switch (status) {
      case 'Collecting':
        return 'text-[#234D3C] dark:text-[#7EA38B] bg-[#DCE7DE] dark:bg-[#233C2F]';
      case 'Available':
        return 'text-[#6F8F7A] dark:text-[#A4B588] bg-[#EDEDE3] dark:bg-[#1F362A]';
      case 'Maintenance':
        return 'text-[#8A9A70] dark:text-[#A4B588] bg-[#EDEDE3] dark:bg-[#14221A]';
      case 'Offline':
        return 'text-[#66736B] dark:text-[#95A89D] bg-transparent';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            Municipal Fleet Operations
          </span>
          <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            Collection Vehicles
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            Real-time tracking of compactor trucks, hazardous disposal units, and hydraulic loaders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToRoutes}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Launch Route Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Fleet Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => {
          const loadPercent = Math.round((v.currentLoadTons / v.capacityTons) * 100);
          const assignedCount = complaints.filter((c) => c.assignedVehicleId === v.id).length;

          return (
            <div
              key={v.id}
              className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4 hover:border-[#234D3C]/30 transition-all"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#234D3C]/8 dark:border-[#8EAD9A]/12">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#234D3C] text-[#FAF8F2] flex items-center justify-center font-bold text-xs font-mono">
                    {v.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                      {v.driverName}
                    </h3>
                    <span className="font-mono text-[10px] text-[#66736B] dark:text-[#95A89D]">
                      {v.registrationNo}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${getStatusColor(
                    v.status
                  )}`}
                >
                  {v.status}
                </span>
              </div>

              {/* Vehicle telemetry */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B] dark:text-[#95A89D] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#6F8F7A]" /> Current Ward:
                  </span>
                  <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                    {v.currentWard}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#66736B] dark:text-[#95A89D] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#6F8F7A]" /> Driver Contact:
                  </span>
                  <span className="font-mono text-[#1E2923] dark:text-[#F5F3EA]">
                    {v.driverPhone}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#66736B] dark:text-[#95A89D] flex items-center gap-1">
                      <Weight className="w-3 h-3 text-[#6F8F7A]" /> Capacity Load:
                    </span>
                    <span className="font-mono font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                      {v.currentLoadTons} / {v.capacityTons} Tons ({loadPercent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#EDEDE3] dark:bg-[#14221A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        loadPercent > 85 ? 'bg-[#8A9A70]' : 'bg-[#234D3C] dark:bg-[#7EA38B]'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* Fuel / Battery Level */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#66736B] dark:text-[#95A89D] flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-[#6F8F7A]" /> Fuel / Battery:
                  </span>
                  <span className="font-mono font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                    {v.fuelLevelPercent}%
                  </span>
                </div>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-3 border-t border-[#234D3C]/8 dark:border-[#8EAD9A]/12 flex items-center justify-between">
                <span className="text-[11px] text-[#66736B] dark:text-[#95A89D]">
                  Assigned Stops: <strong>{assignedCount} points</strong>
                </span>
                <button
                  onClick={onNavigateToRoutes}
                  className="px-3 py-1.5 rounded-lg border border-[#234D3C]/20 hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[11px] font-semibold text-[#234D3C] dark:text-[#A4B588] transition-colors"
                >
                  View Route
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
