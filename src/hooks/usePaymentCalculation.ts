export const usePaymentCalculation = (
  baseAmount: number,
  discount?: number,
  couponCode?: string
) => {
  const discountAmount = discount || 0;
  const finalAmount = baseAmount - discountAmount;
  return {
    finalAmount,
    discountAmount,
    couponApplied: !!couponCode,
  };
};
