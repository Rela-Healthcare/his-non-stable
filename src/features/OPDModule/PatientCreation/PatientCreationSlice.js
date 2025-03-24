// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   formData: {
//     patientTitle: "",
//     SalutationName: "",
//     PatientName: "",
//     DOB: "",
//     Gender: "",
//     Age: "",
//     MaritalStatus: "",
//     IDtype: "",
//     IDNo: "",
//     Nationality: "",
//     NationalityName: "",
//     Language: "",
//     LanguageName: "",
//     Occupation: "",
//     OccupationName: "",
//     MobileNo: "",
//     EmailId: "",
//     StateCode: "",
//     State: "",
//     CityCode: "",
//     City: "",
//     CountryCode: "",
//     Country: "",
//     Pincode: "",
//     BloodGroup: "",
//     birthCountry: "",
//     mob_CountryCode: "",
//     altMob_CountryCode: "",
//     altMobileNo: "",
//     currAddress: "",
//     permAddress: "",
//     Address: "",
//     AreaCode: "",
//     Area: "",
//     kinArea: "",
//     specialAssistanceNeeded: "",
//     specialAssistanceDetailsIfYes: "",
//     specialAssistanceDetailsIfOthers: "",
//     pat_Is_symptoms: "",
//     pat_Is_historyoffever: "",
//     pat_Is_outofcountry1month: "",
//     pat_Is_diseaseoutbreak: "",
//     pat_Is_healthcareworker: "",
//     pat_Is_disease_last1month: "",
//     pat_Is_chickenpox: "",
//     pat_Is_measles: "",
//     pat_Is_mumps: "",
//     pat_Is_rubella: "",
//     pat_Is_diarrheasymptoms: "",
//     pat_Is_activeTB: "",
//     pat_Is_receivewhatsapp: "",
//     RelationTypeCode: "",
//     RelationType: "",
//     RelationName: "",
//     RelationMobileNo: "",
//     prefferedLanguages: "",
//     religion: "",
//     kinAddress: "",
//     kin_StateCode: "",
//     kin_CityCode: "",
//     kin_CountryCode: "",
//     kin_Pincode: "",
//     kin_AreaCode: "",
//     cityList: [],
//     kin_cityList: [],
//     areaList: [],
//     kin_areaList: [],
//     kinState: "",
//     kinCity: "",
//     kinCountry: "",
//     salutationList: [],
  
//     genderList: {
//       8: ["M", "F"],
//       11: ["M"],
//       12: ["F", "T"],
//       19: ["F", "M"],
//       21: ["F"],
//       22: ["M"],
//       23:"M",
//       25: ["M"],
//     },

//     departmentList: [],
//     idTypeList: [],
//     langList: [],
//     countryList: [],
//     religionList: [],
//     relationList: [],
//     occupationList: [],
//     nationalityList: [],
//     maritalStatusList: [],
//     mobileCodeList: [],
//     stateList: [],
//     bloodGroupList: [],
//     occRemark: "",
//     maritalStatusName: "",
//     takeContact: "",
//     patientInfo: false,
//     additionalInfo: false,
//     kinInfo: false,
//     evaluationInfo: false,
//   },
// };
// export const patientCreationSlice = createSlice({
//   name: "patientCreation",
//   initialState,
//   reducers: {
//     dropDownInformation: (state, action) => {
//       const { name, value } = action.payload;
//       state.formData[name] = value;
//     },
//     patientInformation: (state, action) => {
//       const { name, value } = action.payload;
//       state.formData[name] = value;
//     },
//     resetInformation: (state) => {
//       state.formData = initialState.formData;
//     },
//     validateInformation: (state, action) => {
//       const { name, value } = action.payload;
//       state.formData[name] = value;
//     },
//   },
// });

// //Action creators => for each case reducer functions!.

// export const {
//   patientInformation,
//   resetInformation,
//   dropDownInformation,
//   validateInformation,
// } = patientCreationSlice.actions;

// export default patientCreationSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    patientTitle: "",
    SalutationName: "",
    PatientName: "",
    DOB: "",
    Gender: "",
    Age: "",
    MaritalStatus: "",
    IDtype: "",
    IDNo: "",
    Nationality: "",
    NationalityName: "",
    Language: "",
    LanguageName: "",
    Occupation: "",
    OccupationName: "",
    MobileNo: "",
    EmailId: "",
    StateCode: "",
    State: "",
    CityCode: "",
    City: "",
    CountryCode: "",
    Country: "",
    Pincode: "",
    BloodGroup: "",
    birthCountry: "",
    mob_CountryCode: "",
    altMob_CountryCode: "",
    altMobileNo: "",
    currAddress: "",
    permAddress: "",
    Address: "",
    AreaCode: "",
    Area: "",
    kinArea: "",
    specialAssistanceNeeded: "",
    specialAssistanceDetailsIfYes: "",
    specialAssistanceDetailsIfOthers: "",
    pat_Is_symptoms: "",
    pat_Is_historyoffever: "",
    pat_Is_outofcountry1month: "",
    pat_Is_diseaseoutbreak: "",
    pat_Is_healthcareworker: "",
    pat_Is_disease_last1month: "",
    pat_Is_chickenpox: "",
    pat_Is_measles: "",
    pat_Is_mumps: "",
    pat_Is_rubella: "",
    pat_Is_diarrheasymptoms: "",
    pat_Is_activeTB: "",
    pat_Is_receivewhatsapp: "",
    RelationTypeCode: "",
    RelationType: "",
    RelationName: "",
    RelationMobileNo: "",
    prefferedLanguages: "",
    religion: "",
    kinAddress: "",
    kin_StateCode: "",
    kin_CityCode: "",
    kin_CountryCode: "",
    kin_Pincode: "",
    kin_AreaCode: "",
    cityList: [],
    kin_cityList: [],
    areaList: [],
    kin_areaList: [],
    kinState: "",
    kinCity: "",
    kinCountry: "",
    salutationList: [],
    genderList: {
      8: ["M", "F"],
      11: ["M"],
      12: ["F", "T"],
      19: ["F", "M"],
      21: ["F"],
      22: ["M"],
      23: "M",
      25: ["M"],
    },
    departmentList: [],
    idTypeList: [],
    langList: [],
    countryList: [],
    religionList: [],
    relationList: [],
    occupationList: [],
    nationalityList: [],
    maritalStatusList: [],
    mobileCodeList: [],
    stateList: [],
    bloodGroupList: [],
    occRemark: "",
    maritalStatusName: "",
    takeContact: "",
    patientInfo: false,
    additionalInfo: false,
    kinInfo: false,
    evaluationInfo: false,
  },
};

export const patientCreationSlice = createSlice({
  name: "patientCreation",
  initialState,
  reducers: {
    dropDownInformation: (state, action) => {
      const { name, value } = action.payload;
      if (Array.isArray(state.formData[name])) {
        state.formData[name] = [...state.formData[name], ...value]; // Append values
      } else {
        state.formData[name] = value; // Normal assignment
      }
    },
    patientInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetInformation: (state) => {
      state.formData = { ...initialState.formData };
    },
    validateInformation: (state, action) => {
      const { name, value } = action.payload;
      if (typeof state.formData[name] === "boolean") {
        state.formData[name] = Boolean(value);
      }
    },
  },
});

// Exporting actions
export const {
  patientInformation,
  resetInformation,
  dropDownInformation,
  validateInformation,
} = patientCreationSlice.actions;

export default patientCreationSlice.reducer;
