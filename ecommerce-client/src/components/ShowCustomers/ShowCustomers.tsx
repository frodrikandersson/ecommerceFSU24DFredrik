import { useEffect, useState } from "react";
import { useCustomer } from "../../hooks/useCustomer";
import { ICustomers } from "../../models/ICustomers";
import classes from "./ShowCustomers.module.css";
import CustomerForm from "../CustomerForm";

const ShowCustomers = () => {
    const { handleShowCustomers, handleDeleteCustomer, loading, error } = useCustomer();
    const [customers, setCustomers] = useState<ICustomers[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<ICustomers | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(true); 

    useEffect(() => {
        const fetchCustomers = async () => {
            const data = await handleShowCustomers();
            setCustomers(data);
        };

        fetchCustomers();
    }, []);

    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible);
    };

    const closeModal = () => {
        setShowPopup(false);
    };

    const updateCustomerList = async () => {
        const data = await handleShowCustomers();
        setCustomers(data);
    };

    const openCreateCustomerModal = () => {
        setEditingCustomer(null);
        setShowPopup(true);
    };

    const handleSubmitDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        try {
            await handleDeleteCustomer(id);
            updateCustomerList();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    return (
        <div className={`${classes.container}`}>
            <h2 className={`${classes.title}`} onClick={toggleContentVisibility}>
                Customers
                <span className={`${classes.arrow} ${isContentVisible ? classes.down : classes.right}`}>&#9662;</span>
            </h2>

            <div className={`${isContentVisible ? classes.customerContainer : classes.hidden}`}>
                <button className={`${classes.editButton}`} onClick={openCreateCustomerModal}>
                    Add Customer
                </button>

                {loading && <p className={`${classes.loading}`}>Loading...</p>}
                {error && <p className={`${classes.error}`}>{error}</p>}

                {!loading && !error && (
                    <div className={`${classes.customerGrid}`}>
                        {customers.map((customer) => (
                            <div key={customer.id} className={`${classes.customerCard}`}>
                                <p>{customer.firstname} {customer.lastname}</p>
                                <p><strong>Email:</strong> {customer.email}</p>
                                <p><strong>Phone:</strong> {customer.phone}</p>
                                <p><strong>Address:</strong> {customer.street_address}, {customer.city}, {customer.country}</p>
                                <div className={`${classes.buttonGroup}`}>
                                    <button className={`${classes.editButton}`} onClick={() => { setEditingCustomer(customer); setShowPopup(true); }}>
                                        Edit
                                    </button>
                                    <button className={`${classes.deleteButton}`} onClick={() => customer.id && handleSubmitDelete(customer.id)}>
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
                        <h2>Edit Customer</h2>
                        <CustomerForm existingCustomer={editingCustomer} onClose={closeModal} onCustomerUpdated={updateCustomerList} />
                        <button className={`${classes.closeButton}`} onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ShowCustomers;