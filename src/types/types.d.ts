export type ServiceType = {
  name: string;
  qty: number;
  price: number;
  discount: number;
  total: number;
  [key: string]: any; // If you have other dynamic fields
};

export type FormErrorType = {
  [index: number]: {
    name?: string;
    qty?: string;
    price?: string;
    discount?: string;
  };
};

export interface StatusCheckResponse {
  response_token?: {
    transaction_id?: string;
    transaction_status?: string;
    response_code?: string;
    response_message?: string;
    bank_provider_details?: {
      transaction_status?: string;
      bank_response_code?: string;
      bank_response_message?: string;
    };
  };
  status?: string;
  [key: string]: any;
}
