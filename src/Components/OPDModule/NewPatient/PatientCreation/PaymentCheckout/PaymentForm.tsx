import React from 'react';
import {
  Form,
  Button,
  Alert,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from 'react-bootstrap';
import {Tags, HelpCircle} from 'lucide-react';
import CustomFormField from '../../../../../common/form/CustomFormField';
import PaymentButton from '../../../../../Components/Payment/PaymentButton';
import {Button as CustomButton} from '../../../../../common/ui/button';
import {PaymentMode, DiscountType} from '../../../../../types/payment.types';

interface PaymentFormProps {
  payment: {
    mode: PaymentMode;
    type: string;
    discountType: DiscountType;
    discount: number | null;
    couponApplied: boolean;
    cardAmount: number | null;
    cashAmount: number | null;
  };
  errors: Record<string, string>;
  netPayable: number;
  couponAmount: number;
  serviceLevelDiscount: number;
  paymentButtonDetails: {
    patientName: string;
    patientID: string;
    amount: number;
    email: string;
    phone: string;
    processingId: string;
    paymode: string;
    cashierId: string;
  };
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void; // Updated to single parameter
  onSplitAmountChange: (
    type: 'card' | 'cash',
    value: string,
    netPayable: number
  ) => void;
  onPaymentSuccess: (response: any) => void;
  onPaymentError: (error: string) => void;
}

const PAYMENT_TYPES = [
  {label: '💵 Cash', value: 'C'},
  {label: '💳 Card', value: 'R'},
  {label: '📲 UPI', value: 'U'},
  {label: '📝 Cheque', value: 'Q'},
  {label: '🔁 Contra', value: 'T'},
];

const DISCOUNT_TYPES = [
  {label: 'Percentage', value: 'percentage'},
  {label: 'Flat', value: 'flat'},
];

const PaymentForm: React.FC<PaymentFormProps> = ({
  payment,
  errors,
  netPayable,
  couponAmount,
  paymentButtonDetails,
  serviceLevelDiscount,
  onChange,
  onSubmit,
  onSplitAmountChange,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const renderDiscountTooltip = (props: any) => (
    <Tooltip id="discount-tooltip" {...props}>
      Apply percentage or flat discount to the total amount
    </Tooltip>
  );

  const handleCouponToggle = () => {
    onChange('couponApplied', !payment.couponApplied);
  };

  return (
    <Form
      noValidate
      onSubmit={onSubmit}
      className="bg-slate-100 p-4 rounded-lg h-full flex flex-col justify-between drop-shadow">
      <h5 className="text-lg font-bold tracking-wide font-sans border-b-2 pb-2 border-b-slate-200">
        Payment Details
      </h5>

      <div className="mx-2 my-2 h-full">
        {/* Discount Section */}
        <Row className="mb-2">
          <h5 className="text-gray-700 font-semibold text-md flex items-center space-x-2">
            <span>
              Overall Discount <span className="text-red-500">*</span>
            </span>
            <OverlayTrigger placement="right" overlay={renderDiscountTooltip}>
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
              onChange={(e) => {
                onChange('discountType', e.target.value);
                onChange('discount', null);
              }}
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
              value={String(payment.discount) ?? ''}
              onChange={(e) =>
                onChange(
                  'discount',
                  e.target.value === '' ? null : parseFloat(e.target.value)
                )
              }
              disabled={!payment.discountType}
              placeholder="Amount"
              min={0}
              className="m-0 w-1/2"
              isInvalid={!!errors.discount}
              errorMessage={errors.discount}
            />
          </div>
        </Row>
        {/* Coupon Section */}
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

        {/* Payment Mode Selection */}
        <Form.Group className="space-y-4 mt-4">
          <div className="flex gap-6">
            <Form.Check
              type="radio"
              id="full"
              label="Full Payment"
              checked={payment.mode === 'full'}
              onChange={() => onChange('mode', 'full')}
            />
            <Form.Check
              type="radio"
              id="split"
              label="Split Payment"
              checked={payment.mode === 'split'}
              onChange={() => onChange('mode', 'split')}
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
                    onChange('type', e.target.value);
                    onChange('errors', {...errors, payType: ''});
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
                        onSplitAmountChange('card', e.target.value, netPayable)
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
                        onSplitAmountChange('cash', e.target.value, netPayable)
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

      {/* Submit Button */}
      {(payment.mode === 'full' &&
        (payment.type === 'R' || payment.type === 'U')) ||
      payment.mode === 'split' ? (
        <PaymentButton
          paymentDetails={{
            ...paymentButtonDetails,
            paymode: 'cards-upi',
          }}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      ) : (
        <Button
          type="submit"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-teal-800 text-white hover:from-green-700 hover:to-teal-900 transition-all duration-300 ease-in-out px-6 py-2 rounded-lg shadow-lg text-sm tracking-wide w-full mt-6">
          Pay ₹{netPayable.toFixed(2)}
        </Button>
      )}
    </Form>
  );
};

export default PaymentForm;
