import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import CustomDatePicker from '../../common/form/CustomDatePicker';
import CustomSelect from '../../common/form/CustomSelect';
import CustomTextInput from '../../common/form/CustomTextIput';
import {
  CustomAccordion,
  CustomAccordionItem,
} from '../../common/CustomAccordionItem';

const PatientPersonDetailForm = () => {
  const [formData, setFormData] = useState({
    SalutionId: null,
    Name: '',
    DOB: '',
    Age: null,
    Gender: '',
    Nationality: null,
    ID_Type: null,
    ID_No: '',
    Marital_Status: '',
    Mobile_No: '',
    Email_ID: '',
    Occupation: null,
    Pincode: '',
    Country: null,
    State: null,
    City: null,
    Area: null,
    Address: '',
    Religion: null,
    Language: null,
    BloodGroup: null,
    Special_Assistance: null,
    Select_Special_Assistance: '',
    Spl_Assist_Remarks: '',
    Update_Death_Date: '',
    Relation_Type: null,
    Relation_Name: '',
    Relation_Mobile_No: '',
    Kin_Pincode: '',
    Kin_Country: null,
    Kin_State: null,
    Kin_City: null,
    Kin_Area: null,
    Kin_Address: '',
  });

  // Handle input change for form data
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select change for form data
  const handleSelectChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle date picker change for form data
  const handleDateChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Submit form data or call API
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomAccordion>
        {({activeIndex, onToggle}) => (
          <>
            <CustomAccordionItem
              title="Patient Details"
              index={0}
              activeIndex={activeIndex}
              onToggle={onToggle}>
              <div className="py-3">
                {/* Salutation */}
                <CustomSelect
                  label="Salutation"
                  name="Salutation"
                  value={formData.Salutation}
                  onChange={handleSelectChange}
                  options={[
                    {value: 'Male', label: 'Male'},
                    {value: 'Female', label: 'Female'},
                    {value: 'Other', label: 'Other'},
                  ]}
                  placeholder="Select Salutation"
                />
              </div>
            </CustomAccordionItem>

            <CustomAccordionItem
              title="Appointment Details"
              index={1}
              activeIndex={activeIndex}
              onToggle={onToggle}>
              <p>This is the appointment details section.</p>
            </CustomAccordionItem>

            <CustomAccordionItem
              title="Payment Details"
              index={2}
              activeIndex={activeIndex}
              onToggle={onToggle}>
              <p>This is the payment details section.</p>
            </CustomAccordionItem>
          </>
        )}
      </CustomAccordion>

      {/* Name */}
      <CustomTextInput
        label="Name"
        name="Name"
        value={formData.Name}
        onChange={handleInputChange}
        placeholder="Enter your name"
      />

      {/* Date of Birth */}
      <CustomDatePicker
        label="Date of Birth"
        name="DOB"
        value={formData.DOB}
        onChange={handleDateChange}
      />

      {/* Gender */}
      <CustomSelect
        label="Gender"
        name="Gender"
        value={formData.Gender}
        onChange={handleSelectChange}
        options={[
          {value: 'Male', label: 'Male'},
          {value: 'Female', label: 'Female'},
          {value: 'Other', label: 'Other'},
        ]}
        placeholder="Select Gender"
      />

      {/* Mobile No */}
      <CustomTextInput
        label="Mobile Number"
        name="Mobile_No"
        value={formData.Mobile_No}
        onChange={handleInputChange}
        placeholder="Enter your mobile number"
        type="tel"
      />

      {/* Email ID */}
      <CustomTextInput
        label="Email ID"
        name="Email_ID"
        value={formData.Email_ID}
        onChange={handleInputChange}
        placeholder="Enter your email"
        type="email"
      />

      {/* Address */}
      <CustomTextInput
        label="Address"
        name="Address"
        value={formData.Address}
        onChange={handleInputChange}
        placeholder="Enter your address"
      />

      {/* Pincode */}
      <CustomTextInput
        label="Pincode"
        name="Pincode"
        value={formData.Pincode}
        onChange={handleInputChange}
        placeholder="Enter your pincode"
      />

      {/* Marital Status */}
      <CustomSelect
        label="Marital Status"
        name="Marital_Status"
        value={formData.Marital_Status}
        onChange={handleSelectChange}
        options={[
          {value: 'Married', label: 'Married'},
          {value: 'Single', label: 'Single'},
          {value: 'Divorced', label: 'Divorced'},
          {value: 'Widowed', label: 'Widowed'},
        ]}
        placeholder="Select Marital Status"
      />

      {/* Submit Button */}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default PatientPersonDetailForm;
