import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen({ onBack, onLogin }) {
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const user = await login(formData.email, formData.password);
      
      // Login successful, call the parent callback
      onLogin({
        name: user.displayName || user.email,
        email: user.email,
        uid: user.uid
      }, "login");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">User Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || localError) && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-300 text-sm">{error || localError}</p>
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
        <button onClick={onBack} className="mt-6 w-full py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition duration-300">
          Back
        </button>
      </div>
    </div>
  );
}
