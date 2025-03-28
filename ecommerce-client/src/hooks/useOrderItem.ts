import { useState } from "react";
import { updateItems, deleteItems } from "../services/orderItemsService";
import { IOrderItem } from "../models/IOrderItem";

export const useOrderItems = (orderId: number) => {
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Handle updating order items
  const handleUpdateItems = async (updatedItems: IOrderItem[]) => {
    setLoading(true);
    try {
        // Filter out items with invalid ids (null or undefined)
        const updatedItemData = updatedItems
            .filter(item => item.id != null) // Only include items where id is not null or undefined
            .map(item => ({
                id: item.id as number,   // Type assertion since id is guaranteed to be a number after filtering
                quantity: item.quantity,  // Updated quantity
            }));

        // Call the updateItems function with the filtered item data
        await updateItems(updatedItemData); 

        // Update the order items in your state after successful update
        setOrderItems(updatedItems);
    } catch (err) {
        setError("Error updating order items");
    } finally {
        setLoading(false);
    }
};

  // Handle deleting order items
  const handleDeleteItem = async (itemId: number | null | undefined) => {
    if (itemId == null) {
      console.error("Invalid item ID");
      return; // Skip deletion if the ID is invalid
    }
  
    setLoading(true);
    try {
      // Proceed with the deletion if itemId is a valid number
      await deleteItems({ orderId: itemId }); // Now it should work because itemId is guaranteed to be a number
  
      // Update the order items state by removing the item that was deleted
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