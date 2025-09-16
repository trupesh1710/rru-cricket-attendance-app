import React, { useState, useEffect } from 'react';
import { getAllAttendance, getAllUsers, formatAttendanceTime, getStatusBadgeClass } from '../utils/AttendanceService';

export default function AdminReportsScreen({ onBack }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allAttendance = await getAllAttendance(2000);
      const allUsers = await getAllUsers();
      setAttendanceRecords(allAttendance);
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = attendanceRecords.length;
    const successCount = attendanceRecords.filter(r => r.status === 'success').length;
    const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;
    const absentCount = total - successCount;

    // Group by user
    const userStats = {};
    attendanceRecords.forEach(record => {
      if (!userStats[record.userId]) {
        userStats[record.userId] = { total: 0, success: 0 };
      }
      userStats[record.userId].total++;
      if (record.status === 'success') {
        userStats[record.userId].success++;
      }
    });

    return { total, successCount, successRate, absentCount, userStats };
  };

  const exportToCSV = () => {
    if (attendanceRecords.length === 0) return;

    const headers = ['User ID', 'User Name', 'Date & Time', 'Status', 'Distance (m)', 'Latitude', 'Longitude'];
    const csvContent = [
      headers.join(','),
      ...attendanceRecords.map(record => {
        const user = users.find(u => u.id === record.userId);
        return [
          record.userId,
          user?.name || 'Unknown',
          record.timestamp?.toDate()?.toLocaleString('en-IN') || 'N/A',
          record.status,
          record.distance?.toFixed(2) || 'N/A',
          record.location?.latitude?.toFixed(6) || 'N/A',
          record.location?.longitude?.toFixed(6) || 'N/A'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Generating admin report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-6xl w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Admin Attendance Report
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Global attendance summary for all users
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-slate-400">Total Records</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400">{stats.successCount}</div>
              <div className="text-sm text-slate-400">Present Days</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-red-400">{stats.absentCount}</div>
              <div className="text-sm text-slate-400">Absent Days</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">{stats.successRate}%</div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
          </div>

          {/* Export Button */}
          {attendanceRecords.length > 0 && (
            <div className="flex justify-center mb-6">
              <button
                onClick={exportToCSV}
                className="px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-xl font-semibold text-green-300 hover:bg-green-600/30 hover:text-white transition-all duration-300"
              >
                Export All Data to CSV
              </button>
            </div>
          )}

          {/* User Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">User Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.userStats).map(([userId, userStat]) => {
                const user = users.find(u => u.id === userId);
                const rate = userStat.total > 0 ? ((userStat.success / userStat.total) * 100).toFixed(1) : 0;
                return (
                  <div key={userId} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="font-semibold text-white">{user?.name || 'Unknown User'}</div>
                    <div className="text-sm text-slate-400">Total: {userStat.total}, Present: {userStat.success}, Rate: {rate}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Records Preview */}
          {attendanceRecords.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Records (Last 20)</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 hide-scrollbar">
                {attendanceRecords.slice(0, 20).map((record) => {
                  const user = users.find(u => u.id === record.userId);
                  return (
                    <div
                      key={record.id}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="text-slate-300 text-sm">
                        <div>{user?.name || 'Unknown'} - {formatAttendanceTime(record.timestamp)}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(record.status)}`}>
                        {record.status === 'success' ? 'Present' : 'Absent'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {attendanceRecords.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Data Available</h3>
              <p className="text-slate-400">No attendance records found to generate report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
