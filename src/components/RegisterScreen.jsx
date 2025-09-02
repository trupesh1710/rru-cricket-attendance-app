import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function RegisterScreen({ onBack, onRegister }) {
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        username: formData.username
      });
      
      // Registration successful, call the parent callback
      onRegister({
        name: formData.name,
        email: formData.email,
        username: formData.username
      }, "register");
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl" />
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              Register for cricket attendance system
            </p>
          </div>

          {(error || localError) && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-300 text-sm">{error || localError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Choose a username"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
