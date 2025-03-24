import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    Department: "",
    DepartmentName: "",
    DoctorName: "",
    Doctor: "",
    AppointmentDate: "",
    SlotInformationList: [],
    UpdateSlotInfo: "",
    resetSlotInfo: "",
    DepartmentList: [],
    DoctorList: [],
  },
};

export const appointmentReschedulerSlice = createSlice({
  name: "AppointmentRescheduler",
  initialState,
  reducers: {
    dropDownInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    rescheduleInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetReScheduleInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const {
  dropDownInformation,
  rescheduleInformation,
  resetReScheduleInformation,
} = appointmentReschedulerSlice.actions;

export default appointmentReschedulerSlice.reducer;
