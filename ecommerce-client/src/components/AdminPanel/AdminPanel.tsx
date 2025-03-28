import ShowCustomers from "../ShowCustomers";
import ShowOrders from "../ShowOrders";
import ShowProducts from "../ShowProducts";
import classes from "./AdminPanel.module.css";

export function AdminPanel() {

  
  return (
    <div className={`${classes.adminPanel}`}>
      <h2 className={`${classes.h2}`}>Admin Panel</h2>
      <ShowCustomers />
      <ShowProducts />
      <ShowOrders />
    </div>
  );
};


export default AdminPanel;