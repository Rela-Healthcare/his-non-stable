import React from 'react';
import {Button, Container, Form} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {motion} from 'framer-motion';
import {capitalize} from '../../../../utils/utils';

const NextOfKinForm = ({
  formData,
  errors,
  dropdownData,
  kinLocationData,
  locationData,
  additionalDetails,
  onChange,
  onSubmit,
  onReset,
  isCheckedSameAsPatientAddress,
  onCheckboxChange,
  isRelationMobileValid,
}) => {
  const {relationTypeResponse, kinAreaData} = dropdownData;

  return (
    <Container className="max-w-full">
      <Form noValidate onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
          <CustomFormField
            label="Relation Type"
            type="select"
            name="Relation_Type"
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
            onChange={onChange}
            placeholder="Enter relation name"
            className="w-full"
            isInvalid={!!errors.Relation_Name}
            errorMessage={errors.Relation_Name}
          />
          <div className="relative w-full">
            <CustomFormField
              label="Relation Mobile No."
              type="number"
              name="Relation_Mobile_No"
              value={formData.Relation_Mobile_No}
              onChange={onChange}
              required
              className="w-full"
              placeholder="Enter mobile number"
              isInvalid={!!errors.Relation_Mobile_No}
              errorMessage={errors.Relation_Mobile_No}
            />
            {isRelationMobileValid && (
              <motion.span
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3}}
                className="text-green-500 absolute top-[47%] right-2">
                <FontAwesomeIcon icon={faCircleCheck} size="sm" />
              </motion.span>
            )}
          </div>

          <div
            className={`flex justify-center items-center col-span-1 ${
              !additionalDetails.Pincode && 'cursor-not-allowed'
            }`}>
            <Form.Group
              controlId="formBasicCheckbox"
              className="flex justify-center items-center w-full m-2">
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
                    Same as above patient address
                  </span>
                }
                name="same_as_patient_address"
                checked={isCheckedSameAsPatientAddress}
                onChange={onChange}
                className={`flex justify-center items-center gap-2 p-[0.8em] mt-2 border border-gray-400 rounded-md w-full ${
                  !additionalDetails.Pincode && 'bg-gray-200'
                }`}
              />
            </Form.Group>
          </div>

          <CustomFormField
            label="Pincode"
            type="text"
            name="Kin_Pincode"
            required
            value={
              isCheckedSameAsPatientAddress
                ? additionalDetails.Pincode
                : formData?.Kin_Pincode
            }
            onChange={onChange}
            className="w-full"
            placeholder="Enter pincode"
            isInvalid={!!errors.Kin_Pincode}
            errorMessage={errors.Kin_Pincode}
          />
          <CustomFormField
            label="Country"
            name="Kin_Country"
            type="text"
            disabled
            value={
              isCheckedSameAsPatientAddress
                ? capitalize(locationData?.countryName)
                : capitalize(kinLocationData?.countryName)
            }
            className="w-full cursor-not-allowed"
            placeholder="Country will be auto-filled"
          />
          <CustomFormField
            label="State"
            name="Kin_State"
            type="text"
            disabled
            value={
              isCheckedSameAsPatientAddress
                ? capitalize(locationData?.stateName)
                : capitalize(kinLocationData?.stateName ?? '')
            }
            className="w-full cursor-not-allowed"
            placeholder="State will be auto-filled"
          />
          <CustomFormField
            label="City / District"
            name="Kin_City"
            type="text"
            disabled
            value={
              isCheckedSameAsPatientAddress
                ? capitalize(locationData?.cityName)
                : capitalize(kinLocationData?.cityName ?? '')
            }
            className="w-full cursor-not-allowed"
            placeholder="City will be auto-filled"
          />
          <CustomFormField
            label="Area"
            type="select"
            name="Kin_Area"
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

        <div className="flex justify-end gap-3 px-4 pb-4">
          <Button variant="secondary" type="button" onClick={onReset}>
            Clear
          </Button>
          <Button variant="primary" type="submit">
            Save & Continue
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default NextOfKinForm;
