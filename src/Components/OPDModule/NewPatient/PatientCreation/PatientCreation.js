import React, {useState, useEffect} from 'react';
import {Form, Accordion, Col, Row} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import {useDispatch, useSelector} from 'react-redux';
import {OPModuleAgent} from '../../../../agent/agent';
import CustomDropDown from '../../../../common/CustomDropDown/CustomDropDown';
import CustomFormInput from '../../../../common/CustomFormInput/CustomFormInput';
import {
  patientInformation,
  dropDownInformation,
  resetInformation,
} from '../../../../features/OPDModule/PatientCreation/PatientCreationSlice';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons';

const PatientCreation = () => {
  useEffect(() => {
    dispatch(resetInformation());
  }, []);

  const dispatch = useDispatch();
  const formData = useSelector(
    (state) => state?.patientCreation?.formData || {}
  );
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    validatePatientInfo();
    validateAdditionalInfo();
    validateKinInfo();
  }, [formData]);

  // const isFormValid = (fields) => fields.every((field) => field !== "");

  const validatePatientInfo = () => {
    if (
      formData?.SalutationName !== '' &&
      formData?.PatientName !== '' &&
      formData?.DOB !== '' &&
      formData?.Age !== '' &&
      formData?.Gender !== '' &&
      formData?.Nationality !== '' &&
      formData?.IDtype !== '' &&
      formData?.IDNo !== '' &&
      formData?.MaritalStatus !== '' &&
      formData?.MobileNo !== '' &&
      formData?.EmailId !== '' &&
      formData?.Occupation !== ''
    ) {
      dispatch(
        patientInformation({
          name: 'patientInfo',
          value: true,
        })
      );
    } else {
      dispatch(
        patientInformation({
          name: 'patientInfo',
          value: false,
        })
      );
    }
  };

  const validateAdditionalInfo = () => {
    if (
      formData?.Pincode !== '' &&
      formData?.Country !== '' &&
      formData?.State !== '' &&
      formData?.City !== '' &&
      formData?.Area !== '' &&
      formData?.Address !== '' &&
      formData?.religion !== '' &&
      formData?.Language !== '' &&
      formData?.BloodGroup !== '' &&
      formData?.specialAssistanceNeeded === '1' //check for any value (yes or no)
    ) {
      if (formData?.specialAssistanceDetailsIfYes !== '') {
        dispatch(
          patientInformation({
            name: 'additionalInfo',
            value: true,
          })
        );
      } else {
        dispatch(
          patientInformation({
            name: 'additionalInfo',
            value: false,
          })
        );
      }
    } else if (
      formData?.Pincode !== '' &&
      formData?.Country !== '' &&
      formData?.State !== '' &&
      formData?.City !== '' &&
      formData?.Area !== '' &&
      formData?.Address !== '' &&
      formData?.religion !== '' &&
      formData?.Language !== '' &&
      formData?.BloodGroup !== '' &&
      formData?.specialAssistanceNeeded === '0'
    ) {
      dispatch(
        patientInformation({
          name: 'additionalInfo',
          value: true,
        })
      );
    } else {
      dispatch(
        patientInformation({
          name: 'additionalInfo',
          value: false,
        })
      );
    }
  };
  const validateKinInfo = () => {
    if (
      formData?.kin_Pincode !== '' &&
      formData?.kinCountry !== '' &&
      formData?.kinState !== '' &&
      formData?.kinCity !== '' &&
      formData?.kinArea !== '' &&
      formData?.kinAddress !== '' &&
      formData?.RelationType !== '' &&
      formData?.RelationName !== '' &&
      formData?.RelationMobileNo !== ''
    ) {
      dispatch(
        patientInformation({
          name: 'kinInfo',
          value: true,
        })
      );
    } else {
      dispatch(
        patientInformation({
          name: 'kinInfo',
          value: false,
        })
      );
    }
  };

  // Automatically select country , state and city based on Pincode
  useEffect(() => {
    if (formData?.Pincode) {
      autoSelectStateAndCity();
    }
  }, [formData?.Pincode]);

  async function autoSelectStateAndCity() {
    if (formData?.Pincode) {
      try {
        const response = await OPModuleAgent.getCityStateCountryListByPinCode(
          formData?.Pincode
        );

        // access the response data
        const responseData = response.data;

        // Log the API response to verify the structure
        console.log('API Response:', responseData);

        // Check if the response contains valid stateName and cityName
        if (
          responseData &&
          responseData?.stateName &&
          responseData?.cityName &&
          responseData?.countryName
        ) {
          const {
            countryName,
            stateName,
            cityName,
            countryCode,
            stateCode,
            cityCode,
          } = responseData;

          // Dispatching the fetched data to Redux for state and city
          dispatch(patientInformation({name: 'Country', value: countryName}));
          dispatch(patientInformation({name: 'State', value: stateName}));
          dispatch(patientInformation({name: 'City', value: cityName}));
          dispatch(
            patientInformation({name: 'CountryCode', value: countryCode})
          );
          dispatch(patientInformation({name: 'StateCode', value: stateCode}));
          dispatch(patientInformation({name: 'CityCode', value: cityCode}));
        } else {
          console.error(
            'API response is missing stateName or cityName',
            responseData
          );
          // Optionally reset fields or show an error message
          dispatch(patientInformation({name: 'Country', value: ''}));
          dispatch(patientInformation({name: 'State', value: ''}));
          dispatch(patientInformation({name: 'City', value: ''}));
        }
      } catch (error) {
        console.error('Error fetching state and city data:', error);
      }
    } else {
      console.log('Pincode is empty or invalid');
    }
  }

  // Fetch areas based on Pincode
  useEffect(() => {
    if (formData?.Pincode) {
      areaListData();
    }
  }, [formData?.Pincode]);

  async function areaListData() {
    try {
      const areaResponse = (
        await OPModuleAgent.getAreaListByPincode(formData?.Pincode)
      ).data;
      dispatch(dropDownInformation({name: 'areaList', value: areaResponse}));
    } catch (error) {
      console.error('Error fetching area data:', error);
    }
  }
  //-----------end country state city data fetch -----------//

  //----------    kinCountry , kinState, kinCity  code start     -----------//

  // This effect runs when the kin's Pincode changes
  useEffect(() => {
    if (formData?.kin_Pincode) {
      autoSelectKinStateAndCity();
    }
  }, [formData?.kin_Pincode]); // Only trigger when `kin_Pincode` changes

  async function autoSelectKinStateAndCity() {
    if (formData?.kin_Pincode) {
      try {
        const response = await OPModuleAgent.getCityStateCountryListByPinCode(
          formData?.kin_Pincode
        );
        const responseData = response.data;

        if (
          responseData &&
          responseData?.stateName &&
          responseData?.cityName &&
          responseData?.countryName
        ) {
          const {
            countryName,
            stateName,
            cityName,
            countryCode,
            stateCode,
            cityCode,
          } = responseData;

          // Dispatch the response to update Redux state for kin's country, state, and city
          dispatch(
            patientInformation({name: 'kinCountry', value: countryName})
          );
          dispatch(patientInformation({name: 'kinState', value: stateName}));
          dispatch(patientInformation({name: 'kinCity', value: cityName}));
          dispatch(
            patientInformation({name: 'kinCountryCode', value: countryCode})
          );
          dispatch(
            patientInformation({name: 'kinStateCode', value: stateCode})
          );
          dispatch(patientInformation({name: 'kinCityCode', value: cityCode}));
        } else {
          console.error(
            "API response is missing kin's stateName, cityName, or countryName",
            responseData
          );
          // Optionally reset fields if the API response is incomplete
          dispatch(patientInformation({name: 'kinCountry', value: ''}));
          dispatch(patientInformation({name: 'kinState', value: ''}));
          dispatch(patientInformation({name: 'kinCity', value: ''}));
        }
      } catch (error) {
        console.error("Error fetching kin's state and city data:", error);
      }
    } else {
      console.log("Kin's Pincode is empty or invalid");
    }
  }

  useEffect(() => {
    // Check if the "Same as Above" checkbox is checked
    if (formData?.takeContact === '1') {
      // Populate kin's details from the patient's information
      dispatch(
        patientInformation({name: 'kin_Pincode', value: formData?.Pincode})
      );
      dispatch(
        patientInformation({
          name: 'kin_StateCode',
          value: formData?.StateCode,
        })
      );
      dispatch(patientInformation({name: 'kinState', value: formData?.State}));
      dispatch(
        patientInformation({
          name: 'kin_CountryCode',
          value: formData?.CountryCode,
        })
      );
      dispatch(
        patientInformation({name: 'kinCountry', value: formData?.Country})
      );
      dispatch(
        patientInformation({name: 'kin_CityCode', value: formData?.CityCode})
      );
      dispatch(patientInformation({name: 'kinCity', value: formData?.City}));
      dispatch(
        patientInformation({name: 'kin_AreaCode', value: formData?.AreaCode})
      );
      dispatch(patientInformation({name: 'kinArea', value: formData?.Area}));
      dispatch(
        patientInformation({name: 'kinAddress', value: formData?.Address})
      );

      // Call autoSelectKinStateAndCity when Pincode is available
      if (formData?.Pincode) {
        autoSelectKinStateAndCity();
      }
    } else {
      // Reset kin's details when checkbox is unchecked
      dispatch(patientInformation({name: 'kin_Pincode', value: ''}));
      dispatch(patientInformation({name: 'kin_StateCode', value: ''}));
      dispatch(patientInformation({name: 'kinState', value: ''}));
      dispatch(patientInformation({name: 'kin_CountryCode', value: ''}));
      dispatch(patientInformation({name: 'kinCountry', value: ''}));
      dispatch(patientInformation({name: 'kin_CityCode', value: ''}));
      dispatch(patientInformation({name: 'kinCity', value: ''}));
      dispatch(patientInformation({name: 'kin_AreaCode', value: ''}));
      dispatch(patientInformation({name: 'kinArea', value: ''}));
      dispatch(patientInformation({name: 'kinAddress', value: ''}));
    }
  }, [formData?.takeContact, formData?.Pincode]); // Monitor changes to both `takeContact` and `Pincode`

  // Fetch kin's area based on kin_Pincode
  useEffect(() => {
    if (formData?.kin_Pincode) {
      fetchKinAreaList();
    }
  }, [formData?.kin_Pincode]);

  async function fetchKinAreaList() {
    try {
      const kinAreaResponse = (
        await OPModuleAgent.getAreaListByPincode(formData?.kin_Pincode)
      ).data;
      dispatch(
        dropDownInformation({name: 'kin_areaList', value: kinAreaResponse})
      );
    } catch (error) {
      console.error('Error fetching kin area data:', error);
    }
  }

  //kinCountry , kinState, kinCity  code end //

  useEffect(() => {
    fetchData();
  }, [formData?.Pincode]);

  async function fetchData() {
    try {
      const salutationsResponse = (await OPModuleAgent.getSalutations()).data;
      const departmentsResponse = (await OPModuleAgent.getDepartments()).data;
      const mobileCodeResponse = (await OPModuleAgent.getMobileCodeList()).data;
      const maritalStatusResponse = (await OPModuleAgent.getMaritalStatusList()).data;
      const occupationResponse = (await OPModuleAgent.getOccupationList()).data;
      const nationalityResponse = (await OPModuleAgent.getNationalityList()).data;
      const idTypeResponse = (await OPModuleAgent.getIdTypeList()).data;
      const countriesResponse = (await OPModuleAgent.getCountriesList()).data;
      const stateResponse = (await OPModuleAgent.getStateList()).data;
      const relationTyeResponse = (await OPModuleAgent.getRelationTypeList()).data;
      const bloodGroupResponse = (await OPModuleAgent.getBloodGroupList()).data;
      const religionResponse = (await OPModuleAgent.getReligionList()).data;
      const languageResponse = (await OPModuleAgent.getLanguageList()).data;
      const AreaListByPincodeResponse = (
        await OPModuleAgent.getAreaListByPincode()
      ).data;

      dispatch(
        dropDownInformation({
          name: 'salutationList',
          value: salutationsResponse,
        })
      );

      dispatch(
        dropDownInformation({
          name: 'departmentList',
          value: departmentsResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'mobileCodeList',
          value: mobileCodeResponse,
        })
      );

      dispatch(
        dropDownInformation({
          name: 'maritalStatusList',
          value: maritalStatusResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'occupationList',
          value: occupationResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'nationalityList',
          value: nationalityResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'idTypeList',
          value: idTypeResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'countryList',
          value: countriesResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'stateList',
          value: stateResponse,
        })
      );

      dispatch(
        dropDownInformation({
          name: 'relationList',
          value: relationTyeResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'bloodGroupList',
          value: bloodGroupResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'religionList',
          value: religionResponse,
        })
      );
      dispatch(
        dropDownInformation({
          name: 'langList',
          value: languageResponse,
        })
      );
    } catch (error) {
      //console.error("Error fetching data:", error);
    }
  }

  const handleStartDateChange = (date) => {
    setStartDate(date);

    // Format the date to 'yyyy-mm-dd' for the patient information
    const formattedDate = date.toISOString().split('T')[0];

    dispatch(
      patientInformation({
        name: 'DOB',
        value: formattedDate,
      })
    );

    // Calculate age using the new ageCalculator function
    const calculatedAge = ageCalculator(formattedDate);
    dispatch(
      patientInformation({
        name: 'Age',
        value: calculatedAge,
      })
    );
  };

  const handleDeathDateChange = (date) => {
    setStartDate(date);
    // Format the date to 'yyyy-mm-dd' for the patient information
    const formattedDate = date.toISOString().split('T')[0];

    dispatch(
      patientInformation({
        name: 'DateOfDeath',
        value: formattedDate,
      })
    );
  };

  const ageCalculator = (dob) => {
    const birthDate = new Date(dob); // Convert to Date object
    const today = new Date(); // Get current date
    let age = today.getFullYear() - birthDate.getFullYear(); // Calculate year difference
    const monthDifference = today.getMonth() - birthDate.getMonth(); // Calculate month difference

    // If today is before the birthday this year, subtract one from age
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age; // Return the calculated age
  };

  const handleTakeContact = (event) => {
    if (formData?.takeContact === '1') {
      dispatch(
        patientInformation({
          name: 'takeContact',
          value: '0',
        })
      );
    } else {
      dispatch(
        patientInformation({
          name: 'takeContact',
          value: '1',
        })
      );
    }
  };

  const handleSpecialAssistanceChange = (event) => {
    const {name, value} = event.target;
    dispatch(
      patientInformation({
        name,
        value,
      })
    );
    if (value === '0') {
      dispatch(
        patientInformation({
          name: 'specialAssistanceDetailsIfYes',
          value: '',
        })
      );
      dispatch(
        patientInformation({
          name: 'specialAssistanceDetailsIfOthers',
          value: '',
        })
      );
    }
  };
  const handleSpecialAssistance = (event) => {
    const {name, value} = event.target;
    dispatch(
      patientInformation({
        name,
        value,
      })
    );
  };
  const handleOtherSpecialAssistance = (event) => {
    const {name, value} = event.target;
    dispatch(
      patientInformation({
        name,
        value,
      })
    );
  };
  //console.log(formData);

  const handleSalutationChange = (event) => {
    const {name, value} = event.target;
    dispatch(
      patientInformation({
        name,
        value: value,
      })
    );

    dispatch(
      patientInformation({
        name: 'patientTitle',
        value: value,
      })
    );

    // Update gender dropdown based on selected salutation
    const genders = formData?.genderList[value] || [];
    dispatch(
      patientInformation({
        name: 'Gender',
        value: genders.length === 1 ? genders[0] : '',
      })
    );

    dispatch(
      dropDownInformation({
        name: 'availableGenders',
        value: genders,
      })
    );
  };

  return (
    <>
      <Row mb={5}>
        <Accordion style={{marginBottom: '10px'}}>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <div>Personal Details </div>
              {formData?.patientInfo ? (
                <div style={{marginLeft: '7px'}}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    style={{
                      color: 'green',
                      width: '20px',
                      height: '20px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              ) : (
                <div style={{marginLeft: '7px'}}>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{
                      color: 'red',
                      width: '20px',
                      height: '20px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Form.Group
                  as={Col}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={2}></Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={2} xl={2}>
                  <Form.Label className="mandatory">Salutation</Form.Label>
                  <Form.Select
                    className="select"
                    name="SalutationName"
                    onChange={(event) => handleSalutationChange(event)}
                    defaultValue={''}>
                    <option value="" disabled>
                      Select Salutation
                    </option>
                    {formData?.salutationList?.map((value) => (
                      <option key={value.columnCode} value={value.columnCode}>
                        {value.columnName || 'Unknown'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={4} xl={4}>
                  <CustomFormInput
                    className="select"
                    name="PatientName"
                    label="Patient Name"
                    type="text"
                    // required
                    placeholder="Patient Name"
                    pattern="[A-Za-z]+"
                    inputMode="text"
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Form.Label
                    style={{paddingLeft: '12px'}}
                    className="mandatory">
                    DOB
                  </Form.Label>
                  <div>
                    <DatePicker
                      className="select form-control"
                      selected={startDate}
                      onChange={handleStartDateChange}
                      placeholderText="Date of Birth"
                      dateFormat="MMMM d, yyyy"
                      yearDropdownItemNumber={150}
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      scrollableMonthDropdown
                      maxDate={new Date()}
                      minDate={new Date('1900-01-01')}
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    className="select"
                    name="Age"
                    type="text"
                    // required
                    readOnly
                    placeholder="Age"
                    value={formData?.Age} // This should reflect the calculated age
                    disabled={formData?.DOB !== '' ? false : true}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Form.Label className="mandatory">Gender</Form.Label>
                  <Form.Select
                    className="select"
                    name="Gender"
                    onChange={(event) =>
                      dispatch(
                        patientInformation({
                          name: 'Gender',
                          value: event.target.value,
                        })
                      )
                    }
                    value={formData?.Gender}>
                    <option value="" disabled>
                      Select Gender
                    </option>
                    {formData?.availableGenders?.map((gender, index) => (
                      <option key={index} value={gender}>
                        {gender === 'M'
                          ? 'Male'
                          : gender === 'F'
                          ? 'Female'
                          : 'Third Gender'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomDropDown
                    name="Nationality"
                    additionalname="NationalityName"
                    label="Nationality"
                    type="text"
                    className="select"
                    placeholder="Patient Nationality"
                    options={formData?.nationalityList}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomDropDown
                    name="IDtype"
                    label="ID Type"
                    type="text"
                    className="select"
                    placeholder="ID Type"
                    options={formData?.idTypeList}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomFormInput
                    className="select"
                    name="IDNo"
                    label="ID No"
                    type="text"
                    // required
                    IDtype={formData?.IDtype}
                    placeholder="Enter ID No"
                  />
                </Form.Group>
              </Row>
              <Row>
                {console.log('my-formdata', formData)}
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomDropDown
                    name="MaritalStatus"
                    label="Marital Status"
                    type="text"
                    className="select"
                    placeholder="Marital Status"
                    options={formData?.maritalStatusList}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomFormInput
                    className="select"
                    label="Mobile No"
                    name="MobileNo"
                    type="number"
                    required
                    placeholder="Enter Mobile No"
                    pattern={/^[1-9]{1}[0-9]{9}$/}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomFormInput
                    className="select"
                    label="Email ID"
                    name="EmailId"
                    type="email"
                    required
                    pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                    placeholder="Enter Email Id"
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CustomDropDown
                    name="Occupation"
                    additionalname="OccupationName"
                    label="Occupation"
                    type="text"
                    className="select"
                    placeholder="Select occupation"
                    options={formData?.occupationList}
                  />
                </Form.Group>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion style={{marginBottom: '10px'}}>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <div>Additional Details</div>
              {formData?.additionalInfo ? (
                <div style={{marginLeft: '7px'}}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    style={{
                      color: 'green',
                      width: '20px',
                      height: '20px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              ) : (
                <div style={{marginLeft: '7px'}}>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{
                      color: 'red',
                      width: '20px',
                      height: '20px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomFormInput
                    className="select"
                    label="Pincode"
                    name="Pincode"
                    type="number"
                    required
                    pattern={/^[1-9]{1}[0-9]{5}$/}
                    placeholder="Enter Pincode"
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="CountryCode"
                    additionalname="Country"
                    label="Country"
                    type="text"
                    className="select"
                    placeholder="Select Country"
                    value={formData?.Country}
                    options={formData?.countryList}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3}>
                  <CustomDropDown
                    name="StateCode"
                    additionalname="State"
                    label="State"
                    type="text"
                    className="select"
                    placeholder="Select State"
                    value={formData?.State}
                    options={formData?.stateList}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3}>
                  <CustomDropDown
                    name="CityCode"
                    additionalname="City"
                    label="City"
                    type="text"
                    className="select"
                    placeholder="Select City"
                    value={formData?.City}
                    options={formData?.cityList}
                    disabled={formData?.State !== '' ? false : true}
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3}>
                  <CustomDropDown
                    name="AreaCode"
                    additionalname="Area"
                    label="Area"
                    type="text"
                    className="select"
                    placeholder="Select Area"
                    options={formData?.areaList}
                    disabled={formData?.Pincode !== '' ? false : true}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  {' '}
                  <CustomFormInput
                    className="select"
                    label="Address"
                    name="Address"
                    type="text"
                    required
                    readOnly
                    placeholder="Enter Address"
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  {' '}
                  <CustomDropDown
                    name="religion"
                    type="text"
                    label="Religion"
                    className="select"
                    placeholder="Select Religion"
                    options={formData?.religionList}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  {' '}
                  <CustomDropDown
                    name="Language"
                    additionalname="LanguageName"
                    label="Language"
                    type="text"
                    className="select"
                    placeholder="Preffered Language"
                    options={formData?.langList}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="BloodGroup"
                    label="BloodGroup"
                    type="text"
                    className="select"
                    placeholder="Select Blood Group"
                    options={formData?.bloodGroupList}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Form.Label
                    style={{paddingLeft: '12px'}}
                    className="mandatory">
                    Update Death Date
                  </Form.Label>
                  <div>
                    <DatePicker
                      className="select form-control"
                      selected={startDate}
                      onChange={handleDeathDateChange}
                      placeholderText="Date of Death"
                      dateFormat="MMMM d, yyyy"
                      yearDropdownItemNumber={150}
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      scrollableMonthDropdown
                      maxDate={new Date()}
                      minDate={new Date('1900-01-01')}
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={4} lg={2} xl={2}>
                  {['radio'].map((type) => (
                    <div key={`default-${type}`} className="mb-3 ">
                      <Form.Label className="mandatory">
                        Special Assistance
                      </Form.Label>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'stretch',
                          flexWrap: 'wrap',
                          alignContent: 'stretch',
                        }}>
                        <Form.Check // prettier-ignore
                          type={type}
                          name="specialAssistanceNeeded"
                          id="SpecialAssistanceYes"
                          label="Yes"
                          value="1"
                          checked={formData?.specialAssistanceNeeded === '1'}
                          onChange={handleSpecialAssistanceChange}
                        />

                        <Form.Check // prettier-ignore
                          type={type}
                          name="specialAssistanceNeeded"
                          id="SpecialAssistanceNo"
                          label="No"
                          value="0"
                          checked={formData?.specialAssistanceNeeded === '0'}
                          onChange={handleSpecialAssistanceChange}
                        />
                      </div>
                    </div>
                  ))}
                </Form.Group>
                {formData?.specialAssistanceNeeded === '1' && (
                  <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                    {' '}
                    <Form.Label className="mandatory">
                      Select Special Assistance
                    </Form.Label>
                    <Form.Select
                      className="select"
                      name="specialAssistanceDetailsIfYes"
                      value={formData?.specialAssistanceDetailsIfYes}
                      onChange={handleSpecialAssistance}>
                      <option value={''}>Select Special Assistance</option>
                      <option value="Wheel Chair">WHEEL CHAIR</option>
                      <option value="Stretcher"> STRETCHER</option>
                      <option value="Not Applicable">NOT APPLICABLE</option>
                      <option value="Others">OTHERS</option>
                    </Form.Select>
                  </Form.Group>
                )}

                {formData?.specialAssistanceNeeded === '1' &&
                  formData?.specialAssistanceDetailsIfYes === 'Others' && (
                    <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                      <Form.Label className="mandatory">
                        Spl.Assist Remarks
                      </Form.Label>
                      <Form.Control
                        className="select"
                        name="specialAssistanceDetailsIfOthers"
                        value={formData?.specialAssistanceDetailsIfOthers}
                        onChange={handleOtherSpecialAssistance}
                        placeholder="Please Specify if others"></Form.Control>
                    </Form.Group>
                  )}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion style={{marginBottom: '10px'}}>
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <div>Next of Kin</div>
              {formData?.kinInfo ? (
                <div style={{marginLeft: '7px'}}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    style={{
                      color: 'green',
                      width: '20px',
                      height: '20px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              ) : (
                <div style={{marginLeft: '7px'}}>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    style={{
                      color: 'red',
                      width: '20px',
                      height: '20px',
                      textAlign: 'center',
                    }}
                  />
                </div>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group
                as={Col}
                style={{display: 'flex', alignItems: 'center'}}
                lg={3}>
                <Form.Control
                  className="select"
                  value={'Same as Above'}
                  disabled
                  style={{
                    backgroundColor: 'none',
                    border: 'none',
                  }}
                />
                <Form.Check
                  name="Same as Above"
                  type="checkbox"
                  value="1"
                  checked={formData?.takeContact === '1'}
                  onChange={handleTakeContact}
                />
              </Form.Group>
              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="RelationTypeCode"
                    additionalname="RelationType"
                    type="text"
                    label="Relation Type"
                    className="select"
                    placeholder="Select Relation Type"
                    options={formData?.relationList}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomFormInput
                    className="select"
                    label="Relation Name"
                    name="RelationName"
                    type="text"
                    required
                    readOnly
                    placeholder="Relation Name"
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomFormInput
                    className="select"
                    label="Relation Mobile No"
                    name="RelationMobileNo"
                    type="number"
                    required
                    pattern={/^[1-9]{1}[0-9]{9}$/}
                    placeholder="Relation Mobile No"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomFormInput
                    className="select"
                    label="Kin Pincode"
                    name="kin_Pincode"
                    type="number"
                    value={formData?.kin_Pincode}
                    required
                    pattern={/^[1-9]{1}[0-9]{5}$/}
                    placeholder="Kin PinCode"
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="kin_CountryCode"
                    additionalname="kinCountry"
                    label="Kin Country"
                    type="text"
                    className="select"
                    placeholder="Select Kin's Country"
                    options={formData?.countryList}
                    value={formData?.kinCountry}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="kin_StateCode"
                    additionalname="kinState"
                    label="Kin State"
                    type="text"
                    className="select"
                    value={formData?.kinState}
                    placeholder="Select Kin's State"
                    options={formData?.stateList}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="kin_CityCode"
                    additionalname="kinCity"
                    label="City"
                    type="text"
                    className="select"
                    value={formData?.kinCity}
                    placeholder="Select City"
                    options={formData?.kin_cityList}
                    disabled={formData?.kinState !== '' ? false : true}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={3}>
                  <CustomDropDown
                    name="kin_AreaCode"
                    additionalname="kinArea"
                    label="Kin Area"
                    type="text"
                    className="select"
                    value={formData?.kinArea}
                    placeholder="Select Kin's Area"
                    options={formData?.kin_areaList}
                    disabled={formData?.kin_Pincode !== '' ? false : true}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} md={6} lg={6}>
                  <CustomFormInput
                    className="select"
                    label="Kin Address"
                    name="kinAddress"
                    type="text"
                    required
                    value={formData?.kinAddress}
                    placeholder="Kin's Address"
                  />
                </Form.Group>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </>
  );
};

export default PatientCreation;
