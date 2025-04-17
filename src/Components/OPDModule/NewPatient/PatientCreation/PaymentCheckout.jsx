import React, {useRef, useState} from 'react';
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
import {formatPrice} from '../../../../utils/utils';
import {Button as CustomButton} from '../../../../common/ui/button';
import {Tags, HelpCircle} from 'lucide-react';
import {toast} from 'react-toastify';

const PaymentCheckout = ({
  id,
  grossAmount,
  finalDiscount,
  totalAmount,
  couponBalance = 0,
  applyCoupon = false,
  paitentDetails,
  serviceDetails,
  netPayableAmount,
  userId = 'admin123',
  onSubmit,
}) => {
  const [paymentMode, setPaymentMode] = useState('full');
  const [payType, setPayType] = useState('');
  const [cardAmount, setCardAmount] = useState(null);
  const [discountType, setDiscountType] = useState('');
  const [discount, setDiscount] = useState(null);
  const [coupon, setCoupon] = useState(false);
  const [cashAmount, setCashAmount] = useState(null);
  const [errors, setErrors] = useState({});
  const toastShownRef = useRef(false);

  const ReuseGrid = ({customName, customerDetails}) => {
    return (
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const payload = constructPaymentData();
      onSubmit(payload);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMode === 'full') {
      if (!payType) newErrors.payType = 'Select payment type';
    } else {
      const totalEntered =
        parseFloat(cardAmount?.toString() || '0') +
        parseFloat(cashAmount?.toString() || '0');

      if (totalEntered.toFixed(2) !== netPayableAmount.toFixed(2)) {
        newErrors.amounts = `Total must equal ₹${netPayableAmount}`;
      }
    }

    return newErrors;
  };

  const constructPaymentData = () => {
    const paymentTypes = [];

    if (paymentMode === 'full') {
      paymentTypes.push({
        PayType: payType,
        amount: netPayableAmount,
      });
    } else {
      if (cardAmount > 0) {
        paymentTypes.push({
          PayType: 'Card',
          amount: cardAmount,
        });
      }
      if (cashAmount > 0) {
        paymentTypes.push({
          PayType: 'Cash',
          amount: cashAmount,
        });
      }
    }

    return {
      Web_OPReceipt_Payment_Type: paymentTypes,
      Id: id,
      Gross_Amount: grossAmount,
      Final_Discount: finalDiscount,
      Total_Amount: totalAmount,
      Coupon_Balance: applyCoupon ? couponBalance : 0,
      Apply_Coupon: applyCoupon,
      Net_Payable_Amount: netPayableAmount,
      UserId: userId,
    };
  };

  const handleSplitAmountChange = (type, value) => {
    const numericValue = parseFloat(value) || 0 || '';

    const showToastOnce = (message) => {
      if (!toastShownRef.current) {
        toast.error(message);
        toastShownRef.current = true;
        setTimeout(() => {
          toastShownRef.current = false;
        }, 3000); // show only once every 3 seconds
      }
    };

    if (type === 'card') {
      if (numericValue > netPayableAmount) {
        showToastOnce('The card amount exceeds the payable limit.');
        return;
      }
      setCardAmount(numericValue);
      setCashAmount(Math.max(0, netPayableAmount - numericValue));
    } else {
      if (numericValue > netPayableAmount) {
        showToastOnce('The cash amount exceeds the payable limit.');
        return;
      }
      setCashAmount(numericValue);
      setCardAmount(Math.max(0, netPayableAmount - numericValue));
    }
  };

  const renderTooltip = (props) => (
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
                  <th className="border px-1 py-0 text-left">Service</th>
                  <th className="border px-1 py-0 text-left">Discount (₹)</th>
                  <th className="border px-1 py-0 text-left">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="block max-h-64 overflow-y-auto w-full">
                {serviceDetails.slice(0, -1) &&
                serviceDetails.slice(0, -1).length > 0 ? (
                  serviceDetails.slice(0, -1).map((service, index) => (
                    <tr key={index} className="table m-0 w-full table-fixed">
                      <td className="border px-1">
                        {service.ServiceName || '—'}
                      </td>
                      <td className="border px-1">
                        {service.Discount_Type === 'Percentage'
                          ? `${service.Discount ?? 0}%`
                          : service.Discount_Type === 'Flat'
                          ? `₹${service.Discount ?? 0}`
                          : '—'}
                      </td>
                      <td className="border px-1">
                        {formatPrice(service.Amount) ?? 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-1">
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
                <span className="text-red-500">{`— ₹ ${finalDiscount}`}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </li>
              {applyCoupon && (
                <li className="flex justify-between items-center">
                  <span>Coupon:</span>
                  {coupon ? (
                    <span className="text-red-500">{`— ₹ ${couponBalance}`}</span>
                  ) : (
                    0
                  )}
                </li>
              )}
              <li className="text-md font-bold tracking-wide font-serif border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                <span>Net Payable:</span>
                <span>₹{netPayableAmount}</span>
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
                  onChange={(e) => setDiscountType(e.target.value)}
                  className={'m-0 w-1/2'}
                  options={[
                    {label: 'Percentage', value: 'percentage'},
                    {label: 'Flat', value: 'flat'},
                  ]}
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
                <span className="text-gray-500">Save₹50</span>
              </span>
              <CustomButton
                className={`font-sans font-bold ${
                  !coupon ? 'text-green-500' : 'text-red-500'
                }`}
                type="button"
                variant="link"
                onClick={() => setCoupon((prev) => !prev)}
                size="md">
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
                          value={cardAmount}
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
                          value={cashAmount}
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
            Payment: ₹{netPayableAmount}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default PaymentCheckout;
