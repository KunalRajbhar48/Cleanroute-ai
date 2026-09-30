import React, { useState } from 'react';
import { X, User, Shield, Truck, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(currentRole);
  const [emailOrPhone, setEmailOrPhone] = useState('officer.sharma@cleanroute.gov');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const roles = [
    {
      role: 'citizen' as UserRole,
      title: 'Citizen',
      desc: 'Report issues, track complaint statuses, and review resolution photos.',
      icon: User,
      demoCred: 'aarav.mehta@citizen.net',
    },
    {
      role: 'officer' as UserRole,
      title: 'Municipal Officer',
      desc: 'Review AI inferences, detect duplicates, and assign fleet vehicles.',
      icon: Shield,
      demoCred: 'officer.sharma@cleanroute.gov',
    },
    {
      role: 'worker' as UserRole,
      title: 'Collection Worker',
      desc: 'Access turn-by-turn route waypoints and submit collection verifications.',
      icon: Truck,
      demoCred: 'driver.suresh@fleet.cleanroute.gov',
    },
    {
      role: 'admin' as UserRole,
      title: 'Super Admin',
      desc: 'Full system telemetry, Google OR-Tools tuning, and analytics audits.',
      icon: Compass,
      demoCred: 'admin@cleanroute.gov',
    },
  ];

  const handleRoleSelect = (role: UserRole, demoCred: string) => {
    setSelectedRoleTab(role);
    setEmailOrPhone(demoCred);
  };

  const handleConfirmLogin = (roleToApply?: UserRole) => {
    onSelectRole(roleToApply || selectedRoleTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2923]/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
          <div>
            <h2 className="text-xl font-extrabold text-[#1E2923] dark:text-[#F5F3EA]">
              CleanRoute AI Portal Login
            </h2>
            <p className="text-xs text-[#66736B] dark:text-[#95A89D]">
              Choose a municipal profile or continue as hackathon demo user.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] text-[#66736B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRoleTab === r.role;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => handleRoleSelect(r.role, r.demoCred)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#234D3C] text-[#FAF8F2] border-[#234D3C] shadow-sm'
                    : 'border-[#234D3C]/12 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/40 dark:bg-[#14221A] text-[#1E2923] dark:text-[#F5F3EA] hover:border-[#234D3C]/30'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1.5" />
                <span className="text-xs font-semibold block">{r.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role description */}
        <div className="p-3.5 rounded-2xl bg-[#EDEDE3]/50 dark:bg-[#14221A] border border-[#234D3C]/8 text-xs text-[#66736B] dark:text-[#95A89D]">
          {roles.find((r) => r.role === selectedRoleTab)?.desc}
        </div>

        {/* Mock Credentials Form */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">
              Email or Mobile Number
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#FAF8F2] dark:bg-[#182820] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#1E2923] dark:text-[#F5F3EA]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#FAF8F2] dark:bg-[#182820] text-[#1E2923] dark:text-[#F5F3EA] focus:outline-none focus:ring-1 focus:ring-[#234D3C]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Instant 1-Click Demo Login */}
          <button
            type="button"
            onClick={() => handleConfirmLogin(selectedRoleTab)}
            className="w-full py-3 rounded-xl bg-[#234D3C] hover:bg-[#1D3F31] dark:bg-[#3F755E] text-[#FAF8F2] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as Demo User ({roles.find((r) => r.role === selectedRoleTab)?.title})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-[#234D3C]/15 text-[#66736B] dark:text-[#95A89D] text-xs font-semibold hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
