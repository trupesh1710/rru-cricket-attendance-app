import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { sendOtpEmail } from "../utils/otpUtils";

export default function LoginScreen({ onBack, onLogin }) {
  const { login, verifyOTP, resetPassword, sendPasswordResetOTP, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'

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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    setResetMessage('');
    try {
      // Reuse the registration OTP generation and email sending logic
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Remove setting OTP directly to input field
      // setOtp(otp);
      await sendOtpEmail(forgotEmail, otp, 'template_m7g1aad');
      setResetMessage('OTP sent to your email. Please check your inbox.');
      setStep('otp');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await verifyOTP(forgotEmail, otp);
      setResetMessage('OTP verified. Please enter your new password.');
      setStep('reset');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    try {
      await resetPassword(forgotEmail, newPassword);
      setResetMessage('Password reset successfully. You can now login with your new password.');
      setTimeout(() => {
        setIsForgotPassword(false);
        setStep('email');
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setResetMessage('');
      }, 3000);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">{isForgotPassword ? 'Reset Password' : 'User Login'}</h1>
        {isForgotPassword ? (
          <>
            {(error || localError) && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
                <p className="text-red-300 text-sm">{error || localError}</p>
              </div>
            )}
            {resetMessage && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                <p className="text-green-300 text-sm">{resetMessage}</p>
              </div>
            )}
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Send OTP</button>
              </form>
            )}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Verify OTP</button>
              </form>
            )}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Reset Password</button>
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setStep('email');
                setLocalError('');
                setResetMessage('');
                setForgotEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="mt-4 w-full py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition duration-300"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
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
            <button
              onClick={() => setIsForgotPassword(true)}
              className="mt-4 w-full py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition duration-300"
            >
              Forgot Password?
            </button>
            <button onClick={onBack} className="mt-6 w-full py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition duration-300">
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
