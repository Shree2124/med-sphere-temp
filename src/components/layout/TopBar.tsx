'use client';

import { useState } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { alerts as alertsData } from '@/lib/mock-data';

export function TopBar() {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = alertsData.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Search */}
        <div className="flex-1 max-w-md ml-12 lg:ml-0">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search patients, doctors, records..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              id="global-search"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifs(!showNotifs);
                setShowProfile(false);
              }}
              className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              id="notifications-toggle"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-[scale-in_0.15s_ease-out]">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <span className="text-xs text-brand-600 font-medium cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alertsData.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`px-3 py-2.5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!alert.read ? 'bg-brand-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            alert.priority === 'high'
                              ? 'bg-red-500'
                              : alert.priority === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-gray-300'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500">
                            {alert.type}
                          </p>
                          <p className="text-sm text-gray-700 truncate">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button className="w-full text-center text-xs text-brand-600 font-medium py-1.5 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 mx-1" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifs(false);
              }}
              className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              id="profile-toggle"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 leading-tight">
                  Admin
                </p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
              <ChevronDown
                size={14}
                className="text-gray-400 hidden sm:block"
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-[scale-in_0.15s_ease-out]">
                <div className="py-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    <User size={16} /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    <Settings size={16} /> Settings
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
