export interface ProductData {
    name: string;
    description: string;
    images?: string[];
}

export interface LineItem {
    price_data: {
        product_data: ProductData;
        unit_amount: number;
    };
    quantity: number;
}

export interface Customer {
    email: string;
}

export interface CreateCheckoutSessionRequest {
    line_items: LineItem[];
    customer: Customer;
}