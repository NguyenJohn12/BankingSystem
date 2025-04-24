-- Customer table
CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    birthdate DATE
);

-- Account login table
CREATE TABLE account_login (
    email VARCHAR(100) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (email) REFERENCES customer(email)
);

-- Account table
CREATE TABLE account (
    account_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(15,2) NOT NULL,
    open_date DATE NOT NULL,
    min_balance DECIMAL(15,2) NOT NULL,
    overdraft_balance DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- Debit account table
CREATE TABLE debit_account (
    account_id INT PRIMARY KEY,
    daily_withdrawal_limit DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Credit account table
CREATE TABLE credit_account (
    account_id INT PRIMARY KEY,
    credit_limit DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_percent DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Investment account table
CREATE TABLE investment_account (
    account_id INT PRIMARY KEY,
    risk_level VARCHAR(20) NOT NULL,
    strategy VARCHAR(50) NOT NULL,
    percent_return DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Account balance history table
CREATE TABLE account_balance_hist (
    account_id INT NOT NULL,
    balance_history_id INT PRIMARY KEY,
    balance_amount DECIMAL(15,2) NOT NULL,
    balance_date DATETIME NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Transaction table
CREATE TABLE transaction (
    transaction_id INT PRIMARY KEY,
    account_id INT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    transaction_date DATETIME NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Transaction history table
CREATE TABLE transaction_history (
    transaction_id INT NOT NULL,
    account_id INT NOT NULL,
    previous_balance DECIMAL(15,2) NOT NULL,
    new_balance DECIMAL(15,2) NOT NULL,
    history_id INT PRIMARY KEY,
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id),
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Deposit transaction table
CREATE TABLE deposit_transaction (
    transaction_id INT PRIMARY KEY,
    deposit_way VARCHAR(20) NOT NULL,
    deposit_location VARCHAR(100),
    sender_place VARCHAR(100),
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id)
);

-- Withdrawal transaction table
CREATE TABLE withdrawal_transaction (
    transaction_id INT PRIMARY KEY,
    withdrawal_way VARCHAR(20) NOT NULL,
    withdrawal_location VARCHAR(100),
    atm_code VARCHAR(20),
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id)
);

-- Check transaction table
CREATE TABLE check_transaction (
    transaction_id INT PRIMARY KEY,
    check_number VARCHAR(20) NOT NULL,
    check_date DATE NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id)
);

-- Transaction detail table
CREATE TABLE transaction_detail (
    transaction_id INT NOT NULL,
    detail_id INT PRIMARY KEY,
    detail_type VARCHAR(50) NOT NULL,
    detail_value VARCHAR(255) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id)
);

-- Security table
CREATE TABLE security (
    account_id INT NOT NULL,
    security_id INT NOT NULL,
    security_type VARCHAR(20) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    purchase_type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (account_id, security_id),
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Customer relationship table
CREATE TABLE customer_relationship (
    relationship_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    balance_amount DECIMAL(15,2) NOT NULL,
    balance_date DATE NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- Insert customer data
INSERT INTO customer (customer_id, fname, lname, address, phone, email, birthdate) VALUES
(1, 'John', 'Nguyen', '25800 Carlos Bee Blvd, Hayward, CA 94542', '4087488888', 'johnnguyen1303123@gmail.com', '1985-06-15');

-- Insert account login data
INSERT INTO account_login (email, password) VALUES
('johnnguyen1303123@gmail.com', 'helloworld');

-- Insert account data
INSERT INTO account (account_id, customer_id, account_status, account_type, account_number, balance, open_date, min_balance, overdraft_balance) VALUES
(1, 1, 'active', 'checking', 'CHK-100001', 2500.75, '2020-01-15', 100.00, 0.00),
(2, 1, 'active', 'savings', 'SAV-100002', 15000.50, '2020-01-15', 500.00, 0.00),
(3, 1, 'active', 'credit', 'CRD-100003', -2350.25, '2020-02-20', 0.00, 5000.00),
(4, 1, 'active', 'investment', 'INV-100004', 45000.00, '2020-03-10', 0.00, 0.00);

-- Insert debit account data
INSERT INTO debit_account (account_id, daily_withdrawal_limit) VALUES
(1, 1000.00),
(2, 2000.00);

-- Insert credit account data
INSERT INTO credit_account (account_id, credit_limit, due_date, payment_percent) VALUES
(3, 10000.00, '2025-05-15', 2.50);

-- Insert investment account data
INSERT INTO investment_account (account_id, risk_level, strategy, percent_return) VALUES
(4, 'medium', 'Balanced Growth', 6.50);

-- Insert account balance history data
INSERT INTO account_balance_hist (account_id, balance_history_id, balance_amount, balance_date) VALUES
(1, 1, 0.00, '2020-01-15 00:00:00'),
(1, 2, 2000.00, '2020-01-15 10:30:00'),
(1, 3, 5500.00, '2025-03-15 09:45:00'),
(1, 4, 5000.00, '2025-03-20 14:20:00'),
(1, 5, 4000.00, '2025-03-25 16:15:00'),
(1, 6, 2500.00, '2025-04-01 10:00:00'),
(1, 7, 2249.75, '2025-04-10 11:30:00'),
(2, 8, 0.00, '2020-01-15 00:00:00'),
(2, 9, 5000.00, '2020-01-15 11:15:00'),
(2, 10, 15000.00, '2025-02-15 10:00:00'),
(2, 11, 14000.00, '2025-03-30 15:45:00');

-- Insert transaction data
INSERT INTO transaction (transaction_id, account_id, transaction_type, total, description, status, transaction_date) VALUES
(1, 1, 'deposit', 2000.00, 'Initial deposit', 'completed', '2020-01-15 10:30:00'),
(2, 1, 'deposit', 3500.00, 'Salary deposit', 'completed', '2025-03-15 09:45:00'),
(3, 1, 'withdrawal', 500.00, 'ATM withdrawal', 'completed', '2025-03-20 14:20:00'),
(4, 1, 'transfer', 1000.00, 'Transfer to savings', 'completed', '2025-03-25 16:15:00'),
(5, 1, 'payment', 1500.00, 'Rent payment', 'completed', '2025-04-01 10:00:00'),
(6, 1, 'check', 250.25, 'Grocery payment', 'completed', '2025-04-10 11:30:00'),
(7, 2, 'deposit', 5000.00, 'Initial deposit', 'completed', '2020-01-15 11:15:00'),
(8, 2, 'deposit', 10000.00, 'Bonus deposit', 'completed', '2025-02-15 10:00:00'),
(9, 2, 'withdrawal', 1000.00, 'Withdrawal for vacation', 'completed', '2025-03-30 15:45:00'),
(10, 3, 'payment', 1500.00, 'Electronics purchase', 'completed', '2025-02-25 13:30:00'),
(11, 3, 'payment', 850.25, 'Restaurant charges', 'completed', '2025-03-10 20:15:00'),
(12, 3, 'deposit', 750.00, 'Credit card payment', 'completed', '2025-04-05 09:30:00'),
(13, 4, 'deposit', 25000.00, 'Initial investment', 'completed', '2020-03-10 14:00:00'),
(14, 4, 'deposit', 20000.00, 'Additional investment', 'completed', '2025-01-20 11:45:00');

-- Insert transaction history data
INSERT INTO transaction_history (transaction_id, account_id, previous_balance, new_balance, history_id) VALUES
(1, 1, 0.00, 2000.00, 1),
(2, 1, 2000.00, 5500.00, 2),
(3, 1, 5500.00, 5000.00, 3),
(4, 1, 5000.00, 4000.00, 4),
(5, 1, 4000.00, 2500.00, 5),
(6, 1, 2500.00, 2249.75, 6),
(7, 2, 0.00, 5000.00, 7),
(8, 2, 5000.00, 15000.00, 8),
(9, 2, 15000.00, 14000.00, 9),
(10, 3, 0.00, -1500.00, 10),
(11, 3, -1500.00, -2350.25, 11),
(12, 3, -2350.25, -1600.25, 12),
(13, 4, 0.00, 25000.00, 13),
(14, 4, 25000.00, 45000.00, 14);

-- Insert deposit transaction data
INSERT INTO deposit_transaction (transaction_id, deposit_way, deposit_location, sender_place) VALUES
(1, 'teller', 'Main Branch', ''),
(2, 'online', '', 'Employer Direct Deposit'),
(7, 'teller', 'Main Branch', ''),
(8, 'mobile', '', 'Mobile Deposit');

-- Insert withdrawal transaction data
INSERT INTO withdrawal_transaction (transaction_id, withdrawal_way, withdrawal_location, atm_code) VALUES
(3, 'ATM', 'Main Branch CSUEB', 'ATM001');

-- Insert check transaction data
INSERT INTO check_transaction (transaction_id, check_number, check_date) VALUES
(6, 'CHK-001245', '2025-04-10');

-- Insert transaction detail data
INSERT INTO transaction_detail (transaction_id, detail_id, detail_type, detail_value) VALUES
(2, 1, 'sender', 'CSUEB Payroll'),
(4, 2, 'recipient account', 'SAV-100002'),
(5, 3, 'recipient', 'Property Management Co.');

-- Insert security data
INSERT INTO security (account_id, security_id, security_type, purchase_price, purchase_type, quantity) VALUES
(4, 1, 'ETF', 150.25, 'buy', 100),
(4, 2, 'stock', 75.50, 'buy', 200),
(4, 3, 'bond', 1000.00, 'buy', 10),
(4, 4, 'ETF', 2000.00, 'sold', 100);

-- Insert customer relationship data
INSERT INTO customer_relationship (relationship_id, customer_id, balance_amount, balance_date, relationship_type) VALUES
(1, 1, 60150.25, '2025-04-15','Father'),
(2,1,20000.00,'2025-04-23','Family'),
(3,1,12000.00,'2025-04-23','Financial Advisor'),
(4,1,123321.00,'2025-04-23','Business');