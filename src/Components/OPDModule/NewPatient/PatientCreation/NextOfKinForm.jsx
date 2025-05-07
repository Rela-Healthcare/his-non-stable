import React from 'react';
import {Container, Form} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';
import {capitalize} from '../../../../utils/utils';
import {useMediaQuery} from '@mui/material';
import TruncatedText from '../../../../common/TruncatedText';
import FormActionButtons from './FormActionButtons';

const NextOfKinForm = ({
  formData,
  errors,
  dropdownData,
  additionalDetails,
  onChange,
  onSubmit,
  onReset,
  onBlur,
  isCheckedSameAsPatientAddress,
  isRelationMobileValid,
}) => {
  const {relationTypeResponse, kinAreaData} = dropdownData;
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <Container className="px-2 md:px-6">
      <Form noValidate onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
          <CustomFormField
            label="Relation Type"
            type="select"
            name="Relation_Type"
            onBlur={onBlur}
            required
            value={capitalize(formData.Relation_Type)}
            onChange={onChange}
            options={relationTypeResponse}
            className="w-full"
            isInvalid={!!errors.Relation_Type}
            errorMessage={errors.Relation_Type}
          />
          <CustomFormField
            label="Relation Name"
            type="text"
            name="Relation_Name"
            required
            value={capitalize(formData.Relation_Name)}
            onBlur={onBlur}
            onChange={onChange}
            placeholder="Enter relation name"
            className="w-full"
            isInvalid={!!errors.Relation_Name}
            errorMessage={errors.Relation_Name}
          />
          <CustomFormField
            label="Relation Mobile No."
            type="number"
            name="Relation_Mobile_No"
            value={formData.Relation_Mobile_No}
            onBlur={onBlur}
            onChange={onChange}
            required
            className="w-full"
            placeholder="Enter mobile number"
            isInvalid={!!errors.Relation_Mobile_No}
            errorMessage={errors.Relation_Mobile_No}
            validIcon={isRelationMobileValid}
          />
          <div
            className={`flex justify-center items-center col-span-1 ${
              !additionalDetails.Pincode && 'cursor-not-allowed'
            }`}>
            <Form.Group
              controlId="formBasicCheckbox"
              className="flex justify-center items-center w-full my-2">
              <Form.Check
                type="checkbox"
                label={
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className={`${
                      !additionalDetails.Pincode
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}>
                    {isMobile ? (
                      <TruncatedText
                        text="Same as above patient address"
                        maxLength={8}
                      />
                    ) : (
                      'Same as above patient address'
                    )}
                  </span>
                }
                name="same_as_patient_address"
                checked={isCheckedSameAsPatientAddress}
                onChange={onChange}
                onBlur={onBlur}
                className={`flex justify-center items-center gap-2 p-[0.8em] mt-[1.8rem] border border-black rounded-md w-full ${
                  !additionalDetails.Pincode &&
                  'bg-gray-200 h-full cursor-not-allowed'
                }`}
              />
            </Form.Group>
          </div>

          <CustomFormField
            label="Pincode"
            type="text"
            name="Kin_Pincode"
            onBlur={onBlur}
            required
            value={
              isCheckedSameAsPatientAddress
                ? additionalDetails.Pincode
                : formData?.Kin_Pincode
            }
            onChange={onChange}
            disabled={isCheckedSameAsPatientAddress}
            className="w-full"
            maxLength={6}
            placeholder="Enter pincode"
            isInvalid={!!errors.Kin_Pincode}
            errorMessage={errors.Kin_Pincode}
          />
          <CustomFormField
            label="Country"
            name="Kin_Country"
            type="text"
            disabled
            value={capitalize(formData?.countryName ?? '')}
            className="w-full cursor-not-allowed"
            placeholder="Country will be auto-filled"
          />
          <CustomFormField
            label="State"
            name="Kin_State"
            type="text"
            disabled
            value={formData?.stateName ?? ''}
            className="w-full cursor-not-allowed"
            placeholder="State will be auto-filled"
          />
          <CustomFormField
            label="City / District"
            name="Kin_City"
            type="text"
            disabled
            value={formData?.cityName ?? ''}
            className="w-full cursor-not-allowed"
            placeholder="City will be auto-filled"
          />
          <CustomFormField
            label="Area"
            type="select"
            name="Kin_Area"
            disabled={isCheckedSameAsPatientAddress}
            onBlur={onBlur}
            required
            value={
              isCheckedSameAsPatientAddress
                ? additionalDetails?.Area
                : formData?.Kin_Area ?? ''
            }
            onChange={onChange}
            options={kinAreaData}
            className="w-full"
            placeholder="Select area"
            isInvalid={!!errors.Kin_Area}
            errorMessage={errors.Kin_Area}
          />
          <CustomFormField
            label="Address"
            type="text"
            name="Kin_Address"
            onBlur={onBlur}
            disabled={isCheckedSameAsPatientAddress}
            value={
              isCheckedSameAsPatientAddress
                ? capitalize(additionalDetails?.Address)
                : capitalize(formData?.Kin_Address) ?? ''
            }
            onChange={onChange}
            className="w-full md:col-span-2"
            placeholder="Enter full address"
            isInvalid={!!errors.Kin_Address}
            errorMessage={errors.Kin_Address}
          />
        </div>
        <FormActionButtons onClear={onReset} /> {/* Clear and Save Button */}
      </Form>
    </Container>
  );
};

export default NextOfKinForm;
