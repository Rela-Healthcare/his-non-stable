import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    docId: "",
    appointmentId: "",
    RefSource: "",
    RefSourceNameIfDoctor: "",
    InternalDoctorID: "",
    ExternalDoctorID: "",
    InternalDoctorName: "",
    ExternalDoctorName: "",
    VisitType: "",
    PatientType: "",
    PatientVisitType: "",
    Remarks: "",
    PayorID: "",
    PayorName: "",
    Department: "",
    DepartmentID: "",
    DepartmentName: "",
    DoctorName: "",
    AppointmentDate: "",
    RefSourceDetails: "",
    SlotInfo: "",
    package: "",
    PatientTypeList: [
      { columnName: "Self", columnCode: "s" },
      { columnName: "Corporate", columnCode: "c" },
      { columnName: "Insurance", columnCode: "i" },
    ],
    VisitTypeList: [
      {
        columnCode: 3,
        columnName: "OPD Consults",
        responseType: "visitType",
      },
      {
        columnCode: 7,
        columnName: "Health Check",
        responseType: "visitType",
      },
      {
        columnCode: 9,
        columnName: "OP Video Consults",
        responseType: "visitType",
      },
      {
        columnCode: 11,
        columnName: "Diagnostics",
        responseType: "visitType",
      },
      {
        columnCode: 12,
        columnName: "Home Collection",
        responseType: "visitType",
      },
      {
        columnCode: 16,
        columnName: "Referral Visit",
        responseType: "visitType",
      },
    ],

    PayorsList: [],
    DepartmentList: [],
    DoctorList: [],
    SlotList: [],
    ReferralSourceList: [],
    InternalDoctorList: [],
    ExternalDoctorList: [],
    ExDoctor: "",
    internalDocId: "",
    externalDocId: "",
    doctorType: "",
    visitInfo: false,
  },
};

export const appointmentVisitSlice = createSlice({
  name: "appointmentVisitSlice",
  initialState,
  reducers: {
    dropDownInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    visitInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetVisitInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const { visitInformation, resetVisitInformation, dropDownInformation } =
  appointmentVisitSlice.actions;

export default appointmentVisitSlice.reducer;
