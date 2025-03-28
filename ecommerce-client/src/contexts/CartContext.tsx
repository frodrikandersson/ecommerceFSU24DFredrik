import React, { createContext, useContext, useState, ReactNode } from "react";
import { IProducts } from "../models/IProducts";
import { CartItem } from "../models/ICart";

// Define the context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IProducts, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

// Create context with an empty default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider component that provides the cart context
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync the cart with localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product: IProducts, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity }];
      }
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Update item quantity in cart
  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items in the cart
  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};