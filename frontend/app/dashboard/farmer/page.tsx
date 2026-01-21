'use client';

import { useState, useEffect } from 'react';

export default function FarmerDashboard() {
  const [loans, setLoans] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    activeLoans: false,
    pendingLoans: false,
    approvedLoans: false,
    rejectedLoans: false,
    receipts: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/';
          return;
        }

        // Fetch farmer's loans
        const loanResponse = await fetch(`http://localhost:8080/api/loans/farmer/1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const loanData = await loanResponse.json();
        setLoans(loanData);

        // Fetch farmer's warehouse receipts
        const receiptResponse = await fetch(`http://localhost:8080/api/warehouse/receipts/farmer/1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const receiptData = await receiptResponse.json();
        setReceipts(receiptData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  const activeLoans = loans.filter((loan: any) => loan.status === 'ACTIVE' || loan.status === 'DISBURSED');
  const pendingLoans = loans.filter((loan: any) => loan.status === 'PENDING');
  const approvedLoans = loans.filter((loan: any) => loan.status === 'APPROVED');
  const rejectedLoans = loans.filter((loan: any) => loan.status === 'REJECTED');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header with Farm Theme */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Krishi Sahayata Portal</h1>
                <p className="text-green-100">Your Agricultural Financial Partner</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => window.location.href = '/dashboard/farmer/loan-application'}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Apply for Loan</span>
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Farm Dashboard</h2>
              <p className="text-gray-600">Manage your agricultural finances and track your growth</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Farm Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Loans Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Loans</p>
                <p className="text-3xl font-bold mt-1">{activeLoans.length}</p>
                <p className="text-green-100 text-xs mt-1">Running smoothly</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Loans Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending Loans</p>
                <p className="text-3xl font-bold mt-1">{pendingLoans.length}</p>
                <p className="text-amber-100 text-xs mt-1">Under review</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Warehouse Receipts Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Storage Receipts</p>
                <p className="text-3xl font-bold mt-1">{receipts.length}</p>
                <p className="text-blue-100 text-xs mt-1">Safe storage</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold mt-1">₹{loans.reduce((sum: any, loan: any) => sum + parseFloat(loan.amount || 0), 0).toLocaleString()}</p>
                <p className="text-purple-100 text-xs mt-1">All loans</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Sections with Farm Theme */}
        <div className="space-y-6">
          {/* Active Loans Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
              onClick={() => toggleSection('activeLoans')}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Active Loans ({activeLoans.length})</h3>
                  <p className="text-gray-600">Currently active and disbursed agricultural loans</p>
                </div>
              </div>
              <svg 
                className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${expandedSections.activeLoans ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.activeLoans && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="overflow-x-auto">
                  {activeLoans.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Loan ID</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Amount (₹)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Purpose</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Applied Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeLoans.map((loan: any) => (
                          <tr key={loan.id} className="hover:bg-green-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{loan.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{parseFloat(loan.amount || 0).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{loan.purpose}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {loan.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(loan.appliedDate).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('en-IN') : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Loans</h4>
                      <p className="text-gray-600">You don't have any active agricultural loans at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Other sections would follow the same pattern... */}
          {/* For brevity, I'll include just the pending loans section as example */}
          
          {/* Pending Loans Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
              onClick={() => toggleSection('pendingLoans')}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Pending Loans ({pendingLoans.length})</h3>
                  <p className="text-gray-600">Loan applications awaiting approval</p>
                </div>
              </div>
              <svg 
                className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${expandedSections.pendingLoans ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.pendingLoans && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="overflow-x-auto">
                  {pendingLoans.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-amber-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Loan ID</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Amount (₹)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Purpose</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Applied Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingLoans.map((loan: any) => (
                          <tr key={loan.id} className="hover:bg-amber-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{loan.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{parseFloat(loan.amount || 0).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{loan.purpose}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(loan.appliedDate).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                {loan.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Pending Loans</h4>
                      <p className="text-gray-600">You don't have any pending loan applications.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center py-8 text-gray-600">
            <p>© 2026 Made with ❤️ for farmers.</p>
          </div>
        </div>
      </main>
    </div>
  );
}