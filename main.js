import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
const port =  3000;

/// Set up environment variable
env.config();

/// Use postgres for database
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

/// Static files from public
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

/// Home page
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get("/login", (req, res) => {
  res.render("login-page.ejs", { error: null });
});

// POST route — handle login
app.post("/login-account", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM account_login WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        const customerResult = await db.query("SELECT * FROM customer WHERE email = $1", [email]);
        if (customerResult.rows.length > 0) {
          const customer = customerResult.rows[0];

          // Store customer info in cookies
          res.cookie('customerId', customer.customer_id, { maxAge: 3600000, httpOnly: true });
          res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });
          res.cookie('userName', `${customer.fname} ${customer.lname}`, { maxAge: 3600000, httpOnly: true });

          // Login successful
          res.redirect("/main");
        }
      } else {
        res.render("login-page.ejs", { error: "Incorrect password." }); // Password mismatch
      }
    } else {
      res.render("login-page.ejs", { error: "Email not found." }); // No user found
    }
  } catch (err) {
    console.error("Login error:", err);
    res.render("login-page.ejs", { error: "An unexpected error occurred." });
  }
});

app.get("/register", (req, res) => {
  res.render("register-page.ejs", { error: null });
});

app.post("/register-account", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const fname = req.body.fname || "New";
  const lname = req.body.lname || "Customer";

  try {
    const checkResult = await db.query("SELECT * FROM account_login WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.render("register-page.ejs", { error: "Email already exists. Try logging in." });
    } else {
      await db.query("BEGIN");

      // Insert customer record in table
      const customerResult = await db.query(
        "INSERT INTO customer (fname, lname, email) VALUES ($1, $2, $3) RETURNING customer_id",
        [fname, lname, email]
      );

      const customerId = customerResult.rows[0].customer_id;

      // Insert login email and password
      await db.query(
        "INSERT INTO account_login (email, password) VALUES ($1, $2)",
        [email, password]
      );

      // Commit transaction
      await db.query("COMMIT");

      // Store customer info in cookies
      res.cookie('customerId', customerId, { maxAge: 3600000, httpOnly: true });
      res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });
      res.cookie('userName', `${fname} ${lname}`, { maxAge: 3600000, httpOnly: true });

      res.redirect("/main");
    }
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Registration error:", err);
    res.render("register-page.ejs", { error: "An error occurred during registration." });
  }
});

const authenticateUser = (req, res, next) => {
  const customerId = req.cookies.customerId;
  if (!customerId) {
    return res.redirect('/login');
  }
  next();
};

// Add routes for all the other pages
app.get("/main", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  const userName = req.cookies.userName;

  try {
    // Get customer details
    const customerResult = await db.query(
      "SELECT * FROM customer WHERE customer_id = $1",
      [customerId]
    );

    // Get customer accounts
    const accountsResult = await db.query(
      "SELECT * FROM account WHERE customer_id = $1",
      [customerId]
    );

    // Get recent transactions (from all accounts owned by this customer)
    const accountIds = accountsResult.rows.map(account => account.account_id);

    let transactionsResult = { rows: [] };
    if (accountIds.length > 0) {
      transactionsResult = await db.query(
        `SELECT t.* FROM transaction t 
        WHERE t.account_id = ANY($1::int[])
        ORDER BY t.transaction_date DESC
        LIMIT 10`,
        [accountIds]
      );
    }

    res.render("home-page.ejs", {
      customer: customerResult.rows[0],
      accounts: accountsResult.rows,
      transactions: transactionsResult.rows,
      userName: userName,
      pageTitle: 'Dashboard'
    });
  } catch (err) {
    console.error("Main page error:", err);
    res.render("home-page.ejs", {
      error: "Error loading dashboard data.",
      userName: userName,
      pageTitle: 'Dashboard',
      customer: {},
      accounts: [],
      transactions: []
    });
  }
});

