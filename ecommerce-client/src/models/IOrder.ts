import { IOrderItem } from "./IOrderItem"

export interface IOrder{
    id: number | null
    customer_id: number | null
    total_price: number
    payment_status: string
    payment_id: string
    order_status: string
    created_at: string
    order_items: IOrderItem[]
  }