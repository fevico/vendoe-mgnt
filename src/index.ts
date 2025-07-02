import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRouter from './route/auth';
import swaggerSpec from './swagger';
import vendorRouter from './route/vendor';
import orderRouter from './route/payment';

dotenv.config();

const app = express();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const PORT = process.env.PORT || 3000;

// Test database connection
async function testDbConnection() {
  try {
    const users = await prisma.order.findMany();
    console.log('Database connection successful. Order found:', users);
  } catch (error) {
    console.error('Database connection failed:', error); 
  }
}

testDbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use("/vendor", vendorRouter)
app.use('/payment', orderRouter);

 
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => { 
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});