app.get("/customers", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  try {
    const result = await db.query("SELECT * FROM customer WHERE customer_id = $1", [customerId]);
    res.render("customers.ejs", {
      pageTitle: 'Customer Information',
      customers: result.rows,
      userName: req.cookies.userName
    });
  } catch (err) {
    console.error("Error loading customer: ", err);
    res.render("customers.ejs", {
      pageTitle: 'Customer Information',
      error: "Failed to load customer data",
      customers: [],
      userName: req.cookies.userName
    });
  }
});
app.post("/update-customer", authenticateUser, async (req, res) => {
  const { customer_id, address, phone, email } = req.body;
  const customerId = req.cookies.customerId;
  
  try {
    // Security check: Only allow users to update their own information
    if (parseInt(customer_id) !== parseInt(customerId)) {
      return res.render("customers.ejs", {
        pageTitle: 'Customer Information',
        error: "You can only update your own information",
        customers: [],
        userName: req.cookies.userName
      });
    }
    
    // Start a transaction to ensure both updates succeed or fail together
    await db.query("BEGIN");
    
    // First, get the current email for the customer
    const currentEmailResult = await db.query(
      "SELECT email FROM customer WHERE customer_id = $1",
      [customer_id]
    );
    
    if (currentEmailResult.rows.length === 0) {
      throw new Error("Customer not found");
    }
    
    const currentEmail = currentEmailResult.rows[0].email;
    
    // Update the customer table
    await db.query(
      "UPDATE customer SET address = $1, phone = $2, email = $3 WHERE customer_id = $4",
      [address, phone, email, customer_id]
    );
    
    // If email changed, update it in the account_login table
    if (email !== currentEmail) {
      const updateLoginResult = await db.query(
        "UPDATE account_login SET email = $1 WHERE email = $2",
        [email, currentEmail]
      );
      
      // Check if the account_login update affected any rows
      if (updateLoginResult.rowCount === 0) {
        throw new Error("Failed to update login email");
      }
      
      // Update the userEmail cookie if email was changed
      res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });
    }
    
    // Commit the transaction
    await db.query("COMMIT");
    
    // Fetch the updated customer data
    const result = await db.query("SELECT * FROM customer WHERE customer_id = $1", [customerId]);
    
    // Render the page with success message
    res.render("customers.ejs", {
      pageTitle: 'Customer Information',
      customers: result.rows,
      userName: req.cookies.userName,
      success: "Customer information updated successfully!"
    });
  } catch (err) {
    // Rollback the transaction on error
    await db.query("ROLLBACK");
    
    console.error("Error updating customer: ", err);
    
    // Fetch the customer data again to display
    const result = await db.query("SELECT * FROM customer WHERE customer_id = $1", [customerId]);
    
    res.render("customers.ejs", {
      pageTitle: 'Customer Information',
      customers: result.rows,
      error: "Failed to update customer information: " + err.message,
      userName: req.cookies.userName
    });
  }
});

// Modified accounts route
app.get("/accounts", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  try {
    // Get accounts for this customer only
    const accountsResult = await db.query("SELECT * FROM account WHERE customer_id = $1", [customerId]);

    // Get account IDs for this customer
    const accountIds = accountsResult.rows.map(account => account.account_id);

    // Initialize empty arrays for related accounts
    let creditAccounts = [];
    let debitAccounts = [];
    let investmentAccounts = [];

    // Only query specific account types if the customer has accounts
    if (accountIds.length > 0) {
      // Get credit accounts for this customer
      const creditResult = await db.query(
        "SELECT c.*, a.account_type FROM credit_account c " +
        "JOIN account a ON c.account_id = a.account_id " +
        "WHERE c.account_id = ANY($1::int[])",
        [accountIds]
      );
      creditAccounts = creditResult.rows;
    
      // Get debit accounts for this customer
      const debitResult = await db.query(
        "SELECT d.*, a.account_type FROM debit_account d " +
        "JOIN account a ON d.account_id = a.account_id " +
        "WHERE d.account_id = ANY($1::int[])",
        [accountIds]
      );
      debitAccounts = debitResult.rows;
    
      // Get investment accounts for this customer
      const investmentResult = await db.query(
        "SELECT i.*, a.account_type FROM investment_account i " +
        "JOIN account a ON i.account_id = a.account_id " +
        "WHERE i.account_id = ANY($1::int[])",
        [accountIds]
      );
      investmentAccounts = investmentResult.rows;
    }

    res.render("accounts.ejs", {
      pageTitle: 'My Accounts',
      accounts: accountsResult.rows,
      creditAccounts: creditAccounts,
      debitAccounts: debitAccounts,
      investmentAccounts: investmentAccounts,
      userName: req.cookies.userName
    });
  } catch (err) {
    console.error("Error loading accounts: ", err);
    res.render("accounts.ejs", {
      pageTitle: 'My Accounts',
      error: "Failed to load account data",
      accounts: [],
      creditAccounts: [],
      debitAccounts: [],
      investmentAccounts: [],
      userName: req.cookies.userName
    });
  }
});

