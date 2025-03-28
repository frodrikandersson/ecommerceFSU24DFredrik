import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productsService';
import { IProducts } from '../models/IProducts';

export const useProducts = () => {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch all products (to be used in ShowProducts.tsx)
  const handleShowProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data); // Set the products
      return data; // Return the products
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a product
  const handleCreateProduct = async (product: Omit<IProducts, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const newProduct = await createProduct(product);
      setProducts([...products, newProduct]); // Add new product to the list
    } catch (err) {
      setError('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a product
  const handleUpdateProduct = async (productId: number, product: Omit<IProducts, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const updatedProduct = await updateProduct({ id: productId, productData: product });
      // Update the products list by replacing the updated product
      setProducts(products.map(p => (p.id === productId ? updatedProduct : p)));
    } catch (err) {
      setError('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId: number) => {
    setLoading(true);
    try {
      await deleteProduct({ id: productId });
      // Remove the deleted product from the list
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleShowProducts, // Make sure to return this function so it's accessible in other components
  };
};