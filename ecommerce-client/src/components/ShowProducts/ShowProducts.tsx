import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProduct";
import { IProducts } from "../../models/IProducts";
import classes from "./ShowProducts.module.css";
import ProductForm from "../ProductForm";

const ShowProducts = () => {
    const { handleShowProducts, handleDeleteProduct, loading, error } = useProducts();
    const [products, setProducts] = useState<IProducts[]>([]);
    const [editingProduct, setEditingProduct] = useState<IProducts | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await handleShowProducts();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible);
    };

    const closeModal = () => {
        setShowPopup(false);
    };

    const updateProductList = async () => {
        const data = await handleShowProducts();
        setProducts(data);
    };

    const openCreateProductModal = () => {
        setEditingProduct(null);
        setShowPopup(true);
    };

    const handleSubmitDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await handleDeleteProduct(id);
            updateProductList();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className={`${classes.container}`}>
            <h2 className={`${classes.title}`} onClick={toggleContentVisibility}>
                Products
                <span className={`${classes.arrow} ${isContentVisible ? classes.down : classes.right}`}>&#9662;</span>
            </h2>

            <div className={`${isContentVisible ? classes.productContainer : classes.hidden}`}>
                <button className={`${classes.editButton}`} onClick={openCreateProductModal}>
                    Add Product
                </button>

                {loading && <p className={`${classes.loading}`}>Loading...</p>}
                {error && <p className={`${classes.error}`}>{error}</p>}

                {!loading && !error && (
                    <div className={`${classes.productGrid}`}>
                        {products.map((product) => (
                            <div key={product.id} className={`${classes.productCard}`}>
                                <img src={product.image} alt={product.name} className={`${classes.productImage}`} />
                                <p><strong>{product.name}</strong></p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Stock:</strong> {product.stock}</p>
                                <p><strong>Category:</strong> {product.category}</p>
                                <div className={`${classes.buttonGroup}`}>
                                    <button className={`${classes.editButton}`} onClick={() => { setEditingProduct(product); setShowPopup(true); }}>
                                        Edit
                                    </button>
                                    <button className={`${classes.deleteButton}`} onClick={() => product.id && handleSubmitDelete(product.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showPopup && (
              <div className={`${classes.modalOverlay}`}>
                  <div className={`${classes.modalContent}`}>
                    <ProductForm
                        existingProduct={editingProduct}
                        onClose={closeModal}
                        onProductUpdated={updateProductList}
                    />
                  </div>
                </div>
            )}
        </div>
    );
};

export default ShowProducts;