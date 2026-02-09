import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getPendingOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';

const router = express.Router();


router.post('/', createOrder);


router.get('/', getAllOrders);

// Get pending orders for delivery dashboard
router.get('/pending', getPendingOrders);


router.get('/:id', getOrderById);


router.put('/:id', updateOrderStatus);


router.delete('/:id', deleteOrder);

export default router;
