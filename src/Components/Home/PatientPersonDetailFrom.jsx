import React, {useEffect, useState} from 'react';
import {Button, Container, Row} from 'react-bootstrap';
import {
  CustomAccordion,
  CustomAccordionItem,
} from '../../common/CustomAccordionItem';
import {useSelector} from 'react-redux';
import CustomFormField from '../../common/form/CustomFormField';
import {validateID, validateIDType} from '../../utils/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {OPModuleAgent} from '../../agent/agent';
import {useDispatch} from 'react-redux';
import {fetchAreaListByPincode} from '../../store/Slices/dropdownSlice';

const PatientPersonDetailForm = () => {
  const [isIdValid, setIsIdValid] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const dispatch = useDispatch();

  const initialFormData = {
    SalutionId: null,
    Name: '',
    DOB: '',
    Age: null,
    Gender: '',
    Nationality: '',
    ID_Type: '',
    ID_No: '',
    Marital_Status: '',
    Mobile_No: '',
    Email_ID: '',
    Occupation: '',
    Pincode: '',
    Country: '',
    State: '',
    City: '',
    Area: '',
    Address: '',
    Religion: '',
    Language: '',
    BloodGroup: '',
    specialAssistance: '',
    Special_Assistance: false,
    Select_Special_Assistance: '',
    Spl_Assist_Remarks: '',
    Update_Death_Date: '',
    Relation_Type: '',
    Relation_Name: '',
    Relation_Mobile_No: '',
    Kin_Pincode: '',
    Kin_Country: '',
    Kin_State: '',
    Kin_City: '',
    Kin_Area: '',
    Kin_Address: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    if (formData?.Pincode) {
      dispatch(fetchAreaListByPincode(formData?.Pincode));
    }
  }, [dispatch, formData?.Pincode]);

  const resetFormData = () => {
    setFormData(initialFormData);
    setIsIdValid(false);
    setIsMobileValid(false);
    setLocationData([]);
  };

  const {
    salutationsResponse,
    departmentsResponse,
    mobileCodeResponse,
    maritalStatusResponse,
    occupationResponse,
    nationalityResponse,
    idTypeResponse,
    countriesResponse,
    stateResponse,
    relationTypeResponse,
    bloodGroupResponse,
    religionResponse,
    languageResponse,
    areaListByPincodeResponse,
  } = useSelector((state) => state.dropdown);

  async function autoSelectStateAndCity(pincode) {
    if (validateID('pincode', pincode)) {
      try {
        const response = await OPModuleAgent.getCityStateCountryListByPinCode(
          pincode
        );
        const areaResponse = (
          await OPModuleAgent.getAreaListByPincode(formData?.Pincode)
        ).data;

        const responseData = response.data;

        if (
          responseData?.countryCode &&
          responseData?.stateCode &&
          responseData?.cityCode
        ) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            Country: responseData?.countryCode,
            City: responseData?.cityCode,
            State: responseData?.stateCode,
          }));
          setLocationData(responseData || []);
        }
      } catch (error) {
        return console.error('Error fetching state and city data:', error);
      }
    } else {
      setLocationData([]);
      return console.log('Pincode is empty or invalid');
    }
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    let updatedFormData = {...formData};

    if (name === 'ID_No') {
      updatedFormData[name] = value.toUpperCase();
      setIsIdValid(validateIDType(formData.ID_Type, value.toUpperCase()));
    } else if (name === 'Mobile_No') {
      updatedFormData[name] = value;
      setIsMobileValid(validateID('mobile', value));
    } else if (name === 'Pincode') {
      autoSelectStateAndCity(value);
      updatedFormData[name] = value;
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const handleSelectChange = (e) => {
    const {name, value} = e.target;
    let updatedFormData = {...formData, [name]: value};

    if (name === 'Salutation') {
      if (value === '11' || value === '22') {
        updatedFormData.Gender = 'Male';
      } else if (value === '12' || value === '21') {
        updatedFormData.Gender = 'Female';
      } else {
        updatedFormData.Gender = '';
      }
    }

    if (name === 'Special_Assistance') {
      updatedFormData.Special_Assistance = value === 'true';
    }

    setFormData(updatedFormData);
  };

  const handleDateChange = (name, value) => {
    let updatedFormData = {...formData, [name]: value};

    if (name === 'DOB') {
      const birthDate = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      updatedFormData.Age = age.toString();
    }
    setFormData(updatedFormData);
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <CustomAccordion>
      {({activeIndex, onToggle}) => {
        const handleSaveContinue = (e) => {
          e.preventDefault();
          handleSubmit();

          // Open next accordion item
          onToggle(activeIndex + 1);
        };

        return (
          <>
            <CustomAccordionItem
              title="Personal Details"
              index={0}
              activeIndex={activeIndex}
              onToggle={onToggle}>
              <Container>
                <form noValidate onSubmit={handleSaveContinue}>
                  <Row className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 p-4">
                    <div className="col-span-2 flex items-center gap-2">
                      <CustomFormField
                        label="Salutation"
                        type="select"
                        name="Salutation"
                        value={formData.SalutionId}
                        onChange={handleSelectChange}
                        options={salutationsResponse}
                        required
                        className="w-[20%]"
                      />
                      <CustomFormField
                        label="Full Name"
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        required
                        className="w-[80%]"
                      />
                    </div>

                    <CustomFormField
                      label="Date of Birth"
                      type="date"
                      name="DOB"
                      value={formData.DOB}
                      onChange={(e) => handleDateChange('DOB', e.target.value)}
                      required
                      className="w-full"
                    />
                    <CustomFormField
                      label="Age"
                      type="number"
                      name="Age"
                      disabled
                      value={formData.Age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      className="w-full cursor-not-allowed"
                    />

                    <CustomFormField
                      label="Gender"
                      type="select"
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleSelectChange}
                      options={[
                        {label: 'Male', value: 'Male'},
                        {label: 'Female', value: 'Female'},
                        {label: 'Other', value: 'Other'},
                      ]}
                      required
                      className="w-full"
                    />
                    <CustomFormField
                      label="Nationality"
                      type="select"
                      name="Nationality"
                      value={formData.Nationality}
                      onChange={handleSelectChange}
                      options={nationalityResponse}
                      className="w-full"
                    />
                    <CustomFormField
                      label="ID Type"
                      type="select"
                      name="ID_Type"
                      value={formData.ID_Type}
                      onChange={handleSelectChange}
                      options={idTypeResponse}
                      className="w-full"
                    />
                    <div className="flex relative">
                      <CustomFormField
                        label="ID Number"
                        type="text"
                        name="ID_No"
                        value={formData.ID_No.toUpperCase()}
                        onChange={handleInputChange}
                        placeholder="Enter ID Number"
                        required
                        className="w-full"
                      />
                      {isIdValid && (
                        <span className="text-green-500 absolute top-[55%] right-4">
                          <FontAwesomeIcon icon={faCircleCheck} size="sm" />
                        </span>
                      )}
                    </div>
                    <CustomFormField
                      label="Marital Status"
                      type="select"
                      name="Marital_Status"
                      value={formData.Marital_Status}
                      onChange={handleSelectChange}
                      options={maritalStatusResponse}
                      className="w-full"
                    />
                    <div className="flex relative">
                      <CustomFormField
                        label="Mobile Number"
                        type="text"
                        name="Mobile_No"
                        value={formData.Mobile_No}
                        onChange={handleInputChange}
                        placeholder="Enter Mobile No."
                        required
                        className="w-full"
                      />
                      {isMobileValid && (
                        <span className="text-green-500 absolute top-[55%] right-4">
                          <FontAwesomeIcon icon={faCircleCheck} size="sm" />
                        </span>
                      )}
                    </div>

                    <CustomFormField
                      label="Email ID"
                      type="email"
                      name="Email_ID"
                      value={formData.Email_ID}
                      onChange={handleInputChange}
                      placeholder="Enter Email ID"
                      className="w-full"
                    />
                    <CustomFormField
                      label="Occupation"
                      type="select"
                      name="BloodGroup"
                      value={formData.BloodGroup}
                      onChange={handleSelectChange}
                      options={occupationResponse}
                      className="w-full"
                    />
                  </Row>
                  <div className="flex justify-end items-center">
                    <div>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={resetFormData}>
                        Clear
                      </Button>
                      <Button variant="primary" type="submit" size="md">
                        Save & Continue
                      </Button>
                    </div>
                  </div>
                </form>
              </Container>
            </CustomAccordionItem>

            <CustomAccordionItem
              title="Additional Details"
              index={1}
              activeIndex={activeIndex}
              onToggle={onToggle}>
              <Container>
                <form>
                  <Row className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 p-4">
                    <CustomFormField
                      label="Pincode"
                      type="text"
                      name="Pincode"
                      required
                      value={formData.Pincode}
                      onChange={handleInputChange}
                      placeholder="Enter Pincode"
                      className="w-full"
                    />
                    <CustomFormField
                      label="Country"
                      name="Country"
                      type="text"
                      placeholder="Country"
                      disabled
                      value={locationData?.countryName?.toUpperCase() ?? ''}
                      className="w-full cursor-not-allowed"
                    />
                    <CustomFormField
                      label="State"
                      name="State"
                      type="text"
                      placeholder={'State'}
                      disabled
                      value={locationData?.stateName?.toUpperCase() ?? ''}
                      className="w-full cursor-not-allowed"
                    />
                    <CustomFormField
                      label="City / District"
                      name="City"
                      type="text"
                      placeholder={'City / District'}
                      disabled
                      value={locationData?.cityName?.toUpperCase() ?? ''}
                      onChange={handleSelectChange}
                      options={stateResponse}
                      className="w-full cursor-not-allowed"
                    />
                    <CustomFormField
                      label="Area"
                      type="select"
                      name="Area"
                      required
                      value={formData.Area}
                      onChange={handleSelectChange}
                      options={areaListByPincodeResponse}
                      className="w-full"
                    />
                    <CustomFormField
                      label="Address"
                      type="text"
                      name="Address"
                      value={formData.Address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      className="w-full col-span-2"
                    />
                    <CustomFormField
                      label="Blood Group"
                      type="select"
                      name="BloodGroup"
                      value={formData.BloodGroup}
                      onChange={handleSelectChange}
                      options={bloodGroupResponse}
                      className="w-full"
                    />
                    <CustomFormField
                      label="Do you want special assistance?"
                      type="select"
                      name="Special_Assistance"
                      required
                      value={
                        formData.Special_Assistance === true ? 'true' : 'false'
                      }
                      onChange={handleSelectChange}
                      options={[
                        {value: true, label: 'Yes'},
                        {value: false, label: 'No'},
                      ]}
                      className="w-full"
                    />
                    {formData?.Special_Assistance === true ? (
                      <CustomFormField
                        label="Select Special Assistance"
                        type="select"
                        name="Select_Special_Assistance"
                        value={formData.Select_Special_Assistance}
                        onChange={handleSelectChange}
                        options={[
                          {value: '', label: 'Select Special Assistance'},
                          {value: 'Wheel Chair', label: 'WHEEL CHAIR'},
                          {value: 'Stretcher', label: 'STRETCHER'},
                          {value: 'Not Applicable', label: 'NOT APPLICABLE'},
                          {value: 'Others', label: 'OTHERS'},
                        ]}
                        className="w-full"
                      />
                    ) : null}
                  </Row>
                  <div className="flex justify-end items-center">
                    <div>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={resetFormData}>
                        Clear
                      </Button>
                      <Button variant="primary" type="submit" size="md">
                        Save & Continue
                      </Button>
                    </div>
                  </div>
                </form>
              </Container>
            </CustomAccordionItem>
          </>
        );
      }}
    </CustomAccordion>
  );
};

export default PatientPersonDetailForm;
