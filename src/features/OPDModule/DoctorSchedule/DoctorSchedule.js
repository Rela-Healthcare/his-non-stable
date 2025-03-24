import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    DepartmentList: [],
    DoctorList: [],
    SlotGapList: [
      { columnName: "5", columnCode: "5" },
      { columnName: "10", columnCode: "10" },
      { columnName: "15", columnCode: "15" },
      { columnName: "20", columnCode: "20" },
      { columnName: "30", columnCode: "30" },
      { columnName: "60", columnCode: "30" },
    ],
    Department: "",
    depID: "",
    Doctor: "",
    doctorID: "",
    AppointmentStartTime: "",
    AppointmentEndTime: "",
    AppointmentStartDate: "",
    AppointmentEndDate: "",
    SlotInfo: "",
  },
};

const doctorScheduleSlice = createSlice({
  name: "Doctor Schedule",
  initialState,
  reducers: {
    dropdownInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    scheduleInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const { dropdownInformation, scheduleInformation, resetInformation } =
  doctorScheduleSlice.actions;

export default doctorScheduleSlice.reducer;
