import requests from '../api/requestHelper';

// Define the response types if available
import {
  PaymentVerificationResponse,
  PaymentInitRequest,
} from '@/types/payment.types';

/**
 * Verifies the payment status for a given processing ID
 */
export const verifyPaymentInfo = async (
  processingId: string
): Promise<PaymentVerificationResponse> => {
  try {
    const {data} = await requests.get(
      `getTransactionStatus?processingid=${processingId}`
    );
    return data;
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    throw new Error(
      error?.response?.data?.message || 'Payment verification failed'
    );
  }
};

/**
 * Initiates a payment from the backend (for MomentPay.)
 */
export const initiatePayment = async (
  payload: PaymentInitRequest
): Promise<{paymentUrl: string}> => {
  try {
    const {data} = await requests.post('/api/payments/initiate', payload);
    return data;
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    throw new Error(
      error?.response?.data?.message || 'Payment initiation failed'
    );
  }
};
