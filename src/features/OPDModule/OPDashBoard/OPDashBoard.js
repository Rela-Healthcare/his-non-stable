import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    CaseSheetInfo: "",
    InvoiceInfo: "",
    ServiceInfo: "",
    BarcodeInfo: "",
    BillInfo: "",
  },
};

export const OPDashBoardSlice = createSlice({
  name: "OPDashBoardSlice",
  initialState,
  reducers: {
    dashBoardFormData: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetDashBoardFormData: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const { dashBoardFormData, resetDashBoardFormData } =
  OPDashBoardSlice.actions;

export default OPDashBoardSlice.reducer;
