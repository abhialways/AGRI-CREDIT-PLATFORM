const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Mock data
let users = [
  { 
    id: 1, 
    username: 'farmer1', 
    email: 'farmer1@example.com', 
    password: 'password123', 
    role: 'FARMER', 
    fullName: 'John Farmer', 
    isActive: true,
    aadhaar: '123456789012',
    phone: '+919876543210',
    address: '123 Farm Road, Village ABC',
    kycVerified: true
  },
  { 
    id: 2, 
    username: 'lender1', 
    email: 'lender1@example.com', 
    password: 'password123', 
    role: 'LENDER', 
    fullName: 'Jane Lender', 
    isActive: true,
    aadhaar: '234567890123',
    phone: '+918765432109',
    address: '456 Finance Street, City XYZ',
    kycVerified: true
  },
  { 
    id: 3, 
    username: 'admin1', 
    email: 'admin1@example.com', 
    password: 'password123', 
    role: 'ADMIN', 
    fullName: 'Bob Admin', 
    isActive: true,
    aadhaar: '345678901234',
    phone: '+917654321098',
    address: '789 Admin Building, Capital City',
    kycVerified: true
  }
];

let loans = [
  { id: 1, farmerId: 1, lenderId: 2, amount: 5000.00, purpose: 'Seed purchase', interestRate: 8.5, durationInMonths: 12, status: 'APPROVED', appliedDate: '2023-01-15T10:30:00', approvedDate: '2023-01-20T14:45:00', remarks: '', blockchainTransactionHash: '0xa1b2c3d4e5f6' },
  { id: 2, farmerId: 1, amount: 2500.00, purpose: 'Equipment rental', interestRate: 7.0, durationInMonths: 6, status: 'PENDING', appliedDate: '2023-02-10T09:15:00', remarks: '', blockchainTransactionHash: '0xf6e5d4c3b2a1' }
];

let receipts = [
  { id: 1, farmerId: 1, commodityName: 'Wheat', variety: 'Premium Wheat', quantity: 100, unitOfMeasure: 'kg', warehouseLocation: 'Central Warehouse A', warehouseKeeperName: 'Tom Wilson', storedDate: '2023-03-01T08:00:00', status: 'ACTIVE', receiptNumber: 'WR-123456789', blockchainTransactionHash: '0x123456789abc' }
];

