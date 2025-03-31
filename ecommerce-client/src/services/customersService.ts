import api from "../api/axios";
import { ICustomers } from "../models/ICustomers";

export async function getCustomers() {
    try {
        const response = await api.get("/customers");
        return response.data;
    } catch (error) {
        console.error("Failed to get all customers.");
        throw new Error("All customer data fetch failed.");
    }
}

export async function getOneCustomer({ id }: { id?: string}): Promise<ICustomers | null> {
    try {
        console.log("get customer ID", id)
        const response = await api.get(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the specific customer data.", error);
        throw new Error("Customer data fetch failed.");
    }
}

export async function getOneCustomerEmail({email }: { email?: string }): Promise<ICustomers | null> {
    try {
        const response = await api.get(`/customers/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the specific customer data.", error);
        throw new Error("Customer data fetch failed.");
    }
}

export async function createCustomer(customerData: Omit<ICustomers, "id" | "created_at">) {
    try {
        const response = await api.post("/customers", customerData);
        console.log("Customer created successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to create a customer.", error);
        throw new Error("Customer creation failed.");
    }
}

export async function updateCustomer({id, customerData}: {id: number, customerData: Omit<ICustomers, "id" | "created_at">}) {
    try {
        const response = await api.patch("/customers/" + id, customerData);
        console.log("Customer updated successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to update the customer.", error);
        throw new Error("Customer update failed.");
    }
}

export async function deleteCustomer({id}: {id: number}) {
    try {
        const response = await api.delete("/customers/" + id);
        console.log("Customer deleted successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the customer.", error);
        throw new Error("Customer deletion failed.");
    }
}