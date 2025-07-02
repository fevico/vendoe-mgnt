import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorController {
  create: RequestHandler = async (req, res) => {
    try {
      const { businessName, businessAddress, phoneNumber, isActive } = req.body;
      const userId = req.user!.id;

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (existingUser.role === 'vendor') {
        res.status(409).json({ error: 'User is already a vendor' });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          businessName,
          businessAddress,
          phoneNumber,
          isActive: isActive ?? true,
          role: 'vendor',
        },
      });

      res.status(201).json({
        message: 'Vendor profile created successfully',
        vendor: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          businessName: updatedUser.businessName,
          businessAddress: updatedUser.businessAddress,
          phoneNumber: updatedUser.phoneNumber,
          isActive: updatedUser.isActive,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  read: RequestHandler = async (req, res) => {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  readAll: RequestHandler = async (req, res) => {
    try {
      const vendors = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          businessName: true,
          businessAddress: true,
          phoneNumber: true,
          isActive: true,
          role: true,
        },
      });

      res.status(200).json({
        message: 'Vendors retrieved successfully',
        vendors,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  readById: RequestHandler = async (req, res) => {
    try {
      const vendorId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const userRole = req.user!.role;

      if (isNaN(vendorId)) {
        res.status(400).json({ error: 'Invalid vendor ID' });
        return;
      }

      // Restrict access to the vendor themselves or admins
      if (userRole !== 'admin') {
        res.status(403).json({ error: 'Access restricted to admins only!' });
        return;
      }

      const vendor = await prisma.user.findUnique({
        where: { id: vendorId },
        select: {
          id: true,
          name: true,
          email: true,
          businessName: true,
          businessAddress: true,
          phoneNumber: true,
          isActive: true,
          role: true,
        },
      });

      if (!vendor) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }

      if (vendor.role !== 'vendor') {
        res.status(400).json({ error: 'User is not a vendor' });
        return;
      }

      res.status(200).json({
        message: 'Vendor retrieved successfully',
        vendor,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update: RequestHandler = async (req, res) => {
    try {
      const { businessName, businessAddress, phoneNumber } = req.body;
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.role !== 'vendor') {
        res.status(403).json({ error: 'User is not a vendor' });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { businessName, businessAddress, phoneNumber, isActive: true },
      });

      res.status(200).json({
        message: 'Vendor profile updated successfully',
        vendor: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          businessName: updatedUser.businessName,
          businessAddress: updatedUser.businessAddress,
          phoneNumber: updatedUser.phoneNumber,
          isActive: updatedUser.isActive,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

 delete: RequestHandler = async (req, res) => {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },  
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.role !== 'vendor') {
        res.status(403).json({ error: 'User is not a vendor' });
        return;
      }

      // Delete all orders associated with the vendor
      const deletedOrders = await prisma.order.deleteMany({
        where: { userId },
      });

      // Update the user to remove vendor-specific fields and set role to customer
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'customer',
          businessName: null,
          businessAddress: null,
          phoneNumber: null,
          isActive: true,
        },
      });

      res.status(200).json({
        message: 'Vendor profile and associated orders deleted successfully',
        deletedOrdersCount: deletedOrders.count,
        vendor: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}