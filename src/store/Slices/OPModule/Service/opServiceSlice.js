import {createSlice} from '@reduxjs/toolkit';
import {emptyOPService} from '../../../../Components/OPDModule/NewPatient/PatientCreation/patientFormConstants';

const initialState = {
  UserId: '',
  OP_Master: [{...emptyOPService}],
};

const opServiceSlice = createSlice({
  name: 'opService',
  initialState,
  reducers: {
    // Add a new service to the OP_Master
    addService: (state) => {
      state.OP_Master.push({...emptyOPService});
    },
    // Update a service in OP_Master by index
    updateService: (state, action) => {
      const {index, newData} = action.payload;
      state.OP_Master[index] = {...state.OP_Master[index], ...newData};
    },
    // Remove a service from OP_Master by index
    removeService: (state, action) => {
      const {index} = action.payload;
      state.OP_Master.splice(index, 1);
    },
    // Reset the OP_Master to the initial state
    resetServices: (state) => {
      state.OP_Master = [{...emptyOPService}];
    },
    // Set the UserId for the OP Service
    setUserId: (state, action) => {
      state.UserId = action.payload;
    },
  },
});

export const {
  addService,
  updateService,
  removeService,
  resetServices,
  setUserId,
} = opServiceSlice.actions;

export default opServiceSlice.reducer;
