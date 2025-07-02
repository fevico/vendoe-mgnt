Vendor and Order Management API
This is a RESTful API for user authentication, vendor profile management, and order management, built with Express.js, Prisma, PostgreSQL, TypeScript, and documented with Swagger. It supports user registration/login, vendor profile CRUD operations, and order management, with JWT-based authentication via HTTP-only cookies.
Features

Authentication: Register, login, and logout users with JWT tokens stored in HTTP-only cookies.
Vendor Management: Create, read, update, and delete vendor profiles, including associated orders.
Order Management: Create, read, update, and delete orders linked to users.
Swagger Documentation: Interactive API documentation available at /api-docs.

Prerequisites

Node.js: v18 or higher
PostgreSQL: v12 or higher
npm: v9 or higher
Git: For cloning the repository

Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd <repository-name>

2. Install Dependencies
npm install

This installs required packages, including:

express, jsonwebtoken, bcrypt, cookie-parser
@prisma/client, swagger-jsdoc, swagger-ui-express
Dev dependencies: typescript, @types/*, ts-node, nodemon

3. Configure Environment Variables
Create a .env file in the root directory with the following:
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
JWT_SECRET="your-secure-jwt-secret"
PORT=5000


Replace <user>, <password>, and <database> with your PostgreSQL credentials.
Use a strong JWT_SECRET for token signing.

4. Set Up PostgreSQL Database
Ensure PostgreSQL is running and create a database:
psql -U <user> -c "CREATE DATABASE <database>;"

5. Run Prisma Migrations
Initialize the database schema:
npx prisma migrate dev --name init

This creates the User and Order tables based on schema.prisma.
6. Generate Prisma Client
npx prisma generate

7. Build and Run the Application

Development Mode (with auto-restart):npm run dev


Production Build:npm run build
npm start



The server runs on http://localhost:5000 (or the port specified in .env).
8. Access Swagger Documentation
Open http://localhost:5000/api-docs in a browser to view and test API endpoints.
post man url = https://documenter.getpostman.com/view/20440383/2sB34Zsk9d
Project Structure
├── src/
│   ├── config/           # Swagger and other configurations
│   ├── controllers/      # Request handlers (auth, vendor, order)
│   ├── middlewares/      # Authentication and validation middleware
│   ├── routes/           # Express route definitions
│   ├── validators/       # Joi validation schemas
│   ├── prisma/           # Prisma schema and migrations
│   └── server.ts         # Main application entry point
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file

Scripts

npm run dev: Run in development with ts-node-dev
npm run build: Compile TypeScript to JavaScript
npm start: Run the compiled application
npm run prisma:generate: Generate Prisma client
npm run prisma:migrate: Run database migrations

Testing the API
Use tools like curl, Postman, or Swagger UI to test endpoints. Example:
curl -X POST http://localhost:5000/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Jane Vendor","email":"jane@example.com","password":"password123","businessName":"Jane\'s Shop","businessAddress":"123 Market St","phoneNumber":"+1234567890"}' \
--cookie-jar cookies.txt

Troubleshooting

Database Connection Errors: Verify DATABASE_URL and PostgreSQL service.
TypeScript Errors: Run npx tsc --noEmit to check code.
Token Issues: Ensure JWT_SECRET is set and tokens are included in cookies.
Swagger UI Blank: Clear browser cache or check swagger-jsdoc installation.

License
MIT License. See LICENSE file for details.