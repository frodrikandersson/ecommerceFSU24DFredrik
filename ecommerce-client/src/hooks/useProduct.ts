import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productsService';
import { IProducts } from '../models/IProducts';

export const useProducts = () => {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleShowProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data); 
      return data; 
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (product: Omit<IProducts, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const newProduct = await createProduct(product);
      setProducts([...products, newProduct]); 
    } catch (err) {
      setError('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (productId: number, product: Omit<IProducts, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const updatedProduct = await updateProduct({ id: productId, productData: product });
      setProducts(products.map(p => (p.id === productId ? updatedProduct : p)));
    } catch (err) {
      setError('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    setLoading(true);
    try {
      await deleteProduct({ id: productId });
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
    handleShowProducts, 
  };
};