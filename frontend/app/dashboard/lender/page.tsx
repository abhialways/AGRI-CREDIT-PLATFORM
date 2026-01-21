'use client';

import { useState, useEffect } from 'react';

export default function LenderDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/';
          return;
        }

        // Fetch loans for this lender
        const response = await fetch(`http://localhost:8080/api/loans/lender/2`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleApprove = async (loanId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/loans/${loanId}/approve?lenderId=2`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the loans list
      const response = await fetch(`http://localhost:8080/api/loans/lender/2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handleReject = async (loanId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/loans/${loanId}/reject?remarks=Rejected by lender`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the loans list
      const response = await fetch(`http://localhost:8080/api/loans/lender/2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading lender dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header with Farm Theme */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Lender Dashboard</h1>
                <p className="text-green-100">Agricultural Finance Management</p>
              </div>
            </div>
            
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Loan Applications Review</h2>
              <p className="text-gray-600">Manage and process agricultural loan requests</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold mt-1">{loans.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold mt-1">{loans.filter((loan: any) => loan.status === 'APPROVED').length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold mt-1">{loans.filter((loan: any) => loan.status === 'PENDING').length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Loan Applications</h3>
            <p className="text-gray-600 mt-1">Review and process agricultural loan requests</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Amount (₹)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan: any) => (
                  <tr key={loan.id} className="hover:bg-green-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{loan.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.farmerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{parseFloat(loan.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{loan.purpose}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        loan.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                        loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(loan.appliedDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(loan.id)}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(loan.id)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {loan.status !== 'PENDING' && (
                        <span className="text-gray-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {loans.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Loan Applications</h4>
              <p className="text-gray-600">There are currently no loan applications to review.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}