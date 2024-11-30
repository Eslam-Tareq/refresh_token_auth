## 🔍 Overview

**Refresh Token Authentication** is a secure and reliable implementation for managing user authentication with access and refresh tokens. It provides a scalable solution to handle session management and token-based authentication in modern web applications.

---

## 📝 Description

This repository offers a comprehensive solution for implementing authentication workflows with refresh tokens. It allows users to authenticate securely, manage session lifetimes, and refresh their access tokens seamlessly without requiring frequent logins.

Key highlights include:

- Secure token storage and management.
- Automatic token expiration handling.
- Clear and detailed error handling to facilitate debugging.

The project is built with modern best practices, making it ideal for integration into new or existing web applications.

---

## ✨ Features

- **Access and Refresh Token Workflow**: Implements a secure process for issuing and refreshing tokens.
- **Token Expiry Management**: Automatically handles token expiration and re-authentication.
- **Customizable Security Policies**: Easily adapt token lifetimes and secret keys to match your application's needs.
- **Error Handling**: Comprehensive error responses with clear messages and codes.
- **Scalable Design**: Compatible with both monolithic and microservice architectures.

---

## technologies

- **JWT**: for creating strong tokens with supplied secret.
- **nodeJs**: as run time environment.
- **expressJs**: as back-end framework.
- **typescript**: added types and make code more understandable.
- **mongoDB**: as nosql data base for creating user schema using mongoose.

---

## 🛠️ Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**  
    Use the following command to clone this repository:
   ```bash
   git clone https://github.com/Eslam-Tareq/refresh_token_auth.git
   cd refresh_token_auth
   Install Dependencies
   Run the following command to install the required packages:
   ```

Install Dependencies
Run the following command to install the required packages:

bash
Copy code
npm install
Set Environment Variables
Create a .env file in the root directory and configure the required variables:

env
Copy code
PORT=3000
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
TOKEN_EXPIRY=3600 # Expiration time for access tokens (in seconds)
REFRESH_TOKEN_EXPIRY=86400 # Expiration time for refresh tokens (in seconds)
Start the Application
Start the application with the following command:

bash
Copy code
npm start
Run Tests (Optional)
If tests are included, run them using:

bash
Copy code
npm test
