'use client';

import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!showOtpInput) {
        // First login step - send credentials and receive OTP
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          setShowOtpInput(true);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Invalid credentials');
        }
      } else {
        // Second step - verify OTP
        const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, otp })
        });

        if (response.ok) {
          const data = await response.json();
          // Store token and redirect based on role
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('userRole', data.role);
          
          // Redirect based on role
          if (data.role === 'FARMER') {
            window.location.href = '/dashboard/farmer';
          } else if (data.role === 'LENDER') {
            window.location.href = '/dashboard/lender';
          } else if (data.role === 'ADMIN') {
            window.location.href = '/dashboard/admin';
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Invalid OTP');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Logo/Header Section */}
        <div className="text-center">
          <div className="mx-auto bg-gradient-to-r from-violet-500 to-purple-600 p-4 rounded-2xl shadow-2xl w-24 h-24 flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-4xl font-extrabold text-white">
            Krishi Sahayata
          </h2>
          <p className="mt-2 text-xl text-violet-200">
            Agricultural Credit Portal
          </p>
          <p className="mt-2 text-sm text-violet-300">
            Empowering Indian Farmers
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-violet-100 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 border border-violet-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {!showOtpInput && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-violet-100 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-violet-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              )}

              {showOtpInput && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-violet-100 mb-2">
                    OTP Verification
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="block w-full pl-10 pr-3 py-4 border border-violet-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                      placeholder="••••••"
                    />
                  </div>
                  <p className="mt-2 text-sm text-violet-200 text-center">
                    Enter the 6-digit OTP sent to your registered mobile
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-violet-900 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : showOtpInput ? (
                  'Verify OTP & Login'
                ) : (
                  'Continue to OTP'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-violet-200 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => window.location.href = '/register'}
                  className="font-medium text-violet-300 hover:text-white transition-colors duration-200"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-violet-300 text-sm">
          <p>© 2024 Krishi Sahayata Portal</p>
          <p className="mt-1">Empowering Indian Agriculture</p>
        </div>
      </div>
    </div>
  );
}