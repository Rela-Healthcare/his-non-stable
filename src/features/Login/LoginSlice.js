import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    userName: "",
    password: "",
    department: "",
    hospitalName: "",
    authenticatedMsg: 0,
    validEntry: false,
  },
};

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState,
  reducers: {
    loginInformation: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },

    resetLoginInformation: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const { loginInformation, resetLoginInformation } = loginSlice.actions;

export default loginSlice.reducer;
