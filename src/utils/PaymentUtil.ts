import CryptoJS from 'crypto-js';
import {PayMode} from '../types/payment.types';
import {paymentConfig} from '../config/payment';
import forge from 'node-forge';

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
