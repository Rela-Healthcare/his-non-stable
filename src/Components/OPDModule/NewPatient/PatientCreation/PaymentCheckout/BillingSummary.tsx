import React from 'react';

interface BillingSummaryProps {
  grossAmount: number;
  totalDiscount: number;
  afterDiscount: number;
  couponValue: number;
  couponApplied: boolean;
  taxAmount: number;
  taxRate: number;
  serviceCharge: number;
  netPayable: number;
}

export const BillingSummary: React.FC<BillingSummaryProps> = ({
  grossAmount,
  totalDiscount,
  afterDiscount,
  couponValue,
  couponApplied,
  taxAmount,
  taxRate,
  serviceCharge,
  netPayable,
}) => {
  return (
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
            <span className={totalDiscount > 0 ? 'text-red-500' : ''}>
              {`— ₹${totalDiscount.toFixed(2)}`}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Subtotal:</span>
            <span>₹{afterDiscount.toFixed(2)}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Coupon:</span>
            <span className={couponApplied ? 'text-red-500' : ''}>
              {`— ₹${couponApplied ? couponValue.toFixed(2) : 0}`}
            </span>
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
  );
};

export default BillingSummary;
