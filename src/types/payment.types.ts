export const PayModes = {
  CARDS_UPI: 'cards-upi',
  CARDS_SWIPE: 'cards-swipe',
  CARDS_STANDALONE: 'cards-standalone',
  CASH_REMOTE_DEPOSIT: 'cash-remote-deposit',
} as const;

export type PayMode = (typeof PayModes)[keyof typeof PayModes];

export interface PaymentURLParams {
  patientName: string;
  uhid: string;
  chargeRate: number;
  email: string;
  mobileNo: string;
  processingId: string;
  uname?: string;
  payMode?: PayMode;
}

/**
 * Payload sent to the backend to initiate a payment session
 * (used for Stripe, Razorpay, or MomentPay)
 */
export interface PaymentInitRequest {
  patientName: string;
  uhid: string;
  chargeRate: number;
  email: string;
  mobileNo: string;
  processingId: string;
  couponCode?: string;
  splitPayment?: {
    cardAmount: number;
    cashAmount: number;
  };
  payMode?: PayMode;
  uname?: string;
}

/**
 * Backend responds with the generated payment URL or session ID
 */
export interface PaymentInitResponse {
  paymentUrl: string;
  sessionId?: string; // optional for Stripe or Razorpay
}

/**
 * Response from payment verification API
 */
export interface PaymentVerificationResponse {
  data(arg0: string, data: any): unknown;
  status: 'success' | 'pending' | 'failed';
  transactionId: string;
  amount: number;
  payMode?: PayMode;
  message?: string;
  timestamp?: string;
  cardLast4?: string;
  couponCode?: string;
}

// Optional cash-remote-deposit is sent link to patient via whatsapp
export interface PaymentButtonProps {
  paymentDetails: {
    patientName: string;
    uhid: string;
    chargeRate: number;
    email: string;
    mobileNo: string;
    processingId: string;
    payMode?: PayMode;
  };
  className?: string;
}
