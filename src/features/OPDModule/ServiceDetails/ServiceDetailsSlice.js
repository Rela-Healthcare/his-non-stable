import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    SNO: "",
    Rate: 0,
    Unit: 1,
    Discount: 0,
    DepositAmount: 0,
    Amount: 0,
    PayerAmount: 0,
    Remarks: "",
    ServiceGroup: "",
    ServiceGroupName: "",
    Service: "",
    DiscountType: "",
    Priority: "",
    DiscTypeList: [
      { columnName: "Amount", columnCode: "A" },
      { columnName: "Percentage", columnCode: "P" },
    ],
    ServiceID: "",
    PriorityType: "",
    ServiceGroupList: [],
    PriorityList: [],
    ServiceList: [],
    serviceInfo: false,
  },
};

const serviceDetailsSlice = createSlice({
  name: "ServiceCreation",
  initialState,
  reducers: {
    dropDownInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value || [];
    },
    serviceInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetServiceInformation: (state) => {
      state.formData = initialState.formData;
    },
    
    calculateNetAmount: (state, action) => {
      const { value } = action.payload;
      console.log("Updating Net Amount:", value);
    
      // Set final amount based on calculations, perhaps rename Quantity/Amount as deemed necessary.
      state.formData.finalAmount = value;  // Assuming storing to formData
      // Also compute Amount based on the Rate and Discounts etc if needed
      
      let netAmount;
      if (state.formData.DiscountType === "P" && state.formData.Rate) {
          netAmount = state.formData.Rate * (1 - (value / 100));
      } else if (state.formData.DiscountType === "A" && state.formData.Rate) {
          netAmount = state.formData.Rate - value;
      } else {
          netAmount = state.formData.Rate;  // Fallback
      }
    
      state.formData.Amount = Math.max(netAmount, 0);  // Ensure non-negative
    },
    
  },
});

export const {
  serviceInformation,
  resetServiceInformation,
  dropDownInformation,
  calculateNetAmount,
} = serviceDetailsSlice.actions;

export default serviceDetailsSlice.reducer;
