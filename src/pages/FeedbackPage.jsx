// src/components/FeedbackPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Could not load feedbacks.');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-16 px-6 relative overflow-hidden">
      {/* Background glowing grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.2),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2),transparent_40%)] animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-10 bg-black/70 border border-fuchsia-600 rounded-3xl shadow-[0_0_35px_rgba(255,0,255,0.35)] backdrop-blur-md p-8">
        {/* Feedback Form */}
        <div className="w-full lg:w-1/2 border border-cyan-400 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.35)] p-6 bg-gray-950/80">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_14px_#f0f]">
            Share Your Feedback
          </h2>
          <FeedbackForm onFeedbackSubmitted={fetchFeedbacks} />
        </div>

        {/* Feedback List */}
        <div className="w-full lg:w-1/2">
          <FeedbackList feedbacks={feedbacks} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
