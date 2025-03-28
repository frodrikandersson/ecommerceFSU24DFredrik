import { useEffect, useState } from "react";
import { useCustomer } from "../../hooks/useCustomer";
import { ICustomers } from "../../models/ICustomers";
import classes from "./CustomerForm.module.css";

interface CustomerFormProps {
    existingCustomer?: ICustomers | null;
    onClose: () => void; 
    onCustomerUpdated: () => void; 
}

const CustomerForm = ({ existingCustomer, onClose, onCustomerUpdated }: CustomerFormProps) => {
    const { handleCreateCustomer, handleUpdateCustomer, loading, error } = useCustomer();
    const [formData, setFormData] = useState<Omit<ICustomers, "id" | "created_at">>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        street_address: "",
        postal_code: "",
        city: "",
        country: "",
    });

    useEffect(() => {   
        if (existingCustomer) {
            setFormData(existingCustomer);
        }
    }, [existingCustomer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (existingCustomer?.id) {
            await handleUpdateCustomer(existingCustomer.id, formData);
            onCustomerUpdated();
        } else {
            await handleCreateCustomer(formData);
        }
        await onCustomerUpdated();
        onClose(); 
    };


    return (
        <div className={`${classes.modalOverlay}`}>
            <div className={`${classes.modalContent}`}>
                <h2>{existingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
                <form onSubmit={handleSubmit} className={`${classes.form}`}>
                    <div className={`${classes.formGroup}`}>
                        <label>First Name</label>
                        <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Last Name</label>
                        <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Street Address</label>
                        <input type="text" name="street_address" value={formData.street_address} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Postal Code</label>
                        <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className={`${classes.formGroup}`}>
                        <label>Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} required />
                    </div>

                    {error && <p className={`${classes.error}`}>{error}</p>}

                    <div className={`${classes.buttonGroup}`}>
                        <button type="submit" disabled={loading} className={`${classes.submitButton}`}>
                            {existingCustomer ? (loading ? "Updating..." : "Update Customer") : (loading ? "Creating..." : "Create Customer")}
                        </button>
                        <button type="button" className={`${classes.closeButton}`} onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;