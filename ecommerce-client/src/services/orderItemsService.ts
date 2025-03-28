import api from "../api/axios";

// Update order items
export async function updateItems(orderItems: { id: number; quantity: number }[]) {
    try {
        const updateRequests = orderItems.map(item => {
            api.patch(`/order-items/${item.id}`, { quantity: item.quantity });
            console.log(item.id);
        });

        await Promise.all(updateRequests); // Send all PATCH requests in parallel
        console.log("Order items updated successfully.");
    } catch (error) {
        console.error("Failed to update order items.", error);
        throw new Error("Order items update failed.");
    }
}

// Delete order items
export async function deleteItems({ orderId }: { orderId: number }) {
    try {
        const response = await api.delete(`/order-items/${orderId}`);
        console.log("Order items deleted successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete order items.", error);
        throw new Error("Order items deletion failed.");
    }
}
