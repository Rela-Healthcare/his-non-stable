import {useMemo, useEffect, useCallback} from 'react';

// Types
type DiscountType = 'PERCENTAGE' | 'FLAT' | 'NONE';
type ServiceDiscountType = 'Percentage' | 'Flat' | 'None';

interface ServiceDetail {
  ServiceName: string;
  Discount: number;
  Discount_Type: ServiceDiscountType;
  Amount: number;
  Actual_Amount: number;
}

interface UsePaymentCalculationProps {
  services: ServiceDetail[];
  overallDiscount: number;
  overallDiscountType: DiscountType;
  couponAmount: number;
  applyCoupon: boolean;
  taxRate?: number;
  applyTax?: boolean;
  serviceCharge?: number;
  applyServiceCharge?: boolean;
}

interface PaymentCalculations {
  grossAmount: number;
  serviceLevelDiscount: number;
  overallDiscountAmount: number;
  totalDiscount: number;
  afterDiscount: number;
  couponValue: number;
  taxAmount: number;
  serviceChargeAmount: number;
  netPayable: number;
  validateSplit: (cardAmount: number, cashAmount: number) => string;
  breakdown: {
    subtotal: number;
    discounts: number;
    taxes: number;
    charges: number;
    total: number;
  };
}

// Constants
const CURRENCY_PRECISION = 2;
const MIN_PAYMENT_AMOUNT = 0;

/**
 * World-class payment calculation hook with support for:
 * - Service-level discounts
 * - Overall discounts (percentage or flat)
 * - Coupons
 * - Taxes
 * - Service charges
 * - Comprehensive validation
 * - Currency precision handling
 */
export const usePaymentCalculation = ({
  services,
  overallDiscount,
  overallDiscountType,
  couponAmount,
  applyCoupon,
  taxRate = 0,
  applyTax = false,
  serviceCharge = 0,
  applyServiceCharge = false,
}: UsePaymentCalculationProps): PaymentCalculations => {
  /**
   * Validates all input parameters
   * @throws Error if any validation fails
   */
  const validateInputs = useCallback(() => {
    if (!Array.isArray(services)) {
      throw new Error('Services must be an array');
    }
    if (overallDiscount < 0) {
      throw new Error('Discount cannot be negative');
    }
    if (taxRate < 0) {
      throw new Error('Tax rate cannot be negative');
    }
    if (serviceCharge < 0) {
      throw new Error('Service charge cannot be negative');
    }
    if (couponAmount < 0) {
      throw new Error('Coupon amount cannot be negative');
    }
  }, [services, overallDiscount, taxRate, serviceCharge, couponAmount]);

  // Validate inputs on initial render and when dependencies change
  useEffect(() => {
    validateInputs();
  }, [validateInputs]);

  /**
   * Rounds currency values to specified precision
   * @param value - The amount to round
   * @returns Rounded value
   */
  const roundCurrency = (value: number): number => {
    if (typeof value !== 'number' || isNaN(value)) {
      console.error('Invalid value passed to roundCurrency:', value);
      return 0;
    }
    return parseFloat(value.toFixed(CURRENCY_PRECISION));
  };

  // 🧮 Gross Amount (sum of all service amounts)
  const grossAmount = useMemo(() => {
    return roundCurrency(
      services.reduce((total, service) => {
        const amount = Number(service.Actual_Amount) || 0;
        return total + amount;
      }, 0)
    );
  }, [services]);

  // 🏷️ Service-level Discount (calculated per service)
  const serviceLevelDiscount = useMemo(() => {
    return roundCurrency(
      services.reduce((total, service) => {
        // Explicitly check for valid discount
        const discount = Number(service.Discount);
        if (isNaN(discount) || discount <= 0) return total;

        // Case-insensitive comparison for Discount_Type
        const discountType = String(service.Discount_Type).toLowerCase();
        const actualAmount = Number(service.Actual_Amount) || 0;

        const discountValue =
          discountType === 'percentage'
            ? (actualAmount * discount) / 100
            : discount; // Flat discount

        return total + discountValue;
      }, 0)
    );
  }, [services]);

  // 💸 Overall Discount (either % or flat)
  const overallDiscountAmount = useMemo(() => {
    if (overallDiscount <= 0) return 0;

    return roundCurrency(
      overallDiscountType === 'PERCENTAGE'
        ? (grossAmount * overallDiscount) / 100
        : Math.min(overallDiscount, grossAmount)
    );
  }, [grossAmount, overallDiscount, overallDiscountType]);

  // 💯 Total Discount (service + overall)
  const totalDiscount = useMemo(() => {
    return roundCurrency(serviceLevelDiscount + overallDiscountAmount);
  }, [serviceLevelDiscount, overallDiscountAmount]);

  // 💰 Amount after applying all discounts
  const afterDiscount = useMemo(() => {
    return roundCurrency(
      Math.max(grossAmount - totalDiscount, MIN_PAYMENT_AMOUNT)
    );
  }, [grossAmount, totalDiscount]);

  // 🎟️ Coupon Value
  const couponValue = useMemo(() => {
    if (!applyCoupon || couponAmount <= 0) return 0;
    return roundCurrency(Math.min(couponAmount, afterDiscount));
  }, [applyCoupon, couponAmount, afterDiscount]);

  // 💼 Service Charge
  const serviceChargeAmount = useMemo(() => {
    if (!applyServiceCharge || serviceCharge <= 0) return 0;
    const chargeableAmount = afterDiscount - couponValue;
    return roundCurrency(
      typeof serviceCharge === 'number'
        ? serviceCharge
        : (chargeableAmount * serviceCharge) / 100
    );
  }, [applyServiceCharge, serviceCharge, afterDiscount, couponValue]);

  // 🏛️ Tax Amount
  const taxAmount = useMemo(() => {
    if (!applyTax || taxRate <= 0) return 0;
    const taxableAmount = afterDiscount - couponValue + serviceChargeAmount;
    return roundCurrency((taxableAmount * taxRate) / 100);
  }, [applyTax, taxRate, afterDiscount, couponValue, serviceChargeAmount]);

  // 💵 Final Net Payable Amount
  const netPayable = useMemo(() => {
    const amount = roundCurrency(
      afterDiscount - couponValue + serviceChargeAmount + taxAmount
    );
    return Math.max(amount, MIN_PAYMENT_AMOUNT);
  }, [afterDiscount, couponValue, serviceChargeAmount, taxAmount]);

  // 🧩 Payment Breakdown
  const breakdown = useMemo(
    () => ({
      subtotal: grossAmount,
      discounts: totalDiscount,
      taxes: taxAmount,
      charges: serviceChargeAmount,
      total: netPayable,
    }),
    [grossAmount, totalDiscount, taxAmount, serviceChargeAmount, netPayable]
  );

  // 🧠 Split Mode Validator
  const validateSplit = (cardAmount: number, cashAmount: number): string => {
    const total = roundCurrency(cardAmount + cashAmount);
    if (total !== netPayable) {
      return `Split amount (${total}) does not match Net Payable amount (${netPayable})`;
    }
    if (cardAmount < 0 || cashAmount < 0) {
      return 'Amounts cannot be negative';
    }
    return '';
  };

  return {
    grossAmount,
    serviceLevelDiscount,
    overallDiscountAmount,
    totalDiscount,
    afterDiscount,
    couponValue,
    taxAmount,
    serviceChargeAmount,
    netPayable,
    validateSplit,
    breakdown,
  };
};
