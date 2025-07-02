Vendor and Order Management API Documentation
Overview
This API provides endpoints for user authentication, vendor profile management, and order management. It uses Express.js, Prisma, and PostgreSQL, with JWT-based authentication via HTTP-only cookies. All endpoints are documented in Swagger at /api-docs.
Base URL
http://localhost:5000
Authentication
Most endpoints require a JWT token, sent as an HTTP-only cookie named token. Obtain the token via /auth/register or /auth/login. Include the cookie in requests using tools like curl (--cookie) or Postman.
Endpoints
Authentication
POST /auth/register
Register a new user, optionally with vendor details.

Request Body:{
  "name": "Jane Vendor",
  "email": "jane@example.com",
  "password": "password123",
  "role": "vendor | "customer | admin" default("vendor) ,
  "businessName": "Jane's Shop", (optional)
  "businessAddress": "123 Market St", (optional)
  "phoneNumber": "+1234567890", (optional)
}


Responses:
201: Registration successful, returns user data and sets token cookie.{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "role": "vendor",
    "businessName": "Jane's Shop",
    "businessAddress": "123 Market St",
    "phoneNumber": "+1234567890", 
    "isActive": false
  }
}


400: Invalid input (e.g., missing fields).
409: Email already in use.
500: Server error.



POST /auth/login
Log in a user and set a token cookie.

Request Body:{
  "email": "jane@example.com",
  "password": "password123"
}


Responses:
200: Login successful, returns user data and sets token cookie.{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "role": "vendor",
    "businessName": "Jane's Shop",
    "businessAddress": "123 Market St",
    "phoneNumber": "+1234567890",
    "isActive": true
  }
}


400: Invalid input.
401: Invalid password.
404: User not found.
500: Server error.



POST /auth/logout
Log out a user and clear the token cookie.

Responses:
200: Logout successful.{ "message": "Logout successful" }


500: Server error.



Vendors
POST /vendors
Create a vendor profile for the authenticated user.

Security: Requires JWT token.
Request Body:{
  "businessName": "Jane's Shop",
  "businessAddress": "123 Market St",
  "phoneNumber": "+1234567890",
  "isActive": true
}


Responses:
201: Vendor profile created.{
  "message": "Vendor profile created successfully",
  "vendor": {
    "id": 1,
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "businessName": "Jane's Shop",
    "businessAddress": "123 Market St",
    "phoneNumber": "+1234567890",
    "isActive": true,
    "role": "vendor"
  }
}


400: Invalid input.
401: No/invalid token.
404: User not found.
409: User is already a vendor.
500: Server error.



GET /vendors
Retrieve the authenticated user's vendor profile.

Security: Requires JWT token and vendor role.
Responses:
200: Vendor profile retrieved.{
  "id": 1,
  "name": "Jane Vendor",
  "email": "jane@example.com",
  "businessName": "Jane's Shop",
  "businessAddress": "123 Market St",
  "phoneNumber": "+1234567890",
  "isActive": true,
  "role": "vendor"
}


401: No/invalid token.
403: User is not a vendor.
404: User not found.
500: Server error.



GET /vendors/{id}
Retrieve a vendor profile by ID (restricted to the vendor or admins).

Security: Requires JWT token.
Parameters:
id (path): Vendor ID (integer).


Responses:
200: Vendor retrieved.{
  "message": "Vendor retrieved successfully",
  "vendor": {
    "id": 1,
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "businessName": "Jane's Shop",
    "businessAddress": "123 Market St",
    "phoneNumber": "+1234567890",
    "isActive": true,
    "role": "vendor"
  }
}


400: Invalid vendor ID.
401: No/invalid token.
403: Access restricted.
404: Vendor not found.
500: Server error.



GET /vendors/all
Retrieve all vendor profiles.

Security: Requires JWT token.
Responses:
200: Vendors retrieved.{
  "message": "Vendors retrieved successfully",
  "vendors": [
    {
      "id": 1,
      "name": "Jane Vendor",
      "email": "jane@example.com",
      "businessName": "Jane's Shop",
      "businessAddress": "123 Market St",
      "phoneNumber": "+1234567890",
      "isActive": true,
      "role": "vendor"
    }
  ]
}


401: No/invalid token.
500: Server error.



PATCH /vendors
Update the authenticated user's vendor profile.

Security: Requires JWT token and vendor role.
Request Body:{
  "businessName": "Jane's New Shop",
  "businessAddress": "456 Market St",
  "phoneNumber": "+0987654321",
  "isActive": true
}


