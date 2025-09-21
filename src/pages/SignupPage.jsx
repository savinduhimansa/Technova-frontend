import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/user/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      console.log('Registration successful:', response.data);
      toast.success('Account created successfully! Please check your email for the OTP.');
      setShowOtpInput(true);
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      toast.error(
        `Registration failed: ${
          error.response ? error.response.data.message : 'An error occurred'
        }`
      );
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/user/verify-otp', {
        email: formData.email,
        otp: otp,
      });
      console.log('OTP verification successful:', response.data);
      toast.success('Email successfully verified! You can now log in.');
      navigate('/');
    } catch (error) {
      console.error('OTP verification failed:', error.response ? error.response.data : error.message);
      toast.error(
        `OTP verification failed: ${
          error.response ? error.response.data.message : 'An error occurred'
        }`
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6 relative overflow-hidden">
      {/* Neon background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,255,0.25),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.25),transparent_50%)] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-black/70 border border-fuchsia-600 rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.4)] backdrop-blur-md p-8">
        <h2 className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_#0ff]">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-6">Create your account!</p>

        {!showOtpInput ? (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-fuchsia-600 text-fuchsia-200 placeholder-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-fuchsia-600 text-fuchsia-200 placeholder-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-fuchsia-600 text-fuchsia-200 placeholder-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-fuchsia-600 text-fuchsia-200 placeholder-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(255,0,255,0.5)] hover:scale-105 transition-transform"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-gray-300 text-center">Enter the OTP sent to your email</p>
            <div className="input-group">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900/80 border border-cyan-400 text-cyan-200 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:scale-105 transition-transform"
            >
              Verify OTP
            </button>
          </form>
        )}

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-fuchsia-400 hover:text-cyan-300 font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
