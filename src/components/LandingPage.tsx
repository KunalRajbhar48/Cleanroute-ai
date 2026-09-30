import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Route as RouteIcon,
  ShieldCheck,
  TrendingDown,
  Cpu,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';
import { Complaint, PredictiveHotspot } from '../types';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  complaints: Complaint[];
  hotspots: PredictiveHotspot[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  complaints,
  hotspots,
}) => {
  const totalComplaints = 1284;
  const resolvedComplaints = 1047;
  const activeRoutes = 28;
  const detectedHotspots = hotspots.length || 14;

  const steps = [
    {
      step: '01',
      title: 'Citizen Report',
      desc: 'Residents take a photo of overflowing or unsegregated waste with real-time GPS pinpointing.',
      icon: MapPin,
    },
    {
      step: '02',
      title: 'AI Classification',
      desc: 'Multimodal vision classifies waste category, estimates volume, and screens for spatial duplicates.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Predictive Hotspots',
      desc: 'Machine learning predicts recurrence risks 24–48 hours ahead to trigger preventive dispatch.',
      icon: Activity,
    },
    {
      step: '04',
      title: 'OR-Tools Routing',
      desc: 'Google OR-Tools engine solves Capacitated VRP to minimize fleet travel distance and CO₂ emissions.',
      icon: RouteIcon,
    },
    {
      step: '05',
      title: 'Clean City',
      desc: 'Municipal vehicles collect on time. Citizens receive verification photos and resolution alerts.',
      icon: ShieldCheck,
    },
  ];

  const benefits = [
    {
      title: 'AI Waste Classification',
      desc: 'Automated 7-category segregation analysis with 94%+ confidence scores and volume calculation.',
      stat: '94% Accuracy',
    },
    {
      title: 'Duplicate Complaint Detection',
      desc: 'Intelligent spatial clustering filters redundant reports within 150m radius, eliminating duplicate dispatches.',
      stat: '32% Less Noise',
    },
    {
      title: 'Predictive Hotspot Forecasting',
      desc: 'Proactive detection of recurring accumulation zones before overflow happens, preventing civic bottlenecks.',
      stat: '24-48h Advance',
    },
    {
      title: 'Google OR-Tools Route Solver',
      desc: 'Real-time vehicle routing problem optimization minimizing deadhead travel and urban fuel consumption.',
      stat: '18.4% Fuel Saved',
    },
    {
      title: 'Reduced Unnecessary Travel',
      desc: 'Smart capacity checks prevent half-empty compactor trips and balance truck payload evenly.',
      stat: '4.2T CO₂ Avoided',
    },
    {
      title: 'Municipal Efficiency Boost',
      desc: 'Streamlined role-based triage connects citizens, ward officers, and drivers seamlessly in real-time.',
      stat: '3.4h Turnaround',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#234D3C] dark:text-[#A4B588]">
              <Sparkles className="w-3.5 h-3.5 text-[#6F8F7A]" />
              <span>AI-Powered Smart Waste Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1E2923] dark:text-[#F5F3EA] leading-[1.08]">
              Cleaner Cities.
              <br />
              <span className="text-[#234D3C] dark:text-[#7EA38B]">Smarter Routes.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#66736B] dark:text-[#95A89D] max-w-xl font-normal leading-relaxed">
              Transforming waste complaints into intelligent collection decisions through AI, predictive analytics, and route optimization.
            </p>

            <p className="text-xs font-medium tracking-wide uppercase text-[#8A9A70] dark:text-[#A4B588]">
              Turning Waste Reports into Smarter Routes and Cleaner Cities.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('report')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#234D3C] hover:bg-[#1D3F31] dark:bg-[#3F755E] dark:hover:bg-[#4E8B70] text-[#FAF8F2] font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Report Waste</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#234D3C]/20 dark:border-[#8EAD9A]/30 bg-[#FAF8F2] dark:bg-[#182820] hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#1E2923] dark:text-[#F5F3EA] font-semibold text-sm transition-all"
              >
                <span>Explore Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('routes')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-[#6F8F7A] dark:text-[#A4B588] hover:text-[#234D3C] dark:hover:text-[#F5F3EA] hover:underline"
              >
                <span>Explore Solution</span>
              </button>
            </div>
          </div>

          {/* Right Column: Abstract Smart City Map Illustration Card */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/12 dark:border-[#8EAD9A]/18 shadow-xl overflow-hidden">
              {/* Soft eco-tech background decorative circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#DCE7DE]/50 dark:bg-[#233C2F]/40 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#8A9A70]/15 dark:bg-[#6F8F7A]/20 blur-2xl pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#234D3C] dark:bg-[#7EA38B] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E2923] dark:text-[#F5F3EA]">
                      Real-time Smart City Dispatch
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] font-mono">
                    Node: Metro Center
                  </span>
                </div>

                {/* Abstract Route & AI Nodes Canvas Graphic */}
                <div className="h-56 relative rounded-2xl bg-[#EDEDE3]/70 dark:bg-[#14221A] border border-[#234D3C]/8 dark:border-[#8EAD9A]/12 p-3 overflow-hidden flex flex-col justify-between">
                  {/* Visual Route Polylines */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 320 200"
                    fill="none"
                  >
                    <path
                      d="M 30,160 Q 90,80 160,110 T 290,40"
                      stroke="#234D3C"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="opacity-70 dark:stroke-[#7EA38B]"
                    />
                    <path
                      d="M 50,40 C 110,30 180,170 270,160"
                      stroke="#6F8F7A"
                      strokeWidth="2"
                      className="opacity-60 dark:stroke-[#A4B588]"
                    />
                    <circle cx="30" cy="160" r="5" fill="#234D3C" />
                    <circle cx="160" cy="110" r="6" fill="#6F8F7A" />
                    <circle cx="290" cy="40" r="5" fill="#234D3C" />
                    <circle cx="50" cy="40" r="4" fill="#8A9A70" />
                    <circle cx="270" cy="160" r="4" fill="#8A9A70" />
                  </svg>

                  {/* Top telemetry badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F2]/90 dark:bg-[#182820]/90 border border-[#234D3C]/10 text-[11px] text-[#1E2923] dark:text-[#F5F3EA]">
                      <span className="font-semibold">V-102</span>
                      <span className="text-[#6F8F7A]">·</span>
                      <span>Ward 04 → Ward 12</span>
                    </div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                      18.4% Distance Saved
                    </div>
                  </div>

                  {/* Middle floating card */}
                  <div className="relative z-10 self-center w-4/5 p-2.5 rounded-xl bg-[#FAF8F2]/95 dark:bg-[#182820]/95 border border-[#234D3C]/15 shadow-sm text-left">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                        AI Classification: Plastic
                      </span>
                      <span className="text-[#234D3C] dark:text-[#7EA38B] font-bold">94%</span>
                    </div>
                    <div className="text-[10px] text-[#66736B] dark:text-[#95A89D] mt-0.5">
                      No duplicates · Auto-routed to Vehicle V-102
                    </div>
                  </div>

                  {/* Bottom telemetry badge */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-[#66736B] dark:text-[#95A89D]">
                    <span>OR-Tools CVRP Active</span>
                    <span className="flex items-center gap-1 text-[#234D3C] dark:text-[#A4B588]">
                      <Clock className="w-3 h-3" /> ETA 42 min
                    </span>
                  </div>
                </div>

                {/* Supporting Micro-Stats */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-left">
                  <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
                    <span className="block text-[11px] text-[#66736B] dark:text-[#95A89D]">
                      Hotspot Forecast
                    </span>
                    <span className="text-sm font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                      Ward 12 (89% Risk)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
                    <span className="block text-[11px] text-[#66736B] dark:text-[#95A89D]">
                      Response Turnaround
                    </span>
                    <span className="text-sm font-bold text-[#234D3C] dark:text-[#7EA38B]">
                      3.4 hrs (-58%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stat Cards (Large elegant numbers, soft borders) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-left transition-all hover:border-[#234D3C]/25">
            <span className="text-xs uppercase font-medium tracking-wider text-[#66736B] dark:text-[#95A89D]">
              Waste Complaints
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
              {totalComplaints.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] mt-1 block">
              +14% citizen engagement
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-left transition-all hover:border-[#234D3C]/25">
            <span className="text-xs uppercase font-medium tracking-wider text-[#66736B] dark:text-[#95A89D]">
              Resolved Complaints
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#234D3C] dark:text-[#7EA38B]">
              {resolvedComplaints.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] mt-1 block">
              81.5% resolution rate
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-left transition-all hover:border-[#234D3C]/25">
            <span className="text-xs uppercase font-medium tracking-wider text-[#66736B] dark:text-[#95A89D]">
              Active Collection Routes
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
              {activeRoutes}
            </div>
            <span className="text-[11px] text-[#8A9A70] dark:text-[#A4B588] mt-1 block">
              Google OR-Tools optimized
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-left transition-all hover:border-[#234D3C]/25">
            <span className="text-xs uppercase font-medium tracking-wider text-[#66736B] dark:text-[#95A89D]">
              Detected Hotspots
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
              {detectedHotspots}
            </div>
            <span className="text-[11px] text-[#6F8F7A] dark:text-[#A4B588] mt-1 block">
              Forecasted 24h in advance
            </span>
          </div>
        </div>
      </section>

      {/* Visual Workflow: Citizen → AI → Route Optimization → Clean City */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            End-To-End Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E2923] dark:text-[#F5F3EA]">
            How CleanRoute AI Works
          </h2>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            A unified pipeline bridging citizen awareness with algorithmic municipal logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-left flex flex-col justify-between group hover:border-[#234D3C]/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8A9A70] dark:text-[#A4B588] font-mono font-semibold mb-3">
                    <span>STEP {s.step}</span>
                    <Icon className="w-4 h-4 text-[#6F8F7A]" />
                  </div>
                  <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#66736B] dark:text-[#95A89D] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
                Municipal Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E2923] dark:text-[#F5F3EA] mt-1">
                Engineered for Sustainable Smart Cities
              </h2>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-[#234D3C] dark:text-[#A4B588] hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore Live Municipal Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-5 rounded-2xl bg-[#EDEDE3]/40 dark:bg-[#14221A] border border-[#234D3C]/8 dark:border-[#8EAD9A]/12 text-left space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                    {b.title}
                  </h4>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                    {b.stat}
                  </span>
                </div>
                <p className="text-xs text-[#66736B] dark:text-[#95A89D] leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Showcase */}
      <section className="max-w-7xl mx-auto px-4 text-left">
        <div className="p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15 pb-4">
            <div>
              <span className="text-xs uppercase font-semibold text-[#6F8F7A] dark:text-[#A4B588]">
                Technical Foundations
              </span>
              <h3 className="text-xl font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                Production-Ready Stack & Architecture
              </h3>
            </div>
            <button
              onClick={() => onNavigate('api-spec')}
              className="px-3 py-1.5 rounded-lg bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              View Spring Boot API Architecture
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
              <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">Frontend</span>
              <span className="text-[#66736B] dark:text-[#95A89D]">React 19 + TypeScript</span>
            </div>
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
              <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">Mapping</span>
              <span className="text-[#66736B] dark:text-[#95A89D]">Leaflet + OpenStreetMap</span>
            </div>
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
              <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">AI Vision</span>
              <span className="text-[#66736B] dark:text-[#95A89D]">Google Gemini Multimodal</span>
            </div>
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
              <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">Optimization</span>
              <span className="text-[#66736B] dark:text-[#95A89D]">Google OR-Tools (CVRP)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
              <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">Backend</span>
              <span className="text-[#66736B] dark:text-[#95A89D]">Spring Boot REST API</span>
            </div>
            <div className="p-3 rounded-xl bg-[#EDEDE3]/50 dark:bg-[#233C2F]/30 border border-[#234D3C]/8">
              <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">Spatial DB</span>
              <span className="text-[#66736B] dark:text-[#95A89D]">PostgreSQL + PostGIS</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
