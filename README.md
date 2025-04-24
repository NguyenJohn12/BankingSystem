# 🏦 Banking System Application

Members: John Nguyen, Saiful Islam Badhon

A comprehensive banking system web application developed for CS431. This project provides a secure and user-friendly interface for managing customer accounts, transactions, and financial relationship.

## ⛳️ Features

- 🔐 **User Authentication**
  - Secure login/registration system
  - Password protection
  - Cookie-based session management

- 👨‍💻 **Customer Management**
  - View customer information
  - Update customer details (address, phone, email)
  - Maintains data integrity across tables when updating email

- 🧾 **Account Management**
  - View different account types (debit, credit, investment)
  - Account balance tracking
  - Account history visualization

- 💸 **Transaction Processing**
  - Support for multiple transaction types (deposits, withdrawals, checks)
  - Transaction history with detailed information
  - Balance updates after transactions

- 📈 **Investment Portfolio**
  - Securities management
  - Investment account tracking
  - Portfolio visualization

- 🧑🏻‍💼 **Financial Relationships**
  - Customer relationship management
  - Balance tracking across relationship types

## 🤖 Technologies Used

- **Backend**
  - Node.js
  - Express.js
  - PostgreSQL
  - Cookie-based authentication

- **Frontend**
  - EJS (Embedded JavaScript templates)
  - HTML/CSS
  - JavaScript

- **Security**
  - Environment variables for sensitive data
  - Cookie security with HttpOnly flag
  - User input validation

## 📊 Database Schema

The application uses a PostgreSQL database with the following key tables:

- `customer` - Stores customer personal information
- `account_login` - User authentication information
- `account` - Banking accounts with balance information
- `debit_account` - Specific debit account information
- `credit_account` - Specific credit account information
- `investment_account` - Investment account details
- `transaction` - Records of all account transactions
- `transaction_history` - Historical tracking of transactions
- `account_balance_history` - Historical tracking of account balances
- `security` - Investment securities information
- `customer_relationship` - Customer relationship details

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NguyenJohn12/BankingSystem
   cd BankingSystem

2. **Install dependencies**
   ```bash
   npm install
   npm install express
   npm install express ejs
   npm install pg
   npm install dontenv 
   npm install cookie-parser
   npm install body-parser

3. **Set up environment variables**
    - Create a .env file in the root directory with the following:

    ```bash
    PG_USER=your_postgres_username
    PG_HOST=localhost
    PG_DATABASE=banking_system
    PG_PASSWORD=your_postgres_password
    PG_PORT=5432

4. **Set up PostgreSQL database**
    - Create a database named banking_system
    - Run the SQL scripts in the database folder to create tables and seed initial data

5. **Start the application**
    ```bash
    npm start

6. **Access the application**
    - Open your browser and navigate to http://localhost:3000

## 📱 Usage 

1. **Registration/Login**

    - New users can register with email, password, and basic information
    - Existing users can log in with email and password


2. **Customer Management**

    - View and edit customer information
    - Update contact details (address, phone, email)


3. **Account Management**

    - View all accounts associated with the customer
    - Check account balances and transaction history


4. **Transactions**

    - View transaction history
    - Track account balance changes


5. **Investment Portfolio**

    - View investment accounts and securities
    - Track investment performance

## 🚓 Security Features
- Secure cookie-based authentication

- User input validation and sanitization

- Protected routes requiring authentication

- Automatic logout after session expiration

## 🔗 API Documentation

The application provides several internal API endpoints for handling data:

- POST /api/transactions - Process new transactions 

- POST /api/securities - Add or update securities

- POST /api/relationships - Create customer relationships

- POST /update-customer - Update customer information

## 💪 Author
- 🏙️ Front-end Web: Saiful Islam Badhon
- 💻 Back-end Web: John Nguyen

## 👥 Acknowledgements

- CSS

- Node.js

- Express.js

- PostgreSQL

- EJS

- CS431 Course Materials and Instructors
