import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Truck,
  X,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Complaint, ComplaintStatus, SeverityLevel, WasteCategory, CollectionVehicle } from '../types';

interface ComplaintManagementTableProps {
  complaints: Complaint[];
  vehicles: CollectionVehicle[];
  onAssignVehicle: (complaintId: string, vehicleId: string) => void;
  onUpdateStatus: (complaintId: string, status: ComplaintStatus) => void;
  onNavigateToMap: (complaintId: string) => void;
}

export const ComplaintManagementTable: React.FC<ComplaintManagementTableProps> = ({
  complaints,
  vehicles,
  onAssignVehicle,
  onUpdateStatus,
  onNavigateToMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);

  // Filtered complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || c.severity === severityFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'text-[#6F8F7A] dark:text-[#A4B588] bg-[#DCE7DE] dark:bg-[#233C2F]';
      case 'In Progress':
        return 'text-[#234D3C] dark:text-[#E2ECE5] bg-[#EDEDE3] dark:bg-[#1F362A]';
      case 'Assigned':
        return 'text-[#234D3C] dark:text-[#7EA38B] bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15';
      case 'Pending':
        return 'text-[#8A9A70] dark:text-[#A4B588] bg-[#EDEDE3]/80 dark:bg-[#14221A]';
    }
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical':
        return 'text-[#234D3C] dark:text-[#F5F3EA] font-bold';
      case 'High':
        return 'text-[#8A9A70] dark:text-[#A4B588] font-semibold';
      case 'Medium':
        return 'text-[#6F8F7A] dark:text-[#8EAD9A]';
      case 'Low':
        return 'text-[#66736B] dark:text-[#95A89D]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#6F8F7A] dark:text-[#A4B588]">
            Municipal Complaints Ledger
          </span>
          <h1 className="text-3xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
            Complaint Management
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#95A89D]">
            Track, filter, and assign incoming civic waste reports across all municipal wards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[#66736B] dark:text-[#95A89D]">
            Showing {filtered.length} of {complaints.length} records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#66736B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, location, ward..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Plastic">Plastic</option>
            <option value="Organic">Organic</option>
            <option value="Mixed Municipal">Mixed Municipal</option>
            <option value="Construction">Construction</option>
            <option value="Hazardous">Hazardous</option>
            <option value="Electronic">Electronic</option>
            <option value="Metal">Metal</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-[#234D3C]/12 dark:border-[#8EAD9A]/18 bg-[#FAF8F2] dark:bg-[#182820] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDEDE3]/60 dark:bg-[#14221A] border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-[#66736B] dark:text-[#95A89D] uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Complaint ID</th>
                <th className="py-3.5 px-4">Waste Type</th>
                <th className="py-3.5 px-4">Location & Ward</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Vehicle</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234D3C]/8 dark:divide-[#8EAD9A]/10 text-[#1E2923] dark:text-[#F5F3EA]">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-[#EDEDE3]/40 dark:hover:bg-[#233C2F]/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold">{c.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold block">{c.category}</span>
                    <span className="text-[10px] text-[#6F8F7A] dark:text-[#A4B588]">
                      {c.aiClassification.confidence}% confidence
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="truncate font-medium">{c.locationName}</p>
                    <span className="text-[10px] text-[#66736B] dark:text-[#95A89D]">
                      {c.ward}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={getSeverityBadge(c.severity)}>{c.severity}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-semibold ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {c.assignedVehicleId ? (
                      <span className="text-[#234D3C] dark:text-[#7EA38B] font-semibold">
                        {c.assignedVehicleId}
                      </span>
                    ) : (
                      <span className="text-[#8E9C92] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        title="View Details"
                        className="p-1.5 rounded-lg hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#66736B] hover:text-[#1E2923]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setAssignModalComplaint(c)}
                        title="Assign Vehicle"
                        className="p-1.5 rounded-lg hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </button>

                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() => onUpdateStatus(c.id, 'Resolved')}
                          title="Mark Resolved"
                          className="p-1.5 rounded-lg hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#6F8F7A]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2923]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-[#1E2923] dark:text-[#F5F3EA]">
                  Complaint {selectedComplaint.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                  {selectedComplaint.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-xl hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#66736B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-48 rounded-2xl overflow-hidden bg-[#EDEDE3] dark:bg-[#14221A]">
                <img
                  src={selectedComplaint.imageUrl}
                  alt={selectedComplaint.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#66736B] dark:text-[#95A89D] block text-[10px] uppercase font-semibold">
                    Description
                  </span>
                  <p className="font-medium text-[#1E2923] dark:text-[#F5F3EA]">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div>
                  <span className="text-[#66736B] dark:text-[#95A89D] block text-[10px] uppercase font-semibold">
                    Location & Ward
                  </span>
                  <p className="text-[#1E2923] dark:text-[#F5F3EA]">
                    {selectedComplaint.locationName} ({selectedComplaint.ward})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[#66736B] dark:text-[#95A89D] block text-[10px]">
                      Reported By
                    </span>
                    <span className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
                      {selectedComplaint.citizenName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#66736B] dark:text-[#95A89D] block text-[10px]">
                      Contact
                    </span>
                    <span className="font-mono text-[#1E2923] dark:text-[#F5F3EA]">
                      {selectedComplaint.citizenPhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Diagnostics */}
            <div className="p-4 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] border border-[#234D3C]/10 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1E2923] dark:text-[#F5F3EA]">
                  AI Inference Classification: {selectedComplaint.category} ({selectedComplaint.aiClassification.confidence}%)
                </span>
                <span className="text-[#234D3C] dark:text-[#7EA38B]">
                  Duplicate Check: {selectedComplaint.aiClassification.duplicateProbability}% (Low)
                </span>
              </div>
              <p className="text-[#66736B] dark:text-[#95A89D]">
                Recommended Action: {selectedComplaint.aiClassification.recommendedAction}
              </p>
              {selectedComplaint.resolutionNotes && (
                <div className="pt-1 text-[#234D3C] dark:text-[#A4B588]">
                  <strong>Resolution Notes:</strong> {selectedComplaint.resolutionNotes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onNavigateToMap(selectedComplaint.id);
                  setSelectedComplaint(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#234D3C] text-[#FAF8F2] text-xs font-semibold"
              >
                Track on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Assign Vehicle Modal */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2923]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#234D3C]/10">
              <h3 className="font-bold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                Assign Collection Vehicle
              </h3>
              <button
                onClick={() => setAssignModalComplaint(null)}
                className="p-1 rounded hover:bg-[#EDEDE3] text-[#66736B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#66736B] dark:text-[#95A89D]">
              Select a municipal fleet unit to dispatch for {assignModalComplaint.id} ({assignModalComplaint.category} waste in {assignModalComplaint.ward}).
            </p>

            <div className="space-y-2">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    onAssignVehicle(assignModalComplaint.id, v.id);
                    setAssignModalComplaint(null);
                  }}
                  className="p-3 rounded-xl border border-[#234D3C]/10 hover:border-[#234D3C]/40 bg-[#EDEDE3]/40 dark:bg-[#14221A] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-[#1E2923] dark:text-[#F5F3EA] block">
                      {v.id} - {v.driverName}
                    </span>
                    <span className="text-[11px] text-[#66736B] dark:text-[#95A89D]">
                      Current Ward: {v.currentWard} · Payload {v.currentLoadTons}/{v.capacityTons}T
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#234D3C] text-[#FAF8F2]">
                    Dispatch
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
