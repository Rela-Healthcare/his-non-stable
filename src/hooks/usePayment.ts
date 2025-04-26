import {useState, useEffect} from 'react';
import axios, {AxiosError} from 'axios';
import {createMomentPayPayload} from '../utils/PaymentUtil';
import {PayMode} from '../types/payment.types';

interface PaymentResponse {
  success: boolean;
  iframeUrl?: string;
  transactionId?: string;
  error?: string;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {

      console.log('Received message:', event.data);

      // Handle different response formats
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'momentPayResponse') {
          // Handle SDK-style response
          console.log('Payment response:', event.data.payload);
        } else if (event.data.response_token) {
          // Handle direct API response
          console.log('API response:', event.data.response_token);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const initiatePayment = async (params: {
    patientName: string;
    patientID: string;
    amount: number;
    email: string;
    phone: string;
    processingId: string;
    paymode: PayMode;
  }): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);
    setIframeUrl('');

    try {
      const payload = createMomentPayPayload(params);
      console.log('Sending payload:', payload);

      const response = await axios.post(
        'https://testing.momentpay.in/ma/v2/extended-iframe-payment',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 30000, // Increased timeout to 30 seconds
        }
      );

      console.log('API response:', response.data);

      // Handle different response formats
      if (response.data?.iframeUrl) {
        setIframeUrl(response.data.iframeUrl);
        return {success: true, iframeUrl: response.data.iframeUrl};
      } else if (response.data?.url) {
        setIframeUrl(response.data.url);
        return {success: true, iframeUrl: response.data.url};
      }

      throw new Error('Invalid response format from MomentPay');
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      let errorMessage = 'Payment initialization failed';

      if (axiosError.response) {
        console.error('Server response error:', axiosError.response.data);
        errorMessage =
          axiosError.response.data?.message ||
          `Server error: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        console.error('No response received:', axiosError.request);
        errorMessage =
          'No response from payment server - check network connection';
      } else {
        console.error('Request setup error:', axiosError.message);
        errorMessage = axiosError.message || 'Unknown payment error';
      }

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error,
    iframeUrl,
    resetError: () => setError(null),
  };
};
