import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error('Invalid or missing password reset token.');
      navigate('/forgot-password');
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    else setConfirmPassword(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && token) {
      try {
        await axios.post('http://localhost:5001/api/auth/reset-password', {
          token,
          newPassword: password,
        });

        toast.success('Password has been reset successfully!');
        navigate('/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('Failed to reset password. The token may be invalid or expired.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 relative overflow-hidden">
      {/* Neon glow background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,255,0.3),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.3),transparent_50%)] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-black/70 border border-fuchsia-600 rounded-2xl shadow-[0_0_25px_rgba(255,0,255,0.4)] backdrop-blur-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_#0ff]">
          Set New Password
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-fuchsia-400 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-fuchsia-600 text-fuchsia-200 placeholder-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-fuchsia-400 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-fuchsia-600 text-fuchsia-200 placeholder-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(255,0,255,0.5)] hover:scale-105 transition-transform"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
