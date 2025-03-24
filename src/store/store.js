import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/Login/LoginSlice";
import patientCreationReducer from "../features/OPDModule/PatientCreation/PatientCreationSlice";
import appointmentVisitReducer from "../features/OPDModule/AppointmentSchedule/AppointmentScheduleSlice";
import serviceCreationReducer from "../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import serviceCartReducer from "../features/OPDModule/ServiceList/ServiceListSlice";
import paymentReducer from "../features/OPDModule/Payment/PaymentSlice";
import opdResponseReducer from "../features/OPDModule/OPDModuleResponse/OPDModuleResponseSlice";
//Edit Patient
import updatePatientReducer from "../features/OPDModule/PatientUpdation/PatientUpdation";
//Appointment Scheduling
import appointmentScheduleReducer from "../features/Appointments/AppointmentScheduleForCallCenter/AppointmentScheduleForCallCenter";
//DoctorScheduling
import doctorScheduleReducer from "../features/OPDModule/DoctorSchedule/DoctorSchedule";
//Rescheduler
import reSchedulerReducer from "../features/Appointments/AppointmentRescheduler/AppointmentRescheduler";

//opdashboard
import opdashBoardReducer from "../features/OPDModule/OPDashBoard/OPDashBoard";
//naming convection not needed for the exported reducer Function.

import depositReducer from "../features/OPDModule/DepositAllocation/DepositSlice";

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
  },
});
