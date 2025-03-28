import api from "../api/axios";
import { IOrder } from "../models/IOrder";

// Fetch all orders
export async function getOrders() {
    try {
        const response = await api.get("/orders");
        return response.data;
    } catch (error) {
        console.error("Failed to get all orders.");
        throw new Error("All orders fetch failed.");
    }
}

// Fetch a specific order by ID
export async function getOneOrder({ id }: { id: number }): Promise<IOrder> {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the specific order data.");
        throw new Error("Order data fetch failed.");
    }
}

// Create a new order
export async function createOrder(orderData: Omit<IOrder, "id" | "created_at">) {
    try {
        const response = await api.post("/orders", orderData);
        console.log("Order created successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to create an order.", error);
        throw new Error("Order creation failed.");
    }
}

// Update an existing order
export const updateOrder = async (updatedOrder: Partial<IOrder>) => {
    try {
        const response = await api.patch(`/orders/${updatedOrder.id}`, updatedOrder);
        return response.data;
    } catch (error) {
        console.error("Failed to update the order.", error);
        throw new Error("Order update failed.");
    }
};

// Delete an order
export async function deleteOrder({ id }: { id: number }) {
    try {
        const response = await api.delete(`/orders/${id}`);
        console.log("Order deleted successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the order.", error);
        throw new Error("Order deletion failed.");
    }
}