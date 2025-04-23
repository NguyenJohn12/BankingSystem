<<<<<<< HEAD
-- Customer table
CREATE TABLE IF NOT EXISTS Customer (
  Customer_ID SERIAL PRIMARY KEY,
=======
-- Create database
CREATE DATABASE IF NOT EXISTS csueb_bank;
USE csueb_bank;

-- Customer table
CREATE TABLE IF NOT EXISTS Customer (
  Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
>>>>>>> refs/remotes/origin/main
  Fname VARCHAR(50) NOT NULL,
  Lname VARCHAR(50) NOT NULL,
  Address VARCHAR(255),
  Phone VARCHAR(20),
  Email VARCHAR(100) UNIQUE,
  BirthDate DATE
);
<<<<<<< HEAD
-- Account_Login table
CREATE TABLE IF NOT EXISTS account_login (
  email VARCHAR(100) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
=======

-- Account_Login table for authentication
CREATE TABLE IF NOT EXISTS Account_Login (
  Login_ID INT AUTO_INCREMENT PRIMARY KEY,
  Customer_ID INT,
  Username VARCHAR(50) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Last_Login DATETIME,
  Account_Status ENUM('active', 'locked', 'disabled') DEFAULT 'active',
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
>>>>>>> refs/remotes/origin/main
);

-- Account table
CREATE TABLE IF NOT EXISTS Account (
<<<<<<< HEAD
  Account_ID SERIAL PRIMARY KEY,
  Customer_ID INTEGER NOT NULL,
  Account_Status VARCHAR(20) CHECK (Account_Status IN ('active', 'closed', 'suspended')) DEFAULT 'active',
  Account_type VARCHAR(20) CHECK (Account_type IN ('checking', 'savings', 'credit', 'investment')) NOT NULL,
=======
  Account_ID INT AUTO_INCREMENT PRIMARY KEY,
  Customer_ID INT NOT NULL,
  Account_Status ENUM('active', 'closed', 'suspended') DEFAULT 'active',
  Account_type ENUM('checking', 'savings', 'credit', 'investment') NOT NULL,
>>>>>>> refs/remotes/origin/main
  Account_number VARCHAR(20) UNIQUE NOT NULL,
  Balance DECIMAL(15, 2) DEFAULT 0.00,
  Open_date DATE NOT NULL,
  min_balance DECIMAL(15, 2) DEFAULT 0.00,
  overdraft_balance DECIMAL(15, 2) DEFAULT 0.00,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

-- Credit_Account table
CREATE TABLE IF NOT EXISTS Credit_Account (
<<<<<<< HEAD
  Account_ID INTEGER PRIMARY KEY,
=======
  Account_ID INT PRIMARY KEY,
>>>>>>> refs/remotes/origin/main
  Credit_limit DECIMAL(15, 2) NOT NULL,
  Due_date DATE,
  Payment_percent DECIMAL(5, 2) DEFAULT 2.00,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Debit_Account table
CREATE TABLE IF NOT EXISTS Debit_Account (
<<<<<<< HEAD
  Account_ID INTEGER PRIMARY KEY,
=======
  Account_ID INT PRIMARY KEY,
>>>>>>> refs/remotes/origin/main
  Daily_withdrawal_limit DECIMAL(10, 2) DEFAULT 1000.00,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Investment_Account table
CREATE TABLE IF NOT EXISTS Investment_Account (
<<<<<<< HEAD
  Account_ID INTEGER PRIMARY KEY,
  risk_level VARCHAR(10) CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
=======
  Account_ID INT PRIMARY KEY,
  risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
>>>>>>> refs/remotes/origin/main
  Strategy VARCHAR(100),
  Percent_return DECIMAL(5, 2),
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Transaction table
CREATE TABLE IF NOT EXISTS Transaction (
<<<<<<< HEAD
  Transaction_ID SERIAL PRIMARY KEY,
  Account_ID INTEGER NOT NULL,
  Transaction_type VARCHAR(20) CHECK (Transaction_type IN ('deposit', 'withdrawal', 'transfer', 'check', 'payment')) NOT NULL,
  Total DECIMAL(15, 2) NOT NULL,
  Description VARCHAR(255),
  Status VARCHAR(20) CHECK (Status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'completed',
  Transaction_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
=======
  Transaction_ID INT AUTO_INCREMENT PRIMARY KEY,
  Account_ID INT NOT NULL,
  Transaction_type ENUM('deposit', 'withdrawal', 'transfer', 'check', 'payment') NOT NULL,
  Total DECIMAL(15, 2) NOT NULL,
  Description VARCHAR(255),
  Status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
  Transaction_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
>>>>>>> refs/remotes/origin/main
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Check_Transaction table
CREATE TABLE IF NOT EXISTS Check_Transaction (
<<<<<<< HEAD
  Transaction_ID INTEGER PRIMARY KEY,
=======
  Transaction_ID INT PRIMARY KEY,
>>>>>>> refs/remotes/origin/main
  Check_number VARCHAR(20) NOT NULL,
  Check_date DATE NOT NULL,
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Withdrawal_Transaction table
CREATE TABLE IF NOT EXISTS Withdrawal_Transaction (
<<<<<<< HEAD
  Transaction_ID INTEGER PRIMARY KEY,
  Withdrawal_way VARCHAR(20) CHECK (Withdrawal_way IN ('ATM', 'teller', 'online')) NOT NULL,
=======
  Transaction_ID INT PRIMARY KEY,
  Withdrawal_way ENUM('ATM', 'teller', 'online') NOT NULL,
>>>>>>> refs/remotes/origin/main
  Withdrawal_location VARCHAR(100),
  ATM_code VARCHAR(20),
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Deposit_Transaction table
CREATE TABLE IF NOT EXISTS Deposit_Transaction (
<<<<<<< HEAD
  Transaction_ID INTEGER PRIMARY KEY,
  Deposit_way VARCHAR(20) CHECK (Deposit_way IN ('ATM', 'teller', 'online', 'mobile')) NOT NULL,
=======
  Transaction_ID INT PRIMARY KEY,
  Deposit_way ENUM('ATM', 'teller', 'online', 'mobile') NOT NULL,
>>>>>>> refs/remotes/origin/main
  Deposit_location VARCHAR(100),
  Sender_place VARCHAR(100),
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Transaction_Detail table
CREATE TABLE IF NOT EXISTS Transaction_Detail (
<<<<<<< HEAD
  Transaction_ID INTEGER,
  Detail_ID SERIAL,
=======
  Transaction_ID INT,
  Detail_ID INT AUTO_INCREMENT,
>>>>>>> refs/remotes/origin/main
  Detail_type VARCHAR(50),
  Detail_value VARCHAR(255),
  PRIMARY KEY (Detail_ID),
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Security table
CREATE TABLE IF NOT EXISTS Security (
<<<<<<< HEAD
  Account_ID INTEGER,
  Security_Id SERIAL,
  Security_type VARCHAR(20) CHECK (Security_type IN ('stock', 'bond', 'mutual fund', 'ETF')) NOT NULL,
  purchase_price DECIMAL(15, 2) NOT NULL,
  purchase_type VARCHAR(50),
  quantity INTEGER NOT NULL,
=======
  Account_ID INT,
  Security_Id INT AUTO_INCREMENT,
  Security_type ENUM('stock', 'bond', 'mutual fund', 'ETF') NOT NULL,
  purchase_price DECIMAL(15, 2) NOT NULL,
  purchase_type VARCHAR(50),
  quantity INT NOT NULL,
>>>>>>> refs/remotes/origin/main
  PRIMARY KEY (Security_Id),
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Customer_Relationship table
CREATE TABLE IF NOT EXISTS Customer_Relationship (
<<<<<<< HEAD
  Relationship_ID SERIAL PRIMARY KEY,
  Customer_ID INTEGER NOT NULL,
  Balance_Amount DECIMAL(15, 2),
  Balance_Date DATE,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
  Relationship_Type VARCHAR(25)
=======
  Relationship_ID INT AUTO_INCREMENT PRIMARY KEY,
  Customer_ID INT NOT NULL,
  Balance_Amount DECIMAL(15, 2),
  Balance_Date DATE,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
>>>>>>> refs/remotes/origin/main
);

-- Transaction_History table
CREATE TABLE IF NOT EXISTS Transaction_History (
<<<<<<< HEAD
  Transaction_ID INTEGER,
  Account_ID INTEGER,
  Previous_balance DECIMAL(15, 2),
  New_balance DECIMAL(15, 2),
  History_ID SERIAL PRIMARY KEY,
=======
  Transaction_ID INT,
  Account_ID INT,
  Previous_balance DECIMAL(15, 2),
  New_balance DECIMAL(15, 2),
  History_ID INT AUTO_INCREMENT PRIMARY KEY,
>>>>>>> refs/remotes/origin/main
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID),
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Account_Balance_History table
CREATE TABLE IF NOT EXISTS Account_Balance_History (
<<<<<<< HEAD
  Account_ID INTEGER,
  Balance_history_ID SERIAL PRIMARY KEY,
  Balance_Amount DECIMAL(15, 2),
  Balance_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);
=======
  Account_ID INT,
  Balance_history_ID INT AUTO_INCREMENT PRIMARY KEY,
  Balance_Amount DECIMAL(15, 2),
  Balance_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Insert sample data for testing
INSERT INTO Customer (Fname, Lname, Address, Phone, Email, BirthDate)
VALUES 
('John', 'Doe', '123 Main St, Hayward, CA', '510-555-1234', 'john.doe@example.com', '1985-06-15'),
('Jane', 'Smith', '456 Oak Ave, San Lorenzo, CA', '510-555-5678', 'jane.smith@example.com', '1990-03-21');

-- Create admin account
INSERT INTO Account_Login (Customer_ID, Username, Password, Account_Status)
VALUES 
(1, 'admin', '$2b$10$I8Jszl0qnhrKkjCMRV5.ROZhT7D09xFqTpXR.zoLFJITe1THLwbWq', 'active'), -- password: admin123
(2, 'jsmith', '$2b$10$TvzUhWDV7qGnNW5OLz.f3eNjA1pyaBDpTRVWNYBAwv/MmPRgIE5BK', 'active'); -- password: password123
>>>>>>> refs/remotes/origin/main
