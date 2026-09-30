import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { PredictiveHotspot, CollectionVehicle } from '../types';

interface PredictiveHotspotsPageProps {
  hotspots: PredictiveHotspot[];
  vehicles: CollectionVehicle[];
  onNavigate: (page: string) => void;
  onSchedulePreventiveDispatch: (hotspotWard: string) => void;
}

export const PredictiveHotspotsPage: React.FC<PredictiveHotspotsPageProps> = ({
  hotspots,
  vehicles,
  onNavigate,
  onSchedulePreventiveDispatch,
}) => {
  const [scheduledWards, setScheduledWards] = useState<string[]>([]);

  const handleSchedule = (ward: string) => {
    setScheduledWards((prev) => [...prev, ward]);
    onSchedulePreventiveDispatch(ward);
  };

  // Prediction curve over next 48 hours for top high-risk hotspot (Ward 12)
  const forecastHoursData = [
    { hour: 'Now', actualWasteKg: 280, predictedAccumulationKg: 280, criticalThreshold: 600 },
    { hour: '+6h', actualWasteKg: null, predictedAccumulationKg: 390, criticalThreshold: 600 },
    { hour: '+12h', actualWasteKg: null, predictedAccumulationKg: 490, criticalThreshold: 600 },
    { hour: '+18h', actualWasteKg: null, predictedAccumulationKg: 580, criticalThreshold: 600 },
    { hour: '+24h', actualWasteKg: null, predictedAccumulationKg: 690, criticalThreshold: 600 },
    { hour: '+36h', actualWasteKg: null, predictedAccumulationKg: 780, criticalThreshold: 600 },
    { hour: '+48h', actualWasteKg: null, predictedAccumulationKg: 850, criticalThreshold: 600 },
  ];

  // Recurring frequency across wards
  const hotspotFrequencyData = [
    { ward: 'Ward 12', incidents: 38, avgConfidence: 89 },
    { ward: 'Ward 21', incidents: 42, avgConfidence: 91 },
    { ward: 'Ward 15', incidents: 35, avgConfidence: 87 },
    { ward: 'Ward 04', incidents: 29, avgConfidence: 82 },
    { ward: 'Ward 08', incidents: 24, avgConfidence: 76 },
    { ward: 'Ward 18', incidents: 16, avgConfidence: 71 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spatio-Temporal ML Forecasting</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            Predictive Waste Hotspots
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            Identify recurring accumulation zones before they become major problems.
          </p>
        </div>

        <button
          onClick={() => onNavigate('map')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity self-start md:self-auto"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View Hotspot Radii on Map</span>
        </button>
      </div>

      {/* Hotspots AI Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotspots.map((hs) => {
          const isHigh = hs.riskLevel === 'High';
          const isScheduled = scheduledWards.includes(hs.ward);

          return (
            <div
              key={hs.id}
              className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4 hover:border-[#234D3C]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                    {hs.ward}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isHigh ? 'bg-[#234D3C] dark:bg-[#7EA38B]' : 'bg-[#8A9A70]'
                      }`}
                    />
                    <span className="text-xs font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                      {hs.riskLevel} Risk
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                    {hs.locationName}
                  </h3>
                  <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                    Primary Waste Stream: {hs.primaryWasteType}
                  </p>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] text-xs">
                  <div>
                    <span className="text-[10px] text-[#66736B] dark:text-[#95A89D] block">
                      Predicted Accumulation
                    </span>
                    <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                      Next {hs.predictedAccumulationHours} hours
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66736B] dark:text-[#95A89D] block">
                      Prediction Confidence
                    </span>
                    <span className="font-semibold text-[#234D3C] dark:text-[#7EA38B]">
                      {hs.predictionConfidence}%
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-[#66736B] dark:text-[#95A89D] block">
                      Historical Reports
                    </span>
                    <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                      {hs.historicalComplaintsCount} past incidents
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-[#66736B] dark:text-[#95A89D] block">
                      Risk Trend
                    </span>
                    <span className="font-semibold text-[#8A9A70] dark:text-[#A4B588]">
                      {hs.riskTrend}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#66736B] dark:text-[#95A89D] p-3 rounded-xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10">
                  <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA] block mb-0.5">
                    Recommended Action:
                  </span>
                  {hs.recommendedAction}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isScheduled ? (
                  <div className="w-full py-2.5 rounded-xl bg-[#DCE7DE]/70 dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588] text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Preventive Dispatch Scheduled</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSchedule(hs.ward)}
                    className="w-full py-2.5 rounded-xl bg-[#234D3C] hover:bg-[#1D3F31] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Schedule Preventive Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Predictive Analytics & Trend Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: 48-Hour Accumulation Forecast Curve */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                Predicted Accumulation Curve (Ward 12 Corridor)
              </h3>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                Machine learning forecast vs bin capacity threshold (Next 48 Hours)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#234D3C] dark:text-[#7EA38B]">
              89% ML Confidence
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(35, 77, 60, 0.08)" />
                <XAxis dataKey="hour" stroke="#66736B" fontSize={11} tickLine={false} />
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
                  dataKey="predictedAccumulationKg"
                  name="Forecasted Volume (kg)"
                  stroke="#234D3C"
                  strokeWidth={3}
                  dot={{ fill: '#234D3C', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="criticalThreshold"
                  name="Overflow Limit (kg)"
                  stroke="#8A9A70"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hotspot Recurrence by Ward */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
              Hotspot Recurrence Frequency
            </h3>
            <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
              Historical cluster detections across 6 municipal zones
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotFrequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="incidents" fill="#6F8F7A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
