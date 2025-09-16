import React, { useState, useEffect } from 'react';
import { getUserAttendance, formatAttendanceTime, getStatusBadgeClass } from '../utils/AttendanceService';

export default function ViewAttendanceScreen({ user, onBack }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceRecords();
  }, [user]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const records = await getUserAttendance(user.uid);
      setAttendanceRecords(records);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Present';
    case 'absent':
      return 'Absent';
      default:
        return status;
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading attendance records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Attendance History
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                {user?.name || user?.username}'s attendance records
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/10 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Back
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300">
              {error}
            </div>
          )}

          {/* Attendance Records */}
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Attendance Records</h3>
              <p className="text-slate-400">You haven't marked any attendance yet.</p>
            </div>
          ) : (
              <div className="max-h-[360px] overflow-y-auto space-y-4 hide-scrollbar">
              <div className="flex gap-8 text-sm text-gray-900 font-semibold px-4 py-2 bg-white rounded-t-xl sticky top-0 z-10 border-b border-gray-300">
                <div className="flex-1">Date &amp; Time</div>
                <div className="flex-1">Status</div>
                <div className="flex-1">Distance</div>
                <div className="flex-1">Location</div>
              </div>

              {attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex gap-8 items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-1 text-slate-300">
                    {formatAttendanceTime(record.timestamp)}
                  </div>
                  <div className="flex-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(record.status)}`}>
                      {getStatusText(record.status)}
                    </span>
                  </div>
                  <div className="flex-1 text-slate-300">
                    {formatDistance(record.distance)}
                  </div>
                  <div className="flex-1 text-slate-400 text-sm">
                    {record.location ? 
                      `${record.location.latitude.toFixed(6)}, ${record.location.longitude.toFixed(6)}` : 
                      'N/A'
                    }
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          {attendanceRecords.length > 0 && (
            <button
              onClick={fetchAttendanceRecords}
              className="mt-6 px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl font-semibold text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all duration-300"
            >
              Refresh Records
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
