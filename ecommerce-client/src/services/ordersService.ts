import api from "../api/axios";
import { IOrder } from "../models/IOrder";

export async function getOrders() {
    try {
        const response = await api.get("/orders");
        return response.data;
    } catch (error) {
        console.error("Failed to get all orders.");
        throw new Error("All orders fetch failed.");
    }
}

export async function getOneOrder({ id }: { id: number }): Promise<IOrder> {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the specific order data.");
        throw new Error("Order data fetch failed.");
    }
}

export async function getOrderByPaymentId({ paymentId }: { paymentId: string }) {
    try {
        const response = await api.get(`/orders/payment/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the order by payment ID.");
        throw new Error("Order fetch by payment ID failed.");
    }
}

export async function createOrder(orderData: Omit<IOrder, "id" | "created_at">) {
    try {
        const response = await api.post("/orders", orderData);
        console.log("Order created successfully:", orderData);
        return response.data;
    } catch (error) {
        console.error("Failed to create an order.", error);
        throw new Error("Order creation failed.");
    }
}

export const updateOrder = async (updatedOrder: Partial<IOrder>) => {
    try {
        const response = await api.patch(`/orders/${updatedOrder.id}`, updatedOrder);
        return response.data;
    } catch (error) {
        console.error("Failed to update the order.", error);
        throw new Error("Order update failed.");
    }
};

export async function deleteOrder({ id }: { id: number }) {
    try {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the order.", error);
        throw new Error("Order deletion failed.");
    }
}