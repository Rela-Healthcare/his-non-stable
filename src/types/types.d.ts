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
