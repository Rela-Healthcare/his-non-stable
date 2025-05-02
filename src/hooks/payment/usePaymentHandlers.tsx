import {useState, useCallback, useEffect, useRef} from 'react';
import {toast} from 'react-toastify';
import {generateProcessingId} from '../../utils/utils';
import {
  PaymentMode,
  DiscountType,
  PatientDetails,
} from '../../types/payment.types';

interface UsePaymentHandlersProps {
  id: string;
  couponAmount?: number;
  patientDetails?: PatientDetails;
  userId?: string;
  taxRate?: number;
  serviceCharge?: number;
  onPaymentSuccess?: (response: any) => void;
  onPaymentError?: (error: string) => void;
  onSubmit: (data: any) => void;
}

export const usePaymentHandlers = ({
  id,
  couponAmount = 0,
  patientDetails,
  userId = 'admin123',
  onSubmit,
  onPaymentSuccess,
  onPaymentError,
}: UsePaymentHandlersProps) => {
  const [payment, setPayment] = useState({
    mode: 'full' as PaymentMode,
    type: '',
    discountType: '' as DiscountType,
    discount: null as number | null,
    couponApplied: false,
    cardAmount: null as number | null,
    cashAmount: null as number | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const toastShownRef = useRef(false);

  const [paymentButtonDetails, setPaymentButtonDetails] = useState({
    patientName: patientDetails?.Name || '',
    patientID: patientDetails?.UHID || '000000',
    amount: 1,
    email: patientDetails?.Email_ID || '',
    phone: patientDetails?.Mobile_No || '',
    processingId: generateProcessingId(patientDetails?.Mobile_No || ''),
    paymode: 'cards-upi',
    cashierId: userId || 'WEB_CASHIER_01',
  });

  // Reset split amounts when discount/coupon changes
  useEffect(() => {
    setPayment((prev) => ({
      ...prev,
      cardAmount: null,
      cashAmount: null,
    }));
  }, [payment.discountType, payment.discount, payment.couponApplied]);

  // Update payment details when patient changes
  useEffect(() => {
    if (patientDetails) {
      setPaymentButtonDetails((prev) => ({
        ...prev,
        patientName: patientDetails.Name,
        patientID: patientDetails.UHID || '000000',
        email: patientDetails.Email_ID || '',
        phone: patientDetails.Mobile_No || '',
        processingId: generateProcessingId(patientDetails.Mobile_No),
      }));
    }
  }, [patientDetails]);

  const handleChange = useCallback((field: string, value: any) => {
    if (value === '') {
      setErrors((prev) => ({...prev, [field]: ''}));
    }
    setPayment((prev) => ({...prev, [field]: value}));
  }, []);

  const handleSplitAmountChange = useCallback(
    (type: 'card' | 'cash', value: string, netPayable: number) => {
      const enteredValue = parseFloat(value) || 0;
      const cappedValue = Math.min(enteredValue, netPayable);

      if (enteredValue > netPayable && !toastShownRef.current) {
        toast.error(
          `${type === 'card' ? 'Card' : 'Cash'} amount exceeds payable limit`
        );
        toastShownRef.current = true;
        setTimeout(() => {
          toastShownRef.current = false;
        }, 5000);
      }

      if (enteredValue > netPayable) return;

      setPayment((prev) => ({
        ...prev,
        [type === 'card' ? 'cardAmount' : 'cashAmount']: cappedValue,
        [type === 'card' ? 'cashAmount' : 'cardAmount']: Math.max(
          0,
          netPayable - cappedValue
        ),
      }));
    },
    []
  );

  const validateForm = useCallback(
    (netPayable: number) => {
      const newErrors: Record<string, string> = {};

      if (payment.mode === 'full' && !payment.type) {
        newErrors.payType = 'Please select a payment method';
      }

      if (
        payment.discountType &&
        (!payment.discount || payment.discount <= 0)
      ) {
        newErrors.discount = 'Please enter a valid discount value';
      }

      if (payment.mode === 'split') {
        const totalSplit =
          (payment.cardAmount || 0) + (payment.cashAmount || 0);
        if (totalSplit !== netPayable) {
          newErrors.amounts = `Split amounts must equal net payable (₹${netPayable.toFixed(
            2
          )})`;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [payment]
  );

  const constructPaymentData = useCallback(
    (
      netPayable: number,
      grossAmount: number,
      totalDiscount: number,
      afterDiscount: number,
      taxAmount: number
    ) => {
      const paymentTypes = [];

      if (payment.mode === 'full') {
        paymentTypes.push({
          PayType: payment.type,
          amount: netPayable,
        });
      } else {
        if (payment.cardAmount && payment.cardAmount > 0) {
          paymentTypes.push({
            PayType: 'R',
            amount: payment.cardAmount,
          });
        }
        if (payment.cashAmount && payment.cashAmount > 0) {
          paymentTypes.push({
            PayType: 'C',
            amount: payment.cashAmount,
          });
        }
      }

      return {
        Web_OPReceipt_Payment_Type: paymentTypes,
        Id: id,
        Gross_Amount: grossAmount,
        Final_Discount: totalDiscount,
        Total_Amount: afterDiscount,
        Coupon_Balance: payment.couponApplied ? couponAmount : 0,
        Apply_Coupon: payment.couponApplied,
        Tax_Amount: taxAmount,
        Net_Payable_Amount: netPayable,
        UserId: userId,
      };
    },
    [payment, id, couponAmount, userId]
  );

  const handlePaymentSuccess = useCallback(
    (response: any) => {
      const success =
        response.response_token?.response_code === '1200' ||
        response.status === 'success';

      if (success) {
        toast.success('Payment processed successfully');
        if (onPaymentSuccess) {
          onPaymentSuccess(response);
        }
      } else {
        const errorMsg =
          response.response_token?.response_message ||
          response.message ||
          'Payment verification failed';
        toast.error(errorMsg);
        if (onPaymentError) {
          onPaymentError(errorMsg);
        }
      }
    },
    [onPaymentSuccess, onPaymentError]
  );

  const handlePaymentError = useCallback(
    (error: string) => {
      toast.error(`Payment failed: ${error}`);
      if (onPaymentError) {
        onPaymentError(error);
      }
    },
    [onPaymentError]
  );

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent,
      netPayable: number,
      grossAmount: number,
      totalDiscount: number,
      afterDiscount: number,
      taxAmount: number
    ) => {
      e.preventDefault();

      if (!validateForm(netPayable)) return;

      try {
        if (
          payment.mode === 'full' &&
          (payment.type === 'R' || payment.type === 'U')
        ) {
          // PaymentButton will handle this case
          return;
        }

        const payload = constructPaymentData(
          netPayable,
          grossAmount,
          totalDiscount,
          afterDiscount,
          taxAmount
        );
        await onSubmit(payload);
      } catch (error) {
        toast.error(
          `Payment submission failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    },
    [payment, validateForm, constructPaymentData, onSubmit]
  );

  return {
    payment,
    errors,
    paymentButtonDetails,
    handleChange,
    handleSplitAmountChange,
    handleSubmit,
    handlePaymentSuccess,
    handlePaymentError,
  };
};
