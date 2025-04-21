import {convertToApiDate} from '../../../../utils/utils';

export function transformToApiPayload(
  currentPayload: Record<string, any>
): Record<string, any> {
  const apiPayload: Record<string, any> = {
    HM_Web_Service_Order: [],
    Web_OPReceipt_Payment_Type: currentPayload.Web_OPReceipt_Payment_Type || [],
  };

  // Convert Discount Type
  const getDiscountTypeCode = (type: string): number => {
    switch ((type || '').toLowerCase()) {
      case 'flat':
        return 1;
      case 'percentage':
        return 0;
      default:
        return 0;
    }
  };

  // Service loop
  Object.keys(currentPayload).forEach((key) => {
    if (!isNaN(Number(key))) {
      const item = currentPayload[key];

      if (!item?.Service) return;

      apiPayload.HM_Web_Service_Order.push({
        Preg_RegistrationId_id: 0,
        Mchr_ChargeId_id: parseInt(item.Service),
        Opbl_Unit_nbr: 1,
        Opbl_Rate_nbr: item.Actual_Amount || 0,
        Opbl_DiscountType_cd: getDiscountTypeCode(item.Discount_Type),
        Opbl_Discount_nbr: parseFloat(item.Discount || '0'),
        Opbl_NetAmt_nbr: item.Amount || 0,
        Prio_PriorityType_Desc: item.Priority === '1' ? 'STAT' : 'ROUTINE',
        Opbl_Remarks_desc: item.Remarks || '',
      });
    }
  });

  const additionalFields = {
    PatientTitle: parseInt(currentPayload.SalutionId || '0'),
    SalutationName: currentPayload.SalutationName || '',
    PatientName: currentPayload.Name || 'Unknown',
    DOB: convertToApiDate(currentPayload.DOB) || '2000-01-01 00:00:00',
    Gender:
      currentPayload.Gender?.length > 0 &&
      currentPayload.Gender?.charAt(0).toUpperCase() === 'Male'
        ? 'M'
        : 'F',
    MaritalStatus: parseInt(currentPayload.Marital_Status || '0'),
    IDtype: parseInt(currentPayload.ID_Type || '0'),
    IDNo: currentPayload.ID_No || '',
    Nationality: parseInt(currentPayload.Nationality || '0'),
    Language: parseInt(currentPayload.Language || '0'),
    Occupation: parseInt(currentPayload.Occupation || '0'),
    MobileNo: currentPayload.Mobile_No || '',
    EmailId: currentPayload.Email_ID || '',
    Address: currentPayload.Address || '',
    StateCode: currentPayload.State || 0,
    CityCode: currentPayload.City || 0,
    CountryCode: currentPayload.Country || 0,
    Pincode: currentPayload.Pincode || '',
    BirthCountry: currentPayload.Country || 0,
    Area: currentPayload.Area || '',
    Pat_Is_symptoms: Boolean(currentPayload.pat_Is_symptoms),
    Pat_Is_historyoffever: Boolean(currentPayload.pat_Is_historyoffever),
    Pat_Is_outofcountry1month: Boolean(
      currentPayload.pat_Is_outofcountry1month
    ),
    Pat_Is_diseaseoutbreak: Boolean(currentPayload.pat_Is_diseaseoutbreak),
    Pat_Is_healthcareworker: Boolean(currentPayload.pat_Is_healthcareworker),
    Pat_Is_disease_last1month: Boolean(
      currentPayload.pat_Is_disease_last1month
    ),
    Pat_Is_chickenpox: Boolean(currentPayload.pat_Is_chickenpox),
    Pat_Is_measles: Boolean(currentPayload.pat_Is_measles),
    Pat_Is_mumps: Boolean(currentPayload.pat_Is_mumps),
    Pat_Is_rubella: Boolean(currentPayload.pat_Is_rubella),
    Pat_Is_diarrheasymptoms: Boolean(currentPayload.pat_Is_diarrheasymptoms),
    Pat_Is_activeTB: Boolean(currentPayload.pat_Is_activeTB),
    Pat_Is_receivewhatsapp: Boolean(currentPayload.pat_Is_receivewhatsapp),
    RelationType: currentPayload.Relation_Type || '',
    RelationName: currentPayload.Relation_Name || '',
    RelationMobileno: currentPayload.Relation_Mobile_No || '',
    UserID: currentPayload.UserId || '',
    prefferedLanguages: parseInt(currentPayload.Language || '0'),
    religion: parseInt(currentPayload.Religion || '0'),
    kin_Address: currentPayload.Kin_Address || '',
    kin_StateCode: currentPayload.Kin_State || 0,
    kin_CityCode: currentPayload.Kin_City || 0,
    kin_CountryCode: currentPayload.Kin_Country || 0,
    kin_Pincode: currentPayload.Kin_Pincode || '',
    kin_Area: currentPayload.Kin_Area || '',
    BloodGroup: parseInt(currentPayload.BloodGroup || '0'),
    DocId: parseInt(currentPayload.Doctor_Name || '0'),
    AppointmentId: 0,
    RefSource: parseInt(currentPayload.Referral_Source || '0'),
    VistType: parseInt(currentPayload.Visit_Type || '0'),
    PatientType: currentPayload.Patient_Type || 'S',
    PayorID: parseInt(currentPayload.Payor_Name || '0'),
    Remarks: '',
    InternalDocId: 0,
    ExternalDocId: 0,
    Opbl_GrossAmount_nbr: currentPayload.Gross_Amount || 0,
    Opbl_DiscAmount_nbr: currentPayload.Final_Discount || 0,
    Opbl_GLAmount_nbr: 0,
    Opbl_PatientResponsibility_desc: 0,
    Opbl_NetAmount_nbr: currentPayload.Total_Amount || 0,
    APPStartDate:
      convertToApiDate(currentPayload.Appointment_Date) ||
      '2023-01-01 00:00:00',
    Package: currentPayload.Package_Details || '',
    AppRemarks: '',
    AppRefSource: currentPayload.Referral_Source || '',
    VISAValidity:
      convertToApiDate('1900-01-01 00:00:00') || '1900-01-01 00:00:00',
  };

  return {
    ...apiPayload,
    ...additionalFields,
  };
}
