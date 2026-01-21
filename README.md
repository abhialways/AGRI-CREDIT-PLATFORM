# Agricultural Credit & Commodity Management System

A full-stack prototype for an agricultural credit and commodity management system built with Next.js (frontend) and Spring Boot (backend).

## 🚀 Features

- **Multi-role Authentication**: Farmer, Lender, and Admin roles
- **OTP-based Security**: Two-factor authentication with OTP verification
- **Loan Management**: Apply for, approve, and track loans
- **Warehouse Receipt Management**: Store and manage commodity receipts
- **Blockchain Integration**: Mock blockchain transaction hashing
- **Responsive UI**: Modern dashboard for each user role

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL with JPA/Hibernate
- **Security**: Spring Security + JWT
- **Caching**: Redis (optional)

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6.0 or higher
- Node.js 16 or higher
- npm or yarn
- PostgreSQL
- Redis (optional)

## 🏗️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd d:\proto\agricultural-credit-system\backend
```

2. Configure the database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agricredit_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

3. Build the project:
```bash
mvn clean install
```

4. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd d:\proto\agricultural-credit-system\frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/verify-otp` - Verify OTP and get JWT
- `POST /api/auth/register` - Register a new user

### Loan Management
- `POST /api/loans/apply` - Apply for a loan
- `PUT /api/loans/{loanId}/approve` - Approve a loan
- `PUT /api/loans/{loanId}/reject` - Reject a loan
- `PUT /api/loans/{loanId}/disburse` - Disburse a loan
- `GET /api/loans/farmer/{farmerId}` - Get loans by farmer
- `GET /api/loans/lender/{lenderId}` - Get loans by lender
- `GET /api/loans/{loanId}` - Get loan by ID
- `GET /api/loans` - Get all loans

### Warehouse Receipt Management
- `POST /api/warehouse/receipts` - Create a warehouse receipt
- `PUT /api/warehouse/receipts/{receiptId}/status` - Update receipt status
- `GET /api/warehouse/receipts/farmer/{farmerId}` - Get receipts by farmer
- `GET /api/warehouse/receipts/active` - Get active receipts
- `GET /api/warehouse/receipts/status/{status}` - Get receipts by status
- `GET /api/warehouse/receipts/{receiptId}` - Get receipt by ID
- `GET /api/warehouse/receipts` - Get all receipts

## 👥 User Roles

### Farmer
- Apply for loans
- View loan status
- Store commodities in warehouses
- View warehouse receipts

### Lender
- Approve/reject loan applications
- Disburse loans
- Monitor loan portfolio

### Admin
- View all system data
- Manage users
- Monitor overall system activity

## 🧪 Testing the Application

1. Start both backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Register a new user or use existing test credentials
4. Log in with your credentials
5. Enter the OTP sent to the user (in this prototype, OTP is displayed in the backend logs)
6. Explore the role-specific dashboards

## 🧱 Architecture

The application follows a microservices-friendly architecture with:

- **Modular Backend**: Separate modules for authentication, loan management, and warehouse management
- **JWT-based Security**: Stateless authentication with refresh tokens
- **Database Layer**: JPA/Hibernate for ORM with PostgreSQL
- **RESTful APIs**: Clean, documented API endpoints
- **Modern Frontend**: Component-based architecture with state management

## 📦 Project Structure

```
agricultural-credit-system/
├── backend/
│   ├── src/main/java/com/agricredit/
│   │   ├── auth/           # Authentication modules
│   │   ├── config/         # Configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── dto/           # Data transfer objects
│   │   ├── entity/        # JPA entities
│   │   ├── repository/    # JPA repositories
│   │   ├── security/      # Security configuration
│   │   ├── service/       # Business logic
│   │   └── util/          # Utility classes
│   └── pom.xml
└── frontend/
    ├── app/               # Next.js app router pages
    ├── components/        # Reusable components
    ├── styles/            # Global styles
    ├── utils/            # Utility functions
    ├── package.json
    └── README.md
```

## 🧑‍💻 Development

### Running Tests
Backend tests can be run with:
```bash
mvn test
```

Frontend linting can be run with:
```bash
npm run lint
```

## 🚢 Production Deployment

For production deployment:

1. Build the frontend for production:
```bash
npm run build
```

2. Package the backend:
```bash
mvn clean package
```

3. Deploy the JAR file and serve the frontend build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Notes

- This is a prototype application for demonstration purposes
- In a production environment, additional security measures would be implemented
- Database migrations and proper error handling would be enhanced
- Real blockchain integration would replace the mock implementation