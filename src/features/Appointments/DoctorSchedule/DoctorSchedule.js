import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    Department: "",
    DepartmentName: "",
    Doctor: "",
    DoctorName: "",
    SlotGap: "",
    StartDate: "",
    EndDate: "",
    BreakStartTime: "",
    BreakEndTime: "",
    DepartmentList: [],
    DoctorList: [],
    SlotList: [
      { columnName: "5", columnCode: "5" },
      { columnName: "10", columnCode: "10" },
      { columnName: "15", columnCode: "15" },
      { columnName: "20", columnCode: "20" },
      { columnName: "30", columnCode: "30" },
      { columnName: "60", columnCode: "30" },
    ],
  },
};

export const doctorScheduleSlice = createSlice({
  name: "DoctorSchedule",
  initialState,
  reducers: {
    dropDownInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    scheduleInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetScheduleInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const {
  dropDownInformation,
  scheduleInformation,
  resetScheduleInformation,
} = doctorScheduleSlice.actions;

export default doctorScheduleSlice.reducer;