// Modified transactions route
app.get("/transactions", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  try {
    // Get customer's account IDs first
    const accountsResult = await db.query(
      "SELECT account_id FROM account WHERE customer_id = $1",
      [customerId]
    );

    const accountIds = accountsResult.rows.map(account => account.account_id);

    // Initialize all results as empty arrays
    let transactions = [];
    let checkTransactions = [];
    let withdrawalTransactions = [];
    let depositTransactions = [];
    let transactionDetails = [];

    // Only query transactions if customer has accounts
    if (accountIds.length > 0) {
      // Get transactions for customer's accounts only
      transactions = (await db.query(
        `SELECT * FROM transaction 
         WHERE account_id = ANY($1::int[]) 
         ORDER BY transaction_date DESC LIMIT 100`,
        [accountIds]
      )).rows;

      // Get transaction IDs
      const transactionIds = transactions.map(transaction => transaction.transaction_id);

      if (transactionIds.length > 0) {
        // Get related transaction subtypes
        checkTransactions = (await db.query(
          `SELECT * FROM check_transaction 
           WHERE transaction_id = ANY($1::int[])`,
          [transactionIds]
        )).rows;

        withdrawalTransactions = (await db.query(
          `SELECT * FROM withdrawal_transaction 
           WHERE transaction_id = ANY($1::int[])`,
          [transactionIds]
        )).rows;

        depositTransactions = (await db.query(
          `SELECT * FROM deposit_transaction 
           WHERE transaction_id = ANY($1::int[])`,
          [transactionIds]
        )).rows;

        transactionDetails = (await db.query(
          `SELECT * FROM transaction_detail 
           WHERE transaction_id = ANY($1::int[])`,
          [transactionIds]
        )).rows;
      }
    }

    res.render("transactions.ejs", {
      pageTitle: 'My Transactions',
      transactions: transactions,
      checkTransactions: checkTransactions,
      withdrawalTransactions: withdrawalTransactions,
      depositTransactions: depositTransactions,
      transactionDetails: transactionDetails,
      userName: req.cookies.userName
    });
  } catch (err) {
    console.error("Error loading transactions: ", err);
    res.render("transactions.ejs", {
      pageTitle: 'My Transactions',
      error: "Failed to load transaction data",
      transactions: [],
      checkTransactions: [],
      withdrawalTransactions: [],
      depositTransactions: [],
      transactionDetails: [],
      userName: req.cookies.userName
    });
  }
});

app.get("/securities", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  try {
    // Get customer's investment account IDs first
    const accountsResult = await db.query(
      "SELECT account_id FROM account WHERE customer_id = $1 AND account_type = 'investment'",
      [customerId]
    );

    const accountIds = accountsResult.rows.map(account => account.account_id);

    // Get securities for this customer's accounts only
    let securities = [];
    let investmentAccounts = [];
    
    if (accountIds.length > 0) {
      // Get securities
      const securitiesResult = await db.query(
        "SELECT * FROM security WHERE account_id = ANY($1::int[])",
        [accountIds]
      );
      securities = securitiesResult.rows;
      
      // Get investment account details for the form dropdown
      const investmentAccountsResult = await db.query(
        "SELECT * FROM account WHERE account_id = ANY($1::int[]) AND account_type = 'investment'",
        [accountIds]
      );
      investmentAccounts = investmentAccountsResult.rows;
    }

    res.render("securities.ejs", {
      pageTitle: 'My Securities',
      securities: securities,
      investmentAccounts: investmentAccounts,
      userName: req.cookies.userName,
      success: req.query.success || null
    });
  } catch (err) {
    console.error("Error loading securities: ", err);
    res.render("securities.ejs", {
      pageTitle: 'My Securities',
      error: "Failed to load security data",
      securities: [],
      investmentAccounts: [],
      userName: req.cookies.userName
    });
  }
});

