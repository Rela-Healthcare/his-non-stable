export function transformApiToFormState(apiData: any, initialFormStates: any) {
  if (!apiData) return initialFormStates;
  const apiRecord = Array.isArray(apiData) ? apiData[0] : apiData;

  const result = {
    initialPersonalDetails: {
      ...initialFormStates.initialPersonalDetails,
      SalutionId: apiRecord.salutation || '',
      Name: apiRecord.patient_Name || '',
      DOB: apiRecord.dob || '',
      Age: apiRecord.age || '',
      Gender: apiRecord.gender || '',
      Nationality: apiRecord.nationality || '',
      ID_Type: apiRecord.iD_Type || '',
      ID_No: apiRecord.iD_No || '',
      Marital_Status: apiRecord.marital_Status || '',
      Mobile_No: apiRecord.mobile_No || '',
      Email_ID: apiRecord.email_ID || '',
      Occupation: apiRecord.occupation || '',
      ID: apiRecord.id || '',
    },
    initialAdditionalDetails: {
      ...initialFormStates.initialAdditionalDetails,
      Pincode: apiRecord.pincode || '',
      Country: apiRecord.country || '',
      State: apiRecord.state_id || '',
      City: apiRecord.city || '',
      Area: apiRecord.area || '',
      Address: apiRecord.address_txt || '',
      Religion: apiRecord.religion || '',
      Language: apiRecord.language_id || '',
      BloodGroup: apiRecord.bloodGroup || '',
      Special_Assistance: apiRecord.special_Assistance === '1' || false,
      Select_Special_Assistance: apiRecord.select_Special_Assistance || '',
      Spl_Assist_Remarks: apiRecord.spl_Assist_Remarks || '',
    },
    initialNextOfKinDetails: {
      ...initialFormStates.initialNextOfKinDetails,
      Relation_Type: apiRecord.relation_Type || '',
      Relation_Name: apiRecord.relation_Name || '',
      Relation_Mobile_No: apiRecord.relation_Mobile_No || '',
      Kin_Pincode: apiRecord.kin_Pincode || '',
      Kin_Country: apiRecord.kin_Country || '',
      Kin_State: apiRecord.kin_State || '',
      Kin_City: apiRecord.kin_City || '',
      Kin_Area: apiRecord.kin_Area || '',
      Kin_Address: apiRecord.kin_Address || '',
    },
    initialEvaluationDetails: {
      ...initialFormStates.initialEvaluationDetails,
      pat_Is_symptoms:
        apiRecord.pat_Is_symptoms === 1 || apiRecord.pat_Is_symptoms === true,
      pat_Is_historyoffever:
        apiRecord.pat_Is_historyoffever === 1 ||
        apiRecord.pat_Is_historyoffever === true,
      pat_Is_outofcountry1month:
        apiRecord.pat_Is_outofcountry1month === 1 ||
        apiRecord.pat_Is_outofcountry1month === true,
      pat_Is_diseaseoutbreak:
        apiRecord.pat_Is_diseaseoutbreak === 1 ||
        apiRecord.pat_Is_diseaseoutbreak === true,
      pat_Is_healthcareworker:
        apiRecord.pat_Is_healthcareworker === 1 ||
        apiRecord.pat_Is_healthcareworker === true,
      pat_Is_disease_last1month:
        apiRecord.pat_Is_disease_last1month === 1 ||
        apiRecord.pat_Is_disease_last1month === true,
      pat_Is_chickenpox:
        apiRecord.pat_Is_chickenpox === 1 ||
        apiRecord.pat_Is_chickenpox === true,
      pat_Is_measles:
        apiRecord.pat_Is_measles === 1 || apiRecord.pat_Is_measles === true,
      pat_Is_mumps:
        apiRecord.pat_Is_mumps === 1 || apiRecord.pat_Is_mumps === true,
      pat_Is_rubella:
        apiRecord.pat_Is_rubella === 1 || apiRecord.pat_Is_rubella === true,
      pat_Is_diarrheasymptoms:
        apiRecord.pat_Is_diarrheasymptoms === 1 ||
        apiRecord.pat_Is_diarrheasymptoms === true,
      pat_Is_activeTB:
        apiRecord.pat_Is_activeTB === 1 || apiRecord.pat_Is_activeTB === true,
    },
    initialAppointmentDetails: {
      ...initialFormStates.initialAppointmentDetails,
      Department_Name: apiRecord.department_Name || '',
      Doctor_Name: apiRecord.doctor_Name || '',
      Visit_Type: apiRecord.visit_Type || '',
      Appointment_Date: apiRecord.appointment_Date || '',
      Sequence_No: apiRecord.sequence_No || '',
      Patient_Type: apiRecord.patient_Type || '',
      Payor_Name: apiRecord.payor_Name || '',
      Referral_Source: apiRecord.referral_Source || '',
      Doctor_Type: apiRecord.doctor_Type || '',
      Internal_Doctor_Name: apiRecord.internal_Doctor_Name || '',
      External_Doctor_Name: apiRecord.external_Doctor_Name || '',
      Staff_Employee_ID: apiRecord.staff_Employee_ID || '',
      Package_Details: apiRecord.package_Details || '',
      Modified_Id: apiRecord.modified_id || '',
      VIP_Txt: apiRecord.viP_Txt || '',
      Cor_Company_name: apiRecord.cor_Company_name || '',
      Cor_Employee_Id: apiRecord.cor_Employee_Id || '',
      Cor_Relationship: apiRecord.cor_Relationship || '',
    },
    initialPaymentDetails: {
      ...initialFormStates.initialPaymentDetails,
      Web_OPReceipt_Payment_Type:
        apiRecord.paymentlist?.map((payment: any) => ({
          PayType: payment.payment_Mode || '',
          amount: payment.net_Payable_Amount || 0,
          CardNo: payment.cardNo || '',
        })) || [],
      Id: apiRecord.id || null,
      Gross_Amount: apiRecord.gross_Amount || 0,
      Final_Discount: apiRecord.final_Discount || 0,
      Total_Amount: apiRecord.total_Amount || 0,
      Coupon_Balance: apiRecord.coupon_Balance || 0,
      Apply_Coupon: apiRecord.apply_Coupon || false,
      Net_Payable_Amount: apiRecord.total_Amount || 0,
      UserId: apiRecord.created_id || '',
    },
    initialServiceDetails: {
      ...initialFormStates.initialServiceDetails,
      UserId: apiRecord.created_id || '',
      OP_Master:
        apiRecord.servicelist?.map((service: any) => ({
          ...initialFormStates.initialServiceDetails.OP_Master[0],
          ID: service.id || 0,
          Service_Group: service.service_Group || '',
          Service: service.service || '',
          Priority: service.priority || '',
          Rate: service.rate || 0,
          Discount: service.discount || 0,
          Amount: service.amount || 0,
          Amount_Ttl: service.amount_Ttl || 0,
          Remarks: service.remarks || '',
          Discount_Reason: service.discount_Reason || '',
        })) || [],
    },
  };

  return result;
}

// Helper function to convert salutation ID to name
function salutationIdToName(salutationId: string): string {
  const salutations: Record<string, string> = {
    '11': 'Mr.',
    '12': 'Mrs.',
    '21': 'Master',
    '22': 'Miss',
    '31': 'Dr.',
    '32': 'Prof.',
  };
  return salutations[salutationId] || '';
}

// Helper function to calculate age from DOB
function calculateAge(dob: string): string {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
}
