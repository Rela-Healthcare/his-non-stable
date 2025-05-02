import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import loginReducer from '../features/Login/LoginSlice';
import patientCreationReducer from '../features/OPDModule/PatientCreation/PatientCreationSlice';
import appointmentVisitReducer from '../features/OPDModule/AppointmentSchedule/AppointmentScheduleSlice';
import serviceCreationReducer from '../features/OPDModule/ServiceDetails/ServiceDetailsSlice';
import serviceCartReducer from '../features/OPDModule/ServiceList/ServiceListSlice';
import paymentReducer from '../features/OPDModule/Payment/PaymentSlice';
import opdResponseReducer from '../features/OPDModule/OPDModuleResponse/OPDModuleResponseSlice';
//Edit Patient
import updatePatientReducer from '../features/OPDModule/PatientUpdation/PatientUpdation';
//Appointment Scheduling
import appointmentScheduleReducer from '../features/Appointments/AppointmentScheduleForCallCenter/AppointmentScheduleForCallCenter';
//DoctorScheduling
import doctorScheduleReducer from '../features/OPDModule/DoctorSchedule/DoctorSchedule';
//Rescheduler
import reSchedulerReducer from '../features/Appointments/AppointmentRescheduler/AppointmentRescheduler';

//opdashboard
import opdashBoardReducer from '../features/OPDModule/OPDashBoard/OPDashBoard';
//naming convection not needed for the exported reducer Function.

import depositReducer from '../features/OPDModule/DepositAllocation/DepositSlice';

//dropdown
import dropdownReducer from './Slices/dropdownSlice';
import opServiceReducer from './Slices/OPModule/Service/opServiceSlice';

//MomentPay
import momentPayReducer from './Slices/momentPay/momentPaySlice';

export const store = configureStore({
  reducer: {
    loginInfo: loginReducer,
    patientCreation: patientCreationReducer,
    appointmentVisitSchedule: appointmentVisitReducer,
    serviceCreation: serviceCreationReducer,
    serviceCart: serviceCartReducer,
    paymentInfo: paymentReducer,
    opdResponseInfo: opdResponseReducer,
    updatePatientInfo: updatePatientReducer,
    appointmentScheduler: appointmentScheduleReducer,
    doctorScheduler: doctorScheduleReducer,
    reScheduler: reSchedulerReducer,
    opdashBoard: opdashBoardReducer,
    depositInfo: depositReducer,
    dropdown: dropdownReducer,
    opService: opServiceReducer,
    momentPay: momentPayReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.instance'],
        // Ignore these paths in the state
        ignoredPaths: ['momentPay.instance'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
