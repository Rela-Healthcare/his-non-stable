import React from 'react';
import {Form, Row} from 'react-bootstrap';
import FormField from './FormField';

const NextOfKin = ({formData, setFormData}) => {
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
        <FormField
          label="Relation Type"
          name="RelationType"
          value={formData?.RelationType}
          onChange={(e) =>
            setFormData({...formData, RelationType: e.target.value})
          }
        />
        <FormField
          label="Relation Name"
          name="RelationName"
          value={formData?.RelationName}
          onChange={(e) =>
            setFormData({...formData, RelationName: e.target.value})
          }
        />
        <FormField
          label="Relation Mobile No"
          name="RelationMobileNo"
          type="number"
          value={formData?.RelationMobileNo}
          onChange={(e) =>
            setFormData({...formData, RelationMobileNo: e.target.value})
          }
        />
        <FormField
          label="Kin Pincode"
          name="kin_Pincode"
          type="number"
          value={formData?.kin_Pincode}
          onChange={(e) =>
            setFormData({...formData, kin_Pincode: e.target.value})
          }
        />
        <FormField
          label="Kin Country Code"
          name="kin_CountryCode"
          value={formData?.kin_CountryCode}
          onChange={(e) =>
            setFormData({...formData, kin_CountryCode: e.target.value})
          }
        />
        <FormField
          label="Kin Country"
          name="kinCountry"
          value={formData?.kinCountry}
          onChange={(e) =>
            setFormData({...formData, kinCountry: e.target.value})
          }
        />
        <FormField
          label="Kin State Code"
          name="kin_StateCode"
          value={formData?.kin_StateCode}
          onChange={(e) =>
            setFormData({...formData, kin_StateCode: e.target.value})
          }
        />
        <FormField
          label="Kin State"
          name="kinState"
          value={formData?.kinState}
          onChange={(e) => setFormData({...formData, kinState: e.target.value})}
        />
        <FormField
          label="Kin City Code"
          name="kin_CityCode"
          value={formData?.kin_CityCode}
          onChange={(e) =>
            setFormData({...formData, kin_CityCode: e.target.value})
          }
        />
        <FormField
          label="Kin City"
          name="kinCity"
          value={formData?.kinCity}
          onChange={(e) => setFormData({...formData, kinCity: e.target.value})}
        />
        <FormField
          label="Kin Area Code"
          name="kin_AreaCode"
          value={formData?.kin_AreaCode}
          onChange={(e) =>
            setFormData({...formData, kin_AreaCode: e.target.value})
          }
        />
        <FormField
          label="Kin Area"
          name="kinArea"
          value={formData?.kinArea}
          onChange={(e) => setFormData({...formData, kinArea: e.target.value})}
        />
        <FormField
          label="Kin Address"
          name="kinAddress"
          value={formData?.kinAddress}
          onChange={(e) =>
            setFormData({...formData, kinAddress: e.target.value})
          }
        />
        <Form.Group controlId="takeContact">
          <Form.Check
            type="checkbox"
            label="Same as Above"
            name="takeContact"
            checked={formData?.takeContact === '1'}
            onChange={(e) =>
              setFormData({
                ...formData,
                takeContact: e.target.checked ? '1' : '',
              })
            }
          />
        </Form.Group>
      </Row>
    </Form>
  );
};

export default NextOfKin;
