import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    uhid: "",
    patientName: "",
    availableAmount: 0,
    amountTobeAdded: 0,
    depositRemarks: "",
    depositType: "",
    paymentMode: "",
    cardType: "",
    paymentModeCode: "",
  },
};

const depositSlice = createSlice({
  name: "depositSlice",
  initialState,
  reducers: {
    depositInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetDepositInformation: (state) => {
      state.formData = initialState.formData;
    },
    addToDeposit: (state, action) => {
      const { name, value } = action.payload;
      if (value >= 0) state.formData[name] += value;
    },
  },
});

export const { depositInformation, resetDepositInformation, addToDeposit } =
  depositSlice.actions;

export default depositSlice.reducer;