// API endpoint to handle security updates and additions
app.post("/api/securities", authenticateUser, async (req, res) => {
  const { securityId, accountId, securityType, purchasePrice, purchaseType, quantity } = req.body;
  const customerId = req.cookies.customerId;

  try {
    // Start transaction
    await db.query("BEGIN");

    // Verify the account belongs to the authenticated user and is an investment account
    const accountResult = await db.query(
      "SELECT * FROM account WHERE account_id = $1 AND customer_id = $2 AND account_type = 'investment'",
      [accountId, customerId]
    );

    if (accountResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "You don't have access to this investment account"
      });
    }

    // Validate inputs
    if (!securityType || !purchasePrice || !quantity || purchasePrice <= 0 || quantity <= 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Invalid input values"
      });
    }

    let result;
    
    // If securityId is provided, update existing security
    if (securityId) {
      // First verify the security belongs to one of the user's accounts
      const securityCheck = await db.query(
        `SELECT s.* FROM security s
         JOIN account a ON s.account_id = a.account_id
         WHERE s.security_id = $1 AND a.customer_id = $2`,
        [securityId, customerId]
      );
      
      if (securityCheck.rows.length === 0) {
        await db.query("ROLLBACK");
        return res.status(403).json({
          success: false,
          error: "You don't have access to update this security"
        });
      }
      
      // Update the security
      result = await db.query(
        `UPDATE security
         SET account_id = $1, security_type = $2, purchase_price = $3, 
             purchase_type = $4, quantity = $5
         WHERE security_id = $6
         RETURNING security_id`,
        [accountId, securityType, purchasePrice, purchaseType, quantity, securityId]
      );
    } else {
      // Insert new security
      result = await db.query(
        `INSERT INTO security
         (account_id, security_type, purchase_price, purchase_type, quantity)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING security_id`,
        [accountId, securityType, purchasePrice, purchaseType, quantity]
      );
    }

    await db.query("COMMIT");

    return res.json({
      success: true,
      securityId: result.rows[0].security_id,
      message: securityId ? "Security updated successfully" : "Security added successfully"
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Security update error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "An error occurred while saving the security"
    });
  }
});

// API endpoint to add new customer relationships
app.post("/api/relationships", authenticateUser, async (req, res) => {
  const { relationshipType, balanceAmount } = req.body;
  const customerId = req.cookies.customerId;

  // Validate the input
  if (!relationshipType) {
    return res.status(400).json({
      success: false,
      error: "Relationship type is required"
    });
  }

  try {
    // Start transaction
    await db.query("BEGIN");

    // Insert new relationship
    const result = await db.query(
      `INSERT INTO customer_relationship
       (customer_id, relationship_type, balance_amount, balance_date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING relationship_id`,
      [customerId, relationshipType, balanceAmount || null]
    );

    await db.query("COMMIT");

    return res.json({
      success: true,
      relationshipId: result.rows[0].relationship_id,
      message: "Relationship created successfully"
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Relationship creation error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "An error occurred while creating the relationship"
    });
  }
});

// Update the relationships route to include success message
app.get("/relationships", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  try {
    const result = await db.query(
      "SELECT * FROM customer_relationship WHERE customer_id = $1",
      [customerId]
    );
    res.render("relationships.ejs", {
      pageTitle: 'My Relationships',
      relationships: result.rows,
      userName: req.cookies.userName,
      success: req.query.success || null
    });
  } catch (err) {
    console.error("Error loading relationships: ", err);
    res.render("relationships.ejs", {
      pageTitle: 'My Relationships',
      error: "Failed to load relationship data",
      relationships: [],
      userName: req.cookies.userName
    });
  }
});
// Modified history route
app.get("/history", authenticateUser, async (req, res) => {
  const customerId = req.cookies.customerId;
  try {
    // Get customer's account IDs first
    const accountsResult = await db.query(
      "SELECT account_id FROM account WHERE customer_id = $1",
      [customerId]
    );

    const accountIds = accountsResult.rows.map(account => account.account_id);

    // Initialize empty arrays
    let transactionHistory = [];
    let balanceHistory = [];

    if (accountIds.length > 0) {
      // Get transaction history for customer's accounts only
      transactionHistory = (await db.query(
        `SELECT * FROM transaction_history 
         WHERE account_id = ANY($1::int[]) 
         ORDER BY history_id DESC`,
        [accountIds]
      )).rows;

      // Get balance history for customer's accounts only
      balanceHistory = (await db.query(
        `SELECT * FROM account_balance_history 
         WHERE account_id = ANY($1::int[]) 
         ORDER BY balance_date DESC`,
        [accountIds]
      )).rows;
    }

    res.render("history.ejs", {
      pageTitle: 'My History',
      transactionHistory: transactionHistory,
      balanceHistory: balanceHistory,
      userName: req.cookies.userName
    });
  } catch (err) {
    console.error("Error loading history: ", err);
    res.render("history.ejs", {
      pageTitle: 'My History',
      error: "Failed to load history data",
      transactionHistory: [],
      balanceHistory: [],
      userName: req.cookies.userName
    });
  }
});
app.get("/logout", (req, res) => {
  /// Clear cookies after customer log out
  res.clearCookie('customerId');
  res.clearCookie('userEmail');
  res.clearCookie('userName');
  res.redirect("/login");
});

