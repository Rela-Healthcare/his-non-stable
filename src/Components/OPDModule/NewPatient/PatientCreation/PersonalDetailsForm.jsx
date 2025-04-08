import React from 'react';
import {Button, Container, Form} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {motion} from 'framer-motion';
import {stringToObjectDate} from '../../../../utils/utils';
import SalutationNameField from '../../../../common/form/SalutationNameField ';

const PersonalDetailsForm = ({
  formData,
  errors,
  dropdownData,
  onChange,
  onSubmit,
  onReset,
  onContinue,
  isIdValid,
  isMobileValid,
  isEmailValid,
}) => {
  const {
    salutationsResponse,
    maritalStatusResponse,
    occupationResponse,
    nationalityResponse,
    idTypeResponse,
  } = dropdownData;

  return (
    <Container className="px-2 md:px-6">
      <Form noValidate onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-4">
          <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center">
            <SalutationNameField
              salutationValue={formData.SalutionId}
              salutationOptions={salutationsResponse}
              onSalutationChange={onChange}
              salutationName="SalutionId"
              name="Name"
              value={formData.Name}
              onChange={onChange}
              isInvalid={!!errors.SalutionId || !!errors.Name}
            />
          </div>

          <CustomFormField
            label="Date of Birth"
            type="date"
            name="DOB"
            value={
              typeof formData.DOB === 'string'
                ? stringToObjectDate(formData.DOB)
                : formData.DOB
            }
            onChange={onChange}
            required
            className="w-full"
            isInvalid={!!errors.DOB}
            errorMessage={errors.DOB}
          />

          <CustomFormField
            label="Age"
            type="number"
            name="Age"
            disabled
            value={formData.Age}
            onChange={onChange}
            placeholder="Auto Calculated"
            className="w-full cursor-not-allowed"
          />

          <CustomFormField
            label="Gender"
            type="select"
            name="Gender"
            value={formData.Gender}
            placeholder="Select Gender"
            onChange={onChange}
            options={[
              {label: 'Male', value: 'Male'},
              {label: 'Female', value: 'Female'},
              {label: 'Other', value: 'Other'},
            ]}
            required
            className="w-full"
            isInvalid={!!errors.Gender}
            errorMessage={errors.Gender}
          />

          <CustomFormField
            label="Nationality"
            type="select"
            name="Nationality"
            required
            value={formData.Nationality}
            onChange={onChange}
            options={nationalityResponse}
            placeholder="Select Nationality"
            className="w-full"
            isInvalid={!!errors.Nationality}
            errorMessage={errors.Nationality}
          />

          <CustomFormField
            label="ID Type"
            type="select"
            name="ID_Type"
            required
            value={formData.ID_Type}
            onChange={onChange}
            options={idTypeResponse}
            placeholder="Select ID Type"
            className="w-full"
            isInvalid={!!errors.ID_Type}
            errorMessage={errors.ID_Type}
          />

          <div className="relative">
            <CustomFormField
              label="ID Number"
              type="text"
              name="ID_No"
              disabled={formData.ID_Type.length > 1 ? false : true}
              value={formData.ID_No.toUpperCase()}
              onChange={onChange}
              required
              placeholder="Enter ID Number"
              className={`w-full ${
                formData.ID_Type.length > 1 ? '' : 'cursor-not-allowed'
              }`}
            />
            {isIdValid && (
              <motion.span
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3}}
                className="text-green-500 absolute top-[47%] right-2">
                <FontAwesomeIcon icon={faCircleCheck} size="sm" />
              </motion.span>
            )}
          </div>

          <CustomFormField
            label="Marital Status"
            type="select"
            name="Marital_Status"
            required
            placeholder="Select Marital_Status"
            value={formData.Marital_Status}
            onChange={onChange}
            options={maritalStatusResponse}
            className="w-full"
            isInvalid={!!errors.Marital_Status}
            errorMessage={errors.Marital_Status}
          />

          <div className="relative">
            <CustomFormField
              label="Mobile Number"
              type="text"
              name="Mobile_No"
              value={formData.Mobile_No}
              onChange={onChange}
              required
              placeholder="Enter Mobile Number"
              className="w-full"
              isInvalid={!!errors.Mobile_No}
              errorMessage={errors.Mobile_No}
            />
            {isMobileValid && (
              <motion.span
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3}}
                className="text-green-500 absolute top-[47%] right-2">
                <FontAwesomeIcon icon={faCircleCheck} size="sm" />
              </motion.span>
            )}
          </div>

          <div className="relative">
            <CustomFormField
              label="Email ID"
              type="email"
              name="Email_ID"
              required
              value={formData.Email_ID}
              onChange={onChange}
              placeholder="Enter Email ID"
              className="w-full"
              isInvalid={!!errors.Email_ID}
              errorMessage={errors.Email_ID}
            />
            {isEmailValid && (
              <motion.span
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3}}
                className="text-green-500 absolute top-[47%] right-2">
                <FontAwesomeIcon icon={faCircleCheck} size="sm" />
              </motion.span>
            )}
          </div>

          <CustomFormField
            label="Occupation"
            type="select"
            name="Occupation"
            required
            value={formData.Occupation}
            onChange={onChange}
            options={occupationResponse}
            placeholder="Select Occupation"
            className="w-full"
            isInvalid={!!errors.Occupation}
            errorMessage={errors.Occupation}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 mt-6">
          <Button variant="secondary" type="button" onClick={onReset}>
            Clear
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="md"
            onClick={onContinue}>
            Save & Continue
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PersonalDetailsForm;
