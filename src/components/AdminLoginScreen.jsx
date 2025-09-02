import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AdminLoginScreen({ onBack, onLogin }) {
  const { adminLogin, error } = useAuth();
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const adminUser = await adminLogin(formData.adminId, formData.password);
      
      // Admin login successful, call the parent callback
      onLogin({ 
        name: adminUser.name,
        email: adminUser.email,
        adminId: adminUser.uid,
        role: 'admin'
      }, "admin");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-xl" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-slate-300 hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              Administrative access only
            </p>
          </div>

          {(error || localError) && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-300 text-sm">{error || localError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Admin ID</label>
              <input
                type="text"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter admin ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Admin Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
