import { IProducts } from "./IProducts";

export interface CartItem {
    product: IProducts;
    quantity: number;
}