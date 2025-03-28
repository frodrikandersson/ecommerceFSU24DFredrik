import { useState, useEffect } from "react";
import { IOrder } from "../../models/IOrder";
import { useOrder } from "../../hooks/useOrder";
import { useCustomer } from "../../hooks/useCustomer";
import { useProducts } from "../../hooks/useProduct";
import { useOrderItems } from "../../hooks/useOrderItem";  // import the hook for updating order items
import classes from "./OrderForm.module.css";

interface OrderFormProps {
  onClose: () => void;
  editingOrder?: IOrder | null;
  refreshOrders: () => void;
}

const OrderForm = ({ onClose, editingOrder, refreshOrders }: OrderFormProps) => {
  const { handleCreateOrder, handleUpdateOrder, handleShowOneOrder, loading, error } = useOrder();
  const { handleShowCustomers } = useCustomer();
  const { handleShowProducts } = useProducts();
  const { handleUpdateItems, handleDeleteItem } = useOrderItems(editingOrder?.id || 0);  // Initialize hook with the order ID if editing
  
  const [formData, setFormData] = useState<IOrder>({
    id: editingOrder?.id || null,
    customer_id: editingOrder?.customer_id || null,
    payment_status: editingOrder?.payment_status || "unpaid",
    order_status: editingOrder?.order_status || "pending",
    total_price: editingOrder?.total_price || 0,
    payment_id: editingOrder?.payment_id || "",
    created_at: editingOrder?.created_at || new Date().toISOString(),
    order_items: editingOrder?.order_items || [],
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCustomers = await handleShowCustomers();
        setCustomers(fetchedCustomers);
        const fetchedProducts = await handleShowProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch customers or products.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (editingOrder && editingOrder.id) {
        try {
          const orderDetails = await handleShowOneOrder(editingOrder.id);
          
          // Ensure orderDetails is not undefined
          if (orderDetails) {
            setFormData({
              id: orderDetails.id,
              customer_id: orderDetails.customer_id,
              payment_status: orderDetails.payment_status,
              order_status: orderDetails.order_status,
              total_price: orderDetails.total_price,
              payment_id: orderDetails.payment_id,
              created_at: orderDetails.created_at,
              order_items: orderDetails.order_items,
            });
          } else {
            console.error("Order details are undefined");
          }
        } catch (err) {
          console.error("Error fetching order details:", err);
        }
      }
    };
  
    fetchOrderDetails();
  }, [editingOrder]);

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.order_items]);

  const calculateTotalPrice = () => {
    const total = formData.order_items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    setFormData((prev) => ({ ...prev, total_price: total }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    setFormData((prev) => ({
      ...prev,
      order_items: [
        ...prev.order_items,
        { 
          product_id: 0, 
          product_name: "", 
          quantity: 1, 
          unit_price: 0, // Set the default unit price
        },
      ],
    }));
  };

  const handleProductChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedOrderItems = [...formData.order_items];
    updatedOrderItems[index] = {
      ...updatedOrderItems[index],
      [name]: name === "quantity" ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, order_items: updatedOrderItems }));
  };

  const handleProductSelect = (index: number, productId: number) => {
    // Prevent product change during edit mode
    if (!editingOrder) {
      const selectedProduct = products.find((product) => product.id === productId);
      if (selectedProduct) {
        const updatedOrderItems = [...formData.order_items];
        updatedOrderItems[index] = {
          ...updatedOrderItems[index],
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          unit_price: selectedProduct.price, // Ensure unit_price is set here
        };
        setFormData((prev) => ({ ...prev, order_items: updatedOrderItems }));
      }
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    // Find the selected product from the products list
    const selectedProduct = products.find((product) => product.id === formData.order_items[index].product_id);
  
    if (selectedProduct) {
      const maxQuantity = selectedProduct.stock;
  
      // Check if the new quantity is greater than the available stock
      if (newQuantity > maxQuantity) {
        // Set the quantity to the maximum available stock
        alert(`You cannot order more than ${maxQuantity} items of this product.`);
        newQuantity = maxQuantity;
      }
  
      // Update the quantity to the valid value (either the new value or the max stock value)
      const updatedOrderItems = [...formData.order_items];
      updatedOrderItems[index] = {
        ...updatedOrderItems[index],
        quantity: newQuantity,
      };
      setFormData((prev) => ({ ...prev, order_items: updatedOrderItems }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update order
        await handleUpdateOrder(formData.id, formData);
        
        // Update order items
        const updatedItems = formData.order_items.map(item => ({
          id: item.id,
          product_id: item.product_id, // Include product_id
          product_name: item.product_name, // Include product_name
          unit_price: item.unit_price, // Include unit_price
          quantity: item.quantity, // Update quantity
        }));
        console.log(updatedItems);
        await handleUpdateItems(updatedItems); // Update order items separately
  
        alert("Order updated successfully!");
      } else {
        await handleCreateOrder(formData);
        alert("Order created successfully!");
      }
      refreshOrders();
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order");
    }
  };

  return (
    <div className={classes.modalContent}>
      <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.formGroup}>
        <label>Customer</label>
        <select 
          name="customer_id" 
          value={formData.customer_id || ""} 
          onChange={handleInputChange} 
          required 
          disabled={editingOrder ? true : false} // Disable during edit mode
        >
          <option value="" disabled>Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstname} {customer.lastname}
            </option>
          ))}
        </select>
      </div>

        <div className={classes.formGroup}>
          <label>Payment Status</label>
          <input type="text" name="payment_status" value={formData.payment_status} onChange={handleInputChange} required />
        </div>

        <div className={classes.formGroup}>
          <label>Order Status</label>
          <input type="text" name="order_status" value={formData.order_status} onChange={handleInputChange} required />
        </div>

        <div className={classes.formGroup}>
          <label>Total Price</label>
          <input type="number" name="total_price" value={formData.total_price} readOnly />
        </div>

        <div className={classes.productSection}>
        <h4>Order Items</h4>
        {formData.order_items.map((item, index) => (
          <div key={index} className={classes.productItem}>
            <div className={classes.formGroup}>
              <label>Product</label>
              <select 
                name="product_id" 
                value={item.product_id || ""} 
                onChange={(e) => {
                  handleProductChange(index, e); // Keep this for handling product change
                  handleProductSelect(index, Number(e.target.value)); // Update the product details
                }} 
                required
                disabled={editingOrder ? true : false} // Disable during edit mode
              >
                <option value="" disabled>Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            
            <div className={classes.formGroup}>
              <label>Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                value={item.quantity} 
                onChange={(e) => {
                  handleProductChange(index, e); // Keep this for handling other product changes
                  handleQuantityChange(index, Number(e.target.value)); // Check and handle the quantity update
                }} 
                required 
              />
            </div>
            
            <div className={classes.formGroup}>
              <label>Unit Price</label>
              <input 
                type="number" 
                name="unit_price" 
                value={item.unit_price} 
                disabled 
              />
            </div>

            <button 
              type="button" 
              className={`${classes.removeButton}`} 
              onClick={() => handleDeleteItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
        
        {!editingOrder && (
          <button 
            className={`${classes.addProductButton}`} 
            type="button" 
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        )}
      </div>

        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.buttonGroup}>
          <button type="submit" disabled={loading}>{loading ? "Saving..." : formData.id ? "Update Order" : "Create Order"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;