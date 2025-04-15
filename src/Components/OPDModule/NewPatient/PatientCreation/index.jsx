import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomAccordion,
  CustomAccordionItem,
} from '../../../../common/CustomAccordionItem';
import PersonalDetailsForm from './PersonalDetailsForm';
import {
  calculateAgeByDOB,
  dateObjectToString,
  formatDate,
  validateID,
  validateIDType,
} from '../../../../utils/utils';
import {OPModuleAgent} from '../../../../agent/agent';
import {
  fetchAppointmentDetails,
  fetchAreaListByPincode,
  fetchDoctorListByDepartment,
  fetchPayorsList,
} from '../../../../store/Slices/dropdownSlice';
import {useLocalStorage} from '../../../../hooks/useLocalStorage';
import {useConfirmDialog} from '../../../../hooks/useConfirmDialog';
import AdditionalDetailsForm from './AdditionalDetailsForm';
import NextOfKinForm from './NextOfKinForm';
import EvaluationForm from './EvaluationForm';

import {
  initialPersonalDetails,
  initialAdditionalDetails,
  initialNextOfKinDetails,
  initialEvaluationDetails,
  initialAppointmentDetails,
} from './patientFormConstants';
import {
  validatePersonalDetails,
  validateAdditionalDetails,
  validateNextOfKin,
  validateRequired,
  validateScheduleAppointment,
} from './patientFormValidation';
import ScheduleAppointmentForm from './ScheduleAppointmentForm';
import {updateService} from '../../../../store/Slices/OPModule/Service/opServiceSlice';
import ServiceForm from './ServiceForm';

