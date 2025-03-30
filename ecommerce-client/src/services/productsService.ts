import api from "../api/axios";
import { IProducts } from "../models/IProducts"; 

export async function getProducts() {
    try {
        const response = await api.get("/products");
        return response.data;
    } catch (error) {
        console.error("Failed to get all products.");
        throw new Error("All products fetch failed.");
    }
}

export async function getOneProduct({ id }: { id: number }): Promise<IProducts> {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to get the specific product data.");
        throw new Error("Product data fetch failed.");
    }
}

export async function createProduct(productData: Omit<IProducts, "id" | "created_at">) {
    try {
        const response = await api.post("/products", productData);
        return response.data;
    } catch (error) {
        console.error("Failed to create a product.", error);
        throw new Error("Product creation failed.");
    }
}

export async function updateProduct({ id, productData }: { id: number, productData: Omit<IProducts, "id" | "created_at"> }) {
    try {
        const response = await api.patch(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Failed to update the product.", error);
        throw new Error("Product update failed.");
    }
}

export async function deleteProduct({ id }: { id: number }) {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete the product.", error);
        throw new Error("Product deletion failed.");
    }
}