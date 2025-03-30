import { useState } from "react";
import { updateItems, deleteItems } from "../services/orderItemsService";
import { IOrderItem } from "../models/IOrderItem";

export const useOrderItems = (orderId: number) => {
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleUpdateItems = async (updatedItems: IOrderItem[]) => {
    setLoading(true);
    try {
        const updatedItemData = updatedItems
            .filter(item => item.id != null) 
            .map(item => ({
                id: item.id as number, 
                quantity: item.quantity, 
            }));

        await updateItems(updatedItemData); 

        setOrderItems(updatedItems);
    } catch (err) {
        setError("Error updating order items");
    } finally {
        setLoading(false);
    }
};

  const handleDeleteItem = async (itemId: number | null | undefined) => {
    if (itemId == null) {
      console.error("Invalid item ID");
      return; 
    }
  
    setLoading(true);
    try {
      await deleteItems({ orderId: itemId }); 
      setOrderItems((prev) => prev.filter(item => item.id !== itemId)); 
  
    } catch (err) {
      setError("Error deleting order item");
    } finally {
      setLoading(false);
    }
  };

  return {
    orderItems,
    loading,
    error,
    handleUpdateItems,
    handleDeleteItem,
  };
};