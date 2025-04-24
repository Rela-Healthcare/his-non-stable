import React, {
  useRef,
  useState,
  FormEvent,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import {
  Button,
  Form,
  Col,
  Row,
  Alert,
  OverlayTrigger,
  Tooltip,
  Container,
} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';
import {
  capitalize,
  formatPrice,
  generateProcessingId,
} from '../../../../utils/utils';
import {Button as CustomButton} from '../../../../common/ui/button';
import {Tags, HelpCircle} from 'lucide-react';
import {toast} from 'react-toastify';
import TruncatedText from '../../../../common/TruncatedText';
import PaymentButton from '../../../../Components/Payment/PaymentButton';
import {PaymentButtonProps, PayModes} from '../../../../types/payment.types';
import {usePaymentCalculation} from '../../../../hooks/usePaymentCalculation';
import {getConvertPercentageToDecimal} from '../../../../utils/PaymentUtil';

// Types
type PaymentMode = 'full' | 'split';
type DiscountType = 'percentage' | 'flat' | '';

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
  userId?: string;
  onSubmit: (data: any) => void;
  taxRate?: number;
  serviceCharge?: number;
}

// Constants
const PAYMENT_TYPES = [
  {label: '💵 Cash', value: 'C'},
  {label: '💳 Card / UPI', value: 'R'},
  {label: '📝 Cheque', value: 'Q'},
  {label: '🔁 Contra', value: 'T'},
];

const DISCOUNT_TYPES = [
  {label: 'Percentage', value: 'percentage'},
  {label: 'Flat', value: 'flat'},
];

/**
 * World-class Payment Checkout Component with:
 * - Comprehensive payment processing
 * - Discount and coupon handling
 * - Split payment support
 * - Tax and service charge calculation
 * - Robust validation
 * - Accessibility support
 */
