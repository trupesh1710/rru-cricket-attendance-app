import React, { useState } from 'react';
import LocationAttendanceScreen from './LocationAttendanceScreen.jsx';
import ViewAttendanceScreen from './ViewAttendanceScreen.jsx';
import UserProfileScreen from './UserProfileScreen.jsx';

export default function Dashboard({ user, onLogout }) {
  const [showLocationAttendance, setShowLocationAttendance] = useState(false);
  const [showViewAttendance, setShowViewAttendance] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  if (showLocationAttendance) {
    return <LocationAttendanceScreen user={user} onBack={() => setShowLocationAttendance(false)} />;
  }

  if (showViewAttendance) {
    return <ViewAttendanceScreen user={user} onBack={() => setShowViewAttendance(false)} />;
  }

  if (showUserProfile) {
    return <UserProfileScreen user={user} onBack={() => setShowUserProfile(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md w-full px-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Welcome, {user?.name || user?.username}
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              Role: {user?.role}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            <button
              onClick={() => setShowLocationAttendance(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Location Attendance
            </button>
            <button
              onClick={() => setShowViewAttendance(true)}
              className="px-6 py-3 bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              View Attendance
            </button>
            <button className="px-6 py-3 bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
              Generate Reports
            </button>
            <button
              onClick={() => setShowUserProfile(true)}
              className="px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-xl font-semibold text-green-300 hover:bg-green-600/30 hover:text-white transition-all duration-300"
            >
              View Profile
            </button>

            {user?.role === 'admin' && (
              <>
                <button className="px-6 py-3 bg-yellow-600 rounded-xl font-semibold text-white border border-yellow-500 hover:bg-yellow-700 transition-all duration-300">
                  Admin Panel
                </button>
                <button className="px-6 py-3 bg-red-600 rounded-xl font-semibold text-white border border-red-500 hover:bg-red-700 transition-all duration-300">
                  User Management
                </button>
              </>
            )}
          </div>

          <button
            onClick={onLogout}
            className="mt-8 px-6 py-3 bg-red-600/20 border border-red-500/30 rounded-xl font-semibold text-red-300 hover:bg-red-600/30 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
