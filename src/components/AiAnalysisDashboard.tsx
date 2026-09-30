import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  BarChart,
  Eye,
  Sliders,
} from 'lucide-react';
import { Complaint, WasteCategory } from '../types';

interface AiAnalysisDashboardProps {
  complaints: Complaint[];
  onNavigateToMap: (id: string) => void;
}

export const AiAnalysisDashboard: React.FC<AiAnalysisDashboardProps> = ({
  complaints,
  onNavigateToMap,
}) => {
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(complaints[0]?.id || 'CR-1024');
  const [duplicateThresholdBufferMeters, setDuplicateThresholdBufferMeters] = useState(150);

  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Computer Vision & Spatial Intelligence Bench</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            AI Complaint Analysis
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            Inspect multimodal model telemetry, confidence distributions, and spatial duplicate verification.
          </p>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Complaint Selector List */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#234D3C]/8">
            <span className="font-bold text-xs uppercase text-[#66736B] dark:text-[#95A89D]">
              Incoming Reports ({complaints.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {complaints.map((c) => {
              const isSelected = c.id === selectedComplaintId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaintId(c.id)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#234D3C] text-[#FAF8F2] border-[#234D3C] shadow-md'
                      : 'border-[#234D3C]/8 dark:border-[#8EAD9A]/12 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] hover:border-[#234D3C]/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">{c.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#FAF8F2]/20 text-[#FAF8F2]'
                          : 'bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]'
                      }`}
                    >
                      {c.aiClassification.confidence}% Conf.
                    </span>
                  </div>
                  <h4 className="font-bold mt-1 line-clamp-1">{c.title}</h4>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isSelected ? 'text-[#FAF8F2]/80' : 'text-[#66736B] dark:text-[#95A89D]'
                    }`}
                  >
                    {c.category} · {c.ward}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Model Inspector */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
              <div>
                <span className="font-mono font-bold text-sm text-[#234D3C] dark:text-[#7EA38B]">
                  Report {activeComplaint.id}
                </span>
                <h2 className="text-xl font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                  {activeComplaint.title}
                </h2>
                <span className="text-xs text-[#66736B] dark:text-[#95A89D]">
                  Location: {activeComplaint.locationName} ({activeComplaint.ward})
                </span>
              </div>

              <button
                onClick={() => onNavigateToMap(activeComplaint.id)}
                className="px-3.5 py-2 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Locate on Map</span>
              </button>
            </div>

            {/* Photo & Telemetry Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="h-60 rounded-2xl overflow-hidden bg-[#EDEDE3] dark:bg-[#14221A] border border-[#234D3C]/10">
                <img
                  src={activeComplaint.imageUrl}
                  alt={activeComplaint.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                {/* AI Classification Card */}
                <div className="p-4 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] border border-[#234D3C]/8 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
                      AI Classification
                    </span>
                    <span className="text-sm font-bold text-[#234D3C] dark:text-[#7EA38B]">
                      {activeComplaint.aiClassification.confidence}% Confidence
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                    {activeComplaint.category} Waste
                  </h3>

                  {/* Visual Confidence Progress Bar */}
                  <div className="h-2 w-full bg-[#FAF8F2] dark:bg-[#182820] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#234D3C] dark:bg-[#7EA38B] rounded-full"
                      style={{ width: `${activeComplaint.aiClassification.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Duplicate Detection Card */}
                <div className="p-4 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] border border-[#234D3C]/8 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
                      Spatial Duplicate Detection
                    </span>
                    <span className="text-sm font-bold text-[#8A9A70] dark:text-[#A4B588]">
                      {activeComplaint.aiClassification.duplicateProbability}% Match
                    </span>
                  </div>

                  <div className="text-[#1E2923] dark:text-[#F5F3EA] font-semibold">
                    {activeComplaint.aiClassification.duplicateProbability > 25
                      ? 'Potential Duplicate Cluster Detected'
                      : 'Low Probability — Verified Unique Incident'}
                  </div>

                  <div className="h-2 w-full bg-[#FAF8F2] dark:bg-[#182820] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8A9A70] dark:bg-[#A4B588] rounded-full"
                      style={{ width: `${activeComplaint.aiClassification.duplicateProbability}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Action Card */}
            <div className="p-5 rounded-2xl bg-[#DCE7DE]/50 dark:bg-[#233C2F]/40 border border-[#234D3C]/15 space-y-2 text-xs">
              <span className="font-bold text-[#234D3C] dark:text-[#E2ECE5] uppercase tracking-wider block">
                Recommended Action:
              </span>
              <p className="text-[#1E2923] dark:text-[#F5F3EA] text-sm leading-relaxed">
                “{activeComplaint.aiClassification.recommendedAction}”
              </p>
              <div className="text-[11px] text-[#66736B] dark:text-[#95A89D] pt-1">
                Estimated Volume: ~{activeComplaint.aiClassification.estimatedVolumeKg} kg ·
                Recyclability Index: {activeComplaint.aiClassification.recyclabilityScore}/100
              </div>
            </div>

            {/* Interactive Threshold Control */}
            <div className="p-4 rounded-2xl bg-[#EDEDE3]/40 dark:bg-[#14221A] border border-[#234D3C]/8 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#6F8F7A]" />
                  Spatial Duplicate Buffer Radius: {duplicateThresholdBufferMeters}m
                </span>
                <span className="text-[#66736B] dark:text-[#95A89D]">
                  PostGIS ST_DWithin Threshold
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={duplicateThresholdBufferMeters}
                onChange={(e) => setDuplicateThresholdBufferMeters(Number(e.target.value))}
                className="w-full accent-[#234D3C]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
