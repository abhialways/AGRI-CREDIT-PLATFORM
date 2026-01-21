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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const activeLoans = loans.filter((loan: any) => loan.status === 'ACTIVE' || loan.status === 'DISBURSED');
  const pendingLoans = loans.filter((loan: any) => loan.status === 'PENDING');
  const approvedLoans = loans.filter((loan: any) => loan.status === 'APPROVED');
  const rejectedLoans = loans.filter((loan: any) => loan.status === 'REJECTED');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.href = '/dashboard/farmer/loan-application'}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply for Loan
            </button>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Loans</dt>
                    <dd className="text-lg font-medium text-gray-900">{activeLoans.length}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Loans</dt>
                    <dd className="text-lg font-medium text-gray-900">{pendingLoans.length}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Warehouse Receipts</dt>
                    <dd className="text-lg font-medium text-gray-900">{receipts.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Loan Sections */}
        <div className="space-y-6">
          {/* Active Loans Section */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleSection('activeLoans')}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Active Loans ({activeLoans.length})</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Currently active and disbursed loans</p>
              </div>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.activeLoans ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.activeLoans && (
              <div className="border-t border-gray-200">
                {activeLoans.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeLoans.map((loan: any) => (
                        <tr key={loan.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{parseFloat(loan.amount || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(loan.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No active loans found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pending Loans Section */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleSection('pendingLoans')}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Loans ({pendingLoans.length})</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Loans awaiting approval</p>
              </div>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.pendingLoans ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.pendingLoans && (
              <div className="border-t border-gray-200">
                {pendingLoans.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingLoans.map((loan: any) => (
                        <tr key={loan.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{parseFloat(loan.amount || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(loan.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No pending loans found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Approved Loans Section */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleSection('approvedLoans')}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Approved Loans ({approvedLoans.length})</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Approved but not yet disbursed</p>
              </div>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.approvedLoans ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.approvedLoans && (
              <div className="border-t border-gray-200">
                {approvedLoans.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {approvedLoans.map((loan: any) => (
                        <tr key={loan.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{parseFloat(loan.amount || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(loan.approvedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No approved loans found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rejected Loans Section */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleSection('rejectedLoans')}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Rejected Loans ({rejectedLoans.length})</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Rejected loan applications</p>
              </div>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.rejectedLoans ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.rejectedLoans && (
              <div className="border-t border-gray-200">
                {rejectedLoans.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rejectedLoans.map((loan: any) => (
                        <tr key={loan.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{parseFloat(loan.amount || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.approvedDate ? new Date(loan.approvedDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.remarks || 'No remarks'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No rejected loans found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Warehouse Receipts Section */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleSection('receipts')}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Warehouse Receipts ({receipts.length})</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Stored commodities</p>
              </div>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedSections.receipts ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSections.receipts && (
              <div className="border-t border-gray-200">
                {receipts.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commodity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stored Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {receipts.map((receipt: any) => (
                        <tr key={receipt.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.receiptNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{receipt.commodityName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.quantity} {receipt.unitOfMeasure}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              receipt.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                              receipt.status === 'RELEASED' ? 'bg-blue-100 text-blue-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {receipt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(receipt.storedDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No warehouse receipts found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}