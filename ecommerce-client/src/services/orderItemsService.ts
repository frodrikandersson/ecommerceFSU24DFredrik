import api from "../api/axios";

export async function updateItems(orderItems: { id: number; quantity: number }[]) {
    try {
        const updateRequests = orderItems.map(item => {
            api.patch(`/order-items/${item.id}`, { quantity: item.quantity });
        });

        await Promise.all(updateRequests); 
    } catch (error) {
        console.error("Failed to update order items.", error);
        throw new Error("Order items update failed.");
    }
}

export async function deleteItems({ orderId }: { orderId: number }) {
    try {
        const response = await api.delete(`/order-items/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete order items.", error);
        throw new Error("Order items deletion failed.");
    }
}
