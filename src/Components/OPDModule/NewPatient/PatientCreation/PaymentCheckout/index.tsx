import {Container} from 'react-bootstrap';
import PaymentForm from './PaymentForm';
import {usePaymentHandlers} from '../../../../../hooks/payment/usePaymentHandlers';
import {PatientDetailsCard} from './PatientDetailsCard';
import {ServicesTable} from './ServicesTable';
import BillingSummary from './BillingSummary';
import {usePaymentCalculation} from '../../../../../hooks/payment/usePaymentCalculation';
import {UsePaymentHandlersProps} from '../../../../../types/payment.types';
import {generateProcessingId} from '../../../../../utils/PaymentUtil';

interface PatientDetails {
  Name: string;
  Mobile_No: string;
  Email_ID: string;
  Age: string;
  Gender: string;
  UHID?: string;
}

interface ServiceDetail {
  ServiceName: string;
  Discount: number;
  Discount_Type: 'Percentage' | 'Flat';
  Amount: number;
  Actual_Amount: number;
}

interface PaymentCheckoutProps {
  id: string;
  couponAmount?: number;
  patientDetails?: PatientDetails;
  serviceDetails: ServiceDetail[];
  paymentDetails?: any;
  userId: string; // Made required
  onSubmit: (data: any) => void;
  taxRate?: number;
  serviceCharge?: number;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  id,
  userId,
  paymentDetails,
  patientDetails,
  serviceDetails,
  couponAmount,
  onSubmit,
}) => {
  const {
    payment,
    errors,
    handleChange,
    handleSplitAmountChange,
    handlePaymentSuccess,
    handlePaymentError,
    handleSubmit,
  } = usePaymentHandlers({
    id,
    couponAmount,
    patientDetails,
    userId,
    onSubmit,
    initialPaymentDetails: paymentDetails || {},
  } as UsePaymentHandlersProps);

  const {
    serviceLevelDiscount,
    grossAmount,
    totalDiscount,
    afterDiscount,
    couponValue,
    taxAmount,
    netPayable,
  } = usePaymentCalculation({
    services: serviceDetails,
    overallDiscount: payment.discount || 0,
    overallDiscountType:
      payment.discountType === 'percentage' ? 'PERCENTAGE' : 'FLAT',
    couponAmount: Number(couponAmount),
    applyCoupon: payment.couponApplied,
    taxRate: 0,
    applyTax: true,
    serviceCharge: 0,
    applyServiceCharge: true,
  });

  const wrappedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(
        e,
        netPayable,
        grossAmount,
        totalDiscount,
        afterDiscount,
        taxAmount
      );
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Container className="flex justify-between items-center pt-4">
      <div className="h-[75vh] max-h-[75vh] w-4/6 flex flex-col justify-between">
        <PatientDetailsCard patient={patientDetails} />
        <ServicesTable services={serviceDetails} />
        <BillingSummary
          grossAmount={grossAmount}
          totalDiscount={totalDiscount}
          afterDiscount={afterDiscount}
          couponValue={couponValue}
          taxAmount={taxAmount}
          netPayable={netPayable}
          taxRate={0}
          serviceCharge={0}
          couponApplied={payment.couponApplied}
        />
      </div>

      <div className="h-[75vh] w-2/6 ml-4">
        <PaymentForm
          payment={payment}
          errors={errors}
          netPayable={netPayable}
          couponAmount={Number(couponAmount || 0)}
          serviceLevelDiscount={serviceLevelDiscount}
          onChange={handleChange}
          onSubmit={wrappedSubmit}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          paymentButtonDetails={{
            patientName: patientDetails?.Name || '',
            patientID: patientDetails?.UHID || 'UHID0000',
            // amount: netPayable,
            amount: 1,
            email: patientDetails?.Email_ID || '',
            phone: patientDetails?.Mobile_No || '',
            processingId: generateProcessingId('TXN'),
            paymode: 'cards-upi',
            cashierId: userId,
          }}
          onSplitAmountChange={handleSplitAmountChange}
        />
      </div>
    </Container>
  );
};

export default PaymentCheckout;
