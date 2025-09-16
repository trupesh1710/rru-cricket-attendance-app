import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../utils/AttendanceService';

export default function UserManagementScreen({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      setDeletingUserId(userId);
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
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
      <button onClick={onBack} className="mb-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">Back</button>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/10 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/20">
                  <td className="px-4 py-2">{user.name || 'N/A'}</td>
                  <td className="px-4 py-2">{user.email || 'N/A'}</td>
                  <td className="px-4 py-2">{user.role || 'user'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUserId === user.id}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
