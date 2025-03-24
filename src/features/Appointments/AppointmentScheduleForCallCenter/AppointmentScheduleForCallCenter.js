import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    DeptName: "",
    Dept: "",
    DocName: "",
    DocId: "",
    AppointmentDate: "",
    SlotInfo: "",
    appointmentStartTime: "",
    appointmentEndTime: "",
    UHID: "",
    mobileNo: "",
    DepartmentList: [],
    DoctorList: [],
    SlotList: [],
  },
};

export const appointmentScheduleSlice = createSlice({
  name: "Appointment Schedule",
  initialState,
  reducers: {
    dropDownInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    appointmentScheduler: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetAppointmentInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const {
  dropDownInformation,
  appointmentScheduler,
  resetAppointmentInformation,
} = appointmentScheduleSlice.actions;
export default appointmentScheduleSlice.reducer;
