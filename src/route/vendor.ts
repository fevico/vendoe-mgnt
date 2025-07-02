import { VendorController } from '@/controller/vendor';
import { authMiddleware, vendorMiddleware } from '@/middleware/auth';
import { createVendorSchema, updateVendorSchema } from '@/middleware/schema';
import { validate } from '@/middleware/validator';
import { Router } from 'express';

const vendorRouter = Router();
const vendorController = new VendorController();

vendorRouter.post(
  '/',
  authMiddleware,
  validate(createVendorSchema),
  vendorController.create,
);
vendorRouter.get('/', authMiddleware, vendorMiddleware, vendorController.read);
vendorRouter.get('/all', authMiddleware, vendorController.readAll);
vendorRouter.get('/:id', authMiddleware, vendorController.readById);
vendorRouter.put(
  '/',
  authMiddleware,
  vendorMiddleware,
  validate(updateVendorSchema),
  vendorController.update,
);
vendorRouter.delete('/', authMiddleware, vendorController.delete);

export default vendorRouter;