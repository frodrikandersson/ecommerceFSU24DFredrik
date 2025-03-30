import { useState } from "react";
import { ICustomers } from "../models/ICustomers";
import { createCustomer, deleteCustomer, getCustomers, getOneCustomer, getOneCustomerEmail, updateCustomer } from "../services/customersService";

export const useCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShowCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customers = await getCustomers();
      return customers;
    } catch (error) {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  }

  const handleShowOneCustomer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const customer = await getOneCustomer({ id });
      console.log("Customer fetched successfully:", customer);
      return customer;
      
    } catch (error) {
      setError("Failed to fetch the customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowOneCustomerEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const customer = await getOneCustomerEmail({ email });
      return customer;
      
    } catch (error) {
      setError("Failed to fetch the customer.");
    } finally {
      setLoading(false);
    }
  };


  const handleCreateCustomer = async (customer: Omit<ICustomers, "id" | "created_at">) => {
    try {
      setLoading(true);
      setError(null);
      const createdCustomer = await createCustomer(customer);
      return createdCustomer;
    } catch (error) {
      setError("Failed to create a customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (id: number, customer: Omit<ICustomers, "id" | "created_at">) => {
    try {
    setLoading(true);
    setError(null);
    const updatedCustomer = await updateCustomer({ id, customerData: customer });
    return updatedCustomer;
    } catch (error) {
      setError("Failed to update the customer.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const deletedCustomer = await deleteCustomer({ id });
      return deletedCustomer;
    } catch (error) {
      setError("Failed to delete the customer.");
    }
    finally {
      setLoading(false);
    }
  }

  return { handleShowOneCustomer, handleShowOneCustomerEmail, handleShowCustomers ,handleCreateCustomer, handleUpdateCustomer, handleDeleteCustomer, loading, error };
};
