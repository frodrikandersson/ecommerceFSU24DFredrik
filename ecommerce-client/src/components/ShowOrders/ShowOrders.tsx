import { useEffect, useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import { useCustomer } from "../../hooks/useCustomer";
import { IOrder } from "../../models/IOrder";
import { ICustomers } from "../../models/ICustomers";
import OrderForm from "../OrderForm"; 
import classes from "./ShowOrders.module.css";

const ShowOrders = () => {
    const { handleShowOrders, handleDeleteOrder } = useOrder();
    const { handleShowOneCustomer } = useCustomer();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [customers, setCustomers] = useState<Map<number, ICustomers>>(new Map());
    const [isContentVisible, setIsContentVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await handleShowOrders();
            setOrders(ordersData);

            const updatedCustomers = new Map(customers);
            for (let order of ordersData) {
                if (order.customer_id && !updatedCustomers.has(order.customer_id)) {
                    const customer = await handleShowOneCustomer(order.customer_id.toString());
                    if (customer) {
                        updatedCustomers.set(order.customer_id, customer);
                    }
                }
            }
            setCustomers(updatedCustomers);
        } catch (err) {
            setError("Error fetching orders or customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getCustomerName = (customerId: number | null) => {
        if (!customerId || !customers.has(customerId)) return "Unknown Customer";
        const customer = customers.get(customerId);
        return customer ? `${customer.firstname} ${customer.lastname}` : "Customer Not Found";
    };

    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible);
    };

    const handleSubmitDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;

        try {
            await handleDeleteOrder(id);
            fetchOrders(); 
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleAddOrderClick = () => {
        setEditingOrder(null);
        setIsFormVisible(true);
    };

    const handleEditOrderClick = (order: IOrder) => {
        setEditingOrder(order);
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
    };

    return (
        <div className={classes.container}>
            <h2 className={classes.title} onClick={toggleContentVisibility}>
                Orders
                <span className={`${classes.arrow} ${isContentVisible ? classes.down : classes.right}`}>&#9662;</span>
            </h2>


            {isFormVisible && (
                <div className={classes.modalOverlay}>
                    <OrderForm 
                        onClose={handleCloseForm} 
                        editingOrder={editingOrder} 
                        refreshOrders={fetchOrders} 
                    />
                </div>
            )}

            <div className={`${isContentVisible ? classes.orderContainer : classes.hidden}`}>
            <button className={classes.addOrderButton} onClick={handleAddOrderClick}>
                Add Order
            </button>
                {loading && <p className={classes.loading}>Loading...</p>}
                {error && <p className={classes.error}>{error}</p>}

                {!loading && !error && (
                    <div className={classes.orderGrid}>
                        {orders.map((order) => (
                            <div key={order.id} className={classes.orderCard}>
                                <p><strong>Customer:</strong> {getCustomerName(order.customer_id)}</p>
                                <p><strong>Payment Status:</strong> {order.payment_status}</p>
                                <p><strong>Order Status:</strong> {order.order_status}</p>
                                <p><strong>Total Price:</strong> ${order.total_price}</p>
                                <div className={classes.buttonGroup}>
                                    <button className={classes.editButton} onClick={() => handleEditOrderClick(order)}>
                                        Edit
                                    </button>
                                    <button
                                        className={classes.deleteButton}
                                        onClick={() => order.id && handleSubmitDelete(order.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowOrders;