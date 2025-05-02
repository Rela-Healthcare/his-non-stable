import {AppThunk} from '../../store';
import {
  startPayment,
  paymentSuccess,
  paymentFailed,
  initializeSDK,
  resetState,
} from '../../Slices/momentPay/momentPaySlice';
import {generateChecksum} from '../../../utils/PaymentUtil';
import {paymentConfig} from '../../../config/payment';

interface PaymentParams {
  patientName: string;
  patientID: string;
  amount: number;
  email?: string;
  phone?: string;
  processingId: string;
  paymode: string;
  cashierId: string;
}

export const initiatePayment =
  (
    params: PaymentParams,
    onSuccess?: (res: any) => void,
    onError?: (err: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    // Clean up previous state
    dispatch(resetState());

    // Initialize fresh instance
    dispatch(initializeSDK());

    const {instance} = getState().momentPay;

    if (!instance) {
      const errorMsg = 'MomentPay SDK not initialized';
      dispatch(paymentFailed(errorMsg));
      onError?.(errorMsg);
      return;
    }

    dispatch(startPayment());

    try {
      const checksum = generateChecksum({
        amount: params.amount,
        processingId: params.processingId,
        merchantId: paymentConfig.merchantId,
        secret: paymentConfig.secret,
      });

      const tokenData = {
        auth: {
          user: paymentConfig.user,
          key: paymentConfig.key,
        },
        username: paymentConfig.user,
        accounts: [
          {
            patient_name: params.patientName,
            account_number: params.patientID,
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

      const options = {
        actionUrl: paymentConfig.baseUrl,
        token: JSON.stringify(tokenData),
        mid: paymentConfig.merchantId,
        patientName: params.patientName,
        uhid: params.patientID,
        chargerate: params.amount.toString(),
        email: params.email || '',
        mobileno: params.phone || '',
        processingid: params.processingId,
        check_sum_hash: checksum,
      };

      instance.init(options);

      await new Promise<void>((resolve, reject) => {
        instance.onResponse((response) => {
          if (
            response?.response_token?.response_code === '1200' &&
            response?.response_token?.bank_provider_details
              ?.transaction_status === 'SUCCESS'
          ) {
            dispatch(
              paymentSuccess({
                transactionId: response.response_token.transaction_id,
              })
            );
            onSuccess?.(response);
            resolve();
          } else {
            const errorMsg =
              response?.response_token?.response_message || 'Payment failed';
            dispatch(paymentFailed(errorMsg));
            onError?.(errorMsg);
            reject(new Error(errorMsg));
          }
        });

        instance.onClose(() => {
          const closeMsg = 'Payment window closed';
          dispatch(paymentFailed(closeMsg));
          reject(new Error(closeMsg));
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment failed';
      dispatch(paymentFailed(message));
    } finally {
      dispatch(resetState());
    }
  };

export const initializeMomentPay = (): AppThunk => (dispatch) => {
  dispatch(initializeSDK());
};
