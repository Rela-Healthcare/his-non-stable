import CryptoJS from 'crypto-js';
import {PayMode} from '../types/payment.types';
import {paymentConfig} from '../config/payment';
import forge from 'node-forge';
import {StatusCheckResponse} from '@/types/types';

export const generateChecksum = (params: {
  amount: number;
  processingId: string;
  merchantId: number;
  secret: string;
}): string => {
  const hashString = `${params.amount}|${params.processingId}+${params.merchantId}+${params.secret}`;
  const hash = CryptoJS.SHA256(hashString);
  return CryptoJS.enc.Base64.stringify(hash);
};

export const generateHash = (plainText: string): string => {
  const md = forge.md.sha256.create();
  md.update(plainText, 'utf8');
  const hashText = md.digest().toHex();
  return btoa(hashText);
};

export const generateStatusChecksum = (processingId: string): string => {
  const hashString = `${processingId}+${paymentConfig.merchantId}+${paymentConfig.secret}`;

  const hash = CryptoJS.SHA256(hashString);
  const base64 = CryptoJS.enc.Base64.stringify(hash);

  return base64;
};

// Payload creator remains unchanged
export const createMomentPayPayload = (params: {
  patientName: string;
  patientID: string;
  amount: number;
  email?: string;
  phone?: string;
  processingId: string;
  paymode: PayMode;
  cashierId?: string;
}): any => {
  const amount = Number(params.amount.toFixed(2));

  return {
    authentication: {
      user: paymentConfig.user,
      key: paymentConfig.key,
      version: 'HISV2',
    },
    cashier_id: params.cashierId || 'WEB_CASHIER_01',
    customer_details: [
      {
        customer_name: params.patientName,
        customer_id: params.patientID,
        payment_amount: amount,
        customer_email: params.email,
        customer_phone: params.phone,
      },
    ],
    processing_id: params.processingId,
    paymode: params.paymode,
    transaction_till: paymentConfig.paymentLocation,
    payment_fill: 'express_full',
    callback_url: paymentConfig.callbackUrl,
    redirect_url: paymentConfig.redirectUrl,
    merchant_id: paymentConfig.merchantId,
    checksum_hash: generateChecksum({
      amount,
      processingId: params.processingId,
      merchantId: paymentConfig.merchantId,
      secret: paymentConfig.secret,
    }),
  };
};

export const getConvertPercentageToDecimal = (
  percentage: number,
  Amount: number
) => {
  return (percentage / 100) * Amount;
};

export const pollForPaymentStatus = async (
  processingId: string,
  maxAttempts = 5,
  delay = 3000
): Promise<StatusCheckResponse> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `${paymentConfig.baseUrl}/status-check`, // Confirm the actual endpoint with MomentPay
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            processing_id: processingId,
            merchant_id: paymentConfig.merchantId,
            auth_user: paymentConfig.user,
            auth_key: paymentConfig.key,
            username: paymentConfig.user,
            check_sum_hash: generateStatusChecksum(processingId),
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: StatusCheckResponse = await response.json();

      if (
        data.response_token?.transaction_status === 'SUCCESS' ||
        data.status === 'SUCCESS'
      ) {
        return data;
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error('Polling attempt failed:', error);
      if (attempt === maxAttempts - 1) throw error;
    }
  }
  throw new Error('Payment status could not be verified');
};

export const generateProcessingId = (prefix = 'MP'): string => {
  // Timestamp component (13 digits)
  const timestamp = Date.now().toString();

  // Random component (4 alphanumeric chars)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Sequence component (from counter if needed)
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `${prefix}-${timestamp}-${random}-${sequence}`;
};
