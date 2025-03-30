import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProduct";
import { useCartContext } from "../contexts/CartContext"; 
import classes from "./Pages.module.css";
import { useOrder } from "../hooks/useOrder";

export const Productpage = () => {
  const { products } = useProducts();
  const { addToCart } = useCartContext(); 
  const { handleShowOrders, handleShowOneOrder } = useOrder(); 
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  const [adjustedStock, setAdjustedStock] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchOrdersAndAdjustStock = async () => {
      const orders = await handleShowOrders();
      const stockReduction: { [key: number]: number } = {};
      
      for (const order of orders) {
        const orderDetails = await handleShowOneOrder(order.id);
        orderDetails?.order_items.forEach((item: any) => {
          if (stockReduction[item.product_id]) {
            stockReduction[item.product_id] += item.quantity;
          } else {
            stockReduction[item.product_id] = item.quantity;
          }
        });
      }
      
      const updatedStock: { [key: number]: number } = {};
      products.forEach((product) => {
        updatedStock[product.id!] = Math.max(0, product.stock - (stockReduction[product.id!] || 0));
      });
      
      setAdjustedStock(updatedStock);
    };

    fetchOrdersAndAdjustStock();
  }, [products, handleShowOrders, handleShowOneOrder]);

  const handleQuantityChange = (id: number, value: number, maxStock: number) => {
    if (value < 1) value = 1;
    if (value > maxStock) value = maxStock;
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id!] || 1;
    addToCart(product, quantity);
    setAddedProduct(product.id!);

    setCartMessage(`Added ${quantity} × ${product.name} to cart!`);
    setTimeout(() => {
      setCartMessage(null);
      setAddedProduct(null);
    }, 2000);
  };

  const validProducts = products.filter((product) => product.id !== null);

  return (
    <div className={classes.productPage}>
      <h1>Our Products</h1>
      <div className={classes.productGrid}>
        {validProducts.map((product) => {
          const productId = product.id!; 
          const availableStock = adjustedStock[productId] ?? product.stock;
          return (
            <div key={productId} className={classes.productCard}>
              <img className={classes.productImg} src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className={classes.price}>${product.price.toFixed(2)}</p>
              <p className={classes.stock}>Stock: {availableStock}</p>

              <div className={classes.quantityControl}>
                <button
                  onClick={() =>
                    handleQuantityChange(productId, (quantities[productId] || 1) - 1, availableStock)
                  }
                  disabled={(quantities[productId] || 1) <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  name={productId.toString()}
                  value={quantities[productId] || 1}
                  onChange={(e) =>
                    handleQuantityChange(productId, parseInt(e.target.value) || 1, availableStock)
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(productId, (quantities[productId] || 1) + 1, availableStock)
                  }
                  disabled={(quantities[productId] || 1) >= availableStock}
                >
                  +
                </button>
              </div>

              <button
                className={classes.addToCart}
                onClick={() => handleAddToCart(product)}
                disabled={availableStock === 0}
              >
                {addedProduct === productId ? "Added!" : availableStock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};