import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllAttendance } from '../utils/AttendanceService';

export default function AdminReportsScreen({ onBack }) {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, attendanceData] = await Promise.all([
        getAllUsers(),
        getAllAttendance(2000)
      ]);

      setUsers(usersData);
      setAttendance(attendanceData);
    } catch (err) {
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    const days = ranges[dateRange] || 7;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  };

  const filterAttendanceByDate = (records) => {
    const cutoffDate = getDateRange();
    return records.filter(record => {
      const recordDate = record.timestamp?.toDate?.() || new Date(record.timestamp);
      return recordDate >= cutoffDate;
    });
  };

  const generateOverviewReport = () => {
    const filteredAttendance = filterAttendanceByDate(attendance);
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.role !== 'inactive').length;
    const totalRecords = filteredAttendance.length;
    const successRecords = filteredAttendance.filter(r => r.status === 'success').length;
    const absentRecords = filteredAttendance.filter(r => r.status === 'absent').length;
    const successRate = totalRecords > 0 ? ((successRecords / totalRecords) * 100).toFixed(1) : 0;

    return {
      totalUsers,
      activeUsers,
      totalRecords,
      successRecords,
      absentRecords,
      successRate
    };
  };

  const generateUserReport = () => {
    const filteredAttendance = filterAttendanceByDate(attendance);
    const userStats = {};

    filteredAttendance.forEach(record => {
      if (!userStats[record.userId]) {
        const user = users.find(u => u.id === record.userId);
        userStats[record.userId] = {
          name: user?.name || 'Unknown User',
          email: user?.email || 'N/A',
          total: 0,
          success: 0,
          absent: 0,
          attendanceRate: 0
        };
      }

      userStats[record.userId].total++;
      if (record.status === 'success') {
        userStats[record.userId].success++;
      } else if (record.status === 'absent') {
        userStats[record.userId].absent++;
      }
    });

    // Calculate attendance rates
    Object.keys(userStats).forEach(userId => {
      const user = userStats[userId];
      user.attendanceRate = user.total > 0 ? ((user.success / user.total) * 100).toFixed(1) : 0;
    });

    return Object.values(userStats).sort((a, b) => b.total - a.total);
  };

  const generateDailyReport = () => {
    const filteredAttendance = filterAttendanceByDate(attendance);
    const dailyStats = {};

    filteredAttendance.forEach(record => {
      const date = record.timestamp?.toDate?.() || new Date(record.timestamp);
      const dateKey = date.toDateString();

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          total: 0,
          success: 0,
          absent: 0,
          successRate: 0
        };
      }

      dailyStats[dateKey].total++;
      if (record.status === 'success') {
        dailyStats[dateKey].success++;
      } else if (record.status === 'absent') {
        dailyStats[dateKey].absent++;
      }
    });

    // Calculate success rates
    Object.keys(dailyStats).forEach(date => {
      const day = dailyStats[date];
      day.successRate = day.total > 0 ? ((day.success / day.total) * 100).toFixed(1) : 0;
    });

    return Object.values(dailyStats).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const exportReport = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderOverviewReport = () => {
    const report = generateOverviewReport();
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">User Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Total Users:</span>
                <span className="text-blue-400 font-bold">{report.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Active Users:</span>
                <span className="text-green-400 font-bold">{report.activeUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Attendance Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Total Records:</span>
                <span className="text-yellow-400 font-bold">{report.totalRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Success Rate:</span>
                <span className="text-green-400 font-bold">{report.successRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Status Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Successful:</span>
                <span className="text-green-400 font-bold">{report.successRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Absent:</span>
                <span className="text-red-400 font-bold">{report.absentRecords}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => exportReport([report], `overview-report-${new Date().toISOString().split('T')[0]}.csv`)}
            className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all duration-300"
          >
            Export CSV
          </button>
        </div>
      </div>
    );
  };

  const renderUserReport = () => {
    const userReport = generateUserReport();
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => exportReport(userReport, `user-report-${new Date().toISOString().split('T')[0]}.csv`)}
            className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all duration-300"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Success</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Absent</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                {userReport.map((user, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                    <td className="px-4 py-3 text-center">{user.total}</td>
                    <td className="px-4 py-3 text-center text-green-400">{user.success}</td>
                    <td className="px-4 py-3 text-center text-red-400">{user.absent}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${parseFloat(user.attendanceRate) >= 80 ? 'text-green-400' : parseFloat(user.attendanceRate) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {user.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDailyReport = () => {
    const dailyReport = generateDailyReport();
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => exportReport(dailyReport, `daily-report-${new Date().toISOString().split('T')[0]}.csv`)}
            className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all duration-300"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Success</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Absent</th>
                  <th className="px-4 py-3 text-left text-slate-300 font-medium">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {dailyReport.map((day, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3">{new Date(day.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">{day.total}</td>
                    <td className="px-4 py-3 text-center text-green-400">{day.success}</td>
                    <td className="px-4 py-3 text-center text-red-400">{day.absent}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${parseFloat(day.successRate) >= 80 ? 'text-green-400' : parseFloat(day.successRate) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {day.successRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p>{error}</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-600 rounded">Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">Back</button>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/30 hover:text-white transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="overview">Overview</option>
                <option value="users">User Report</option>
                <option value="daily">Daily Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {reportType === 'overview' && 'System Overview Report'}
            {reportType === 'users' && 'User Attendance Report'}
            {reportType === 'daily' && 'Daily Attendance Report'}
          </h2>

          {reportType === 'overview' && renderOverviewReport()}
          {reportType === 'users' && renderUserReport()}
          {reportType === 'daily' && renderDailyReport()}
        </div>
      </div>
    </div>
  );
}
