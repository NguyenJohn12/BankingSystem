-- Customer table
CREATE TABLE IF NOT EXISTS Customer (
  Customer_ID SERIAL PRIMARY KEY,
  Fname VARCHAR(50) NOT NULL,
  Lname VARCHAR(50) NOT NULL,
  Address VARCHAR(255),
  Phone VARCHAR(20),
  Email VARCHAR(100) UNIQUE,
  BirthDate DATE
);
-- Account_Login table
CREATE TABLE IF NOT EXISTS account_login (
  email VARCHAR(100) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

-- Account table
CREATE TABLE IF NOT EXISTS Account (
  Account_ID SERIAL PRIMARY KEY,
  Customer_ID INTEGER NOT NULL,
  Account_Status VARCHAR(20) CHECK (Account_Status IN ('active', 'closed', 'suspended')) DEFAULT 'active',
  Account_type VARCHAR(20) CHECK (Account_type IN ('checking', 'savings', 'credit', 'investment')) NOT NULL,
  Account_number VARCHAR(20) UNIQUE NOT NULL,
  Balance DECIMAL(15, 2) DEFAULT 0.00,
  Open_date DATE NOT NULL,
  min_balance DECIMAL(15, 2) DEFAULT 0.00,
  overdraft_balance DECIMAL(15, 2) DEFAULT 0.00,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

-- Credit_Account table
CREATE TABLE IF NOT EXISTS Credit_Account (
  Account_ID INTEGER PRIMARY KEY,
  Credit_limit DECIMAL(15, 2) NOT NULL,
  Due_date DATE,
  Payment_percent DECIMAL(5, 2) DEFAULT 2.00,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Debit_Account table
CREATE TABLE IF NOT EXISTS Debit_Account (
  Account_ID INTEGER PRIMARY KEY,
  Daily_withdrawal_limit DECIMAL(10, 2) DEFAULT 1000.00,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Investment_Account table
CREATE TABLE IF NOT EXISTS Investment_Account (
  Account_ID INTEGER PRIMARY KEY,
  risk_level VARCHAR(10) CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  Strategy VARCHAR(100),
  Percent_return DECIMAL(5, 2),
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Transaction table
CREATE TABLE IF NOT EXISTS Transaction (
  Transaction_ID SERIAL PRIMARY KEY,
  Account_ID INTEGER NOT NULL,
  Transaction_type VARCHAR(20) CHECK (Transaction_type IN ('deposit', 'withdrawal', 'transfer', 'check', 'payment')) NOT NULL,
  Total DECIMAL(15, 2) NOT NULL,
  Description VARCHAR(255),
  Status VARCHAR(20) CHECK (Status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'completed',
  Transaction_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Check_Transaction table
CREATE TABLE IF NOT EXISTS Check_Transaction (
  Transaction_ID INTEGER PRIMARY KEY,
  Check_number VARCHAR(20) NOT NULL,
  Check_date DATE NOT NULL,
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Withdrawal_Transaction table
CREATE TABLE IF NOT EXISTS Withdrawal_Transaction (
  Transaction_ID INTEGER PRIMARY KEY,
  Withdrawal_way VARCHAR(20) CHECK (Withdrawal_way IN ('ATM', 'teller', 'online')) NOT NULL,
  Withdrawal_location VARCHAR(100),
  ATM_code VARCHAR(20),
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Deposit_Transaction table
CREATE TABLE IF NOT EXISTS Deposit_Transaction (
  Transaction_ID INTEGER PRIMARY KEY,
  Deposit_way VARCHAR(20) CHECK (Deposit_way IN ('ATM', 'teller', 'online', 'mobile')) NOT NULL,
  Deposit_location VARCHAR(100),
  Sender_place VARCHAR(100),
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Transaction_Detail table
CREATE TABLE IF NOT EXISTS Transaction_Detail (
  Transaction_ID INTEGER,
  Detail_ID SERIAL,
  Detail_type VARCHAR(50),
  Detail_value VARCHAR(255),
  PRIMARY KEY (Detail_ID),
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Security table
CREATE TABLE IF NOT EXISTS Security (
  Account_ID INTEGER,
  Security_Id SERIAL,
  Security_type VARCHAR(20) CHECK (Security_type IN ('stock', 'bond', 'mutual fund', 'ETF')) NOT NULL,
  purchase_price DECIMAL(15, 2) NOT NULL,
  purchase_type VARCHAR(50),
  quantity INTEGER NOT NULL,
  PRIMARY KEY (Security_Id),
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Customer_Relationship table
CREATE TABLE IF NOT EXISTS Customer_Relationship (
  Relationship_ID SERIAL PRIMARY KEY,
  Customer_ID INTEGER NOT NULL,
  Balance_Amount DECIMAL(15, 2),
  Balance_Date DATE,
  FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
  Relationship_Type VARCHAR(25)
);

-- Transaction_History table
CREATE TABLE IF NOT EXISTS Transaction_History (
  Transaction_ID INTEGER,
  Account_ID INTEGER,
  Previous_balance DECIMAL(15, 2),
  New_balance DECIMAL(15, 2),
  History_ID SERIAL PRIMARY KEY,
  FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID),
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);

-- Account_Balance_History table
CREATE TABLE IF NOT EXISTS Account_Balance_History (
  Account_ID INTEGER,
  Balance_history_ID SERIAL PRIMARY KEY,
  Balance_Amount DECIMAL(15, 2),
  Balance_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
);