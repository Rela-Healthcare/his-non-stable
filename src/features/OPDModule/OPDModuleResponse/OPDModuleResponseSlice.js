import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    response: "",
    existingResponse: "",
    serviceOnlyResponse: "",
    webPatientResponse: "",
  },
};

const OPDModuleResponseSlice = createSlice({
  name: "OPDSaveResponse",
  initialState,
  reducers: {
    getResponseInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetResponseInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const { getResponseInformation, resetResponseInformation } =
  OPDModuleResponseSlice.actions;

export default OPDModuleResponseSlice.reducer;