const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  id,
  couponAmount = 0,
  paymentDetails,
  patientDetails,
  serviceDetails,
  userId = 'admin123',
  onSubmit,
  taxRate = 0,
  serviceCharge = 0,
}) => {
  // State
  const [payment, setPayment] = useState({
    mode: 'full' as PaymentMode,
    type: '',
    discountType: '' as DiscountType,
    discount: null as number | null,
    couponApplied: paymentDetails?.Apply_Coupon ?? false,
    cardAmount: null as number | null,
    cashAmount: null as number | null,
  });

  const [myPaymentDetails, setMyPaymentDetails] = useState<
    PaymentButtonProps['paymentDetails']
  >({
    patientName: '',
    uhid: '000000',
    chargeRate: 1,
    email: '',
    mobileNo: '',
    processingId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toastShownRef = useRef(false);

  // Reset split amounts when discount/coupon changes
  useEffect(() => {
    setPayment((prev) => ({
      ...prev,
      cardAmount: null,
      cashAmount: null,
    }));
  }, [payment.discountType, payment.discount, payment.couponApplied]);

  // Calculate payment details using custom hook
  const {
    grossAmount,
    serviceLevelDiscount,
    overallDiscountAmount,
    totalDiscount,
    afterDiscount,
    couponValue,
    taxAmount,
    netPayable,
    validateSplit,
    breakdown,
  } = usePaymentCalculation({
    services: serviceDetails.slice(0, -1),
    overallDiscount: payment.discount || 0,
    overallDiscountType:
      payment.discountType === 'percentage' ? 'PERCENTAGE' : 'FLAT',
    couponAmount,
    applyCoupon: payment.couponApplied,
    taxRate,
    applyTax: true,
    serviceCharge,
    applyServiceCharge: true,
  });

  // Memoized patient data fallback
  const patientData = useMemo(
    () => ({
      Name: capitalize(patientDetails?.Name) || 'Not Available',
      Mobile_No: patientDetails?.Mobile_No || 'Not Available',
      Age: patientDetails?.Age || 'Not Available',
      Gender: patientDetails?.Gender || 'Not Available',
      UHID: patientDetails?.UHID || 'UHID000000',
    }),
    [patientDetails]
  );

  /**
   * Handles coupon application/removal
   */
  const handleCouponToggle = useCallback(() => {
    setPayment((prev) => ({
      ...prev,
      couponApplied: !prev.couponApplied,
    }));
  }, []);

  /**
   * Handles split amount changes with validation
   */
  const handleSplitAmountChange = useCallback(
    (type: 'card' | 'cash', value: string) => {
      const enteredValue = parseFloat(value) || 0;
      const cappedValue = Math.min(enteredValue, netPayable);

      // Show toast if amount exceeds payable limit (once per change)
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
    [netPayable]
  );

  /**
   * Validates the payment form
   */
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Payment type validation
    if (payment.mode === 'full' && !payment.type) {
      newErrors.payType = 'Please select a payment method';
    }

    // Discount validation
    if (payment.discountType && (!payment.discount || payment.discount <= 0)) {
      newErrors.discount = 'Please enter a valid discount value';
    }

    // Split payment validation
    if (payment.mode === 'split') {
      const validationError = validateSplit(
        payment.cardAmount || 0,
        payment.cashAmount || 0
      );
      if (validationError) newErrors.amounts = validationError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [payment, validateSplit]);

  /**
   * Constructs payment data payload
   */
  const constructPaymentData = useCallback(() => {
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
      Service_Charge: serviceCharge,
      Net_Payable_Amount: netPayable,
      UserId: userId,
    };
  }, [
    payment.mode,
    payment.couponApplied,
    payment.type,
    payment.cardAmount,
    payment.cashAmount,
    id,
    grossAmount,
    totalDiscount,
    afterDiscount,
    couponAmount,
    taxAmount,
    serviceCharge,
    netPayable,
    userId,
  ]);

  /**
   * Processes payment and generates payment URL if needed
   */
  const processPayment = useCallback(async () => {
    if (!patientDetails) {
      toast.error('Patient details are required for payment');
      return null;
    }
    setMyPaymentDetails({
      patientName: patientDetails.Name,
      uhid: patientDetails.UHID || '000000',
      chargeRate: netPayable,
      email: patientDetails.Email_ID,
      mobileNo: patientDetails.Mobile_No,
      processingId: generateProcessingId(patientDetails.Mobile_No),
      payMode: PayModes.CARDS_UPI,
    });
    return null;
  }, [patientDetails, netPayable]);

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = constructPaymentData();

    try {
      // For online payments, generate URL and open modal
      if (payment.mode === 'full' && payment.type === 'R') {
        await processPayment();
        return;
      }

      // For other payment types, submit directly
      onSubmit(payload);
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error('Failed to process payment');
    }
  };

  /**
   * Reusable patient detail display component
   */
  const PatientDetailRow: React.FC<{label: string; value: string}> = ({
    label,
    value,
  }) => (
    <div className="w-full flex justify-between items-center py-1">
      <span className="text-[#838383] font-bold text-sm">{label}</span>
      <span className="text-black font-bold text-sm ml-2">:</span>
      <span className="text-black font-bold text-sm flex-1 text-right ml-2">
        {value || 'Not Available'}
      </span>
    </div>
  );

  /**
   * Tooltip for discount information
   */
  const renderDiscountTooltip = (props: any) => (
    <Tooltip id="discount-tooltip" {...props}>
      {serviceLevelDiscount > 0
        ? 'Service-level discounts have already been applied, so overall discount will not be provided.'
        : 'Apply percentage or flat discount to the total amount'}
    </Tooltip>
  );

  return (
    <Container className="flex justify-between items-center pt-4">
      <div className="h-[75vh] w-4/6 flex flex-col justify-between">
        {/* Patient Details */}
        <div className="border-b-2 border-slate-200 ">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Patient Information
          </h3>
          <div className="flex flex-col items-center justify-between">
            <Row className="w-full">
              <Col className="!m-0 !p-0" sm={5}>
                <PatientDetailRow
                  label="Patient Name"
                  value={patientData.Name}
                />
              </Col>
              <Col sm={2} />
              {/* space between */}
              <Col className="!m-0 !p-0" sm={5}>
                {' '}
                {/* or use `ml-2` for smaller gap */}
                <PatientDetailRow label="UHID" value={patientData.UHID} />
              </Col>
            </Row>
            <Row className="w-full">
              <Col className="!m-0 !p-0" sm={5}>
                <PatientDetailRow
                  label="Mobile"
                  value={patientData.Mobile_No}
                />
              </Col>
              <Col sm={2} />
              <Col className="!m-0 !p-0" sm={5}>
                <PatientDetailRow
                  label="Age/Gender"
                  value={`${patientData.Age}/${patientData.Gender}`}
                />
              </Col>
            </Row>
          </div>
        </div>

        {/* Services */}
        <div className="border-b-2 border-slate-200 pb-2 h-full mt-3">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Services</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead className="sticky top-0 z-10 block bg-slate-200">
                <tr className="table w-full m-0 border-0 table-fixed">
                  <th className="border px-1 py-0 text-left w-6/12">Service</th>
                  <th className="border px-1 py-0 text-left w-3/12">
                    Discount (₹)
                  </th>
                  <th className="border px-1 py-0 text-left w-3/12">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="block max-h-64 overflow-y-auto w-full">
                {serviceDetails.slice(0, -1).length > 0 ? (
                  serviceDetails.slice(0, -1).map((service, index) => (
                    <tr key={index} className="table m-0 w-full table-fixed">
                      <td className="border px-1 w-6/12">
                        <TruncatedText
                          text={service.ServiceName}
                          maxLength={30}
                          middleEllipsis={true}
                          className="font-semibold text-sm px-2"
                        />
                      </td>
                      <td className="border px-1 w-3/12">
                        {service.Discount_Type === 'Percentage'
                          ? `${service.Discount ?? 0}%  ( ₹${
                              service.Discount &&
                              service?.Actual_Amount &&
                              getConvertPercentageToDecimal(
                                service?.Discount,
                                service?.Actual_Amount
                              ).toFixed(2)
                            } )`
                          : service.Discount_Type === 'Flat'
                          ? `₹${service.Discount ?? 0}`
                          : '—'}
                      </td>
                      <td className="border px-1 w-3/12 font-medium">
                        <TruncatedText
                          text={`₹${formatPrice(service.Amount)}`}
                          alwaysShowTooltip={true}
                          tooltipText={`without discount: ₹${formatPrice(
                            service?.Actual_Amount
                          )}`}
                          maxLength={30}
                          middleEllipsis={true}
                          className="font-semibold text-sm px-2"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-1">
                      No services available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="mt-3 flex justify-end items-center">
          <div className="w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Billing Summary
            </h3>
            <ul className="font-sans font-semibold flex flex-col justify-between gap-y-2">
              <li className="flex justify-between items-center">
                <span>Gross Amount:</span>
                <span>₹{grossAmount.toFixed(2)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Discounts:</span>
                <span
                  className={
                    totalDiscount > 0 ? 'text-red-500' : ''
                  }>{`— ₹${totalDiscount.toFixed(2)}`}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>₹{afterDiscount.toFixed(2)}</span>
              </li>

              <li className="flex justify-between items-center">
                <span>Coupon:</span>
                <span
                  className={
                    payment.couponApplied ? 'text-red-500' : ''
                  }>{`— ₹${
                  payment.couponApplied ? couponValue.toFixed(2) : 0
                }`}</span>
              </li>
              {taxAmount > 0 && (
                <li className="flex justify-between items-center">
                  <span>Tax ({taxRate}%):</span>
                  <span>+ ₹{taxAmount.toFixed(2)}</span>
                </li>
              )}
              {serviceCharge > 0 && (
                <li className="flex justify-between items-center">
                  <span>Service Charge:</span>
                  <span>+ ₹{serviceCharge.toFixed(2)}</span>
                </li>
              )}
              <li className="text-md font-bold tracking-wide font-serif border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                <span>Net Payable:</span>
                <span>₹{netPayable.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="h-[75vh] w-2/6 ml-4">
        <Form
          noValidate
          onSubmit={handleSubmit}
          className="bg-slate-100 p-4 rounded-lg h-full flex flex-col justify-between drop-shadow">
          <h5 className="text-lg font-bold tracking-wide font-sans border-b-2 pb-2 border-b-slate-200">
            Payment Details
          </h5>

          <div className="mx-2 my-2 h-full">
            <Row>
              <h5 className="text-gray-700 font-semibold text-md flex items-center space-x-2">
                <span>
                  Overall Discount <span className="text-red-500">*</span>
                </span>
                <OverlayTrigger
                  placement="right"
                  overlay={renderDiscountTooltip}>
                  <span className="text-gray-500 cursor-pointer">
                    <HelpCircle size={18} />
                  </span>
                </OverlayTrigger>
              </h5>
              <div className="flex justify-between items-center gap-x-2">
                <CustomFormField
                  type="select"
                  name="discountType"
                  value={payment.discountType}
                  onChange={(e) =>
                    setPayment((prev) => ({
                      ...prev,
                      discountType: e.target.value as DiscountType,
                      discount: null,
                    }))
                  }
                  options={DISCOUNT_TYPES}
                  placeholder="Discount Type"
                  disabled={serviceLevelDiscount > 0}
                  className="m-0 w-1/2"
                  isInvalid={!!errors.discount}
                  errorMessage={errors.discount}
                />
                <CustomFormField
                  type="number"
                  name="discount"
                  value={payment.discount || ''}
                  onChange={(e) =>
                    setPayment((prev) => ({
                      ...prev,
                      discount: parseFloat(e.target.value) || null,
                    }))
                  }
                  disabled={!payment.discountType}
                  placeholder="Amount"
                  min="0"
                  className="m-0 w-1/2"
                  isInvalid={!!errors.discount}
                  errorMessage={errors.discount}
                />
              </div>
            </Row>
            <div className="flex justify-between items-center my-2 px-3 w-full h-[2.6rem] border-1 border-gray-800 rounded-md">
              <span className="flex items-center font-sans font-bold">
                Coupon <Tags fill="#CCC" size={20} className="mx-2" />
                <span className="text-gray-500">Save|₹{couponAmount}</span>
              </span>
              <CustomButton
                className={`font-sans font-bold ${
                  !payment.couponApplied ? 'text-green-500' : 'text-red-500'
                }`}
                type="button"
                variant="link"
                onClick={handleCouponToggle}
                size="sm">
                {!payment.couponApplied ? 'Apply' : 'Remove'}
              </CustomButton>
            </div>
            <Form.Group className="space-y-4 mt-4">
              <div className="flex gap-6">
                <Form.Check
                  type="radio"
                  id="full"
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      Full Payment
                    </span>
                  }
                  checked={payment.mode === 'full'}
                  onChange={() =>
                    setPayment((prev) => ({...prev, mode: 'full'}))
                  }
                />
                <Form.Check
                  type="radio"
                  id="split"
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      Split Payment
                    </span>
                  }
                  checked={payment.mode === 'split'}
                  onChange={() =>
                    setPayment((prev) => ({...prev, mode: 'split'}))
                  }
                />
              </div>

              {/* Full Payment Fields */}
              {payment.mode === 'full' && (
                <div className="space-y-4">
                  <Form.Group>
                    <Form.Label className="text-sm font-semibold text-gray-700">
                      Pay Using <span className="text-red-600">*</span>
                    </Form.Label>
                    <CustomFormField
                      type="select"
                      name="payType"
                      value={payment.type}
                      onChange={(e) => {
                        setPayment((prev) => ({...prev, type: e.target.value}));
                        setErrors((prev) => ({...prev, payType: ''}));
                      }}
                      options={PAYMENT_TYPES}
                      placeholder="Select payment method"
                      isInvalid={!!errors.payType}
                      errorMessage={errors.payType}
                      required
                    />
                  </Form.Group>
                </div>
              )}

              {/* Split Payment Fields */}
              {payment.mode === 'split' && (
                <div className="space-y-4">
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-sm font-semibold text-gray-700">
                          Card Amount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Card Amount"
                          value={payment.cardAmount || ''}
                          onChange={(e) =>
                            handleSplitAmountChange('card', e.target.value)
                          }
                          min="0"
                          max={netPayable}
                          className="text-sm font-medium text-gray-900"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-sm font-semibold text-gray-700">
                          Cash Amount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Cash Amount"
                          value={payment.cashAmount || ''}
                          onChange={(e) =>
                            handleSplitAmountChange('cash', e.target.value)
                          }
                          min="0"
                          max={netPayable}
                          className="text-sm font-medium text-gray-900"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {errors.amounts && (
                <Alert variant="danger" className="text-sm font-medium">
                  {errors.amounts}
                </Alert>
              )}
            </Form.Group>
          </div>

          {/* Submit Button - Conditionally render PaymentButton for online payments */}
          {(payment.mode === 'full' && payment.type === 'R') ||
          payment.mode === 'split' ? (
            <PaymentButton
              paymentDetails={myPaymentDetails && myPaymentDetails}
              className="w-full mt-6 py-2 font-bold"
            />
          ) : (
            <Button
              type="submit"
              className={`flex items-center font-sans justify-center gap-2 bg-gradient-to-r from-green-700 to-teal-800 text-white hover:from-green-700 hover:to-teal-900 transition-all duration-300 ease-in-out px-6 py-2 rounded-lg shadow-lg text-sm tracking-wide w-full mt-6`}>
              Pay ₹{netPayable.toFixed(2)}
            </Button>
          )}
        </Form>
      </div>
    </Container>
  );
};

export default PaymentCheckout;
