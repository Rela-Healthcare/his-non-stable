import React from 'react';
import {Form, Row} from 'react-bootstrap';
import FormField from './FormField';

const PersonalDetails = ({formData, setFormData}) => {
  return (
    <Form>
      <Row style={{padding: '10px'}}>
        {/* Salutation Name */}
        <FormField
          label="Salutation Name"
          name="SalutationName"
          value={formData?.SalutationName}
          onChange={(e) =>
            setFormData({...formData, SalutationName: e.target.value})
          }
          disabled
        />

        {/* Patient Name */}
        <FormField
          label="Patient Name"
          name="PatientName"
          value={formData?.PatientName}
          onChange={(e) =>
            setFormData({...formData, PatientName: e.target.value})
          }
          disabled
        />

        {/* Date of Birth */}
        <FormField
          label="Date of Birth"
          name="DOB"
          type="date"
          value={formData?.DOB}
          onChange={(e) => setFormData({...formData, DOB: e.target.value})}
          disabled
        />

        {/* Age */}
        <FormField
          label="Age"
          name="Age"
          type="number"
          value={formData?.Age}
          onChange={(e) => setFormData({...formData, Age: e.target.value})}
          disabled
        />

        {/* Gender */}
        <FormField
          label="Gender"
          name="Gender"
          value={formData?.Gender}
          onChange={(e) => setFormData({...formData, Gender: e.target.value})}
          disabled
        />

        {/* Nationality */}
        <FormField
          label="Nationality"
          name="Nationality"
          value={formData?.Nationality}
          onChange={(e) =>
            setFormData({...formData, Nationality: e.target.value})
          }
          disabled
        />

        {/* ID Type */}
        <FormField
          label="ID Type"
          name="IDtype"
          value={formData?.IDtype}
          onChange={(e) => setFormData({...formData, IDtype: e.target.value})}
          disabled
        />

        {/* ID Number */}
        <FormField
          label="ID Number"
          name="IDNo"
          value={formData?.IDNo}
          onChange={(e) => setFormData({...formData, IDNo: e.target.value})}
          disabled
        />

        {/* Marital Status */}
        <FormField
          label="Marital Status"
          name="MaritalStatus"
          value={formData?.MaritalStatus}
          onChange={(e) =>
            setFormData({...formData, MaritalStatus: e.target.value})
          }
          disabled
        />

        {/* Mobile Number */}
        <FormField
          label="Mobile Number"
          name="MobileNo"
          type="tel"
          value={formData?.MobileNo}
          onChange={(e) => setFormData({...formData, MobileNo: e.target.value})}
          disabled
        />

        {/* Email ID */}
        <FormField
          label="Email ID"
          name="EmailId"
          type="email"
          value={formData?.EmailId}
          onChange={(e) => setFormData({...formData, EmailId: e.target.value})}
          disabled
        />

        {/* Occupation */}
        <FormField
          label="Occupation"
          name="Occupation"
          value={formData?.Occupation}
          onChange={(e) =>
            setFormData({...formData, Occupation: e.target.value})
          }
          disabled
        />
      </Row>
    </Form>
  );
};

export default PersonalDetails;
