// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   formData: {
//     existingPatientDetails: [],
//     existingPatientData: "",
//     SalutationName: "",
//   },
// };

// export const patientUpdationSlice = createSlice({
//   name: "PatientUpdation",
//   initialState,
//   reducers: {
//     patientFetching: (state, action) => {
//       const { name, value } = action.payload;
//       state.formData[name].push(value);
//     },
//     patientUpdating: (state, action) => {
//       const { name, value } = action.payload;
//       state.formData[name] = value;
//     },
//     resetPatientInfo: (state, action) => {
//       state.formData = initialState.formData;
//     },
//   },
// });

// export const { patientFetching, patientUpdating, resetPatientInfo } =
//   patientUpdationSlice.actions;

// export default patientUpdationSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  formData: {
    existingPatientDetails: [],
    existingPatientData: "",
    SalutationName: "",
    patientInfo: false,
    additionalInfo: false,
    kinInfo: false,
    evaluationInfo: false,
  },
};

export const patientUpdationSlice = createSlice({
  name: "PatientUpdation",
  initialState,
  reducers: {
    patientFetching: (state, action) => {
      const { name, value } = action.payload;
      if (!Array.isArray(state.formData[name])) {
        state.formData[name] = [];
      }
      state.formData[name].push(value);
    },
    patientUpdating: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetPatientInfo: (state) => {
      state.formData = { ...initialState.formData };
    },
 
  }
});

export const { patientFetching, patientUpdating, resetPatientInfo,  } =
  patientUpdationSlice.actions;

export default patientUpdationSlice.reducer;

