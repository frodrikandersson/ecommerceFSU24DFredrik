import api from "../api/axios";
import { IProducts } from "../models/IProducts"; // Assuming IProduct exists

// Fetch all products
export async function getProducts() {
    try {
        const response = await api.get("/products");
        return response.data;
    } catch (error) {
        console.error("Failed to get all products.");
        throw new Error("All products fetch failed.");
    }
}

// Fetch a specific product by ID
export async function getOneProduct({ id }: { id: number }): Promise<IProducts> {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the specific product data.");
        throw new Error("Product data fetch failed.");
    }
}

// Create a new product
export async function createProduct(productData: Omit<IProducts, "id" | "created_at">) {
    try {
        const response = await api.post("/products", productData);
        console.log("Product created successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to create a product.", error);
        throw new Error("Product creation failed.");
    }
}

// Update an existing product
export async function updateProduct({ id, productData }: { id: number, productData: Omit<IProducts, "id" | "created_at"> }) {
    try {
        const response = await api.patch(`/products/${id}`, productData);
        console.log("Product updated successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to update the product.", error);
        throw new Error("Product update failed.");
    }
}

// Delete a product
export async function deleteProduct({ id }: { id: number }) {
    try {
        const response = await api.delete(`/products/${id}`);
        console.log("Product deleted successfully.", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the product.", error);
        throw new Error("Product deletion failed.");
    }
}