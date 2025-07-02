import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateOrderNumber } from '@/utils/order';

const prisma = new PrismaClient();

export class PaymentController {
  create: RequestHandler = async (req, res) => {
    try {
      const { amount, item } = req.body;
      const userId = req.user!.id;
        const orderNumber = generateOrderNumber()
      const order = await prisma.order.create({
        data: {
          amount,
          item,
          orderNumber,
          userId,
        },
      });

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          id: order.id,
          amount: order.amount,
          item: order.item,
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  read: RequestHandler = async (req, res) => {
    try {
      const userId = req.user!.id;
      const orders = await prisma.order.findMany({
        where: { userId },
        select: {
          id: true,
          amount: true,
          item: true,
          orderNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        message: 'Orders retrieved successfully',
        orders,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  readAll: RequestHandler = async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        select: {
          id: true,
          amount: true,
          item: true,
          orderNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        message: 'All orders retrieved successfully',
        orders,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  readById: RequestHandler = async (req, res) => {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.id, 10);

      const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
        select: {
          id: true,
          amount: true,
          item: true,
          orderNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!order) {
        res.status(404).json({ error: 'No order found' });
        return;
      }

      res.status(200).json({
        message: 'Order retrieved successfully',
        order,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update: RequestHandler = async (req, res) => {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.id, 10);
      const { amount, item, status } = req.body;

      const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { amount, item, status },
        select: {
          id: true,
          amount: true,
          item: true,
          orderNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete: RequestHandler = async (req, res) => {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.id, 10);

      const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
      });  

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      await prisma.order.delete({
        where: { id: orderId },
      });

      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}