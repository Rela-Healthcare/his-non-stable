import React, {useRef, useState, FormEvent, useMemo, useEffect} from 'react';
import {
  Button,
  Form,
  Col,
  Row,
  Alert,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {Container} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';
import {formatPrice, generateProcessingId} from '../../../../utils/utils';
import {Button as CustomButton} from '../../../../common/ui/button';
import {Tags, HelpCircle} from 'lucide-react';
import {toast} from 'react-toastify';
import generatePaymentURL from '../../../../utils/generatePaymentURL';
import PaymentModal from '../../../../common/PaymentModal';
import TruncatedText from '../../../../common/TruncatedText';

interface PatientDetails {
  Name?: string;
  Mobile_No?: string;
  Email_ID?: string;
  Age?: string;
  Gender?: string;
}

interface ServiceDetail {
  ServiceName?: string;
  Discount?: number;
  Discount_Type?: 'Percentage' | 'Flat' | string;
  Amount?: number;
  Actual_Amount?: number;
}

interface PaymentCheckoutProps {
  id: string;
  totalAmount: number;
  couponAmount?: number;
  paitentDetails?: PatientDetails;
  serviceDetails: ServiceDetail[];
  paymentDetails?: any;
  userId?: string;
  onSubmit: (data: any) => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  id,
  couponAmount = 0,
  paymentDetails,
  paitentDetails,
  serviceDetails,
  userId = 'admin123',
  onSubmit,
}) => {
  const [paymentMode, setPaymentMode] = useState<'full' | 'split'>('full');
  const [payType, setPayType] = useState<string>('');
  const [discountType, setDiscountType] = useState<string>('');
  const [discount, setDiscount] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<boolean>(
    paymentDetails?.Apply_Coupon ? true : false
  );
  const [cardAmount, setCardAmount] = useState<number | null>(null);
  const [cashAmount, setCashAmount] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentURL, setPaymentURL] = useState('');
  const toastShownRef = useRef(false);

  useEffect(() => {
    setCardAmount(null);
    setCashAmount(null);
  }, [discountType, discount, coupon]);

  const grossAmount = useMemo(() => {
    return serviceDetails.reduce((total, service) => {
      return total + (service.Actual_Amount || 0);
    }, 0);
  }, [serviceDetails]);

  const finalDiscount = useMemo(() => {
    return serviceDetails.reduce((total, service) => {
      const actualAmount = service.Actual_Amount || 0;
      const discount = Number(service.Discount) || 0;
      if (service.Discount_Type === 'Percentage') {
        return total + (actualAmount * discount) / 100;
      }
      return total + discount;
    }, 0);
  }, [serviceDetails]);

  const getConvertPercentageToDecimal = (
    percentage: number,
    Actual_Amount: number
  ) => {
    return (percentage / 100) * Actual_Amount;
  };

  const parsedDiscount =
    parseFloat(String(discount ? discount : finalDiscount)) || 0;

  const couponValue = useMemo(() => {
    return coupon ? couponAmount : 0;
  }, [coupon, couponAmount]);

  const parseAmount = (val: number | string | null | undefined): number =>
    parseFloat(String(val ?? 0)) || 0;

  const computedDiscountAmount = useMemo(() => {
    if (isNaN(parsedDiscount) || parsedDiscount <= 0) return 0;
    const discountValue =
      discountType === 'percentage'
        ? (grossAmount * parsedDiscount) / 100
        : parsedDiscount;
    return Math.min(discountValue, grossAmount);
  }, [discountType, parsedDiscount, grossAmount]);

  const netPayable = useMemo(() => {
    const afterDiscount = Math.max(grossAmount - computedDiscountAmount, 0);
    return Math.max(afterDiscount - couponValue, 0);
  }, [grossAmount, computedDiscountAmount, couponValue]);

  const ReuseGrid: React.FC<{customName: string; customerDetails: string}> = ({
    customName,
    customerDetails,
  }) => (
    <div className="w-full flex justify-center items-center">
      <div className="w-full">
        <h5 className="text-[#838383] font-bold text-sm font-inter">
          {customName}
        </h5>
      </div>
      <div className="w-full">
        <h5 className="text-black font-bold text-sm font-inter">:</h5>
      </div>
      <div className="w-full">
        <h5 className="text-black font-bold text-sm font-inter">
          {customerDetails}
        </h5>
      </div>
    </div>
  );

  const handleCoupon = () => {
    setCoupon((prevCoupon) => {
      return !prevCoupon;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const payload = constructPaymentData();
      const result = payload.Web_OPReceipt_Payment_Type.find(
        (item: {PayType: string}) => item.PayType === 'R'
      );
      if (result) {
        try {
          if (
            paitentDetails?.Name &&
            result?.amount &&
            paitentDetails?.Email_ID &&
            paitentDetails?.Mobile_No
          ) {
            const paymentURL = await generatePaymentURL({
              patientName: paitentDetails?.Name,
              uhid: '000000',
              /* chargeRate: result?.amount, */
              chargeRate: 1.0,
              email: paitentDetails?.Email_ID,
              mobileNo: paitentDetails?.Mobile_No,
              processingId: generateProcessingId(paitentDetails?.Mobile_No),
            });

            setPaymentURL(paymentURL);
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error('❌ Error generating payment link:', error);
          toast.error('Failed to generate payment link.');
          return;
        }
      }
      // onSubmit(payload);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string | undefined> = {};

    if (paymentMode === 'full') {
      if (!payType) newErrors.payType = 'Please select a payment type';
    }

    if (discountType && (isNaN(parsedDiscount) || parsedDiscount <= 0)) {
      newErrors.discount = 'Please enter a valid discount value';
    }

    if (paymentMode === 'split') {
      const cardAmt = parseAmount(cardAmount);
      const cashAmt = parseAmount(cashAmount);
      const total = +(cardAmt + cashAmt).toFixed(2);

      if (total !== +netPayable.toFixed(2)) {
        newErrors.amounts = `Split total ₹${total} must equal Net Payable ₹${netPayable.toFixed(
          2
        )}`;
      }

      if (cardAmt < 0 || cashAmt < 0) {
        newErrors.amounts = 'Amounts cannot be negative';
      }
    }

    return newErrors;
  };

  const constructPaymentData = () => {
    const paymentTypes = [];

    if (paymentMode === 'full') {
      paymentTypes.push({
        PayType: payType,
        amount: netPayable,
      });
    } else {
      if (cardAmount !== null && cardAmount > 0) {
        paymentTypes.push({
          PayType: 'R',
          amount: cardAmount,
        });
      }
      if (cashAmount !== null && cashAmount > 0) {
        paymentTypes.push({
          PayType: 'C',
          amount: cashAmount,
        });
      }
    }

    return {
      Web_OPReceipt_Payment_Type: paymentTypes,
      Id: id,
      Gross_Amount: grossAmount,
      Final_Discount: computedDiscountAmount,
      Total_Amount: grossAmount - computedDiscountAmount,
      Coupon_Balance: coupon ? couponAmount : 0,
      Apply_Coupon: coupon,
      Net_Payable_Amount: netPayable,
      UserId: userId,
    };
  };

  const handleSplitAmountChange = (type: 'card' | 'cash', value: string) => {
    const enteredValue = parseAmount(value);
    const cappedValue = Math.min(enteredValue, netPayable);

    const showToastOnce = (msg: string) => {
      if (!toastShownRef.current) {
        toast.error(msg);
        toastShownRef.current = true;
        setTimeout(() => {
          toastShownRef.current = false;
        }, 3000);
      }
    };

    if (enteredValue > netPayable) {
      showToastOnce(
        `${type === 'card' ? 'Card' : 'Cash'} amount exceeds the payable limit`
      );
      return;
    }

    if (type === 'card') {
      setCardAmount(cappedValue);
      setCashAmount(Math.max(0, netPayable - cappedValue));
    } else {
      setCashAmount(cappedValue);
      setCardAmount(Math.max(0, netPayable - cappedValue));
    }
  };

  const renderTooltip = (props: any) => (
    <Tooltip id="overall-discount-tooltip" {...props}>
      If you have already applied a discount to individual services, you cannot
      provide an overall discount.
    </Tooltip>
  );

  return (
    <Container className="flex justify-between items-center mt-4">
      <div className="h-[75vh] w-4/6 flex flex-col justify-between">
        {/* Patient Details */}
        <div className="border-b-2 border-slate-200 ">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Patient Information
          </h3>
          <div className="flex items-center justify-between">
            <table className="table-auto w-full">
              <tbody>
                <tr>
                  <td className="px-4 py-2">
                    <ReuseGrid
                      customName="Name"
                      // customerDetails={paitentDetails?.Name}
                      customerDetails={'Bharathkumar'}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <ReuseGrid customName="UHID" customerDetails={'11039'} />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <ReuseGrid
                      customName="Mobile"
                      // customerDetails={paitentDetails?.Mobile}
                      customerDetails={'9876543210'}
                    />
                  </td>
                  <td className="px-4 py-2 ">
                    <ReuseGrid
                      customName="Age/Gender"
                      // customerDetails={`${paitentDetails?.Age}/${paitentDetails?.Gender}`}
                      customerDetails={`22/M`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Services */}
        <div className="border-b-2 border-slate-200 pb-2 h-full mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Services</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead className="sticky top-0 z-10 block bg-slate-200">
                <tr className="table w-full m-0 border-0 table-fixed">
                  <th className="border px-1 py-0 text-left w-7/12">Service</th>
                  <th className="border px-1 py-0 text-left w-3/12">
                    Discount (₹)
                  </th>
                  <th className="border px-1 py-0 text-left w-2/12">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="block max-h-64 overflow-y-auto w-full">
                {serviceDetails.slice(0, -1) &&
                serviceDetails.slice(0, -1).length > 0 ? (
                  serviceDetails.slice(0, -1).map((service, index) => (
                    <tr key={index} className="table m-0 w-full table-fixed">
                      <td className="border px-1 w-7/12">
                        <TruncatedText
                          text={service.ServiceName || '—'}
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
                      <td className="border px-1 w-2/12">
                        {formatPrice(service.Actual_Amount) ?? 0}
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
          <div className="px-3 w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Billing Summary
            </h3>
            <ul className="font-sans font-semibold flex flex-col justify-between gap-y-2">
              <li className="flex justify-between items-center">
                <span>Gross Amount:</span>
                <span>₹{grossAmount}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Final Discount:</span>
                <span className="text-red-500">{`— ₹ ${computedDiscountAmount}`}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span>₹{grossAmount - computedDiscountAmount}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Coupon:</span>
                {coupon ? (
                  <span className="text-red-500">{`— ₹ ${couponValue}`}</span>
                ) : (
                  0
                )}
              </li>
              <li className="text-md font-bold tracking-wide font-serif border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                <span>Net Payable:</span>
                <span>₹{netPayable}</span>
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
          className="bg-slate-100 p-4 rounded-lg h-full flex flex-col justify-between">
          <h5 className="text-lg font-bold tracking-wide font-sans border-b-2 pb-2 border-b-slate-200">
            Payment Details
          </h5>

          <div className="mx-2 my-2 h-full">
            <Row>
              <h5 className="text-gray-700 font-semibold text-md flex items-center space-x-2">
                <span>
                  Over all discount <span className="text-red-500">*</span>
                </span>

                <OverlayTrigger placement="right" overlay={renderTooltip}>
                  <span className="text-gray-500 cursor-pointer">
                    <HelpCircle size={18} />
                  </span>
                </OverlayTrigger>
              </h5>
              <div className="flex justify-between items-center gap-x-2">
                <CustomFormField
                  type="select"
                  name="discountType"
                  required
                  value={discountType}
                  disabled={finalDiscount > 0 ? true : false}
                  onChange={(e: {target: {value: string}}) =>
                    setDiscountType(e.target.value)
                  }
                  className={'m-0 w-1/2'}
                  options={
                    [
                      {label: 'Percentage', value: 'percentage'},
                      {label: 'Flat', value: 'flat'},
                    ] as unknown as never[]
                  }
                  placeholder="Discount Type"
                  isInvalid={!!errors?.discountType}
                  errorMessage={errors?.discountType}
                />
                <CustomFormField
                  type="number"
                  name="discount"
                  required
                  value={discount}
                  disabled={!discountType}
                  onChange={(e) => setDiscount(e.target.value)}
                  className={'m-0 w-1/2'}
                  placeholder="Discount"
                  isInvalid={!!errors?.discount}
                  errorMessage={errors?.discount}
                />
              </div>
            </Row>
            <div className="flex justify-between items-center my-2 px-3 w-full h-[3rem] border-1 border-gray-800 rounded-md">
              <span className="flex items-center font-sans font-bold">
                Coupon <Tags fill="#CCC" size={20} className="mx-2" />
                <span className="text-gray-500">Save₹{couponValue}</span>
              </span>
              <CustomButton
                className={`font-sans font-bold ${
                  !coupon ? 'text-green-500' : 'text-red-500'
                }`}
                type="button"
                variant="link"
                onClick={handleCoupon}
                size="sm">
                {!coupon ? 'Apply' : 'Remove'}
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
                  checked={paymentMode === 'full'}
                  onChange={() => setPaymentMode('full')}
                />
                <Form.Check
                  type="radio"
                  id="split"
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      Split Payment
                    </span>
                  }
                  checked={paymentMode === 'split'}
                  onChange={() => setPaymentMode('split')}
                />
              </div>

              {/* Full Payment Fields */}
              {paymentMode === 'full' && (
                <div className="space-y-4">
                  <Form.Group>
                    <Form.Label className="text-sm font-semibold text-gray-700">
                      Pay Using <span className="text-red-600">*</span>
                    </Form.Label>
                    <CustomFormField
                      type="select"
                      name="PayType"
                      required
                      value={payType}
                      onChange={(e) => setPayType(e.target.value)}
                      options={[
                        {label: '💵 Cash', value: 'C'},
                        {label: '💳 Card', value: 'R'},
                        {label: '📝 Cheque', value: 'Q'},
                        {label: '🔁 Contra', value: 'T'},
                      ]}
                      placeholder="Select payment method"
                      isInvalid={!!errors?.payType}
                      errorMessage={errors?.payType}
                    />
                  </Form.Group>
                </div>
              )}

              {/* Split Payment Fields */}
              {paymentMode === 'split' && (
                <div className="space-y-4">
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label className="text-sm font-semibold text-gray-700">
                          Card Amount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={cardAmount || ''}
                          onChange={(e) =>
                            handleSplitAmountChange('card', e.target.value)
                          }
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
                          value={cashAmount || ''}
                          onChange={(e) =>
                            handleSplitAmountChange('cash', e.target.value)
                          }
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

          <Button
            variant="success"
            type="submit"
            className="mt-3 w-full font-sans font-bold">
            Payment: ₹{netPayable}
          </Button>
        </Form>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        iframeUrl={paymentURL}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default PaymentCheckout;
