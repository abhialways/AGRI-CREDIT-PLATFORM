'use client';

import { useState } from 'react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaar: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'FARMER'
  });
  const [verification, setVerification] = useState({
    aadhaarVerified: false,
    phoneVerified: false,
    verificationId: '',
    phoneOtp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const verifyAadhaar = async () => {
    if (formData.aadhaar.length !== 12 || !/^\d+$/.test(formData.aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/aadhaar-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaarNumber: formData.aadhaar,
          fullName: formData.fullName,
          dob: '1990-01-01' // Mock DOB
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setVerification(prev => ({
          ...prev,
          aadhaarVerified: true,
          verificationId: data.verificationId
        }));
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to verify Aadhaar');
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async () => {
    if (!/^\+91[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid Indian phone number (+91XXXXXXXXXX)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/send-otp-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`OTP sent to your phone: ${data.debugOtp}`);
        setError('OTP has been sent to your phone (check console for demo)');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = () => {
    // In demo, accept any 6-digit OTP
    if (verification.phoneOtp.length === 6 && /^\d+$/.test(verification.phoneOtp)) {
      setVerification(prev => ({ ...prev, phoneVerified: true }));
      setStep(3);
    } else {
      setError('Please enter a valid 6-digit OTP');
    }
  };

  const completeRegistration = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          verificationId: verification.verificationId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Registration successful! Please login.');
        window.location.href = '/';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Agricultural Credit System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Complete Registration - Step {step} of 3
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Aadhaar Verification */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Step 1: Aadhaar Verification</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                maxLength={12}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="123456789012"
                required
              />
            </div>

            <button
              onClick={verifyAadhaar}
              disabled={loading || !formData.fullName || formData.aadhaar.length !== 12}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Aadhaar'}
            </button>
          </div>
        )}

        {/* Step 2: Phone Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Step 2: Phone Verification</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+919876543210"
                required
              />
            </div>

            <button
              onClick={sendPhoneOtp}
              disabled={loading || !/^\+91[6-9]\d{9}$/.test(formData.phone)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            {verification.phoneOtp && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={verification.phoneOtp}
                  onChange={(e) => setVerification(prev => ({ ...prev, phoneOtp: e.target.value }))}
                  maxLength={6}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123456"
                />
                <button
                  onClick={verifyPhoneOtp}
                  className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Account Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Step 3: Account Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="FARMER">Farmer</option>
                <option value="LENDER">Lender</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              onClick={completeRegistration}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}