// Login.jsx
import React, { useState } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // log in as a user
    axios.post("http://localhost:5001/api/user/login", { email, password })
      .then((response) => {
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        const user = response.data.user;
        if (user.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        // User login failed, now attempt staff login
        axios.post("http://localhost:5001/api/staff/login", { email, password })
          .then((staffResponse) => {
            toast.success("Login successful");
            localStorage.setItem("token", staffResponse.data.token);

            const staffMember = staffResponse.data.user;
            if (staffMember.role === 'inventoryManager') {
              navigate("/inventoryManager", { state: { email: staffMember.email } });
            }
            if (staffMember.role === 'productManager') {
              navigate("/productManager", { state: { email: staffMember.email } });
            }
            if (staffMember.role === 'technician') {
              navigate("/technician", { state: { email: staffMember.email } });
            }
            if (staffMember.role === 'salesManager') {
              navigate("/salesdashboard", { state: { email: staffMember.email } });
            }
          })
          .catch((staffError) => {
            toast.error(staffError.response?.data?.message || "Login failed. Invalid email or password.");
          });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-950/80 border border-fuchsia-500 shadow-[0_0_25px_rgba(255,0,255,0.6)]">
        <h2 className="text-3xl font-extrabold text-fuchsia-400 text-center drop-shadow-[0_0_10px_#f0f]">
          Welcome Back!
        </h2>
        <p className="mt-2 text-center text-sm text-cyan-300">
          Login to your account!
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-cyan-400 px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            />
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-cyan-400 px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="/forget" className="text-xs text-fuchsia-400 hover:underline hover:text-fuchsia-300">
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(0,255,255,0.7)] hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-fuchsia-400 hover:underline hover:text-fuchsia-300">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
