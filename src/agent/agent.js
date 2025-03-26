import axios from 'axios';

// const BASE_URL = 'http://192.168.15.3/Test_HIS/api/his/'; // Devlopment
const BASE_URL = 'https://www.relainstitute.in/NewHIS_Live/api/HIS/'; // Live

const apiRequest = async (method, url, body = null) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data: body,
      headers: {'Content-Type': 'application/json'},
    });
    console.log(
      `API Response [${method.toUpperCase()} ${url}]:`,
      response.data
    );
    return {data: response.data, status: 'success'};
  } catch (error) {
    console.error(`API Error [${method.toUpperCase()} ${url}]:`, error);
    return {
      data: error.response
        ? error.response.data
        : 'An unexpected error occurred.',
      status: 'error',
    };
  }
};

const requests = {
  get: (url) => apiRequest('get', url),
  post: (url, body) => apiRequest('post', url, body),
  put: (url, body) => apiRequest('put', url, body),
  delete: (url, body) => apiRequest('delete', url, body),
};

export const OPModuleAgent = {
  hislogin: (loginpayload) => requests.post('getHISLogin', loginpayload),
  getpackagePriceList: () => requests.get('PackagePriceList'),
  getservicePriceList: () => requests.get('ServicePriceList?NationalityCode=0'),
  getSMSapplog: (Fdate, tdate) =>
    requests.get(`Get_SMSLogDetails?Fdate=${Fdate}&tDate=${tdate}`),
  getwhatsapplog: (fromDate, toDate) =>
    requests.get(`Get_WhatsappLog?Fdate=${fromDate}&tDate=${toDate}`),
  getpaymentlog: (fromDate, toDate) =>
    requests.get(`Get_PaymentLog?fromDate=${fromDate}&toDate=${toDate}`),
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
  getDepartments: () => requests.get('departments'),
  getRefSrcList: () => requests.get('get_Ref_Source'),
  getInternalDoctorList: () => requests.get('get_Web_DoctorData'),
  getExternalDoctorList: () => requests.get('Get_ExternalDoc_Data'),
  getDoctorListByDepartment: (departmentId) =>
    requests.get(`departmentWiseDoctor?DepID=${departmentId}`),
  getMasterSlot: () => requests.get('GetAppMasterSlot'),
  getDetailSlot: () => requests.get('GetAppDetailSlot'),
  deleteDetailslotDatewise: (deletePayload) =>
    requests.delete('Delete_AppDetailSlotDateWise', deletePayload),
  updatedetailslot: (updatedPayload) =>
    requests.put('UpdateTimeDetailtbl_v1', updatedPayload),
  GetDoctorseqSlotGap: (DoctorId) =>
    requests.get(`Get_DoctorseqSlotGap?DoctorId=${DoctorId}`),
  GetUpdateTime: (sessionId) =>
    requests.get(`GetUpdateTime?SessionId=${sessionId}`),
  SaveMasterHeader: (AppointmentHeader) =>
    requests.post('SaveAppMasterSlot', AppointmentHeader),
  SaveAppointmentMaster: (masterDetail) =>
    requests.post('Save_AppDetail_new', masterDetail),
  SlotBlockingandUnblocking: (BlockandUnblockPayload) =>
    requests.post('SlotBlockandUnblock', BlockandUnblockPayload),
  AvailableSlotConsultant: (DoctorId, fromDate, toDate) =>
    requests.get(
      `AvailableConsultantSlot?DoctorId=${DoctorId}&FromDate=${fromDate}&ToDate=${toDate}`
    ),
  getAppointmentDetails: (appointmentpayload) =>
    requests.post('AvailableSlot_ampm_seq', appointmentpayload),
  getPayorsList: (payors) =>
    requests.get(`GetInsurance_Corporate?PanelType=${payors}`),
  getServiceGroupList: () => requests.get('get_services'),
  getOccupationData: () => requests.get('OccupationData'),
  getPriorityList: () => requests.get('get_priority'),
  getServicesList: (serviceGroupCode) =>
    requests.get(`Get_ChargeMaster_v1?Code=${serviceGroupCode}`),
  saveOPDModule: (payload) => requests.post('Insert_OPDMaster_Porc', payload),
  saveExistingOPDModule: (existingPayload) =>
    requests.post('Insert_ExsistsOPDMaster_Porc', existingPayload),
  getExistingPatientDetails: (searchInput) =>
    requests.get(`web_PatientDtl?Type=op&search=${searchInput}`),
  getExistingPatientByPatientId: (patientId) =>
    requests.get(`Get_ExisPat_Detail?patientid=${patientId}`),
  saveAppointmentWithVisitExistingPatient: (saveInformation) =>
    requests.post('VisitWithAppointment', saveInformation),
  saveServiceDataWithPaymentInfo: (saveInformation) =>
    requests.post('Web_OPBill_Receipt', saveInformation),
  getOutPatientLists: (searchInput) =>
    requests.get(`opList?Type=op&search=${searchInput}`),
  getAppointmentStatus: (fromDate, toDate) =>
    requests.get(`getAppList_All?FromDate=${fromDate}&ToDate=${toDate}`),
};