/// API Transaction
app.post("/api/transactions", authenticateUser, async (req, res) => {
  /// Check if required fields are present
  const { accountId, transactionType, amount, description } = req.body;

  if (!accountId || !transactionType || !amount) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: accountId, transactionType, and amount are required"
    });
  }

  // Validate transaction type
  // const validTypes = ['deposit', 'withdrawal', 'transfer', 'payment', 'check'];
  // if (!validTypes.includes(transactionType)) {
  //   return res.status(400).json({
  //     success: false,
  //     error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}`
  //   });
  // }

  try {
    // Start transaction
    await db.query("BEGIN");

    // Verify the account belongs to the authenticated user
    const accountResult = await db.query(
      "SELECT * FROM account WHERE account_id = $1 AND customer_id = $2",
      [accountId, req.cookies.customerId]
    );

    if (accountResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        error: "You don't have access to this account"
      });
    }

    // const currentBalance = parseFloat(accountResult.rows[0].balance);
    // let newBalance = currentBalance;

    // // Parse amount as float to ensure proper calculation
    // const parsedAmount = parseFloat(amount);

    // if (isNaN(parsedAmount) || parsedAmount <= 0) {
    //   await db.query("ROLLBACK");
    //   return res.status(400).json({
    //     success: false,
    //     error: "Amount must be a positive number"
    //   });
    // }

    /// Update account balance based on transaction type
    // if (transactionType === 'deposit') {
    //   newBalance = currentBalance + parsedAmount;
    // } else if (transactionType === 'withdrawal' || transactionType === 'payment' || transactionType === 'check') {
    //   // Check sufficient funds for withdrawals
    //   if (parsedAmount > currentBalance) {
    //     await db.query("ROLLBACK");
    //     return res.status(400).json({
    //       success: false,
    //       error: "Insufficient funds for withdrawal"
    //     });
    //   }
    //   newBalance = currentBalance - parsedAmount;
    // } else if (transactionType === 'transfer') {
    //   if (parsedAmount > currentBalance) {
    //     await db.query("ROLLBACK");
    //     return res.status(400).json({
    //       success: false,
    //       error: "Insufficient funds for transfer"
    //     });
    //   }
    //   newBalance = currentBalance - parsedAmount;
    // }

    /// Insert transaction record - Let the database generate the transaction_id
    /// Make sure we're not trying to provide the transaction_id ourselves
    const transactionResult = await db.query(
      `INSERT INTO transaction
       (account_id, transaction_type, total, description, status)
       VALUES ($1, $2, $3, $4, 'completed')
       RETURNING transaction_id`,
      [accountId, transactionType, parsedAmount, description || '']
    );

    const transactionId = transactionResult.rows[0].transaction_id;

    /// Insert specific transaction details based on type
    // if (transactionType === 'check') {
    //   /// For check transactions, generate a mock check number
    //   const checkNumber = Math.floor(1000000 + Math.random() * 9000000);
    //   await db.query(
    //     `INSERT INTO check_transaction
    //      (transaction_id, check_number, check_date)
    //      VALUES ($1, $2)`,
    //     [transactionId, checkNumber]
    //   );
    // } else if (transactionType === 'withdrawal') {
    //   /// For withdrawal transactions
    //   await db.query(
    //     `INSERT INTO withdrawal_transaction
    //      (transaction_id, withdrawal_way, withdrawal_location)
    //      VALUES ($1, 'online', 'web application')`,
    //     [transactionId]
    //   );
    // } else if (transactionType === 'deposit') {
    //   /// For deposit transactions
    //   await db.query(
    //     `INSERT INTO deposit_transaction
    //      (transaction_id, deposit_way, deposit_location)
    //      VALUES ($1, 'online', 'web application')`,
    //     [transactionId]
    //   );
    // }

    /// Update account balance when the customer pay
    await db.query(
      "UPDATE account SET balance = $1 WHERE account_id = $2",
      [newBalance, accountId]
    );

    /// Record transaction history
    await db.query(
      `INSERT INTO transaction_history
       (transaction_id, account_id, previous_balance, new_balance)
       VALUES ($1, $2, $3, $4)`,
      [transactionId, accountId, currentBalance, newBalance]
    );

    /// Record account balance history
    await db.query(
      `INSERT INTO account_balance_history
       (account_id, balance_amount)
       VALUES ($1, $2)`,
      [accountId, newBalance]
    );

    /// Commit transaction
    await db.query("COMMIT");

    return res.json({
      success: true,
      transactionId,
      newBalance
    });
  } catch (err) {
    /// Ensure we rollback on any error
    try {
      await db.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Error during rollback:", rollbackErr);
    }

    console.error("Transaction error:", err);

    /// Return specific error message
    return res.status(500).json({
      success: false,
      error: err.message || "An error occurred processing your transaction"
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});