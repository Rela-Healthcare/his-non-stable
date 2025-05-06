import requests from '../api/requestHelper';

export const OPModuleAgent = {
  //Login
  hislogin: (loginpayload) => requests.post(`getHISLogin`, loginpayload),

  //PriceList
  getpackagePriceList: () => requests.get(`PackagePriceList`),
  getservicePriceList: () =>
    requests.get(`ServicePriceList?NationalityCode=${0}`),

  //Logs
  getSMSapplog: (Fdate, tdate) =>
    requests.get(`Get_SMSLogDetails?Fdate=${Fdate}&tDate=${tdate}`),

  getwhatsapplog: (fromDate, toDate) =>
    requests.get(`Get_WhatsappLog?Fdate=${fromDate}&tDate=${toDate}`),
  getpaymentlog: (fromDate, toDate) =>
    requests.get(`Get_PaymentLog?fromDate=${fromDate}&toDate=${toDate}`),

  // New functions using the second baseURL
  getAppointmentSearch: (fromDate, toDate) =>
    requests.get(
      `GetAppointmentPatientSearch?FromDate=${fromDate}&ToDate=${toDate}`
    ),

  getDepositReport: (fromDate, toDate, uhid) =>
    requests.get(
      `GetDepositreports?FromDate=${fromDate}&ToDate=${toDate}&Uhid=${uhid}`
    ),

  getCreditNoteReport: (fromDate, toDate) =>
    requests.get(`GetCreditNoteReport?FromDate=${fromDate}&ToDate=${toDate}`),

  getRegistrationReport: (fromDate, toDate) =>
    requests.get(
      `GetRegistrationReport?FromDate=${fromDate}&ToDate=${toDate}&PatientType=${0}&NationalityId=${0}&VisitType=${0}`
    ),

  getInvoice: (fromDate, toDate) =>
    requests.get(`GetInvoice?FromDate=${fromDate}&ToDate=${toDate}`),

  getCashCollectionReport: (fromDate, toDate) =>
    requests.get(
      `GetCashCollectionreport?FromDate=${fromDate}&ToDate=${toDate}&InstutionId=${1}`
    ),

  getConcessionReport: (fromDate, toDate) =>
    requests.get(
      `Get_Concession_report?FromDate=${fromDate}&ToDate=${toDate}&BillType=${0}`
    ),

  getBillCancellationReport: (fromDate, toDate) =>
    requests.get(`Get_Bill_cancellation?FromDate=${fromDate}&ToDate=${toDate}`),

  //

  getSalutations: () => requests.get('salutations'),

  getMobileCodeList: () => requests.get('mobileCode'),

  getMaritalStatusList: () => requests.get('maritalStatus'),

  getOccupationList: () => requests.get('occupationData'),

  getNationalityList: () => requests.get('nationality'),

  getIdTypeList: () => requests.get('idType'),

  getRelationTypeList: () => requests.get('get_Web_Relationship'),

  getBloodGroupList: () => requests.get('MasterBloodGroup'),

  getReligionList: () => requests.get('Get_MasReligion_Data'),

  getLanguageList: () => requests.get('Get_MasLang_Data'),

  getCountriesList: () => requests.get('countries'),

  getStateList: () => requests.get('state'),

  getCityStateCountryListByPinCode: (pinCode) =>
    requests.post('GetDatabyPinCode', {
      PinCode: pinCode,
      StateCode: 0,
      CountryCode: 0,
    }),

  getAreaListByPincode: (pinCode) => requests.get(`area?pinCode=${pinCode}`),

  //2. Visit Creation endpoints

  getDepartmentMaster: () => requests.get('Get_Department_Mst'),

  getDepartments: () => requests.get('departments'),

  getRefSrcList: () => requests.get('get_Ref_Source'),

  getInternalDoctorList: () => requests.get('get_Web_DoctorData'),
  getExternalDoctorList: () => requests.get('Get_ExternalDoc_Data'),

  //get details with query params attached url
  getDoctorListByDepartment: (departmentId) =>
    requests.get(`departmentWiseDoctor?DepID=${departmentId}`),

  //appointment masterupdatedetailslot

  getMasterSlot: () => requests.get('GetAppMasterSlot', true),
  getDetailSlot: () => requests.get('GetAppDetailSlot', true),

  deleteDetailslotDatewise: (deletePayload) =>
    requests.delete(`Delete_AppDetailSlotDateWise`, deletePayload, true),

  updatedetailslot: (updatedPayload) =>
    requests.put(`UpdateTimeDetailtbl_v1`, updatedPayload, true),

  GetDoctorseqSlotGap: (DoctorId) =>
    requests.get(`Get_DoctorseqSlotGap?DoctorId=${DoctorId}`, true),

  GetUpdateTime: (sessionId) =>
    requests.get(`GetUpdateTime?SessionId=${sessionId}`),

  // SaveAppointmentHeader: (HeaderDetail) =>
  //  requests.post(`Slot_New_Hdr`, HeaderDetail),

  SaveMasterHeader: (AppointmentHeader) =>
    requests.post(`SaveAppMasterSlot`, AppointmentHeader, true),

  SaveAppointmentMaster: (masterDetail) =>
    requests.post(`Save_AppDetail_new`, masterDetail, true),

  SlotBlockingandUnblocking: (BlockandUnblockPayload) =>
    requests.post(`SlotBlockandUnblock`, BlockandUnblockPayload, true),

  // SaveAppointmentMaster: (masterDetail) =>
  //   requests.post(`Slot_New_Dtl`, masterDetail),

  AvailableSlotConsultant: (DoctorId, fromDate, toDate) =>
    requests.get(
      `AvailableConsultantSlot?DoctorId=${DoctorId}&FromDate=${fromDate}&ToDate=${toDate}`,
      true
    ),

  //appointment master end

  // getAppointmentDetails: (date, docId) =>
  //   requests.get(`AppAvailableSlotTimeDtl?APPDate=${date}&ConsId=${docId}&Slottype=0`),

  getAppointmentDetails: (appointmentpayload) =>
    requests.post(`AvailableSlot_ampm_seq`, appointmentpayload),

  getPayorsList: (payors) =>
    requests.get(`GetInsurance_Corporate?PanelType=${payors}`),

  //3. Service Ceration Endpoints
  getServiceGroupList: () => requests.get('get_services'),
  getOccupationData: () => requests.get('OccupationData'),
  getPriorityList: () => requests.get('get_priority'),
  getServicesList: (serviceGroupCode) =>
    requests.get(`Get_ChargeMaster_v1?Code=${serviceGroupCode}`),
  getPackageList: () => requests.get(`Get_Packages_Dtl`),

  //Save OPD Visit, Patient Creation, Service Addition Endpoints
  saveOPDModule: (payload) => requests.post('Insert_OPDMaster_Porc', payload),
  getTemporaryOPDPatient: (UserId) =>
    requests.get(`Get_NewReg_dtl?UserId=${UserId}`),
  createTemporaryOPDPatient: (payload) =>
    requests.post('Insert_NewPatient_Registration', payload),
  updateTemporaryOPDPersonalDetails: (payload) =>
    requests.put('Update_NewPatient_Registration', payload),
  updateTempOPDPatientAdditionalDetails: (payload) =>
    requests.put('Update_NewRegistration', payload),
  updateTempOPDPatientKinDetails: (payload) =>
    requests.put('Update_NewRegistration_Kin', payload),
  updateTempOPDPatientEvaluation: (payload) =>
    requests.put('Update_NewRegistration_Evaluation', payload),
  updateTempOPDPatientAppointment: (payload) =>
    requests.put('Update_NewRegistration_appt', payload),
  insertServiceInvioice: (payload) =>
    requests.post('Insert_New_Invoice', payload),
  insertPaymentInformation: (payload) =>
    requests.post('Payment_Information_Dtl', payload),

  //Insert_ExsistsOPDMaster_Porc
  saveExistingOPDModule: (existingPayload) =>
    requests.post('Insert_ExsistsOPDMaster_Porc', existingPayload, true),

  getExistingPatientDetails: (searchInput) =>
    requests.get(`web_PatientDtl?Type=op&search=${searchInput}`),

  getExistingPatientByPatientId: (patientId) =>
    requests.get(`Get_ExisPat_Detail?patientid=${patientId}`),

  saveAppointmentWithVisitExistingPatient: (saveInformation) =>
    requests.post(`VisitWithAppointment`, saveInformation),

  //serviceDatawithWithPaymentInfo
  saveServiceDataWithPaymentInfo: (saveInformation) =>
    requests.post(`Web_OPBill_Receipt`, saveInformation),

  getOutPatientLists: (searchInput) =>
    requests.get(`opList?Type=op&search=${searchInput}`),

  getOutPatientList: (searchInput, fromDate, toDate) =>
    requests.get(
      `getInvoice_Reprint_List?FromDate=${fromDate}&ToDate=${toDate}&type=op&search=${searchInput}`
    ),

  getAppointmentPatientsearchDetails: (fromDate, toDate) =>
    requests.get(
      `GetAppointmentPatientSearch?FromDate=${fromDate}&ToDate=${toDate}`
    ),

  //Depaosit Dashboard
  getDepositDetailsList: (fromDate, toDate) =>
    requests.get(
      `Get_Web_DepositeDtl_Reprint?FromDate=${fromDate}&ToDate=${toDate}&Uhid=${0}`,
      true
    ),

  //Test API  refund
  getrefundDetailsList: (Uhid) =>
    requests.get(`Get_RefundReport?&Uhid=${Uhid}`, true),

  //Live  API   (Refund)
  getRefundReport: (fromDate, toDate) =>
    requests.get(`GetRefundReport?FromDate=${fromDate}&ToDate=${toDate}`),

  // DepositCancel
  SaveDepositCancellation: (DepositCancellation) =>
    requests.post(`Save_DepositCancellation`, DepositCancellation, true),

  // refundCancel
  SaveRefundCancellation: (RefundCancellation) =>
    requests.post(`Save_RefundCancellation`, RefundCancellation, true),

  // Type_change
  SaveDepositType_Change: (DepositType_Change) =>
    requests.post(`Save_DepositType_Change`, DepositType_Change, true),

  //Save refund
  SaveRefund: (SaveRefund) => requests.post(`Save_Refund`, SaveRefund, true),

  //Mobiledeposit
  SaveMobileDeposit: (Save_MobileDeposit) =>
    requests.post(`Save_MobileDeposit`, Save_MobileDeposit, true),

  //Deposit
  saveDepositInfo: (saveInfo) => requests.post(`Deposit_Dep`, saveInfo, true),

  getInvoiceDetails: (billNum) =>
    requests.get(`GetInvoiceReprint_out_NEW?BillNo=${billNum}`),

  //getCaseSheet duplicate for the exisiting patient
  getCaseSheetInfo: (registrationID) =>
    requests.get(`getPatientRegistrationPdf?RegId=${registrationID}`),
  getWebCheckinInfo: (searchText) =>
    requests.get(`Get_appointmentList?Search=${searchText}`),

  //deposit information needs to be added.
  getDepositInfo: (searchText) =>
    requests.get(`Get_Web_PatDepositeDtl?patientid=${searchText}`),

  updatePOSPayment: (saveInfo) =>
    requests.post(`updatePOSPayment`, saveInfo, true),

  verifyPaymentInfo: (processingId) =>
    requests.get(`getTransactionStatus?processingid=${processingId}`),

  //getAll Appointments status!
  getAppointmentStatus: (fromDate, toDate) =>
    requests.get(`getAppList_All?FromDate=${fromDate}&ToDate=${toDate}`),

  //enable appointment slots
  saveAppointmentSlot: (slotInfo) =>
    requests.post(`Insert_AppointmentSlot`, slotInfo),
};
