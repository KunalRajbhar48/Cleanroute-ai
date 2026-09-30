import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Route as RouteIcon,
  Sparkles,
  Truck,
  TrendingUp,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Complaint, CollectionVehicle, PredictiveHotspot } from '../types';

interface AdminDashboardProps {
  complaints: Complaint[];
  vehicles: CollectionVehicle[];
  hotspots: PredictiveHotspot[];
  onNavigate: (page: string) => void;
  onAssignVehicle: (complaintId: string, vehicleId: string) => void;
  onUpdateStatus: (complaintId: string, status: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  complaints,
  vehicles,
  hotspots,
  onNavigate,
  onAssignVehicle,
  onUpdateStatus,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Stats
  const total = 1284;
  const pending = complaints.filter((c) => c.status === 'Pending').length + 160;
  const resolved = 1047;
  const critical = complaints.filter((c) => c.severity === 'Critical' && c.status !== 'Resolved').length + 48;
  const activeVehicles = vehicles.filter((v) => v.status === 'Collecting').length + 22;
  const hotspotCount = hotspots.length || 14;

  // Chart 1: Daily complaints vs resolved
  const complaintsByDay = [
    { day: 'Mon', reported: 42, resolved: 38 },
    { day: 'Tue', reported: 55, resolved: 49 },
    { day: 'Wed', reported: 68, resolved: 62 },
    { day: 'Thu', reported: 51, resolved: 54 },
    { day: 'Fri', reported: 74, resolved: 70 },
    { day: 'Sat', reported: 89, resolved: 81 },
    { day: 'Sun', reported: 96, resolved: 90 },
  ];

  // Chart 2: Category Distribution
  const categoryData = [
    { name: 'Plastic', value: 420, color: '#234D3C' },
    { name: 'Organic', value: 380, color: '#6F8F7A' },
    { name: 'Construction', value: 210, color: '#8A9A70' },
    { name: 'Mixed Solid', value: 160, color: '#A4B588' },
    { name: 'Hazardous/E-Waste', value: 114, color: '#4E725E' },
  ];

  // Chart 3: Ward Generation Trend
  const wardData = [
    { ward: 'Ward 04', volumeTons: 18.4, resolvedPercent: 88 },
    { ward: 'Ward 08', volumeTons: 14.2, resolvedPercent: 82 },
    { ward: 'Ward 12', volumeTons: 22.8, resolvedPercent: 79 },
    { ward: 'Ward 15', volumeTons: 16.5, resolvedPercent: 85 },
    { ward: 'Ward 18', volumeTons: 19.1, resolvedPercent: 80 },
    { ward: 'Ward 21', volumeTons: 21.0, resolvedPercent: 77 },
  ];

  // Critical pending issues requiring officer attention
  const criticalPending = complaints
    .filter((c) => c.severity === 'Critical' && c.status !== 'Resolved')
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            Smart City Municipal Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            Good Morning, Municipal Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#95A89D]">
            Here's today's smart waste management overview and real-time fleet operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timeRange === '7d'
                  ? 'bg-[#234D3C] text-[#FAF8F2] shadow-sm'
                  : 'text-[#66736B] dark:text-[#95A89D]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timeRange === '30d'
                  ? 'bg-[#234D3C] text-[#FAF8F2] shadow-sm'
                  : 'text-[#66736B] dark:text-[#95A89D]'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <button
            onClick={() => onNavigate('routes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Generate Routes</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Total Complaints
          </span>
          <div className="mt-1.5 text-2xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            {total.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#6F8F7A] dark:text-[#A4B588] block mt-1">
            +12% this week
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Pending
          </span>
          <div className="mt-1.5 text-2xl font-extrabold text-[#8A9A70] dark:text-[#A4B588]">
            {pending}
          </div>
          <span className="text-[10px] text-[#66736B] dark:text-[#95A89D] block mt-1">
            Avg age: 2.1 hrs
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Resolved
          </span>
          <div className="mt-1.5 text-2xl font-extrabold text-[#234D3C] dark:text-[#7EA38B]">
            {resolved.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#6F8F7A] dark:text-[#A4B588] block mt-1">
            81.5% clearance rate
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Critical Issues
          </span>
          <div className="mt-1.5 text-2xl font-extrabold text-[#234D3C] dark:text-[#E2ECE5]">
            {critical}
          </div>
          <span className="text-[10px] text-[#8A9A70] dark:text-[#A4B588] block mt-1">
            Hazmat & Market waste
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Active Vehicles
          </span>
          <div className="mt-1.5 text-2xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            {activeVehicles}
          </div>
          <span className="text-[10px] text-[#6F8F7A] dark:text-[#A4B588] block mt-1">
            87% fleet utilization
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Waste Hotspots
          </span>
          <div className="mt-1.5 text-2xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            {hotspotCount}
          </div>
          <span className="text-[10px] text-[#8A9A70] dark:text-[#A4B588] block mt-1">
            3 High Risk zones
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Daily Waste Complaints vs Resolved Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                Waste Complaints vs Resolution Velocity
              </h3>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                Daily incoming citizen submissions compared to verified fleet clearances
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#66736B] dark:text-[#95A89D]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#234D3C]" /> Reported
              </span>
              <span className="flex items-center gap-1.5 text-[#66736B] dark:text-[#95A89D]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6F8F7A]" /> Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#234D3C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#234D3C" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6F8F7A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6F8F7A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(35, 77, 60, 0.08)" />
                <XAxis dataKey="day" stroke="#66736B" fontSize={11} tickLine={false} />
                <YAxis stroke="#66736B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '12px',
                    borderColor: 'rgba(35, 77, 60, 0.15)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stroke="#234D3C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#6F8F7A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution Donut Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
              Waste Category Breakdown
            </h3>
            <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
              Proportion of classified material types
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '10px',
                    borderColor: 'rgba(35, 77, 60, 0.15)',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-[#1E2923] dark:text-[#F5F3EA] truncate">{c.name}</span>
                <span className="text-[#66736B] dark:text-[#95A89D] ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward Generation & Critical Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ward Generation Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                Waste Tonnage by Municipal Ward
              </h3>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                Daily estimated accumulation across key zones
              </p>
            </div>
            <span className="text-xs font-mono text-[#6F8F7A] dark:text-[#A4B588]">
              Units: Metric Tons
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(35, 77, 60, 0.08)" />
                <XAxis dataKey="ward" stroke="#66736B" fontSize={11} tickLine={false} />
                <YAxis stroke="#66736B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '12px',
                    borderColor: 'rgba(35, 77, 60, 0.15)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="volumeTons" fill="#234D3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Dispatch Queue */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8A9A70]" />
              <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                Critical Dispatch Queue
              </h3>
            </div>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-xs font-semibold text-[#6F8F7A] dark:text-[#A4B588] hover:underline"
            >
              View All ({complaints.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalPending.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                      {item.id}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#FAF8F2] dark:bg-[#182820] text-[#234D3C] dark:text-[#A4B588]">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#8A9A70] font-semibold">
                      {item.ward}
                    </span>
                  </div>
                  <p className="text-[#66736B] dark:text-[#95A89D] truncate">
                    {item.locationName}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.assignedVehicleId ? (
                    <span className="px-2 py-1 rounded-lg bg-[#FAF8F2] dark:bg-[#182820] text-[10px] font-mono font-semibold text-[#234D3C] dark:text-[#7EA38B]">
                      Assigned to {item.assignedVehicleId}
                    </span>
                  ) : (
                    <button
                      onClick={() => onAssignVehicle(item.id, 'V-102')}
                      className="px-2.5 py-1 rounded-lg bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-[11px] font-semibold hover:opacity-90 transition-opacity"
                    >
                      Assign V-102
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
