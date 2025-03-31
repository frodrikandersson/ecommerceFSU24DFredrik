import { useState } from 'react';
import { createOrder, updateOrder, deleteOrder, getOrders, getOneOrder, getOrderByPaymentId } from '../services/ordersService';
import { IOrder } from '../models/IOrder';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateOrder = async (orderPayload: Omit<IOrder, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const result = await createOrder(orderPayload); 
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Error creating order');
    }
  };

  const handleUpdateOrder = async (
    orderId: number,
    orderPayload: Omit<IOrder, 'id' | 'created_at' | 'customer_id' | 'total_price' | 'order_items'>
  ) => {
    try {
      setLoading(true);
      const result = await updateOrder({ id: orderId, ...orderPayload });
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Error updating order');
    }
  };

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
  };

  const handleShowOneOrderByPaymentId = async (paymentId: string) => {
    try {
      setLoading(true);
      const result = await getOrderByPaymentId({ paymentId });
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError("Error fetching data for one order by payment ID");
    }
  };

  const handleShowOrders = async () => {
    try {
      setLoading(true);
      const orders = await getOrders();
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
    handleShowOneOrderByPaymentId,
    handleShowOrders,
    loading,
    error,
  };
};