Responses:
200: Vendor profile updated.{
  "message": "Vendor profile updated successfully",
  "vendor": {
    "id": 1,
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "businessName": "Jane's New Shop",
    "businessAddress": "456 Market St",
    "phoneNumber": "+0987654321",
    "isActive": true,
    "role": "vendor"
  }
}


400: Invalid input.
401: No/invalid token.
403: User is not a vendor.
404: User not found.
500: Server error.



DELETE /vendors
Delete the authenticated user's vendor profile and associated orders.

Security: Requires JWT token and vendor role.
Responses:
200: Vendor profile and orders deleted.{
  "message": "Vendor profile and associated orders deleted successfully",
  "deletedOrdersCount": 2,
  "vendor": {
    "id": 1,
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "role": "customer"
  }
}


401: No/invalid token.
403: User is not a vendor.
404: User not found.
500: Server error.



Orders
POST /orders
Create a new order for the authenticated user.

Security: Requires JWT token.
Request Body:{
  "amount": 99.99,
  "currency": "USD",
  "item": "Laptop"
}


Responses:
201: Order created.{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "amount": 99.99,
    "currency": "USD",
    "item": "Laptop",
    "orderNumber": "ORD-123e4567",
    "status": "PENDING",
    "createdAt": "2025-07-02T11:44:00Z",
    "updatedAt": "2025-07-02T11:44:00Z"
  }
}


400: Invalid input.
401: No/invalid token.
500: Server error.



GET /orders
Retrieve all orders for the authenticated user.

Security: Requires JWT token.
Responses:
200: Orders retrieved.{
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "id": 1,
      "amount": 99.99,
      "currency": "USD",
      "item": "Laptop",
      "orderNumber": "ORD-123e4567",
      "status": "PENDING",
      "createdAt": "2025-07-02T11:44:00Z",
      "updatedAt": "2025-07-02T11:44:00Z"
    }
  ]
}


401: No/invalid token.
500: Server error.



GET /orders/{id}
Retrieve an order by ID.

Security: Requires JWT token.
Parameters:
id (path): Order ID (integer).


Responses:
200: Order retrieved.{
  "message": "Order retrieved successfully",
  "order": {
    "id": 1,
    "amount": 99.99,
    "currency": "USD",
    "item": "Laptop",
    "orderNumber": "ORD-123e4567",
    "status": "PENDING",
    "createdAt": "2025-07-02T11:44:00Z",
    "updatedAt": "2025-07-02T11:44:00Z"
  }
}


401: No/invalid token.
404: Order not found.
500: Server error.



PATCH /orders/{id}
Update an order by ID.

Security: Requires JWT token.
Parameters:
id (path): Order ID (integer).


Request Body:{
  "amount": 149.99,
  "currency": "USD",
  "item": "Upgraded Laptop",
  "status": "COMPLETED"
}


Responses:
200: Order updated.{
  "message": "Order updated successfully",
  "order": {
    "id": 1,
    "amount": 149.99,
    "currency": "USD",
    "item": "Upgraded Laptop",
    "orderNumber": "ORD-123e4567",
    "status": "COMPLETED",
    "createdAt": "2025-07-02T11:44:00Z",
    "updatedAt": "2025-07-02T11:45:00Z"
  }
}


400: Invalid input.
401: No/invalid token.
404: Order not found.
500: Server error.



DELETE /orders/{id}
Delete an order by ID.

Security: Requires JWT token.
Parameters:
id (path): Order ID (integer).


Responses:
200: Order deleted.{ "message": "Order deleted successfully" }


401: No/invalid token.
404: Order not found.
500: Server error.



Error Handling

Errors return a JSON object with an error field (e.g., {"error": "User not found"}).
Common status codes: 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error).

Testing with curl
Example workflow:

Register:curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Jane Vendor","email":"email":"jane@example.com","password":"password123"}' \
--cookie-jar cookies.txt


Create vendor profile:curl -X POST http://localhost:3000/vendors \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{"businessName":"Jane\'s Shop","businessAddress":"123 Market St","phoneNumber":"+1234567890"}'


Create order:curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{"amount":99.99,"currency":"USD","item":"Laptop"}'


Delete vendor profile (and orders):curl -X DELETE http://localhost:3000/vendors \
-b cookies.txt



Swagger UI
Access interactive documentation at http://localhost:3000/api-docs. Use the "Try it out" feature to test endpoints with a valid token cookie.
Notes

Security: Tokens are HTTP-only cookies for enhanced security.
Database: Uses PostgreSQL with Prisma for type-safe queries.
Validation: Joi validates request bodies for vendor and order endpoints.
Authorization: Vendor-specific endpoints (GET/PATCH/DELETE /vendors) require vendor role; GET /vendors/{id} requires vendor or admin access.
