import { useState } from 'react';
import { createOrder, updateOrder, deleteOrder, getOrders, getOneOrder } from '../services/ordersService';
import { IOrder } from '../models/IOrder';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle creating an order
  const handleCreateOrder = async (orderPayload: Omit<IOrder, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const result = await createOrder(orderPayload); // Passing the payload without id and created_at
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Error creating order');
    }
  };

  // Handle updating an order
  const handleUpdateOrder = async (
    orderId: number,
    orderPayload: Omit<IOrder, 'id' | 'created_at' | 'customer_id' | 'total_price' | 'order_items'>
  ) => {
    try {
      setLoading(true);
      const result = await updateOrder({ id: orderId, ...orderPayload }); // Merge id with payload
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Error updating order');
    }
  };

  // Handle deleting an order
  const handleDeleteOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const result = await deleteOrder({ id: orderId });
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Error deleting order');
    }
  };

  const handleShowOneOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const result = await getOneOrder({ id: orderId });
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError("Error fetching data for one order");
    }
  }

  // Handle fetching all orders
  const handleShowOrders = async () => {
    try {
      setLoading(true);
      const orders = await getOrders(); // Fetch all orders
      setLoading(false);
      return orders;
    } catch (err) {
      setLoading(false);
      setError('Error fetching orders');
    }
  };

  return {
    handleCreateOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleShowOneOrder,
    handleShowOrders,
    loading,
    error,
  };
};