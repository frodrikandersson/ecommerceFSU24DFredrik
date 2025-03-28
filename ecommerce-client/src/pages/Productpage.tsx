import { useState } from "react";
import { useProducts } from "../hooks/useProduct";
import { useCartContext } from "../contexts/CartContext";  // Use the cart context
import classes from "./Pages.module.css";

export const Productpage = () => {
  const { products } = useProducts();
  const { addToCart } = useCartContext();  // Use addToCart from context
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const handleQuantityChange = (id: number, value: number, maxStock: number) => {
    if (value < 1) value = 1;
    if (value > maxStock) value = maxStock;
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const validProducts = products.filter((product) => product.id !== null);

  return (
    <div className={classes.productPage}>
      <h1>Our Products</h1>
      <div className={classes.productGrid}>
        {validProducts.map((product) => {
          const productId = product.id!; // Type assertion here to ensure it's not null
          return (
            <div key={productId} className={classes.productCard}>
              <img className={classes.productImg} src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className={classes.price}>${product.price.toFixed(2)}</p>
              <p className={classes.stock}>Stock: {product.stock}</p>

              <div className={classes.quantityControl}>
                <button
                  onClick={() =>
                    handleQuantityChange(productId, (quantities[productId] || 1) - 1, product.stock)
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
                    handleQuantityChange(productId, parseInt(e.target.value) || 1, product.stock)
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(productId, (quantities[productId] || 1) + 1, product.stock)
                  }
                  disabled={(quantities[productId] || 1) >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                className={classes.addToCart}
                onClick={() => addToCart(product, quantities[productId] || 1)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};