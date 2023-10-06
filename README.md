# E-Wallet Project for DTGO Technical Test

This project was created for the technical test at DTGO. It is not for commercial purposes.

## Structure

This project is divided into 2 parts:

1. client-side web application (app)
2. server-side API (api)

The web application techstack includes Vite, React, TailwindCSS. The server side techstack includes Node.js, Express.js, JWT, Bcrypt.

## Getting Started

Below is the instructions and requirements to get this project running. This project was developed and tested on MacOS Ventura 13.15.1 operating on an Apple Silicon only. You may need to tweak the setup process based on your current system environment.

`SQLite` was chosen as the database option for this project for its portability and setup convenience. If you prefer other databases, you may need to edit database schema promptly (The file is located at `db/schema.sql`).

This project assumes that you already have `yarn` package manager already installed. If you need to install it, please follow the instruction on their website: [Yarn](https://yarnpkg.com).

### Notes on `.env`

This project includes the .env files to store app secrets on the environment level, however, in the typical production environment, they should not be commited to the git repository for security reasons. App secrets should be securely stored in the environment variables for instance.

### Prerequisite

- MacOS (Ventura 13.15.1) (Apple Silicon)
- Homebrew
- Node (v16.14.2)
- Yarn
- ZSH (optional)
- NVM (optional)

### Instructions

This instructions manual assume you have the basic knowledge on operating the terminal. This project was developed and tested using ZSH Unix shell only.

1. Install `sqlite` using `Homebrew` using the following command inside the terminal:

```
arch --x86_64 homebrew install sqlite
```

2. Install dependencies for the API.

```
cd api/
yarn
```

3. Install dependencies for the web application

```
cd app/
yarn
```

4. Start the API server

```
cd api/
yarn start
```

5. Build and start the web application

```
cd app/
yarn build
yarn preview
```

or run it in development mode

```
yarn dev
```

## API Specification

### Authentication

- Authentication for API endpoints uses JWT (JSON Web Tokens).
- To authenticate, clients need to include the JWT token in the Authorization header of their requests.
- Example header for an authenticated request:

```
Authorization: <JWT-Token>
```

### API Endpoints

#### User Registration

| Endpoint                    | Description                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| **POST** /users/register    | Register a new user.                                                                        |
| **Request Body**            |                                                                                             |
| - `username` (string)       | The username for the new user.                                                              |
| - `password` (string)       | The user's password.                                                                        |
| - `rePassword` (string)     | Confirm the user's password.                                                                |
| **Response**                |                                                                                             |
| - 201 Created               | User registration successful.                                                               |
| - 400 Bad Request           | Invalid request data (e.g., username already exists, passwords don't match, weak password). |
| - 500 Internal Server Error | Server error.                                                                               |

#### User Login

| Endpoint                    | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| **POST** /users/login       | Authenticate a user and return a JWT token.            |
| **Request Body**            |                                                        |
| - `username` (string)       | The username of the user.                              |
| - `password` (string)       | The user's password.                                   |
| **Response**                |                                                        |
| - 200 OK                    | Login successful. Returns a JWT token in the response. |
| - 401 Unauthorized          | Incorrect password.                                    |
| - 404 Not Found             | User not found.                                        |
| - 500 Internal Server Error | Server error.                                          |

#### Get Wallet Balance

| Endpoint                    | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| **GET** /wallet/balance     | Retrieve the wallet balance of the authenticated user. |
| **Authentication**          | Required (JWT token in the Authorization header).      |
| **Response**                |                                                        |
| - 200 OK                    | Successful. Returns the wallet balance.                |
| - 404 Not Found             | User not found.                                        |
| - 500 Internal Server Error | Server error.                                          |

#### Top-Up Wallet

| Endpoint                    | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| **POST** /wallet/top-up     | Top-up the wallet balance of the authenticated user.   |
| **Authentication**          | Required (JWT token in the Authorization header).      |
| **Request Body**            |                                                        |
| - `amount` (number)         | The amount to top up.                                  |
| **Response**                |                                                        |
| - 200 OK                    | Top-up successful. Returns the updated wallet balance. |
| - 400 Bad Request           | Invalid request data (e.g., invalid amount).           |
| - 404 Not Found             | User not found.                                        |
| - 500 Internal Server Error | Server error.                                          |

#### Make Payment

| Endpoint                        | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| **POST** /wallet/pay            | Make a payment from the authenticated user's wallet to another user. |
| **Authentication**              | Required (JWT token in the Authorization header).                    |
| **Request Body**                |                                                                      |
| - `recipient_username` (string) | The username of the recipient.                                       |
| - `amount` (number)             | The amount to pay.                                                   |
| **Response**                    |                                                                      |
| - 200 OK                        | Payment successful. Returns the updated sender's wallet balance.     |
| - 400 Bad Request               | Invalid request data (e.g., invalid amount, insufficient balance).   |
| - 404 Not Found                 | User not found (sender or recipient).                                |
| - 500 Internal Server Error     | Server error.                                                        |

#### Transaction History

| Endpoint                    | Description                                                 |
| --------------------------- | ----------------------------------------------------------- |
| **GET** /wallet/history     | Retrieve the transaction history of the authenticated user. |
| **Authentication**          | Required (JWT token in the Authorization header).           |
| **Response**                |                                                             |
| - 200 OK                    | Successful. Returns the transaction history for the user.   |
| - 404 Not Found             | User not found.                                             |
| - 500 Internal Server Error | Server error.                                               |

#### Void Transaction

| Endpoint                    | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| **POST** /wallet/void       | Void a pending transaction of the authenticated user. |
| **Authentication**          | Required (JWT token in the Authorization header).     |
| **Request Body**            |                                                       |
| - `transaction_id` (string) | The ID of the transaction to void.                    |
| **Response**                |                                                       |
| - 200 OK                    | Transaction voided successfully.                      |
| - 400 Bad Request           | Invalid request (e.g., transaction is not pending).   |
| - 403 Forbidden             | Unauthorized to void this transaction.                |
| - 404 Not Found             | User or transaction not found.                        |
| - 500 Internal Server Error | Server error.                                         |

## Encryption Diagram

For sending sensitive data in API, we'll use HTTPS (TLS/SSL) encryption. This ensures that data sent between the client and server is encrypted and cannot be intercepted by malicious actors.

**Encryption Mechanism:**

1. **Client-Side**: The client starts a request to the server.
2. **TLS Handshake**: The client and server establish a secure connection using a TLS handshake.
3. **Data Encryption**: Sensitive data (like passwords or transaction details) is encrypted using the established secure connection.
4. **Server-Side**: The server receives and decrypts the data, processes the request, and sends an encrypted response back.
5. **Client-Side**: The client decrypts the received response.

## Credit

Pavaruth Pengcharoen (Poom)

Senior Software Developer

Tel: +66 93 124 2007

Email: poom.pengcharoen@gmail.com
