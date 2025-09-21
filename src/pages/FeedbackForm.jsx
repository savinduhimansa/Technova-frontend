// src/components/FeedbackForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

const FeedbackForm = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    serviceRating: '',
    comments: ''
  });

  // State to hold validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+$/i;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.serviceRating) {
      newErrors.serviceRating = 'Please select a rating';
    }

    if (!formData.comments) {
      newErrors.comments = 'Comments are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('http://localhost:5001/api/feedback', formData);
        toast.success('Thank you for your feedback! It has been submitted successfully.');
        // Reset form and errors
        setFormData({ email: '', name: '', serviceRating: '', comments: '' });
        setErrors({});
      } catch (error) {
        console.error('There was an error submitting the form:', error);
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      // Display an error if form validation fails
      toast.error('Please correct the form errors before submitting.');
    }
  };

  return (
    <>
      <div className="form-container min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
        <h2 className="form-title text-3xl font-extrabold text-fuchsia-400 drop-shadow-[0_0_12px_#f0f] text-center">
          Customer Feedback Form
        </h2>
        <p className="form-description mt-2 mb-8 text-center text-cyan-300">
          We'd love to hear about your experience with our system. Your feedback helps us improve!
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-2xl bg-gray-950/70 border border-fuchsia-600 shadow-[0_0_18px_rgba(255,0,255,0.4)] p-6 space-y-6"
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label block text-sm font-semibold text-cyan-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input w-full rounded-lg bg-gray-900 border border-cyan-400 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              placeholder="yourname@example.com"
            />
            {errors.email && (
              <p className="error-message mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label block text-sm font-semibold text-cyan-200 mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input w-full rounded-lg bg-gray-900 border border-cyan-400 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              placeholder="e.g., Jane Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label block text-sm font-semibold text-cyan-200 mb-2">
              How would you rate your overall experience?
            </label>
            <div className="rating-group flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label
                  key={rating}
                  className={`rating-label relative inline-flex items-center justify-center h-10 w-10 rounded-full cursor-pointer transition
                    ${formData.serviceRating === String(rating)
                      ? 'bg-gradient-to-br from-fuchsia-600 to-cyan-500 text-white shadow-[0_0_16px_rgba(255,0,255,0.6)]'
                      : 'bg-gray-900 text-cyan-300 border border-cyan-500/60 hover:bg-gray-800'
                    }`}
                >
                  <input
                    type="radio"
                    name="serviceRating"
                    value={rating}
                    checked={formData.serviceRating === String(rating)}
                    onChange={handleChange}
                    className="rating-radio absolute opacity-0 inset-0 cursor-pointer"
                  />
                  <span className="rating-star text-sm font-bold">{rating}</span>
                </label>
              ))}
            </div>
            {errors.serviceRating && (
              <p className="error-message mt-1 text-xs text-red-400">{errors.serviceRating}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comments" className="form-label block text-sm font-semibold text-cyan-200 mb-1">
              Comments or Suggestions
            </label>
            <textarea
              id="comments"
              name="comments"
              rows="4"
              value={formData.comments}
              onChange={handleChange}
              className="form-textarea w-full rounded-lg bg-gray-900 border border-cyan-400 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              placeholder="What did you like or what could be improved?"
            />
            {errors.comments && (
              <p className="error-message mt-1 text-xs text-red-400">{errors.comments}</p>
            )}
          </div>

          <div className="form-actions flex justify-end">
            <button
              type="submit"
              className="submit-button rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-2 text-sm font-bold text-white shadow-[0_0_16px_rgba(255,0,255,0.6)] hover:scale-105 transition-transform"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FeedbackForm;