const PatientCreation = ({UserId}) => {
  const dispatch = useDispatch();
  const [formStatus, setFormStatus] = useLocalStorage('formStatus', [
    false, // 0.personal details
    false, // 1.additional details
    false, // 2.next of kin
    false, // 3.evaluation
    false, // 4.appointment
    false, // 5.service
    false, // 6.payment
  ]);
  const [activeAccordions, setActiveAccordions] = useLocalStorage(
    'activeAccordions',
    [0, 1, 2, 3, 4, 5]
  );
  const [personalDetails, setPersonalDetails] = useLocalStorage(
    'personalDetails',
    initialPersonalDetails
  );
  const [additionalDetails, setAdditionalDetails] = useLocalStorage(
    'additionalDetails',
    initialAdditionalDetails
  );
  const [nextOfKinDetails, setNextOfKinDetails] = useLocalStorage(
    'nextOfKinDetails',
    initialNextOfKinDetails
  );
  const [evaluationDetails, setEvaluationDetails] = useLocalStorage(
    'evaluationDetails',
    initialEvaluationDetails
  );
  const [appointmentDetails, setAppointmentDetails] = useLocalStorage(
    'appointmentDetails',
    initialAppointmentDetails
  );
  const {confirm, ConfirmDialogComponent} = useConfirmDialog();

  const [personalErrors, setPersonalErrors] = useState({});
  const [additionalErrors, setAdditionalErrors] = useState({});
  const [nextOfKinErrors, setNextOfKinErrors] = useState({});
  const [appointmentErrors, setAppointmentErrors] = useState({});
  const [isIdValid, setIsIdValid] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isRelationMobileValid, setIsRelationMobileValid] = useState(false);
  const [additionalAreaData, setAdditionalAreaData] = useState([]);
  const [kinAreaData, setKinAreaData] = useState([]);
  const [isCheckedSameAsPatientAddress, setIsCheckedSameAsPatientAddress] =
    useState(false);

  const dropdownData = useSelector((state) => state.dropdown.data);
  const opServices = useSelector((state) => state.opService);
  const [serviceDetails, setServiceDetails] = useLocalStorage(
    'serviceDetails',
    opServices.OP_Master
  );
  const {
    salutationsResponse = [],
    maritalStatusResponse = [],
    relationTypeResponse = [],
    bloodGroupResponse = [],
    religionResponse = [],
    languageResponse = [],
    occupationResponse = [],
    nationalityResponse = [],
    idTypeResponse = [],
    areaListByPincodeResponse = [],
    doctorListByDepartmentResponse = [],
    appointmentDetailsResponse = [],
    payorsListResponse = [],
    refSrcListResponse = [],
    internalDoctorListResponse = [],
    externalDoctorListResponse = [],
    departmentsResponse = [],
    serviceGroupListResponse = [],
    priorityListResponse = [],
    servicesListResponse = [],
  } = dropdownData || {};

  useEffect(() => {
    if (additionalDetails?.Pincode?.length === 6) {
      dispatch(fetchAreaListByPincode(additionalDetails?.Pincode));
    }
    if (nextOfKinDetails?.Kin_Pincode?.length === 6) {
      dispatch(fetchAreaListByPincode(nextOfKinDetails?.Kin_Pincode));
    }
  }, [dispatch, additionalDetails?.Pincode, nextOfKinDetails?.Kin_Pincode]);

  useEffect(() => {
    if (appointmentDetails?.Department_Name) {
      dispatch(
        fetchDoctorListByDepartment(appointmentDetails?.Department_Name)
      );
    }
  }, [dispatch, appointmentDetails.Department_Name]);

  useEffect(() => {
    if (appointmentDetails?.Patient_Type === 'c' || 'i') {
      dispatch(fetchPayorsList(appointmentDetails?.Patient_Type));
    }
  }, [dispatch, appointmentDetails.Patient_Type]);

  useEffect(() => {
    if (
      appointmentDetails?.Appointment_Date &&
      appointmentDetails?.Doctor_Name
    ) {
      dispatch(
        fetchAppointmentDetails({
          AppointmentDate: appointmentDetails?.Appointment_Date,
          doctorId: Number(appointmentDetails?.Doctor_Name),
        })
      );
    }
  }, [
    dispatch,
    appointmentDetails.Appointment_Date,
    appointmentDetails.Doctor_Name,
  ]);

  useEffect(() => {
    setAdditionalAreaData(areaListByPincodeResponse);
    setKinAreaData(areaListByPincodeResponse);
  }, [areaListByPincodeResponse]);

  const openAllAccordions = () => {
    setActiveAccordions([0, 1, 2, 3, 4, 5]); // Adjust indices based on your accordion count
  };

  const closeAllAccordions = () => {
    setActiveAccordions([]);
  };

  const markFormAsCompleted = (index) => {
    const updatedFormStatus = [...formStatus];
    updatedFormStatus[index] = true;
    setFormStatus(updatedFormStatus);
  };

  const autoSelectStateAndCity = async (fieldName, pincode) => {
    if (validateID('pincode', pincode)) {
      try {
        const response = await OPModuleAgent.getCityStateCountryListByPinCode(
          pincode
        );
        await OPModuleAgent.getAreaListByPincode(pincode).data; // fetch area list
        const responseData = response.data;

        if (
          responseData?.countryCode &&
          responseData?.stateCode &&
          responseData?.cityCode
        ) {
          if (fieldName === 'Pincode') {
            setAdditionalDetails((prevFormData) => ({
              ...prevFormData,
              Country: responseData?.countryCode,
              City: responseData?.cityCode,
              State: responseData?.stateCode,
              countryName: responseData?.countryName,
              stateName: responseData?.stateName,
              cityName: responseData?.cityName,
            }));
          } else if (fieldName === 'Kin_Pincode') {
            setNextOfKinDetails((prevFormData) => ({
              ...prevFormData,
              Kin_Country: responseData?.countryCode,
              Kin_City: responseData?.cityCode,
              Kin_State: responseData?.stateCode,
              countryName: responseData?.countryName,
              stateName: responseData?.stateName,
              cityName: responseData?.cityName,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching state and city data:', error);
        alert(
          'Something went wrong while fetching address data. Please try again later.'
        );
      }
    } else {
      // Reset the state, country, and city if the pincode is invalid or empty
      setAdditionalDetails((prevFormData) => ({
        ...prevFormData,
        Country: '',
        City: '',
        State: '',
        countryName: '',
        stateName: '',
        cityName: '',
      }));
      setNextOfKinDetails((prevFormData) => ({
        ...prevFormData,
        Kin_Country: '',
        Kin_City: '',
        Kin_State: '',
        countryName: '',
        stateName: '',
        cityName: '',
      }));
      console.log('Pincode is empty or invalid');
    }
  };

  const getGenderFromSalutation = (salutationId) => {
    if (salutationId === '11' || salutationId === '22') return 'Male';
    if (salutationId === '12' || salutationId === '21') return 'Female';
    return '';
  };

  // Handlers for Personal Details
  const handlePersonalDetailsChange = (e) => {
    const {name, value} = e.target;
    const updatedDetails = {...personalDetails, [name]: value};

    if (personalErrors[name]) {
      setPersonalErrors((prev) => ({...prev, [name]: ''}));
    }
    if (name === 'ID_Type' && personalDetails.ID_No?.length > 1) {
      const id =
        typeof personalDetails.ID_No === 'string'
          ? personalDetails.ID_No.toUpperCase()
          : personalDetails.ID_No;
      const idType = value.toLowerCase();
      setIsIdValid(validateIDType(idType, id));
    } else if (name === 'ID_No') {
      updatedDetails[name] = value.toUpperCase();
      setIsIdValid(
        validateIDType(personalDetails.ID_Type, value.toUpperCase())
      );
    } else if (name === 'DOB') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const age = calculateAgeByDOB(value);
        updatedDetails.Age = age.toString();
      } else {
        updatedDetails.Age = '';
      }
    } else if (name === 'Mobile_No') {
      setIsMobileValid(validateID('mobile', value));
    } else if (name === 'Email_ID') {
      setIsEmailValid(validateID('email', value));
    } else if (name === 'SalutionId') {
      updatedDetails.Gender = getGenderFromSalutation(value);
    }

    setPersonalDetails(updatedDetails);
  };

  // Handlers for Additional Details
  const handleAdditionalDetailsChange = (e) => {
    const {name, value} = e.target;
    const updatedDetails = {...additionalDetails, [name]: value};

    if (name === 'Pincode') {
      updatedDetails[name] = value;
      if (validateID('pincode', value)) {
        autoSelectStateAndCity(name, value);
      } else {
        updatedDetails.Country = '';
        updatedDetails.City = '';
        updatedDetails.State = '';
        updatedDetails.Address = '';
        updatedDetails.countryName = '';
        updatedDetails.stateName = '';
        updatedDetails.cityName = '';
      }
    } else if (name === 'Select_Special_Assistance') {
      updatedDetails[name] = value;
    } else if (name === 'Area') {
      updatedDetails[name] = value;
    } else {
      updatedDetails[name] = value;
    }

    setAdditionalDetails(updatedDetails);
  };

  // Handlers for Next of Kin
  const handleNextOfKinChange = (e) => {
    const {name, value} = e.target;
    const updatedDetails = {...nextOfKinDetails, [name]: value};

    if (name === 'Relation_Mobile_No') {
      setIsRelationMobileValid(validateID('mobile', value));
    } else if (name === 'Kin_Pincode') {
      updatedDetails[name] = value;
      if (validateID('pincode', value)) {
        autoSelectStateAndCity(name, value);
      } else {
        updatedDetails.Kin_Country = '';
        updatedDetails.Kin_State = '';
        updatedDetails.Kin_City = '';
        updatedDetails.Kin_Address = '';
        updatedDetails.countryName = '';
        updatedDetails.stateName = '';
        updatedDetails.cityName = '';
      }
    } else if (name === 'same_as_patient_address') {
      if (
        !isCheckedSameAsPatientAddress &&
        additionalDetails?.Pincode?.length >= 6
      ) {
        updatedDetails.Kin_Pincode = additionalDetails.Pincode;
        updatedDetails.Kin_Country = additionalDetails.Country;
        updatedDetails.Kin_State = additionalDetails.State;
        updatedDetails.Kin_City = additionalDetails.City;
        updatedDetails.Kin_Area = additionalDetails.Area;
        updatedDetails.Kin_Address = additionalDetails.Address;
        updatedDetails.countryName = additionalDetails.countryName;
        updatedDetails.stateName = additionalDetails.stateName;
        updatedDetails.cityName = additionalDetails.cityName;
        setIsCheckedSameAsPatientAddress(true);
      } else {
        updatedDetails.Kin_Pincode = '';
        updatedDetails.Kin_Country = '';
        updatedDetails.Kin_State = '';
        updatedDetails.Kin_City = '';
        updatedDetails.Kin_Area = '';
        updatedDetails.Kin_Address = '';
        updatedDetails.countryName = '';
        updatedDetails.stateName = '';
        updatedDetails.cityName = '';
        setIsCheckedSameAsPatientAddress(false);
      }
    } else {
      updatedDetails[name] = value;
    }

    setNextOfKinDetails(updatedDetails);
  };

  const handleEvaluationChange = (e) => {
    const {name, value, type, checked} = e.target;
    const parsedValue =
      type === 'checkbox'
        ? checked
        : value === 'true'
        ? true
        : value === 'false'
        ? false
        : value;

    setEvaluationDetails({...evaluationDetails, [name]: parsedValue});
  };

  const handleAppointmentChange = async (e) => {
    const {name, value} = e.target;
    const updatedDetails = {...appointmentDetails, [name]: value};
    if (name === 'Appointment_Date') {
      updatedDetails[name] = dateObjectToString(value);
    }
    setAppointmentDetails(updatedDetails);
  };

  const handleServiceChange = (e, index) => {
    const {name, value} = e.target;
    const updatedService = {...opServices.OP_Master[index], [name]: value};
    dispatch(updateService({index, newData: updatedService}));
  };

  const handleBlur = (e) => {
    const {name, value} = e.target;

    // Convert object keys to arrays for checks
    const personalFields = Object.keys(initialPersonalDetails);
    const additionalFields = Object.keys(initialAdditionalDetails);
    const nextOfKinFields = Object.keys(initialNextOfKinDetails);
    const appointmentFields = Object.keys(initialAppointmentDetails);

    let requiredFields = [];

    if (personalFields.includes(name)) {
      requiredFields = personalFields;
      setPersonalErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    } else if (additionalFields.includes(name)) {
      requiredFields = additionalFields;
      setAdditionalErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    } else if (nextOfKinFields.includes(name)) {
      requiredFields = nextOfKinFields;
      setNextOfKinErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    } else if (appointmentFields.includes(name)) {
      requiredFields = appointmentFields;
      setAppointmentErrors((prev) => {
        const newErrors = {...prev};
        if (name === 'Patient_Type' && value === 's') {
          delete newErrors['Payor_Name'];
        }
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validation logic
    switch (name) {
      case 'Pincode':
        if (!validateRequired(value)) {
          setAdditionalErrors((prev) => ({
            ...prev,
            [name]: 'Pincode is required',
          }));
        } else if (value?.length !== 6) {
          setAdditionalErrors((prev) => ({
            ...prev,
            [name]: 'Pincode must be 6 digits',
          }));
        }
        break;

      case 'Mobile_No':
        if (!validateRequired(value)) {
          setPersonalErrors((prev) => ({
            ...prev,
            [name]: 'Mobile number is required',
          }));
        } else if (!validateID('mobile', value)) {
          setPersonalErrors((prev) => ({
            ...prev,
            [name]: 'Invalid mobile number',
          }));
        }
        break;

      case 'Email_ID':
        if (value && !validateID('email', value)) {
          setPersonalErrors((prev) => ({
            ...prev,
            [name]: 'Invalid email address',
          }));
        }
        break;

      case 'Address':
        if (!validateRequired(value)) {
          setAdditionalErrors((prev) => ({
            ...prev,
            [name]: 'Address is required',
          }));
        } else if (value?.length < 8) {
          setAdditionalErrors((prev) => ({
            ...prev,
            [name]: 'Address is too short',
          }));
        }
        break;

      default:
        if (requiredFields.includes(name) && !validateRequired(value)) {
          const errorMsg = `${name.replace(/_/g, ' ')} is required`;

          if (personalFields.includes(name)) {
            setPersonalErrors((prev) => ({
              ...prev,
              [name]: errorMsg,
            }));
          } else if (additionalFields.includes(name)) {
            setAdditionalErrors((prev) => ({
              ...prev,
              [name]: errorMsg,
            }));
          } else if (nextOfKinFields.includes(name)) {
            setNextOfKinErrors((prev) => ({
              ...prev,
              [name]: errorMsg,
            }));
          }
        }
    }
  };

  const handlePersonalDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validatePersonalDetails(
        personalDetails,
        validateID,
        validateIDType
      );
      setPersonalErrors(errors);
      if (Object.keys(errors)?.length === 0) {
        const DOB = formatDate(personalDetails.DOB);
        const payload = {
          ...personalDetails,
          DOB,
          UserId,
        };
        const res = await OPModuleAgent.createTemporaryOPDPatient(payload);
        if (res?.data?.s_No) {
          const sNo = res.data.s_No;
          setPersonalDetails({
            ...personalDetails,
            ID: sNo,
          });
          markFormAsCompleted(0);
          setActiveAccordions([1]);
        }
      }
    } catch (error) {
      console.error('Submit error:', error?.message);
      alert('Something went wrong. Please try again.', error.message);
    }
  };

  const handleAdditionalDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validateAdditionalDetails(additionalDetails, validateID);
      setAdditionalErrors(errors);
      if (Object.keys(errors)?.length === 0) {
        const payload = {
          ID: Number(personalDetails?.ID),
          Pincode: String(additionalDetails?.Pincode),
          Country: Number(additionalDetails?.Country),
          State_id: Number(additionalDetails?.State),
          City: Number(additionalDetails?.City),
          Area: String(additionalDetails?.Area),
          Address_txt: String(additionalDetails?.Address),
          Religion: Number(additionalDetails?.Religion),
          Language_id: Number(additionalDetails?.Language),
          BloodGroup: Number(additionalDetails?.BloodGroup),
          Special_Assistance: Boolean(additionalDetails?.Special_Assistance),
          Select_Special_Assistance: String(
            additionalDetails?.Select_Special_Assistance
          ),
          Spl_Assist_Remarks: String(additionalDetails?.Spl_Assist_Remarks),
        };
        const res = await OPModuleAgent.updateTempOPDPatientAdditionalDetails(
          payload
        );
        if (res?.data?.id) {
          markFormAsCompleted(1);
          setActiveAccordions([2]);
        }
      }
    } catch (error) {
      console.error('Submit error:', error?.message);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleNextOfKinSubmit = async (e) => {
    e.preventDefault();
    const errors = validateNextOfKin(
      nextOfKinDetails,
      isCheckedSameAsPatientAddress
    );
    setNextOfKinErrors(errors);
    if (Object.keys(errors)?.length === 0) {
      const payload = {
        ID: Number(personalDetails?.ID),
        Relation_Type: Number(nextOfKinDetails?.Relation_Type),
        Relation_Name: nextOfKinDetails?.Relation_Name,
        Relation_Mobile_No: nextOfKinDetails?.Relation_Mobile_No,
        Kin_Pincode: nextOfKinDetails?.Kin_Pincode,
        Kin_Country: nextOfKinDetails?.Kin_Country,
        Kin_State: nextOfKinDetails?.Kin_State,
        Kin_City: nextOfKinDetails?.Kin_City,
        Kin_Area: nextOfKinDetails?.Kin_Area,
        Kin_Address: nextOfKinDetails?.Kin_Address,
      };
      const response = await OPModuleAgent.updateTempOPDPatientKinDetails(
        payload
      );
      if (response?.data?.id) {
        markFormAsCompleted(2);
        setActiveAccordions([3]);
      }
      console.log('Submission successful:', response);
    }
    try {
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ID: Number(personalDetails?.ID),
        ...evaluationDetails,
        pat_Is_symptoms: evaluationDetails?.pat_Is_symptoms === '1' ? 1 : 0,
        pat_Is_historyoffever:
          evaluationDetails?.pat_Is_historyoffever === '1' ? 1 : 0,
        pat_Is_outofcountry1month:
          evaluationDetails?.pat_Is_outofcountry1month === '1' ? 1 : 0,
        pat_Is_diseaseoutbreak:
          evaluationDetails?.pat_Is_diseaseoutbreak === '1' ? 1 : 0,
        pat_Is_healthcareworker:
          evaluationDetails?.pat_Is_healthcareworker === '1' ? 1 : 0,
        pat_Is_disease_last1month:
          evaluationDetails?.pat_Is_disease_last1month === '1' ? 1 : 0,
        pat_Is_chickenpox: evaluationDetails?.pat_Is_chickenpox === '1' ? 1 : 0,
        pat_Is_measles: evaluationDetails?.pat_Is_measles === '1' ? 1 : 0,
        pat_Is_mumps: evaluationDetails?.pat_Is_mumps === '1' ? 1 : 0,
        pat_Is_rubella: evaluationDetails?.pat_Is_rubella === '1' ? 1 : 0,
        pat_Is_diarrheasymptoms:
          evaluationDetails?.pat_Is_diarrheasymptoms === '1' ? 1 : 0,
        pat_Is_activeTB: evaluationDetails?.pat_Is_activeTB === '1' ? 1 : 0,
      };
      const allFalseOrNull = Object.values(evaluationDetails).every(
        (value) => value === null || value === false || value === 0
      );
      if (allFalseOrNull) {
        const userConfirmed = await confirm(
          'Confirm Submission',
          'Are you sure you want to submit? Because all questions are unselected.'
        );
        if (!userConfirmed) return;
      }
      const response = await OPModuleAgent.updateTempOPDPatientEvaluation(
        payload
      );
      if (response?.data?.id) {
        markFormAsCompleted(3);
        setActiveAccordions([4]);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validateScheduleAppointment(
        appointmentDetails,
        validateID
      );
      setAppointmentErrors(errors);
      if (Object.keys(errors)?.length === 0) {
        const payload = {
          ID: Number(personalDetails?.ID),
          Department_Name: Number(appointmentDetails?.Department_Name),
          Doctor_Name: Number(appointmentDetails?.Doctor_Name),
          Visit_Type: Number(appointmentDetails?.Visit_Type),
          Appointment_Date: appointmentDetails?.Appointment_Date,
          Sequence_No: Number(appointmentDetails?.Sequence_No),
          Patient_Type: appointmentDetails?.Patient_Type,
          Payor_Name:
            appointmentDetails?.Payor_Name !== null
              ? Number(appointmentDetails?.Payor_Name)
              : 0,
          Referral_Source: Number(appointmentDetails?.Referral_Source),
          Doctor_Type: appointmentDetails?.Doctor_Type,
          Internal_Doctor_Name:
            appointmentDetails?.Internal_Doctor_Name !== null
              ? Number(appointmentDetails?.Internal_Doctor_Name)
              : 15,
          External_Doctor_Name:
            appointmentDetails?.External_Doctor_Name !== null
              ? Number(appointmentDetails?.External_Doctor_Name)
              : 0,
          Staff_Employee_ID: appointmentDetails?.Staff_Employee_ID,
          Package_Details: appointmentDetails?.Package_Details,
          Modified_Id: UserId,
        };
        const res = await OPModuleAgent.updateTempOPDPatientAppointment(
          payload
        );
        if (res?.data?.id) {
          markFormAsCompleted(4);
          setActiveAccordions([5]);
        }
      }
    } catch (error) {
      console.error('Submit error:', error?.message);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleServiceSubmit = async (services, e) => {
    e.preventDefault();
    const payload = {
      Id: Number(personalDetails?.ID),
      UserId,
      OP_Master: services.map((service) => ({
        ID: 74, // Same as main Id
        Service_Group: service.serviceGroup,
        Service: service.service,
        Priority: service.priority,
        Rate: service.rate,
        Discount_Type: service.discountType,
        AMOUNT: service.amount,
        Discount: service.discount,
        Amount_Ttl: service.amountTotal,
        Remarks: service.remarks,
        Discount_Reason: service.discountReason,
      })),
    };

    try {
      const response = await OPModuleAgent.insertServiceInvioice(payload);
      if (response?.data?.id) {
        markFormAsCompleted(5);
        setActiveAccordions([6]);
        setServiceDetails(payload);
      } else {
        console.error('❌ Submission failed:', response?.data?.id);
        alert(
          `❌ Submission failed: ${response?.data?.msgDesc || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  const submitAllData = async () => {
    try {
      for (let i = 0; i < opServices.OP_Master.length; i++) {
        const service = opServices.OP_Master[i];
        if (!service.Service || !service.Rate) {
          alert(`Service #${i + 1} is invalid`);
          return;
        }
      }

      const combinedData = {
        UserId: opServices.UserId,
        OP_Master: opServices.OP_Master,
        // Add other sections like personalDetails etc.
      };

      console.log('✅ Final submission data:', combinedData);
      // Send to API or wherever
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  // Form reset handlers
  const resetPersonalDetails = () => {
    setPersonalDetails(initialPersonalDetails);
    setIsIdValid(false);
    setIsMobileValid(false);
    setIsEmailValid(false);
    setPersonalErrors({});
  };

  const resetAdditionalDetails = () => {
    setAdditionalDetails(initialAdditionalDetails);
    setAdditionalErrors({});
  };

  const resetNextOfKinDetails = () => {
    setNextOfKinDetails(initialNextOfKinDetails);
    setIsRelationMobileValid(false);
    setIsCheckedSameAsPatientAddress(false);
    setNextOfKinErrors({});
  };

  const resetAppointmentDetails = () => {
    setAppointmentDetails(initialAppointmentDetails);
    setAppointmentErrors({});
  };

  return (
    <>
      <CustomAccordion
        activeIndex={activeAccordions}
        setActiveIndex={setActiveAccordions}
        formStatus={formStatus}>
        <CustomAccordionItem title="Personal Details">
          <PersonalDetailsForm
            formData={personalDetails}
            errors={personalErrors}
            dropdownData={{
              salutationsResponse,
              maritalStatusResponse,
              occupationResponse,
              nationalityResponse,
              idTypeResponse,
            }}
            onChange={handlePersonalDetailsChange}
            onSubmit={handlePersonalDetailsSubmit}
            onBlur={handleBlur}
            onReset={resetPersonalDetails}
            isIdValid={isIdValid}
            isMobileValid={isMobileValid}
            isEmailValid={isEmailValid}
          />
        </CustomAccordionItem>

        <CustomAccordionItem title="Additional Details">
          <AdditionalDetailsForm
            formData={additionalDetails}
            errors={additionalErrors}
            dropdownData={{
              additionalAreaData,
              religionResponse,
              languageResponse,
              bloodGroupResponse,
            }}
            onBlur={handleBlur}
            onChange={handleAdditionalDetailsChange}
            onSubmit={handleAdditionalDetailsSubmit}
            onReset={resetAdditionalDetails}
          />
        </CustomAccordionItem>

        <CustomAccordionItem title="Next of Kin">
          <NextOfKinForm
            formData={nextOfKinDetails}
            errors={nextOfKinErrors}
            dropdownData={{
              relationTypeResponse,
              kinAreaData,
            }}
            additionalDetails={additionalDetails}
            onBlur={handleBlur}
            onChange={handleNextOfKinChange}
            onSubmit={handleNextOfKinSubmit}
            onReset={resetNextOfKinDetails}
            isCheckedSameAsPatientAddress={isCheckedSameAsPatientAddress}
            onCheckboxChange={setIsCheckedSameAsPatientAddress}
            isRelationMobileValid={isRelationMobileValid}
          />
        </CustomAccordionItem>

        <CustomAccordionItem title="Evaluation">
          <EvaluationForm
            formData={evaluationDetails}
            handleChange={handleEvaluationChange}
            setEvaluationDetails={setEvaluationDetails}
            onSubmit={handleEvaluationSubmit}
            onReset={() => setEvaluationDetails(initialEvaluationDetails)}
            shouldAnimate={activeAccordions === 3}
          />
        </CustomAccordionItem>

        <CustomAccordionItem title="Schedule Appointment">
          <ScheduleAppointmentForm
            formData={appointmentDetails}
            errors={appointmentErrors}
            onBlur={handleBlur}
            dropdownData={{
              departmentsResponse,
              doctorListByDepartmentResponse,
              appointmentDetailsResponse,
              payorsListResponse,
              refSrcListResponse,
              internalDoctorListResponse,
              externalDoctorListResponse,
            }}
            onChange={handleAppointmentChange}
            onSubmit={handleAppointmentSubmit}
            onReset={resetAppointmentDetails}
          />
        </CustomAccordionItem>

        <CustomAccordionItem title="Services & Invoice">
          <ServiceForm
            formData={serviceDetails}
            setServiceDetails={setServiceDetails}
            onChange={handleServiceChange}
            onSubmit={handleServiceSubmit}
            dropdownData={{
              serviceGroupListResponse,
              priorityListResponse,
              servicesListResponse,
            }}
          />
        </CustomAccordionItem>

        {/* Other accordion items */}
        {['Payments'].map((title) => (
          <CustomAccordionItem key={title} title={title} />
        ))}
      </CustomAccordion>
      <ConfirmDialogComponent />
    </>
  );
};

export default PatientCreation;
