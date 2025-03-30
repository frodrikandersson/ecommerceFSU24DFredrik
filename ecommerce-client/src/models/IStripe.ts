export interface ILineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
    };
    unit_amount: number;
  };
  quantity: number;
}

export interface IStripeSession {
  id: string;
  object: string;
  adaptive_pricing: {
      enabled: boolean;
  },
  after_expiration: null;
  allow_promotion_codes: null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
      enabled: boolean;
      liability: null;
      status: null;
  };
  billing_address_collection: null;
  cancel_url: string;
  client_reference_id: null;
  client_secret: null;
  collected_information: {
      shipping_details: {
          address: {
              city: string;
              country: string;
              line1: string;
              line2: null;
              postal_code: number;
              state: null
          };
          name: string;
      }
  };
  consent: null;
  consent_collection: null;
  created: string;
  currency: string;
  currency_conversion: null;
  custom_fields: [];
  custom_text: {
      after_submit: null;
      shipping_address: null;
      submit: null;
      terms_of_service_acceptance: null
  };
  customer: null;
  customer_creation: string;
  customer_details: {
      address: {
          city: string;
          country: string;
          line1: string;
          line2: null;
          postal_code: number;
          state: null
      };
      email: string;
      name: string;
      phone: null;
      tax_exempt: string;
      tax_ids: [];
  };
  customer_email: string;
  discounts: [];
  expires_at: number;
  invoice: null;
  invoice_creation: {
      enabled: boolean;
      invoice_data: {
          account_tax_ids: null;
          custom_fields: null;
          description: null;
          footer: null;
          issuer: null;
          metadata: {};
          rendering_options: null
      }
  };
  livemode: boolean;
  locale: null;
  metadata: {
      city: string;
      country: string;
      customer_id: number;
      postal_code: number;
      street_address: string;
  };
  mode: string;
  payment_intent: string;
  payment_link: null;
  payment_method_collection: string;
  payment_method_configuration_details: null;
  payment_method_options: {
      card: {
          request_three_d_secure: string
      }
  };
  payment_method_types: [
      string
  ];
  payment_status: string;
  permissions: null;
  phone_number_collection: {
      enabled: boolean
  };
  recovered_from: null;
  saved_payment_method_options: null;
  setup_intent: null;
  shipping_address_collection: {
      allowed_countries: [
        string
      ]
  };
  shipping_cost: null;
  shipping_details: {
      address: {
          city: string;
          country: string;
          line1: string;
          line2: null;
          postal_code: number;
          state: null
      };
      carrier: null;
      name: string;
      phone: null;
      tracking_number: null
  };
  shipping_options: [];
  status: string;
  submit_type: null;
  subscription: null;
  success_url: string;
  total_details: {
      amount_discount: 0;
      amount_shipping: 0;
      amount_tax: 0
  };
  ui_mode: string;
  url: null
};

export interface IStripeLineItems extends Array<IStripeLineItem> {};

export interface IStripeLineItem {
    id: string;
    object: string;
    amount_discount: number;
    amount_subtotal: number;
    amount_tax: number;
    amount_total: number;
    currency: string;
    description: string;
    price: {
        id: string;
        object: string;
        active: boolean;
        billing_scheme: string;
        created: number;
        currency: string;
        custom_unit_amount: null;
        livemode: boolean;
        lookup_key: null;
        metadata: {};
        nickname: null;
        product: string;
        recurring: null;
        tax_behavior: string;
        tiers_mode: null;
        transform_quantity: null;
        type: string;
        unit_amount: number;
        unit_amount_decimal: number;
    };
    quantity: number;
};

export interface IStripeProducts extends Array<IStripeProduct> {};

export interface IStripeProduct {
  id: string;
  object: string;
  active: boolean;
  attributes: [];
  created: number;
  default_price: null;
  description: string;
  images: [ string ];
  livemode: boolean;
  marketing_features: [];
  metadata: {
      product_id: number;
  };
  name: string;
  package_dimensions: null;
  shippable: null;
  statement_descriptor: null;
  tax_code: null;
  type: string;
  unit_label: null;
  updated: number;
  url: null;
};