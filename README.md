# Agricultural Credit & Commodity Management System

A full-stack agricultural credit and commodity management system built with Next.js and Spring Boot, designed to facilitate agricultural lending and warehouse receipt management.

## 🌾 Features

- **Multi-role Authentication**: Farmer, Lender, and Admin roles with role-based access control
- **OTP-based Login**: Secure two-factor authentication with phone OTP verification
- **KYC Verification**: Aadhaar and PAN verification workflows
- **Loan Management**: Complete loan application, approval, and tracking system
- **Warehouse Receipts**: Digital warehouse receipt management for commodities
- **Responsive UI**: Mobile-first design with agricultural-themed interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Spring Boot, Java 17
- **Database**: PostgreSQL (simulated with mock server in this version)
- **Authentication**: JWT with OTP verification
- **Styling**: Tailwind CSS with custom agricultural theme

## 📋 Prerequisites

- Node.js 18+ 
- Java 17+
- npm or yarn

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/abhialways/AGRI-CREDIT-PLATFORM.git
cd AGRI-CREDIT-PLATFORM
```

2. Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

3. Start the mock backend server:
```bash
cd ..  # Navigate back to root
node mock-server.js
```

4. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

5. Open your browser and visit `http://localhost:3000`

## 🔐 Default Credentials

The system uses phone number-based authentication with OTP:

- **Farmer**: Use any valid phone number, OTP is any 6-digit number
- **Lender**: Use any valid phone number, OTP is any 6-digit number  
- **Admin**: Use any valid phone number, OTP is any 6-digit number

## 🏗️ Project Structure

```
AGRI-CREDIT-PLATFORM/
├── backend/                 # Spring Boot backend (Java)
│   ├── src/main/java/com/agricredit/
│   │   ├── controller/      # REST controllers
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   └── dto/             # Data transfer objects
│   └── pom.xml              # Maven dependencies
├── frontend/                # Next.js frontend
│   ├── app/                 # Next.js app router pages
│   │   ├── dashboard/       # Role-specific dashboards
│   │   │   ├── farmer/      # Farmer dashboard
│   │   │   ├── lender/      # Lender dashboard  
│   │   │   └── admin/       # Admin dashboard
│   │   ├── register/        # Registration page
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── next.config.js       # Next.js configuration
├── mock-server.js           # Mock backend server for demonstration
└── README.md
```

## 🎨 Agricultural Theme

The UI features an agricultural-themed design with:
- Green color palette representing growth and nature
- Farm-friendly icons and imagery
- Responsive layouts suitable for mobile devices commonly used by farmers
- Intuitive navigation for users with varying technical expertise

## 🧪 Testing

The application includes mock data for testing different scenarios:
- Loan applications with various statuses (Pending, Approved, Rejected)
- Warehouse receipts for different commodities
- Multi-role access with appropriate permissions

## 📱 Mobile Responsiveness

The application is designed to work seamlessly on mobile devices, tablets, and desktops, making it accessible to farmers who primarily use smartphones.

## 🚢 Future Enhancements

Potential enhancements for production deployment:
- Blockchain integration for immutable transaction records
- Real-time commodity price feeds
- GPS-enabled warehouse locations
- Advanced analytics dashboard
- Integration with government agricultural databases
- Offline capability for areas with poor connectivity

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.