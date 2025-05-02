import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {generateChecksum} from '../../utils/PaymentUtil';
import {paymentConfig} from '../../config/payment';
import {generateStatusChecksum} from '../../utils/PaymentUtil';

interface StatusCheckResult {
  status: 'success' | 'failed' | 'pending';
  message?: string;
}

interface MomentPayResponse {
  response_token?: {
    response_code: string;
    response_message: string;
    processing_id: string;
    customer_id: string;
    amount: string;
    transaction_id: string;
    paymode: string;
    transaction_till: string;
    bank_provider_details: {
      transaction_status: string;
      bank_response_code: string;
      bank_response_message: string;
    };
  };
  type?: string;
  payload?: any;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<
    'pending' | 'success' | 'failed'
  >('pending');

  // Handle payment responses from MomentPay iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      // Important: Verify the message origin for security
      // if (!event.origin.includes('momentpay.in')) {
      //   console.warn('Message from untrusted origin:', event.origin);
      //   return;
      // }

      let responseData: MomentPayResponse;

      // Parse the message data
      if (typeof event.data === 'string') {
        try {
          responseData = JSON.parse(event.data);
        } catch (e) {
          console.error('Failed to parse message data as JSON:', event.data);
          return;
        }
      } else if (typeof event.data === 'object') {
        responseData = event.data;
      } else {
        console.warn('Received unexpected message format:', event.data);
        return;
      }

      // Handle different response formats
      if (responseData.response_token) {
        const response = responseData.response_token;
        console.log('Received MomentPay response:', response);

        if (
          response.response_code === '1200' &&
          response.bank_provider_details?.transaction_status === 'SUCCESS'
        ) {
          setTransactionStatus('success');
          // You might want to store the transaction details in state or context
          console.log(
            'Payment successful. Transaction ID:',
            response.transaction_id
          );
        } else {
          setTransactionStatus('failed');
          setError(response.response_message || 'Payment failed');
          console.error('Payment failed:', response.response_message);
        }
      } else if (
        responseData.type === 'momentPayResponse' &&
        responseData.payload
      ) {
        // Handle SDK-style response if needed
        console.log('SDK response payload:', responseData.payload);
      }
    } catch (error) {
      console.error('Error processing payment message:', error);
      setError('Error processing payment response');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  // Function to check payment status (fallback mechanism)
  const checkPaymentStatus = useCallback(
    async (processingId: string): Promise<StatusCheckResult> => {
      try {
        const response = await axios.post(
          `${paymentConfig.baseUrl}/status`,
          {
            processing_id: processingId,
            mid: paymentConfig.merchantId,
            auth_user: paymentConfig.user,
            auth_key: paymentConfig.key,
            username: paymentConfig.user,
            check_sum_hash: generateStatusChecksum(processingId),
          },
          {
            headers: {'Content-Type': 'application/json'},
            timeout: 10000,
          }
        );

        if (response.data?.payment_response?.responseMessage === 'APPROVED') {
          return {status: 'success'};
        } else if (
          response.data?.payment_response?.responseMessage === 'PENDING'
        ) {
          return {status: 'pending'};
        }
        return {
          status: 'failed',
          message:
            response.data?.payment_response?.responseMessage ||
            'Payment failed',
        };
      } catch (error) {
        return {
          status: 'failed',
          message: 'Status check failed',
        };
      }
    },
    []
  );

  const initiatePayment = async (params: {
    patientName: string;
    patientID: string;
    amount: number;
    email?: string;
    phone?: string;
    processingId: string;
    paymode: string;
    cashierId?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setIframeUrl('');

    try {
      // Create the MomentPay SDK instance
      const paymentMoment = new (window as any).MomentPay();

      // Format the token correctly - this is critical!
      const tokenData = {
        auth: {
          user: paymentConfig.user,
          key: paymentConfig.key,
        },
        username: paymentConfig.user,
        accounts: [
          {
            patient_name: `Name: ${params.patientName}`,
            account_number: `UHID: ${params.patientID}`,
            amount: params.amount.toFixed(2),
            email: params.email || '',
            phone: params.phone || '',
          },
        ],
        processing_id: params.processingId,
        paymode: params.paymode,
        payment_fill: 'pre_full',
        payment_location: paymentConfig.paymentLocation,
        return_url: paymentConfig.redirectUrl,
        response_url: paymentConfig.callbackUrl,
      };

      // Prepare the SDK parameters
      const sdkParams = {
        actionUrl: `https://testing.momentpay.in/ma/provider/iframe`,
        patientName: params.patientName,
        uhid: params.patientID,
        chargerate: params.amount.toString(),
        email: params.email || '',
        mobileno: params.phone || '',
        processingid: params.processingId,
        username: paymentConfig.user,
        paymode: params.paymode,
        merchantid: paymentConfig.merchantId,
        authuser: paymentConfig.user,
        authkey: paymentConfig.key,
        hospitallocation: paymentConfig.paymentLocation,
        version: '1.0',
        returnUrl: paymentConfig.redirectUrl,
        responseUrl: paymentConfig.callbackUrl,
        checkSumHash: generateChecksum({
          amount: params.amount,
          processingId: params.processingId,
          merchantId: paymentConfig.merchantId,
          secret: paymentConfig.secret,
        }),
      };

      // Initialize the payment
      await paymentMoment.init({
        actionUrl: `https://testing.momentpay.in/ma/provider/iframe`,
        token: JSON.stringify(tokenData), // Must be stringified JSON
        mid: paymentConfig.merchantId,
        check_sum_hash: generateChecksum({
          amount: params.amount,
          processingId: params.processingId,
          merchantId: paymentConfig.merchantId,
          secret: paymentConfig.secret,
        }),
        // Add these to ensure they appear in the iframe
        patientName: params.patientName,
        uhid: params.patientID,
        chargerate: params.amount.toString(),
        email: params.email || '',
        mobileno: params.phone || '',
        processingid: params.processingId,
      });

      console.log('MomentPay Token Data:', tokenData);
      console.log('MomentPay Init Params:', {
        actionUrl: `${paymentConfig.baseUrl}/ma/provider/iframe`,
        token: JSON.stringify(tokenData),
        mid: paymentConfig.merchantId,
        check_sum_hash: generateChecksum({
          amount: params.amount,
          processingId: params.processingId,
          merchantId: paymentConfig.merchantId,
          secret: paymentConfig.secret,
        }),
        patientName: params.patientName,
        uhid: params.patientID,
        chargerate: params.amount.toString(),
        email: params.email || '',
        mobileno: params.phone || '',
        processingid: params.processingId,
      });

      // Set up response handler
      paymentMoment.onResponse((data: any) => {
        console.log('Payment response:', data);
        // Handle payment response here
        try {
          const response =
            typeof data.response === 'string'
              ? JSON.parse(data.response)
              : data.response;

          if (response.response_token?.response_code === '1200') {
            // onPaymentSuccess ?.(response);
          } else {
            // onPaymentError?.(
            //   response.response_token?.response_message || 'Payment failed'
            // );
          }
        } catch (e) {
          // onPaymentError?.('Error processing payment response');
        }
      });

      // Set up close handler
      paymentMoment.onClose(() => {
        console.log('Payment modal closed');
      });

      return {success: true};
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setError(error.message || 'Payment failed');
      return {success: false, error: error.message};
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error,
    iframeUrl,
    transactionStatus,
    resetError: () => setError(null),
    checkPaymentStatus,
  };
};