let otpStore = {};

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to generate JWT-like token
function generateToken(userId, username, role) {
  return `mock_token_${userId}_${username}_${role}`;
}

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Generate OTP
  const otp = generateOTP();
  otpStore[username] = {
    otp: otp,
    expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
  
  // Log OTP to console for testing
  console.log(`OTP for ${username}: ${otp}`);
  
  res.json({
    message: `OTP generated: ${otp}. Please enter this code.`,
    userId: user.id,
    username: user.username,
    role: user.role,
    debugOtp: otp // For testing purposes only
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { username, otp } = req.body;
  
  const otpData = otpStore[username];
  
  // For demo purposes, accept any 6-digit OTP
  if (!otpData || otp.length !== 6 || !/\d{6}/.test(otp)) {
    return res.status(400).json({ message: 'Invalid OTP format. Please enter a 6-digit number.' });
  }
  
  // In demo mode, accept any OTP
  console.log(`Accepting OTP ${otp} for ${username} (demo mode)`);
  
  if (Date.now() > otpData.expiry) {
    delete otpStore[username];
    return res.status(400).json({ message: 'OTP has expired' });
  }
  
  // Clear OTP after successful verification
  delete otpStore[username];
  
  const user = users.find(u => u.username === username);
  
  const accessToken = generateToken(user.id, user.username, user.role);
  const refreshToken = generateToken(user.id, user.username, user.role);
  
  res.json({
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    userId: user.id,
    username: user.username,
    role: user.role
  });
});

// Aadhaar Verification Endpoint
app.post('/api/auth/aadhaar-verify', (req, res) => {
  const { aadhaarNumber, fullName, dob } = req.body;
  
  // Mock Aadhaar verification (in real app, this would connect to UIDAI)
  if (aadhaarNumber && aadhaarNumber.length === 12 && /^\d+$/.test(aadhaarNumber)) {
    // Simulate successful verification
    const verificationId = `VID_${Date.now()}`;
    
    res.json({
      success: true,
      verificationId,
      message: 'Aadhaar verified successfully',
      name: fullName,
      aadhaarLast4: aadhaarNumber.slice(-4)
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid Aadhaar number format'
    });
  }
});

// Phone Number Verification
app.post('/api/auth/send-otp-phone', (req, res) => {
  const { phone } = req.body;
  
  if (phone && /^\+91[6-9]\d{9}$/.test(phone)) {
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Phone OTP for ${phone}: ${phoneOtp}`);
    
    res.json({
      success: true,
      message: `OTP sent to ${phone}`,
      debugOtp: phoneOtp
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid Indian phone number format'
    });
  }
});

// Complete Registration with KYC
app.post('/api/auth/register-complete', (req, res) => {
  const { username, email, password, role, fullName, aadhaar, phone, address, verificationId } = req.body;
  
  // Validate required fields
  if (!username || !email || !password || !aadhaar || !phone) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }
  
  // Check if user already exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  
  if (users.some(u => u.aadhaar === aadhaar)) {
    return res.status(400).json({ message: 'Aadhaar already registered' });
  }
  
  if (users.some(u => u.phone === phone)) {
    return res.status(400).json({ message: 'Phone number already registered' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // In real app, this would be hashed
    role: role || 'FARMER',
    fullName,
    aadhaar,
    phone,
    address: address || '',
    isActive: true,
    kycVerified: true,
    registrationDate: new Date().toISOString(),
    verificationId
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    message: 'Registration completed successfully',
    userId: newUser.id,
    username: newUser.username,
    role: newUser.role
  });
});

// Original simple register endpoint (kept for backward compatibility)
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, role, fullName } = req.body;
  
  // Check if user already exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // In real app, this would be hashed
    role: role || 'FARMER',
    fullName: fullName || username,
    isActive: true,
    kycVerified: false
  };
  
  users.push(newUser);
  
  res.json({
    message: 'User registered successfully',
    userId: newUser.id,
    username: newUser.username,
    role: newUser.role
  });
});

// Loan endpoints
app.post('/api/loans/apply', (req, res) => {
  const { farmerId, amount, purpose, interestRate, durationInMonths } = req.body;
  
  const newLoan = {
    id: loans.length + 1,
    farmerId,
    amount,
    purpose,
    interestRate,
    durationInMonths,
    status: 'PENDING',
    appliedDate: new Date().toISOString(),
    remarks: '',
    blockchainTransactionHash: `0x${Math.random().toString(36).substring(2, 15)}`
  };
  
  loans.push(newLoan);
  
  res.json(newLoan);
});

app.put('/api/loans/:loanId/approve', (req, res) => {
  const loanId = parseInt(req.params.loanId);
  const { lenderId } = req.query;
  
  const loanIndex = loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1) {
    return res.status(404).json({ message: 'Loan not found' });
  }
  
  if (loans[loanIndex].status !== 'PENDING') {
    return res.status(400).json({ message: 'Loan is not in pending status' });
  }
  
  loans[loanIndex].status = 'APPROVED';
  loans[loanIndex].lenderId = parseInt(lenderId);
  loans[loanIndex].approvedDate = new Date().toISOString();
  
  res.json(loans[loanIndex]);
});

app.put('/api/loans/:loanId/reject', (req, res) => {
  const loanId = parseInt(req.params.loanId);
  const { remarks } = req.query;
  
  const loanIndex = loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1) {
    return res.status(404).json({ message: 'Loan not found' });
  }
  
  if (loans[loanIndex].status !== 'PENDING') {
    return res.status(400).json({ message: 'Loan is not in pending status' });
  }
  
  loans[loanIndex].status = 'REJECTED';
  loans[loanIndex].remarks = remarks || '';
  
  res.json(loans[loanIndex]);
});

app.get('/api/loans/farmer/:farmerId', (req, res) => {
  const farmerId = parseInt(req.params.farmerId);
  const farmerLoans = loans.filter(loan => loan.farmerId === farmerId);
  
  // Add farmer names to the response
  const result = farmerLoans.map(loan => ({
    ...loan,
    farmerName: users.find(u => u.id === loan.farmerId)?.fullName || 'Unknown Farmer',
    lenderName: loan.lenderId ? users.find(u => u.id === loan.lenderId)?.fullName || 'Unknown Lender' : null
  }));
  
  res.json(result);
});

app.get('/api/loans/lender/:lenderId', (req, res) => {
  const lenderId = parseInt(req.params.lenderId);
  const lenderLoans = loans.filter(loan => loan.lenderId === lenderId);
  
  // Add farmer and lender names to the response
  const result = lenderLoans.map(loan => ({
    ...loan,
    farmerName: users.find(u => u.id === loan.farmerId)?.fullName || 'Unknown Farmer',
    lenderName: users.find(u => u.id === loan.lenderId)?.fullName || 'Unknown Lender'
  }));
  
  res.json(result);
});

app.get('/api/loans', (req, res) => {
  const result = loans.map(loan => ({
    ...loan,
    farmerName: users.find(u => u.id === loan.farmerId)?.fullName || 'Unknown Farmer',
    lenderName: loan.lenderId ? users.find(u => u.id === loan.lenderId)?.fullName || 'Unknown Lender' : null
  }));
  
  res.json(result);
});

// Warehouse Receipt endpoints
app.post('/api/warehouse/receipts', (req, res) => {
  const { farmerId, commodityName, variety, quantity, unitOfMeasure, warehouseLocation, warehouseKeeperName, qualityGrade, condition, remarks } = req.body;
  
  const newReceipt = {
    id: receipts.length + 1,
    farmerId,
    commodityName,
    variety,
    quantity,
    unitOfMeasure,
    warehouseLocation,
    warehouseKeeperName,
    storedDate: new Date().toISOString(),
    status: 'ACTIVE',
    receiptNumber: `WR-${Date.now()}`,
    blockchainTransactionHash: `0x${Math.random().toString(36).substring(2, 15)}`,
    qualityGrade: qualityGrade || 'Standard',
    condition: condition || 'Good',
    remarks: remarks || ''
  };
  
  receipts.push(newReceipt);
  
  res.json(newReceipt);
});

app.get('/api/warehouse/receipts/farmer/:farmerId', (req, res) => {
  const farmerId = parseInt(req.params.farmerId);
  const farmerReceipts = receipts.filter(receipt => receipt.farmerId === farmerId);
  
  const result = farmerReceipts.map(receipt => ({
    ...receipt,
    farmerName: users.find(u => u.id === receipt.farmerId)?.fullName || 'Unknown Farmer'
  }));
  
  res.json(result);
});

app.get('/api/warehouse/receipts', (req, res) => {
  const result = receipts.map(receipt => ({
    ...receipt,
    farmerName: users.find(u => u.id === receipt.farmerId)?.fullName || 'Unknown Farmer'
  }));
  
  res.json(result);
});

app.listen(port, () => {
  console.log(`Mock backend server running at http://localhost:${port}`);
});