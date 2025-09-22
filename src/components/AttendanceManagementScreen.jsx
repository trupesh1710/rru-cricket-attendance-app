import React, { useEffect, useState } from 'react';
import { getAllAttendance, getAllUsers } from '../utils/AttendanceService';

export default function AttendanceManagementScreen({ onBack }) {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedRecords, setSelectedRecords] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceData, usersData] = await Promise.all([
        getAllAttendance(2000), // Get more records for admin
        getAllUsers()
      ]);

      setAttendance(attendanceData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.email || 'N/A';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'absent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredAttendance = attendance.filter(record => {
    const user = users.find(u => u.id === record.userId);
    const userName = user?.name || '';
    const userEmail = user?.email || '';

    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;

    const matchesDate = !filterDate || formatTimestamp(record.timestamp).includes(filterDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRecords.size === filteredAttendance.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filteredAttendance.map(record => record.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRecords.size === 0) {
      setError('Please select records to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRecords.size} attendance record(s)? This action cannot be undone.`)) {
      return;
    }

    // Note: In a real implementation, you would need a deleteAttendanceRecord function
    // For now, we'll just show a message
    setError(`Bulk delete functionality would delete ${selectedRecords.size} records. This feature needs backend implementation.`);
    setSelectedRecords(new Set());
  };

  // Calculate statistics
  const stats = {
    total: attendance.length,
    success: attendance.filter(r => r.status === 'success').length,
    absent: attendance.filter(r => r.status === 'absent').length,
    today: attendance.filter(record => {
      const recordDate = record.timestamp?.toDate?.() || new Date(record.timestamp);
      const today = new Date();
      return recordDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
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
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-600/30 hover:text-white transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Records</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-green-400">{stats.success}</div>
            <div className="text-sm text-slate-400">Successful</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-red-400">{stats.absent}</div>
            <div className="text-sm text-slate-400">Absent</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.today}</div>
            <div className="text-sm text-slate-400">Today</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by user or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {selectedRecords.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-600/30 hover:text-white transition-all duration-300"
              >
                Delete Selected ({selectedRecords.size})
              </button>
            )}
          </div>
        </div>

        {/* Attendance Table */}
        {filteredAttendance.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8 text-center">
            <p className="text-slate-300">No attendance records found matching your criteria.</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRecords.size === filteredAttendance.length && filteredAttendance.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-white/20 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">User</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Distance</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Timestamp</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map(record => (
                    <tr key={record.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                          className="rounded border-white/20 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-3">{getUserName(record.userId)}</td>
                      <td className="px-4 py-3 text-slate-400">{getUserEmail(record.userId)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {record.distance ? `${Math.round(record.distance)}m` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {record.location ? `${record.location.latitude.toFixed(4)}, ${record.location.longitude.toFixed(4)}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatTimestamp(record.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {/* TODO: Add edit functionality */}}
                          className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all duration-300 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {/* TODO: Add delete functionality */}}
                          className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-600/30 hover:text-white transition-all duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
