import {useState} from 'react';
import generatePaymentURL from '../utils/generatePaymentURL';
import {verifyPaymentInfo} from '../services/paymentService';
import {PaymentURLParams} from '../types/payment.types';

export const usePayment = () => {
  const [iframeUrl, setIframeUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const startPayment = async (params: PaymentURLParams) => {
    setIframeUrl(generatePaymentURL(params));
    setIsOpen(true);
  };

  const closePayment = async (processingId: string) => {
    setIsOpen(false);
    return verifyPaymentInfo(processingId);
  };

  return {iframeUrl, isOpen, startPayment, closePayment};
};
