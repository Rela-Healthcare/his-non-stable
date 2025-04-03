import React from 'react';
import {Form, Row} from 'react-bootstrap';
import FormField from './FormField';

const AdditionalDetails = ({formData, setFormData}) => {
  return (
    <Form>
      <Row>
        <FormField
          label="Salutation Name"
          name="SalutationName"
          value={formData?.SalutationName}
          onChange={(e) =>
            setFormData({...formData, SalutationName: e.target.value})
          }
          disabled
        />
      </Row>

      <Row>
        <FormField
          label="Pincode"
          name="Pincode"
          value={formData?.Pincode}
          onChange={(e) => setFormData({...formData, Pincode: e.target.value})}
        />

        <FormField
          label="Country Code"
          name="CountryCode"
          value={formData?.CountryCode}
          onChange={(e) =>
            setFormData({...formData, CountryCode: e.target.value})
          }
        />

        <FormField
          label="Country"
          name="Country"
          value={formData?.Country}
          onChange={(e) => setFormData({...formData, Country: e.target.value})}
        />
      </Row>

      <Row>
        <FormField
          label="State Code"
          name="StateCode"
          value={formData?.StateCode}
          onChange={(e) =>
            setFormData({...formData, StateCode: e.target.value})
          }
        />

        <FormField
          label="State"
          name="State"
          value={formData?.State}
          onChange={(e) => setFormData({...formData, State: e.target.value})}
        />
      </Row>

      <Row>
        <FormField
          label="City Code"
          name="CityCode"
          value={formData?.CityCode}
          onChange={(e) => setFormData({...formData, CityCode: e.target.value})}
        />

        <FormField
          label="City"
          name="City"
          value={formData?.City}
          onChange={(e) => setFormData({...formData, City: e.target.value})}
        />
      </Row>

      <Row>
        <FormField
          label="Area Code"
          name="AreaCode"
          value={formData?.AreaCode}
          onChange={(e) => setFormData({...formData, AreaCode: e.target.value})}
        />

        <FormField
          label="Area"
          name="Area"
          value={formData?.Area}
          onChange={(e) => setFormData({...formData, Area: e.target.value})}
        />
      </Row>

      <Row>
        <FormField
          label="Address"
          name="Address"
          value={formData?.Address}
          onChange={(e) => setFormData({...formData, Address: e.target.value})}
        />
      </Row>

      <Row>
        <FormField
          label="Religion"
          name="religion"
          value={formData?.religion}
          onChange={(e) => setFormData({...formData, religion: e.target.value})}
        />

        <FormField
          label="Language"
          name="Language"
          value={formData?.Language}
          onChange={(e) => setFormData({...formData, Language: e.target.value})}
        />

        <FormField
          label="Language Name"
          name="LanguageName"
          value={formData?.LanguageName}
          onChange={(e) =>
            setFormData({...formData, LanguageName: e.target.value})
          }
        />
      </Row>

      <Row>
        <FormField
          label="Blood Group"
          name="BloodGroup"
          value={formData?.BloodGroup}
          onChange={(e) =>
            setFormData({...formData, BloodGroup: e.target.value})
          }
        />
      </Row>

      <Row>
        <FormField
          label="Special Assistance Needed"
          name="specialAssistanceNeeded"
          value={formData?.specialAssistanceNeeded}
          onChange={(e) =>
            setFormData({...formData, specialAssistanceNeeded: e.target.value})
          }
        />

        <FormField
          label="Special Assistance Details (If Yes)"
          name="specialAssistanceDetailsIfYes"
          value={formData?.specialAssistanceDetailsIfYes}
          onChange={(e) =>
            setFormData({
              ...formData,
              specialAssistanceDetailsIfYes: e.target.value,
            })
          }
        />

        <FormField
          label="Special Assistance Details (If Others)"
          name="specialAssistanceDetailsIfOthers"
          value={formData?.specialAssistanceDetailsIfOthers}
          onChange={(e) =>
            setFormData({
              ...formData,
              specialAssistanceDetailsIfOthers: e.target.value,
            })
          }
        />
      </Row>
    </Form>
  );
};

export default AdditionalDetails;
