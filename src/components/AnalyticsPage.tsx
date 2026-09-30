import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Leaf,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<'Today' | '7 Days' | '30 Days' | 'Custom'>('7 Days');

  // Efficiency data over time
  const efficiencyData = [
    { period: 'Day 1', avgResponseHrs: 5.2, routeKmSaved: 14.8, co2AvoidedKg: 4.1 },
    { period: 'Day 2', avgResponseHrs: 4.8, routeKmSaved: 18.2, co2AvoidedKg: 5.2 },
    { period: 'Day 3', avgResponseHrs: 4.1, routeKmSaved: 21.0, co2AvoidedKg: 5.9 },
    { period: 'Day 4', avgResponseHrs: 3.9, routeKmSaved: 19.5, co2AvoidedKg: 5.4 },
    { period: 'Day 5', avgResponseHrs: 3.6, routeKmSaved: 24.3, co2AvoidedKg: 6.8 },
    { period: 'Day 6', avgResponseHrs: 3.4, routeKmSaved: 26.1, co2AvoidedKg: 7.3 },
    { period: 'Day 7', avgResponseHrs: 3.1, routeKmSaved: 28.4, co2AvoidedKg: 8.0 },
  ];

  // Category tonnage trends
  const tonnageByMaterial = [
    { material: 'Plastic Polymers', recycledTons: 42.5, divertedPercent: 88 },
    { material: 'Organic Compostable', recycledTons: 68.2, divertedPercent: 94 },
    { material: 'C&D Debris', recycledTons: 38.0, divertedPercent: 62 },
    { material: 'Scrap Metal', recycledTons: 19.4, divertedPercent: 98 },
    { material: 'E-Waste WEEE', recycledTons: 8.6, divertedPercent: 84 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            Sustainability & Operational Intelligence
          </span>
          <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            Analytics & Impact Report
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            Quantifiable environmental metrics, fleet route savings, and municipal turnaround KPIs.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 text-xs">
          {(['Today', '7 Days', '30 Days', 'Custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPeriod(p)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterPeriod === p
                  ? 'bg-[#234D3C] text-[#FAF8F2] shadow-sm'
                  : 'text-[#66736B] dark:text-[#95A89D]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Average Response Time
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#234D3C] dark:text-[#7EA38B]">
            3.4 Hours
          </div>
          <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] mt-1 block">
            ↓ 58% vs legacy 8.2h baseline
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Fleet Distance Reduced
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            18.4% Saved
          </div>
          <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] mt-1 block">
            152 km deadhead travel avoided
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Diverted From Landfills
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            84.2%
          </div>
          <span className="text-[11px] text-[#8A9A70] dark:text-[#A4B588] mt-1 block">
            High circular segregation rate
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
            Citizen Satisfaction
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#234D3C] dark:text-[#7EA38B]">
            4.8 / 5.0
          </div>
          <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] mt-1 block">
            Based on 920+ resolved feedback ratings
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Turnaround Time Curve */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                Turnaround Response Time Acceleration
              </h3>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                Hours from citizen upload to truck collection verification
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#234D3C] dark:text-[#7EA38B]">
              Units: Hours
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(35, 77, 60, 0.08)" />
                <XAxis dataKey="period" stroke="#66736B" fontSize={11} tickLine={false} />
                <YAxis stroke="#66736B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '12px',
                    borderColor: 'rgba(35, 77, 60, 0.15)',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgResponseHrs"
                  name="Response Turnaround (hrs)"
                  stroke="#234D3C"
                  strokeWidth={3}
                  dot={{ fill: '#234D3C', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Diversion & Circular Economy Recovery */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                Material Recovery by Stream
              </h3>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                Tons routed to composting, recycling plants, and WEEE dismantlers
              </p>
            </div>
            <span className="text-xs font-mono text-[#6F8F7A] dark:text-[#A4B588]">
              Units: Tons
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tonnageByMaterial} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(35, 77, 60, 0.08)" />
                <XAxis dataKey="material" stroke="#66736B" fontSize={11} tickLine={false} />
                <YAxis stroke="#66736B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '12px',
                    borderColor: 'rgba(35, 77, 60, 0.15)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="recycledTons" fill="#6F8F7A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
