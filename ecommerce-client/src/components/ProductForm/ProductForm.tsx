import { useState, useEffect } from "react";
import classes from "./ProductForm.module.css";
import { IProducts } from "../../models/IProducts";
import { useProducts } from "../../hooks/useProduct";

interface ProductFormProps {
  existingProduct?: IProducts | null;
  onClose: () => void;
  onProductUpdated: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ existingProduct, onClose, onProductUpdated }) => {
  const [product, setProduct] = useState<Omit<IProducts, "id" | "created_at">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {handleUpdateProduct} = useProducts();

  useEffect(() => {
    if (existingProduct) {
      setProduct({
        name: existingProduct.name,
        description: existingProduct.description,
        price: existingProduct.price,
        stock: existingProduct.stock,
        category: existingProduct.category,
        image: existingProduct.image,
      });
    }
  }, [existingProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (existingProduct) {
          await handleUpdateProduct(existingProduct.id, product);
      } else {
        // Create product logic if existingProduct is false... not sure what to do here
      }
      onProductUpdated();
      onClose();
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${classes.modalOverlay}`}>
      <div className={`${classes.modalContent}`}>
        <h2>{existingProduct ? "Edit Product" : "Add Product"}</h2>
        {error && <p className={`${classes.error}`}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={`${classes.formGroup}`}>
            <label>Name:</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className={`${classes.formGroup}`}>
            <label>Description:</label>
            <textarea name="description" value={product.description} onChange={handleChange} required />
          </div>
          <div className={`${classes.formGroup}`}>
            <label>Price:</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} required />
          </div>
          <div className={`${classes.formGroup}`}>
            <label>Stock:</label>
            <input type="number" name="stock" value={product.stock} onChange={handleChange} required />
          </div>
          <div className={`${classes.formGroup}`}>
            <label>Category:</label>
            <input type="text" name="category" value={product.category} onChange={handleChange} required />
          </div>
          <div className={`${classes.formGroup}`}>
            <label>Image URL:</label>
            <input type="text" name="image" value={product.image} onChange={handleChange} required />
          </div>
          <div className={`${classes.buttonGroup}`}>
            <button className={`${classes.submitButton}`} type="submit" disabled={loading}>
              {loading ? (existingProduct ? "Updating..." : "Creating...") : existingProduct ? "Update" : "Create"}
            </button>
            <button className={`${classes.closeButton}`} type="button" onClick={onClose} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;