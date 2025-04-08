import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomAccordion,
  CustomAccordionItem,
} from '../../../../common/CustomAccordionItem';
import PersonalDetailsForm from './PersonalDetailsForm';
import AdditionalDetailsForm from './AdditionalDetailsForm';
import NextOfKinForm from './NextOfKinForm';
import {
  calculateAgeByDOB,
  formatDate,
  validateID,
  validateIDType,
} from '../../../../utils/utils';
import {OPModuleAgent} from '../../../../agent/agent';
import {fetchAreaListByPincode} from '../../../../store/Slices/dropdownSlice';
import {useLocalStorage} from '../../../../hooks/useLocalStorage';
import {
  initialPersonalDetails,
  initialAdditionalDetails,
  initialNextOfKinDetails,
} from './patientFormConstants';
import {
  validatePersonalDetails,
  validateAdditionalDetails,
  validateNextOfKin,
  validateRequired,
} from './patientFormValidation';

const PatientPersonCreation = ({UserId}) => {
  const dispatch = useDispatch();
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
  const [locationData, setLocationData] = useLocalStorage('locationData', []);
  const [kinLocationData, setKinLocationData] = useLocalStorage(
    'kinLocationData',
    []
  );

  const [personalErrors, setPersonalErrors] = useState({});
  const [additionalErrors, setAdditionalErrors] = useState({});
  const [nextOfKinErrors, setNextOfKinErrors] = useState({});
  const [isIdValid, setIsIdValid] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isRelationMobileValid, setIsRelationMobileValid] = useState(false);
  const [additionalAreaData, setAdditionalAreaData] = useState([]);
  const [kinAreaData, setKinAreaData] = useState([]);
  const [isCheckedSameAsPatientAddress, setIsCheckedSameAsPatientAddress] =
    useState(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useLocalStorage(
    'activeAccordionIndex',
    0
  );

  const dropdownData = useSelector((state) => state.dropdown.data);
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
    setAdditionalAreaData(areaListByPincodeResponse);
    setKinAreaData(areaListByPincodeResponse);
  }, [areaListByPincodeResponse]);

  const autoSelectStateAndCity = async (fieldName, pincode) => {
    if (validateID('pincode', pincode)) {
      try {
        const response = await OPModuleAgent.getCityStateCountryListByPinCode(
          pincode
        );
        const areaResponse = (await OPModuleAgent.getAreaListByPincode(pincode))
          .data;
        const responseData = response.data;
        console.log(areaResponse);

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
            }));
            setLocationData(responseData || []);
          } else if (fieldName === 'Kin_Pincode') {
            setNextOfKinDetails((prevFormData) => ({
              ...prevFormData,
              Kin_Country: responseData?.countryCode,
              Kin_City: responseData?.cityCode,
              Kin_State: responseData?.stateCode,
            }));
            setKinLocationData(responseData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching state and city data:', error);
        alert(
          'Something went wrong while fetching address data. Please try again later.'
        );
      }
    } else {
      setAdditionalDetails((prevFormData) => ({
        ...prevFormData,
        Country: '',
        City: '',
        State: '',
      }));
      setNextOfKinDetails((prevFormData) => ({
        ...prevFormData,
        Kin_Country: '',
        Kin_City: '',
        Kin_State: '',
      }));
      setLocationData([]);
      setKinLocationData([]);
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
    if (name === 'ID_Type' && personalDetails.ID_No.length > 1) {
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
      autoSelectStateAndCity(name, value);
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
      autoSelectStateAndCity(name, value);
    } else if (name === 'same_as_patient_address') {
      if (
        !isCheckedSameAsPatientAddress &&
        additionalDetails?.Pincode.length >= 6
      ) {
        updatedDetails.Kin_Pincode = additionalDetails.Pincode;
        updatedDetails.Kin_Country = additionalDetails.Country;
        updatedDetails.Kin_State = additionalDetails.State;
        updatedDetails.Kin_City = additionalDetails.City;
        updatedDetails.Kin_Area = additionalDetails.Area;
        updatedDetails.Kin_Address = additionalDetails.Address;
        setIsCheckedSameAsPatientAddress(true);
      } else {
        updatedDetails.Kin_Pincode = '';
        updatedDetails.Kin_Country = '';
        updatedDetails.Kin_State = '';
        updatedDetails.Kin_City = '';
        updatedDetails.Kin_Area = '';
        updatedDetails.Kin_Address = '';
        setIsCheckedSameAsPatientAddress(false);
      }
    } else {
      updatedDetails[name] = value;
    }

    setNextOfKinDetails(updatedDetails);
  };

  // Handlers for On Blur
  const handleBlur = (e) => {
    const {name, value} = e.target;

    // Determine which required fields to use based on the field name
    let requiredFields = [];
    if (initialPersonalDetails.includes(name)) {
      requiredFields = initialPersonalDetails;
      setPersonalErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    } else if (initialAdditionalDetails.includes(name)) {
      requiredFields = initialAdditionalDetails;
      setAdditionalErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    } else if (initialNextOfKinDetails.includes(name)) {
      requiredFields = initialNextOfKinDetails;
      setNextOfKinErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }

    // Run specific validations based on field name
    switch (name) {
      case 'Pincode':
        if (!validateRequired(value)) {
          setAdditionalErrors((prev) => ({
            ...prev,
            [name]: 'Pincode is required',
          }));
        } else if (value.length !== 6) {
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
        } else if (!validateID('Mobile', value)) {
          setPersonalErrors((prev) => ({
            ...prev,
            [name]: 'Invalid mobile number',
          }));
        }
        break;

      case 'Email_ID':
        if (value && !validateID('Email', value)) {
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
        } else if (value.length < 8) {
          setAdditionalErrors((prev) => ({
            ...prev,
            [name]: 'Address is too short',
          }));
        }
        break;

      default:
        if (requiredFields.includes(name) && !validateRequired(value)) {
          // Set error in the appropriate errors object
          if (initialPersonalDetails.includes(name)) {
            setPersonalErrors((prev) => ({
              ...prev,
              [name]: `${name.replace(/_/g, ' ')} is required`,
            }));
          } else if (initialAdditionalDetails.includes(name)) {
            setAdditionalErrors((prev) => ({
              ...prev,
              [name]: `${name.replace(/_/g, ' ')} is required`,
            }));
          } else if (initialNextOfKinDetails.includes(name)) {
            setNextOfKinErrors((prev) => ({
              ...prev,
              [name]: `${name.replace(/_/g, ' ')} is required`,
            }));
          }
        }
    }
  };

  // Form submission handlers
  const handlePersonalDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validatePersonalDetails(
        personalDetails,
        validateID,
        validateIDType
      );
      setPersonalErrors(errors);
      if (Object.keys(errors).length === 0) {
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
          setActiveAccordionIndex(1);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.', error.message);
    }
  };

  const handleAdditionalDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validateAdditionalDetails(additionalDetails, validateID);
      setAdditionalErrors(errors);
      if (Object.keys(errors).length === 0) {
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
          setActiveAccordionIndex(2);
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
      validateID,
      isCheckedSameAsPatientAddress
    );
    setNextOfKinErrors(errors);
    if (Object.keys(errors).length === 0) {
      submitAllData();
    }
    try {
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const submitAllData = async () => {
    try {
      const combinedData = {
        ...personalDetails,
        ...additionalDetails,
        ...nextOfKinDetails,
      };
      console.log(combinedData);
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
      console.log('Submission successful:', response);
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
    setLocationData([]);
    setAdditionalErrors({});
  };

  const resetNextOfKinDetails = () => {
    setNextOfKinDetails(initialNextOfKinDetails);
    setIsRelationMobileValid(false);
    setIsCheckedSameAsPatientAddress(false);
    setKinLocationData([]);
    setNextOfKinErrors({});
  };

  return (
    <CustomAccordion
      activeIndex={activeAccordionIndex}
      setActiveIndex={setActiveAccordionIndex}>
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
          locationData={locationData}
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
          kinLocationData={kinLocationData}
          locationData={locationData}
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
    </CustomAccordion>
  );
};

export default PatientPersonCreation;
