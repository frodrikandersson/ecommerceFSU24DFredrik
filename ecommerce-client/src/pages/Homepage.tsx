import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import classes from "./Pages.module.css";
import { useProducts } from "../hooks/useProduct";
import { IProducts } from "../models/IProducts";

export const Homepage = () => {
  const [countdown, setCountdown] = useState(3600);
  const { handleShowProducts } = useProducts();
  const [deals, setDeals] = useState<IProducts[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await handleShowProducts();
        if (products.length > 0) {
          setDeals(getRandomProducts(products, 2)); 
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getRandomProducts = (products: IProducts[], count: number): IProducts[] => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className={classes.homepage}>
      <section className={classes.hero}>
        <h1>Welcome to HappyShop!</h1>
        <p>Find everything you need at unbeatable prices!*</p>
        <NavLink to="/productpage" className={classes.shopNow}>Shop Now</NavLink>
      </section>

      <section className={classes.deals}>
        <h2>🔥 Deals of the Day 🔥</h2>
        <div className={classes.dealList}>
          {deals.length > 0 ? (
            deals.map((deal) => (
              <div key={deal.id} className={classes.dealItem}>
                <img src={deal.image} alt={deal.name} />
                <p className={classes.dealName}>{deal.name}</p>
                <p className={classes.fakePrice}>{(deal.price * 1.2).toFixed(2)} kr</p>
                <p className={classes.discountPrice}>
                  <span>20% Off: </span> {deal.price.toFixed(2)} kr
                </p>
                <p className={classes.timer}>{formatTime(countdown)}</p>
                <NavLink to="/productpage" className={classes.dealButton}>Shop Now</NavLink>
              </div>
            ))
          ) : (
            <p>Loading deals...</p>
          )}
        </div>
      </section>

      <section className={classes.categories}>
        <h2>Shop by Category</h2>
        <div className={classes.categoryList}>
          <div className={classes.categoryCard}>Electronics</div>
          <div className={classes.categoryCard}>Fashion</div>
          <div className={classes.categoryCard}>Home & Garden</div>
          <div className={classes.categoryCard}>Toys & Games</div>
        </div>
      </section>
    </div>
  );
};