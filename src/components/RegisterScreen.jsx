import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import emailjs from '@emailjs/browser';
import { generateOtp, sendOtpEmail } from "../utils/otpUtils";

export default function RegisterScreen({ onBack, onRegister }) {
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [localError, setLocalError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    emailjs.init('pq9rl6ss1CvmYldsW'); // Updated with your Public Key
  }, []);

  const handleSendOtp = async () => {
    if (!formData.email) {
      setLocalError("Please enter email");
      return;
    }

    try {
      setLocalError('');
      const otp = generateOtp();
      setGeneratedOtp(otp);
      await sendOtpEmail(formData.email, otp);
      setOtpSent(true);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      setLocalError("Please enter OTP");
      return;
    }

    if (otp === generatedOtp) {
      setOtpVerified(true);
      setLocalError('');
    } else {
      setLocalError("Invalid OTP");
    }
  };

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

    if (!otpSent) {
      await handleSendOtp();
    } else if (!otpVerified) {
      handleVerifyOtp();
    } else {
      try {
        await register(formData.email, formData.password, {
          name: formData.name,
          email: formData.email
        });

        onRegister({
          name: formData.name,
          email: formData.email
        }, "register");

        setPopupMessage("Registration Successful! Your account has been created successfully.");
        setShowPopup(true);
      } catch (err) {
        if (err.code === 'auth/email-already-in-use' || err.message.includes('email-already-in-use') || err.message.includes('already in use')) {
          // Suppress duplicate error message since popup is shown elsewhere
          // setLocalError('');
          setPopupMessage("The email address is already in use by another account.");
          setShowPopup(true);
        } else {
          setLocalError(err.message);
        }
      }
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

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter OTP"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {otpSent ? 'Verify & Register' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/20">
            <h2 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent">
              {popupMessage === "Registration Successful! Your account has been created successfully." ? "Registration Successful" : "Error"}
            </h2>
            <p className="mb-6 text-white">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
