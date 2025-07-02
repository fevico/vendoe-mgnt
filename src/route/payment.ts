import { Router } from 'express';
import { PaymentController } from '@/controller/payment';
import { authMiddleware } from '@/middleware/auth';
import { validate } from '@/middleware/validator';
import { createOrderSchema, updateOrderSchema } from '@/middleware/schema';

const orderRouter = Router();
const orderController = new PaymentController();

orderRouter.post(
  '/',
  authMiddleware,
  validate(createOrderSchema),
  orderController.create,
);
orderRouter.get('/', authMiddleware, orderController.read);
orderRouter.get('/all', authMiddleware, orderController.readAll);
orderRouter.get('/:id', authMiddleware, orderController.readById);
orderRouter.patch(
  '/:id',
  authMiddleware,
  validate(updateOrderSchema),
  orderController.update,
);
orderRouter.delete('/:id', authMiddleware, orderController.delete);

export default orderRouter;



// import { Router } from 'express';
// import { OrderController } from '@/controllers/orderController';
// import { validate } from '@/validators/validate';
// import { createOrderSchema, updateOrderSchema } from '@/validators/orderValidator';
// import { authMiddleware } from '@/middlewares/authMiddleware';

// const orderRouter = Router();
// const orderController = new OrderController();

// orderRouter.post(
//   '/',
//   authMiddleware,
//   validate(createOrderSchema),
//   orderController.create,
// );
// orderRouter.get('/', authMiddleware, orderController.read);
// orderRouter.get('/:id', authMiddleware, orderController.readById);
// orderRouter.patch(
//   '/:id',
//   authMiddleware,
//   validate(updateOrderSchema),
//   orderController.update,
// );
// orderRouter.delete('/:id', authMiddleware, orderController.delete);

// export default orderRouter;