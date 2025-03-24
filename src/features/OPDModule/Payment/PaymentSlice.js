import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    paymentMethodList: [
      { columnName: "Cash", columnCode: "C" },
      { columnName: "Card", columnCode: "R" },
      { columnName: "Cheque", columnCode: "Q" },
      { columnName: "Contra", columnCode: "T" },
    ],
    paymentMethod: "",
    RefNo: "REF",
    balanceAmount: 0,
    CardList: [
      {
        value: 1,
        label: "cards-swipe",
        value1: "CS",
      },
      {
        value: 2,
        label: "cards-upi",
        value1: "CU",
      },
      {
        value: 3,
        label: "cards-standalone",

        value1: "CS",
      },
    ],
    CardType: "",
    verifyPaymentFlag: false,
    actualAmountToPay: 0,
    collectedAmountInHand: 0,
    newBalanceAmountToPay: 0,
  },
};

export const paymentSlice = createSlice({
  name: "PaymentSlice",
  initialState,
  reducers: {
    paymentInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    posPaymentInformation: (state, action) => {
      const { actualAmount, collectedAmount } = action.payload;
      // console.log(actualAmount);
      if (actualAmount > 0) {
        state.formData["newBalanceAmountToPay"] =
          actualAmount - collectedAmount;
      }
    },
    
    resetPaymentInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const {
  paymentInformation,
  resetPaymentInformation,
  posPaymentInformation,
} = paymentSlice.actions;

export default paymentSlice.reducer;
