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
  Service_Group?: string;
  Service: string;
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
    <Container className="px-0 md:px-4">
      <div className="flex flex-col lg:flex-row gap-4 pt-4">
        {/* Left Column - Patient Details, Services, Billing Summary */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div>
            <PatientDetailsCard patient={patientDetails} />
          </div>

          <div className="flex-1 overflow-auto">
            <ServicesTable services={serviceDetails} />
          </div>

          <div>
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
        </div>

        {/* Right Column - Payment Form */}
        <div className="w-full lg:w-1/3">
          <div className="rounded-lg shadow sticky top-4 sm:h-auto lg:h-[72vh] overflow-y-auto">
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
        </div>
      </div>
    </Container>
  );
};

export default PaymentCheckout;
