'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

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
        const response = await axios.get(`http://localhost:8080/api/loans/lender/2`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoans(response.data);
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
      await axios.put(`http://localhost:8080/api/loans/${loanId}/approve?lenderId=2`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the loans list
      const response = await axios.get(`http://localhost:8080/api/loans/lender/2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(response.data);
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handleReject = async (loanId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/loans/${loanId}/reject?remarks=Rejected by lender`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the loans list
      const response = await axios.get(`http://localhost:8080/api/loans/lender/2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(response.data);
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Loans</dt>
                    <dd className="text-lg font-medium text-gray-900">{loans.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd className="text-lg font-medium text-gray-900">{loans.filter((loan: any) => loan.status === 'APPROVED').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{loans.filter((loan: any) => loan.status === 'PENDING').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loans Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Loan Applications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review and manage loan applications</p>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan: any) => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.farmerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(loan.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                          loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(loan.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(loan.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {loan.status !== 'PENDING' && (
                        <span className="text-gray-500">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}