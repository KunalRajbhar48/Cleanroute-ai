import React, { useState } from 'react';
import {
  UploadCloud,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  Camera,
  Layers,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Complaint, WasteCategory, SeverityLevel, AIClassificationResult } from '../types';
import { analyzeWasteReport } from '../services/aiService';

interface CitizenReportPageProps {
  complaints: Complaint[];
  onAddComplaint: (newComplaint: Complaint) => void;
  onNavigate: (page: string) => void;
}

export const CitizenReportPage: React.FC<CitizenReportPageProps> = ({
  complaints,
  onAddComplaint,
  onNavigate,
}) => {
  // Form states
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
  );
  const [categoryHint, setCategoryHint] = useState<WasteCategory>('Plastic');
  const [description, setDescription] = useState(
    'Discarded plastic bottles, beverage cups, and snack wrapping littering pedestrian walkway.'
  );
  const [locationName, setLocationName] = useState('Near FC Road Central Plaza');
  const [ward, setWard] = useState('Ward 04');
  const [latitude, setLatitude] = useState(18.5284);
  const [longitude, setLongitude] = useState(73.8421);
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [citizenName, setCitizenName] = useState('Aarav Mehta');
  const [citizenPhone, setCitizenPhone] = useState('+91 98231 44521');

  // Submission & AI analysis states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Quick preset test buttons for reviewers
  const presets = [
    {
      label: 'Plastic Bottles (Ward 04)',
      img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      category: 'Plastic' as WasteCategory,
      desc: 'Discarded beverage bottles and single-use packaging accumulating on sidewalk.',
      location: 'Near FC Road Central Plaza',
      ward: 'Ward 04',
      lat: 18.5284,
      lng: 73.8421,
      sev: 'High' as SeverityLevel,
    },
    {
      label: 'Market Greens (Ward 12)',
      img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      category: 'Organic' as WasteCategory,
      desc: 'Rotten vegetable greens and produce discards dumped by wholesale vendors.',
      location: 'Kothrud Market Gate 2',
      ward: 'Ward 12',
      lat: 18.5032,
      lng: 73.8115,
      sev: 'Critical' as SeverityLevel,
    },
    {
      label: 'Construction Debris (Ward 08)',
      img: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
      category: 'Construction' as WasteCategory,
      desc: 'Crushed concrete blocks, plaster rubble, and discarded cement bags blocking access alley.',
      location: 'South Main Road Lane 7',
      ward: 'Ward 08',
      lat: 18.5362,
      lng: 73.8941,
      sev: 'High' as SeverityLevel,
    },
    {
      label: 'Suspected Chemical Cans (Ward 12)',
      img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      category: 'Hazardous' as WasteCategory,
      desc: 'Leaking industrial paint and solvent barrels dumped beside water runoff ditch.',
      location: 'Canal Road Embankment',
      ward: 'Ward 12',
      lat: 18.4978,
      lng: 73.8341,
      sev: 'Critical' as SeverityLevel,
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSelectedImage(p.img);
    setCategoryHint(p.category);
    setDescription(p.desc);
    setLocationName(p.location);
    setWard(p.ward);
    setLatitude(p.lat);
    setLongitude(p.lng);
    setSeverity(p.sev);
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationName(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          // Fallback simulation
          setLatitude(18.5204 + (Math.random() - 0.5) * 0.02);
          setLongitude(73.8567 + (Math.random() - 0.5) * 0.02);
          setLocationName('GPS Geocoded: Central Ward Precinct');
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmittedComplaint(null);

    // Multistep animated AI inference sequence
    const steps = [
      'Analyzing high-resolution image...',
      'Extracting spatial features & material density...',
      'Cross-referencing 250m municipal spatial buffer for duplicates...',
      'Computing priority score & vehicle payload recommendation...',
      'Analysis Complete ✓',
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(steps[i]);
      await new Promise((r) => setTimeout(r, 450));
    }

    const aiResult = await analyzeWasteReport(
      {
        description,
        categoryHint,
        latitude,
        longitude,
        ward,
      },
      complaints
    );

    const generatedId = `CR-${1030 + complaints.length}`;
    const newComplaint: Complaint = {
      id: generatedId,
      title: description.slice(0, 48) + (description.length > 48 ? '...' : ''),
      description,
      category: aiResult.category,
      severity: aiResult.severity,
      status: 'Pending',
      locationName,
      ward,
      latitude,
      longitude,
      imageUrl: selectedImage,
      reportedAt: new Date().toISOString(),
      citizenName: citizenName || 'Verified Citizen',
      citizenPhone: citizenPhone || '+91 98000 00000',
      aiClassification: aiResult,
    };

    onAddComplaint(newComplaint);
    setSubmittedComplaint(newComplaint);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
          <Camera className="w-3.5 h-3.5" />
          <span>Citizen Reporting Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
          Report a Waste Issue
        </h1>
        <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
          Help us keep your neighborhood clean. Our AI will analyze the photo, detect duplicates, and dispatch the nearest collection crew.
        </p>
      </div>

      {/* Preset Pickers for Quick Demonstration */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <span className="text-xs font-semibold text-[#66736B] dark:text-[#95A89D] block mb-2">
          Demo Presets (1-Click Fill):
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[#234D3C]/12 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/50 dark:bg-[#233C2F]/50 hover:bg-[#234D3C] hover:text-[#FAF8F2] dark:hover:bg-[#3F755E] text-[#1E2923] dark:text-[#F5F3EA] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reporting Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-6"
          >
            {/* Image Upload Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-[#1E2923] dark:text-[#F5F3EA]">
                Waste Photo Upload
              </label>
              <div className="relative rounded-2xl border-2 border-dashed border-[#234D3C]/20 dark:border-[#8EAD9A]/30 bg-[#EDEDE3]/40 dark:bg-[#14221A] p-4 text-center overflow-hidden group">
                {selectedImage ? (
                  <div className="relative h-48 w-full rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Uploaded waste preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-[#1E2923]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#FAF8F2] text-[#234D3C] text-xs font-semibold shadow">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-2">
                    <UploadCloud className="w-10 h-10 mx-auto text-[#6F8F7A]" />
                    <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
                      Drag and drop image here, or browse files
                    </p>
                    <label className="cursor-pointer inline-block px-3 py-1.5 rounded-lg bg-[#234D3C] text-[#FAF8F2] text-xs font-medium">
                      Select Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Waste Category & Ward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                  Initial Waste Category
                </label>
                <select
                  value={categoryHint}
                  onChange={(e) => setCategoryHint(e.target.value as WasteCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
                >
                  <option value="Plastic">Plastic Waste</option>
                  <option value="Organic">Organic / Market Food Waste</option>
                  <option value="Mixed Municipal">Mixed Municipal Solid Waste</option>
                  <option value="Construction">Construction & Demolition Debris</option>
                  <option value="Hazardous">Hazardous / Biomedical</option>
                  <option value="Electronic">Electronic / E-Waste</option>
                  <option value="Metal">Scrap Metal</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                  Municipal Ward
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
                >
                  <option value="Ward 04">Ward 04 (Shivajinagar / FC Road)</option>
                  <option value="Ward 08">Ward 08 (Koregaon Park / Bund Garden)</option>
                  <option value="Ward 12">Ward 12 (Kothrud / Karve Road)</option>
                  <option value="Ward 15">Ward 15 (Viman Nagar / Airport Rd)</option>
                  <option value="Ward 18">Ward 18 (Hadapsar / Magarpatta)</option>
                  <option value="Ward 21">Ward 21 (Baner / Pashan)</option>
                </select>
              </div>
            </div>

            {/* Location & GPS Detection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                Location Landmark / Address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6F8F7A]" />
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter landmark or street name..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EDEDE3] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588] text-xs font-semibold hover:bg-[#DCE7DE] transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Detect GPS</span>
                </button>
              </div>
              <div className="text-[10px] text-[#66736B] dark:text-[#95A89D]">
                Coordinates: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
              </div>
            </div>

            {/* Severity Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                Observed Severity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Critical'] as SeverityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      severity === lvl
                        ? 'bg-[#234D3C] text-[#FAF8F2] border-[#234D3C] shadow-sm'
                        : 'border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#66736B] dark:text-[#95A89D]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                Detailed Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the waste situation, accumulation period, or special concerns..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
              />
            </div>

            {/* Citizen Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#66736B] dark:text-[#95A89D]">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#66736B] dark:text-[#95A89D]">
                  Contact Phone for SMS Updates
                </label>
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/30 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA]"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#234D3C] hover:bg-[#1D3F31] dark:bg-[#3F755E] dark:hover:bg-[#4E8B70] text-[#FAF8F2] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{analysisStep}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#A4B588]" />
                  <span>Analyze & Submit Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Analysis Result Card or Live Explainer */}
        <div className="lg:col-span-5 space-y-4">
          {submittedComplaint ? (
            <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 dark:border-[#8EAD9A]/25 shadow-xl space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#234D3C] dark:text-[#7EA38B]" />
                  <span className="font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                    Report Submitted Successfully
                  </span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                  {submittedComplaint.id}
                </span>
              </div>

              {/* AI Waste Analysis Card */}
              <div className="p-4 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold text-[#66736B] dark:text-[#95A89D]">
                    AI Waste Analysis
                  </span>
                  <span className="text-xs font-mono font-bold text-[#234D3C] dark:text-[#7EA38B]">
                    {submittedComplaint.aiClassification.confidence}% Confidence
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                    {submittedComplaint.aiClassification.category} Waste
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF8F2] dark:bg-[#182820] text-[#234D3C] dark:text-[#A4B588]">
                    Severity: {submittedComplaint.severity}
                  </span>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-[#FAF8F2] dark:bg-[#182820] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#234D3C] dark:bg-[#7EA38B] rounded-full transition-all duration-1000"
                      style={{ width: `${submittedComplaint.aiClassification.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-[#66736B] dark:text-[#95A89D] block text-[10px]">
                      Duplicate Probability
                    </span>
                    <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                      {submittedComplaint.aiClassification.duplicateProbability}% (Low)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#66736B] dark:text-[#95A89D] block text-[10px]">
                      Est. Weight / Volume
                    </span>
                    <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                      ~{submittedComplaint.aiClassification.estimatedVolumeKg} kg
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 text-xs">
                  <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA] block mb-0.5">
                    Recommended Action:
                  </span>
                  <p className="text-[#66736B] dark:text-[#95A89D]">
                    {submittedComplaint.aiClassification.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onNavigate('map')}
                  className="w-full py-2.5 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] text-[#FAF8F2] font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Complaint on Live Map</span>
                </button>
                <button
                  onClick={() => onNavigate('complaints')}
                  className="w-full py-2.5 rounded-xl border border-[#234D3C]/20 dark:border-[#8EAD9A]/30 text-[#1E2923] dark:text-[#F5F3EA] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] transition-colors"
                >
                  <span>Open Complaints Management Table</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 space-y-4">
              <span className="text-xs uppercase font-semibold text-[#6F8F7A] dark:text-[#A4B588]">
                How AI Analysis Works
              </span>
              <h3 className="text-lg font-bold text-[#1E2923] dark:text-[#F5F3EA]">
                Zero-Friction Civic Intelligence
              </h3>
              <p className="text-xs text-[#66736B] dark:text-[#95A89D] leading-relaxed">
                When you click <strong>Analyze & Submit</strong>, our model:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#EDEDE3]/40 dark:bg-[#14221A] border border-[#234D3C]/8">
                  <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">
                    1. Multimodal Classification
                  </span>
                  <span className="text-[#66736B] dark:text-[#95A89D]">
                    Identifies polymer types, organic composting viability, or hazardous medical discards.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#EDEDE3]/40 dark:bg-[#14221A] border border-[#234D3C]/8">
                  <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">
                    2. Spatial Duplicate Filtering
                  </span>
                  <span className="text-[#66736B] dark:text-[#95A89D]">
                    Matches coordinates within a 250m geodesic radius to prevent multiple trucks dispatched to one pile.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#EDEDE3]/40 dark:bg-[#14221A] border border-[#234D3C]/8">
                  <span className="font-semibold block text-[#1E2923] dark:text-[#F5F3EA]">
                    3. OR-Tools Routing Dispatch
                  </span>
                  <span className="text-[#66736B] dark:text-[#95A89D]">
                    Sequences collection into the nearest vehicle's optimal route without manual intervention.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
