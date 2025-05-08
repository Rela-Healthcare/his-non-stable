// patientFormConstants.js
export const PATIENT_FORM_OPTIONS = {
  GENDERS: ['Male', 'Female', 'Other'],
  SPECIAL_ASSISTANCE_TYPES: ['Wheelchair', 'Interpreter', 'Guide', 'Other'],
};

export const initialPersonalDetails = {
  SalutionId: '',
  SalutationName: '',
  Name: '',
  DOB: '',
  Age: '',
  Gender: '',
  Nationality: '',
  ID_Type: '',
  ID_No: '',
  Marital_Status: '',
  Mobile_No: '',
  Email_ID: '',
  Occupation: '',
};

export const initialAdditionalDetails = {
  Pincode: '',
  Country: '',
  State: '',
  City: '',
  countryName: '',
  stateName: '',
  cityName: '',
  Area: '',
  Address: '',
  Religion: '',
  Language: '',
  BloodGroup: '',
  Special_Assistance: '',
  Select_Special_Assistance: '',
  Spl_Assist_Remarks: '',
  Update_Death_Date: '',
};

export const initialNextOfKinDetails = {
  Relation_Type: '',
  Relation_Name: '',
  Relation_Mobile_No: '',
  Kin_Pincode: '',
  Kin_Country: '',
  Kin_State: '',
  Kin_City: '',
  Kin_Area: '',
  Kin_Address: '',
  countryName: '',
  stateName: '',
  cityName: '',
};

export const initialEvaluationDetails = {
  pat_Is_symptoms: null, // boolean value true or false
  pat_Is_historyoffever: null, // boolean value true or false
  pat_Is_outofcountry1month: null, // boolean value true or false
  pat_Is_diseaseoutbreak: null, // boolean value true or false
  pat_Is_healthcareworker: null, // boolean value true or false
  pat_Is_disease_last1month: null, // boolean value true or false
  pat_Is_diarrheasymptoms: null, // boolean value true or false
  pat_Is_activeTB: null, // boolean value true or false
  pat_Is_chickenpox: null, // boolean value true or false
  pat_Is_measles: null, // boolean value true or false
  pat_Is_mumps: null, // boolean value true or false
  pat_Is_rubella: null, // boolean value true or false
};

export const initialAppointmentDetails = {
  Department_Name: '',
  Doctor_Name: '',
  Visit_Type: '',
  Appointment_Date: '',
  Sequence_No: '',
  Patient_Type: '',
  Payor_Name: '',
  Referral_Source: '',
  Doctor_Type: '',
  Internal_Doctor_Name: '',
  External_Doctor_Name: '',
  Staff_Employee_ID: '',
  Package_Details: '',
  Modified_Id: '',
  VIP_Txt: '',
  Cor_Company_name: '',
  Cor_Employee_Id: '',
  Cor_Relationship: '',
};

export const REFERRAL = {
  STAFF: 76,
  DOCTOR: 58,
  CORPORATE: 56,
  VIP: 77,
};

export const emptyOPService = {
  Service_Group: '',
  Service: '',
  ServiceName: '',
  Priority: '',
  Discount_Type: '',
  Discount: '',
  Discount_Reason: '',
  Actual_Amount: 0,
  Amount: 0,
  Remarks: '',
  servicesListResponse: [],
  totalAmount: 0,
  saved: false,
};
export const initialServiceDetails = {
  UserId: '',
  OP_Master: [{...emptyOPService}],
};

export const initialPaymentDetails = {
  Web_OPReceipt_Payment_Type: [
    {
      PayType: 'R',
      amount: 0,
      CardNo: '',
    },
  ],
  Id: null,
  Gross_Amount: 0,
  Final_Discount: 0,
  Total_Amount: 0,
  Coupon_Balance: 0,
  Apply_Coupon: false,
  Net_Payable_Amount: 0,
  UserId: '',
};
