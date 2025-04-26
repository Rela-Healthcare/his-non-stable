import forge from 'node-forge';
import {PayMode} from '@/types/payment.types';

interface PaymentConfig {
  baseUrl: string;
  user: string;
  key: string;
  secret: string;
  merchantId: string;
  paymentLocation: string;
  callbackUrl: string;
  redirectUrl: string;
}

// Use only ONE configuration - testing environment
const paymentConfig: PaymentConfig = {
  baseUrl: 'https://testing.momentpay.in/ma/v2/extended-iframe-payment',
  user: process.env.REACT_APP_MOMENTPAY_USER || 'jrsuperspecialityadmin',
  key:
    process.env.REACT_APP_MOMENTPAY_KEY || 'uwVoleGcWIHfgUwgmOMYR8lgx1G7gCz6',
  secret:
    process.env.REACT_APP_MOMENTPAY_SECRET ||
    'Mbs1dj8pZerMyv7cnhxIqSMKhievG5aWGOdyuGw1rFujoQGTH',
  merchantId: process.env.REACT_APP_MOMENTPAY_MERCHANT_ID || '26',
  paymentLocation: 'Rela Hospital - Test',
  callbackUrl: 'http://192.168.36.26:3000/payment-result',
  redirectUrl: 'http://192.168.36.26:3000/payment-result',
};

export const generateChecksum = (params: {
  amount: number;
  processingId: string;
  merchantId: string;
  secret: string;
}): string => {
  try {
    const amountStr = params.amount.toFixed(2); // Ensure 2 decimal places
    const plainString = `${amountStr}|${params.processingId}+${params.merchantId}+${params.secret}`;
    const md = forge.md.sha256.create();
    md.update(plainString, 'utf8');
    return btoa(md.digest().toHex());
  } catch (error) {
    console.error('Checksum generation failed:', error);
    throw new Error('Failed to generate payment checksum');
  }
};

interface PaymentPayload {
  authentication: {
    user: string;
    key: string;
    version: string;
  };
  cashier_id: string;
  customer_details: Array<{
    customer_name: string;
    customer_id: string;
    payment_amount: number;
    customer_email?: string;
    customer_phone?: string;
  }>;
  processing_id: string;
  paymode: string;
  transaction_till: string;
  payment_fill: string;
  callback_url?: string;
  redirect_url?: string;
  merchant_id: string;
  checksum_hash: string;
}

export const createMomentPayPayload = (params: {
  patientName: string;
  patientID: string;
  amount: number;
  email?: string;
  phone?: string;
  processingId: string;
  paymode: PayMode;
  cashierId?: string;
}): PaymentPayload => {
  const amount = Number(params.amount.toFixed(2)); // Ensure proper amount format

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
