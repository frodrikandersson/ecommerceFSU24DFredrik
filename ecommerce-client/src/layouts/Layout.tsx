import { NavLink, Outlet } from "react-router";
import classes from "./Layout.module.css";
import { useCartContext } from "../contexts/CartContext";  // Use the cart context

export function Layout() {
  const { getTotalItems } = useCartContext();
  const totalItems = getTotalItems(); // Get total items using the context

  return (
    <div className={classes.layoutWrapper}>
      <header className={classes.header}>
        <div className={`${classes.divWrapper}`}>
          <img src="logo.png" alt="Shop logo" className={classes.logo} />
          <nav>
            <ul className={classes.navList}>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? classes.activeLink : classes.link}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/productpage" className={({ isActive }) => isActive ? classes.activeLink : classes.link}>Shop</NavLink>
              </li>
              <li>
                <NavLink to="/auth" className={({ isActive }) => isActive ? classes.activeLink : classes.link}>Log in</NavLink>
              </li>
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? classes.activeLink : classes.link}>Admin</NavLink>
              </li>
            </ul>
          </nav>
          <div className={classes.cartIconContainer}>
            <NavLink to="/cart" className={classes.cartLink}>
              <img src="cart.png" alt="Cart" className={classes.cartIcon} />
              {totalItems > 0 && <span className={classes.cartCount}>{totalItems}</span>}
            </NavLink>
          </div>
        </div>
      </header>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}