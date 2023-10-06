-- Users Table
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

-- Transactions Table
CREATE TABLE Transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    transaction_type TEXT CHECK(transaction_type IN ('Top-up', 'Pay', 'Void')) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'Success', 'Failed')) NOT NULL,
    recipient_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (recipient_id) REFERENCES Users(user_id)
);

-- Create an index on the user_id column in the Transactions table for faster lookups
CREATE INDEX idx_user_id ON Transactions (user_id);

-- Create an index on the recipient_id column in the Transactions table for faster lookups
CREATE INDEX idx_recipient_id ON Transactions (recipient_id);
