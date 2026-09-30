import React, { useState } from 'react';
import {
  Compass,
  FilePlus,
  LayoutDashboard,
  MapPin,
  Route as RouteIcon,
  TableProperties,
  Truck,
  BarChart3,
  Code2,
  Bell,
  Sun,
  Moon,
  User,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { NotificationItem, UserRole } from '../types';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  userRole,
  setUserRole,
  isDark,
  setIsDark,
  notifications,
  setNotifications,
  onOpenLogin,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navLinks = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'report', label: 'Report Waste', icon: FilePlus },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'hotspots', label: 'Hotspots', icon: Sparkles },
    { id: 'routes', label: 'Routes', icon: RouteIcon },
    { id: 'complaints', label: 'Complaints', icon: TableProperties },
    { id: 'vehicles', label: 'Fleet', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'api-spec', label: 'Architecture', icon: Code2 },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    citizen: { title: 'Citizen', color: 'text-[#6F8F7A] dark:text-[#A4B588]' },
    officer: { title: 'Municipal Officer', color: 'text-[#234D3C] dark:text-[#8EAD9A]' },
    worker: { title: 'Fleet Driver', color: 'text-[#8A9A70] dark:text-[#A4B588]' },
    admin: { title: 'Super Admin', color: 'text-[#234D3C] dark:text-[#E2ECE5]' },
  };

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#FAF8F2]/90 dark:bg-[#182820]/90 backdrop-blur-md border border-[#234D3C]/10 dark:border-[#8EAD9A]/15 shadow-sm">
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#234D3C] dark:bg-[#3F755E] flex items-center justify-center text-[#F5F3EA] shadow-inner group-hover:scale-105 transition-transform duration-200">
            {/* Minimal combined Leaf + Path + AI Node icon */}
            <svg
              className="w-5 h-5 text-[#FAF8F2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#1E2923] dark:text-[#F5F3EA]">
                CleanRoute<span className="text-[#6F8F7A] dark:text-[#A4B588]">AI</span>
              </span>
              <span className="hidden md:inline-block text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#DCE7DE]/70 dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                Aether '26
              </span>
            </div>
            <p className="text-[11px] text-[#66736B] dark:text-[#95A89D] hidden sm:block leading-none">
              Smart Waste Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-[#234D3C] text-[#FAF8F2] shadow-sm'
                    : 'text-[#66736B] dark:text-[#95A89D] hover:text-[#1E2923] dark:hover:text-[#F5F3EA] hover:bg-[#EDEDE3]/70 dark:hover:bg-[#233C2F]/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Notifications, Theme, Role Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-[#66736B] dark:text-[#95A89D] hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#234D3C] dark:bg-[#7EA38B] ring-2 ring-[#FAF8F2] dark:ring-[#182820]" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 shadow-xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#234D3C]/10 dark:border-[#8EAD9A]/15">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1E2923] dark:text-[#F5F3EA]">
                      Notifications
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#DCE7DE] dark:bg-[#233C2F] text-[#234D3C] dark:text-[#A4B588]">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#6F8F7A] dark:text-[#A4B588] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.linkPage) setActivePage(notif.linkPage);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                        notif.read
                          ? 'bg-transparent hover:bg-[#EDEDE3]/50 dark:hover:bg-[#233C2F]/40'
                          : 'bg-[#EDEDE3]/70 dark:bg-[#233C2F]/70 border-l-3 border-[#234D3C] dark:border-[#7EA38B]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {notif.type === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-[#8A9A70] flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6F8F7A] flex-shrink-0" />
                          )}
                          <span className="font-semibold text-xs text-[#1E2923] dark:text-[#F5F3EA]">
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#66736B] dark:text-[#95A89D]">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#66736B] dark:text-[#95A89D] mt-1 pl-5 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl text-[#66736B] dark:text-[#95A89D] hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#A4B588]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Role Indicator & Switcher Modal Trigger */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 bg-[#EDEDE3]/50 dark:bg-[#233C2F]/40 hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F] transition-colors text-xs"
          >
            <User className="w-3.5 h-3.5 text-[#6F8F7A]" />
            <div className="text-left hidden sm:block">
              <span className={`block font-semibold leading-tight ${roleLabels[userRole].color}`}>
                {roleLabels[userRole].title}
              </span>
            </div>
            <span className="text-[10px] text-[#66736B] dark:text-[#95A89D] hidden sm:inline">
              (Switch)
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl lg:hidden text-[#66736B] dark:text-[#95A89D] hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-3 rounded-2xl bg-[#FAF8F2] dark:bg-[#182820] border border-[#234D3C]/15 dark:border-[#8EAD9A]/20 shadow-lg space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-left transition-colors ${
                  isActive
                    ? 'bg-[#234D3C] text-[#FAF8F2]'
                    : 'text-[#66736B] dark:text-[#95A89D] hover:bg-[#EDEDE3] dark:hover:bg-[#233C2F]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
