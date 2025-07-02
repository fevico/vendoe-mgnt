import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API for user authentication, vendor management, and order management with Express, Prisma, and PostgreSQL',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local server' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          summary: 'User Login',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful, returns user data and sets token cookie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Login successful' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'user@example.com' },
                          role: { type: 'string', example: 'vendor' },
                          businessName: { type: 'string', example: "John's Shop", nullable: true },
                          businessAddress: { type: 'string', example: '123 Market St', nullable: true },
                          phoneNumber: { type: 'string', example: '+1234567890', nullable: true },
                          isActive: { type: 'boolean', example: true, nullable: false },
                        },
                      },
                    },
                  },
                },
              },
              headers: {
                'Set-Cookie': {
                  schema: {
                    type: 'string',
                    example: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=3600000',
                  },
                  description: 'JWT token set in an HTTP-only cookie',
                },
              },
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      errors: {
                        type: 'object',
                        example: {
                          email: 'Invalid email address',
                          password: 'Password must be at least 6 characters long',
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Invalid password' },
            '404': { description: 'User not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'User Registration',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', enum: ['vendor', 'customer', 'admin'], default: 'vendor' },
                    businessName: { type: 'string', example: "John's Shop", nullable: true },
                    businessAddress: { type: 'string', example: '123 Market St', nullable: true },
                    phoneNumber: { type: 'string', example: '+1234567890', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Registration successful, returns user data and sets token cookie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Registration successful' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'user@example.com' },
                          role: { type: 'string', example: 'vendor' },
                          businessName: { type: 'string', example: "John's Shop", nullable: true },
                          businessAddress: { type: 'string', example: '123 Market St', nullable: true },
                          phoneNumber: { type: 'string', example: '+1234567890', nullable: true },
                          isActive: { type: 'boolean', example: true, nullable: true },
                        },
                      },
                    },
                  },
                },
              },
              headers: {
                'Set-Cookie': {
                  schema: {
                    type: 'string',
                    example: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=3600000',
                  },
                  description: 'JWT token set in an HTTP-only cookie',
                },
              },
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      errors: {
                        type: 'object',
                        example: {
                          name: 'Name is required',
                          email: 'Invalid email address',
                          password: 'Password must be at least 6 characters long',
                          businessName: 'Business name is required',
                          businessAddress: 'Business address is required',
                          phoneNumber: 'Phone number is required',
                        },
                      },
                    },
                  },
                },
              },
            },
            '409': { description: 'Email already in use' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/auth/logout': {
        post: {
          summary: 'User Logout',
          tags: ['Authentication'],
          responses: {
            '200': {
              description: 'Logout successful, clears token cookie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Logout successful' },
                    },
                  },
                },
              },
              headers: {
                'Set-Cookie': {
                  schema: {
                    type: 'string',
                    example: 'token=; Max-Age=0',
                  },
                  description: 'Clears the JWT token cookie',
                },
              },
            },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/vendors': {
        post: {
          summary: 'Create Vendor Profile',
          tags: ['Vendors'],
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['businessName', 'businessAddress', 'phoneNumber'],
                  properties: {
                    businessName: { type: 'string', example: "John's Shop" },
                    businessAddress: { type: 'string', example: '123 Market St' },
                    phoneNumber: { type: 'string', example: '+1234567890' },
                    isActive: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Vendor profile created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Vendor profile created successfully' },
                      vendor: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          businessName: { type: 'string', example: "John's Shop" },
                          businessAddress: { type: 'string', example: '123 Market St' },
                          phoneNumber: { type: 'string', example: '+1234567890' },
                          isActive: { type: 'boolean', example: true },
                          role: { type: 'string', example: 'vendor' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      errors: {
                        type: 'object',
                        example: {
                          businessName: 'Business name is required',
                          businessAddress: 'Business address is required',
                          phoneNumber: 'Phone number is required',
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '404': { description: 'User not found' },
            '409': { description: 'User is already a vendor' },
            '500': { description: 'Internal server error' },
          },
        },
        get: {
          summary: 'Get Own Vendor Profile',
          tags: ['Vendors'],
          security: [{ cookieAuth: [] }],
          responses: {
            '200': {
              description: 'Vendor profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'John Doe' },
                      email: { type: 'string', example: 'john@example.com' },
                      businessName: { type: 'string', example: "John's Shop" },
                      businessAddress: { type: 'string', example: '123 Market St' },
                      phoneNumber: { type: 'string', example: '+1234567890' },
                      isActive: { type: 'boolean', example: true },
                      role: { type: 'string', example: 'vendor' },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '403': { description: 'User is not a vendor' },
            '404': { description: 'User not found' },
            '500': { description: 'Internal server error' },
          },
        },
        patch: {
          summary: 'Update Vendor Profile',
          tags: ['Vendors'],
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    businessName: { type: 'string', example: "John's New Shop" },
                    businessAddress: { type: 'string', example: '456 Market St' },
                    phoneNumber: { type: 'string', example: '+0987654321' },
                    isActive: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Vendor profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Vendor profile updated successfully' },
                      vendor: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          businessName: { type: 'string', example: "John's New Shop" },
                          businessAddress: { type: 'string', example: '456 Market St' },
                          phoneNumber: { type: 'string', example: '+0987654321' },
                          isActive: { type: 'boolean', example: true },
                          role: { type: 'string', example: 'vendor' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Invalid input' },
            '401': { description: 'No token provided or invalid token' },
            '403': { description: 'User is not a vendor' },
            '404': { description: 'User not found' },
            '500': { description: 'Internal server error' },
          },
        },
        delete: {
          summary: 'Delete Vendor Profile',
          tags: ['Vendors'],
          security: [{ cookieAuth: [] }],
          responses: {
            '200': {
              description: 'Vendor profile deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Vendor profile deleted successfully' },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '403': { description: 'User is not a vendor' },
            '404': { description: 'User not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/vendors/{id}': {
        get: {
          summary: 'Get Vendor Profile by ID Only Admin can do this',
          tags: ['Vendors'],
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
              description: 'Vendor ID',
            },
          ],
          responses: {
            '200': {
              description: 'Vendor retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Vendor retrieved successfully' },
                      vendor: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          businessName: { type: 'string', example: "John's Shop" },
                          businessAddress: { type: 'string', example: '123 Market St' },
                          phoneNumber: { type: 'string', example: '+1234567890' },
                          isActive: { type: 'boolean', example: true },
                          role: { type: 'string', example: 'vendor' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Invalid vendor ID' },
            '401': { description: 'No token provided or invalid token' },
            '403': { description: 'Access restricted to the vendor or admins' },
            '404': { description: 'Vendor not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/vendors/all': {
        get: {
          summary: 'Get All Vendor Profiles',
          tags: ['Vendors'],
          security: [{ cookieAuth: [] }],
          responses: {
            '200': {
              description: 'Vendors retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Vendors retrieved successfully' },
                      vendors: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer', example: 1 },
                            name: { type: 'string', example: 'John Doe' },
                            email: { type: 'string', example: 'john@example.com' },
                            businessName: { type: 'string', example: "John's Shop" },
                            businessAddress: { type: 'string', example: '123 Market St' },
                            phoneNumber: { type: 'string', example: '+1234567890' },
                            isActive: { type: 'boolean', example: true },
                            role: { type: 'string', example: 'vendor' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/orders': {
        post: {
          summary: 'Create Order',
          tags: ['Orders'],
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'currency', 'item'],
                  properties: {
                    amount: { type: 'number', example: 99.99 },
                    currency: { type: 'string', example: 'USD' },
                    item: { type: 'string', example: 'Laptop' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Order created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Order created successfully' },
                      order: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          amount: { type: 'number', example: 99.99 },
                          currency: { type: 'string', example: 'USD' },
                          item: { type: 'string', example: 'Laptop' },
                          orderNumber: { type: 'string', example: 'ORD-123e4567' },
                          status: { type: 'string', example: 'PENDING' },
                          createdAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                          updatedAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      errors: {
                        type: 'object',
                        example: {
                          amount: 'Amount must be a positive number',
                          currency: 'Currency must be 3 characters',
                          item: 'Item description is required',
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '500': { description: 'Internal server error' },
          },
        },
        get: {
          summary: 'Get User Orders',
          tags: ['Orders'],
          security: [{ cookieAuth: [] }],
          responses: {
            '200': {
              description: 'Orders retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Orders retrieved successfully' },
                      orders: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer', example: 1 },
                            amount: { type: 'number', example: 99.99 },
                            currency: { type: 'string', example: 'USD' },
                            item: { type: 'string', example: 'Laptop' },
                            orderNumber: { type: 'string', example: 'ORD-123e4567' },
                            status: { type: 'string', example: 'PENDING' },
                            createdAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                            updatedAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '500': { description: 'Internal server error' },
          },
        },
      },
      '/orders/{id}': {
        get: {
          summary: 'Get Order by ID',
          tags: ['Orders'],
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
              description: 'Order ID',
            },
          ],
          responses: {
            '200': {
              description: 'Order retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Order retrieved successfully' },
                      order: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          amount: { type: 'number', example: 99.99 },
                          currency: { type: 'string', example: 'USD' },
                          item: { type: 'string', example: 'Laptop' },
                          orderNumber: { type: 'string', example: 'ORD-123e4567' },
                          status: { type: 'string', example: 'PENDING' },
                          createdAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                          updatedAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '404': { description: 'Order not found' },
            '500': { description: 'Internal server error' },
          },
        },
        patch: {
          summary: 'Update Order',
          tags: ['Orders'],
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
              description: 'Order ID',
            },
          ],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number', example: 149.99 },
                    currency: { type: 'string', example: 'USD' },
                    item: { type: 'string', example: 'Upgraded Laptop' },
                    status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'CANCELLED'], example: 'COMPLETED' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Order updated successfully' },
                      order: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          amount: { type: 'number', example: 149.99 },
                          currency: { type: 'string', example: 'USD' },
                          item: { type: 'string', example: 'Upgraded Laptop' },
                          orderNumber: { type: 'string', example: 'ORD-123e4567' },
                          status: { type: 'string', example: 'COMPLETED' },
                          createdAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:47:00Z' },
                          updatedAt: { type: 'string', format: 'date-time', example: '2025-07-02T07:48:00Z' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Invalid input' },
            '401': { description: 'No token provided or invalid token' },
            '404': { description: 'Order not found' },
            '500': { description: 'Internal server error' },
          },
        },
        delete: {
          summary: 'Delete Order',
          tags: ['Orders'],
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
              description: 'Order ID',
            },
          ],
          responses: {
            '200': {
              description: 'Order deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Order deleted successfully' },
                    },
                  },
                },
              },
            },
            '401': { description: 'No token provided or invalid token' },
            '404': { description: 'Order not found' },
            '500': { description: 'Internal server error' },
          },
        },
      },
    },
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;