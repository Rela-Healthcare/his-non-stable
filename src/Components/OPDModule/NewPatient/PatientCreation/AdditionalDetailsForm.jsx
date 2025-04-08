import React from 'react';
import {Button, Container, Form} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';

const AdditionalDetailsForm = ({
  formData,
  errors,
  dropdownData,
  locationData,
  onChange,
  onSubmit,
  onReset,
  onContinue,
}) => {
  const {
    additionalAreaData,
    religionResponse,
    languageResponse,
    bloodGroupResponse,
  } = dropdownData;

  return (
    <Container fluid className="px-4">
      <Form noValidate onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-4">
          <CustomFormField
            label="Pincode"
            type="number"
            name="Pincode"
            onBlur={onChange}
            required
            value={formData.Pincode}
            onChange={onChange}
            placeholder="Enter Pincode"
            className="w-full"
            isInvalid={!!errors.Pincode}
            errorMessage={errors.Pincode}
          />
          <CustomFormField
            label="Country"
            name="Country"
            type="text"
            disabled
            value={locationData?.countryName?.toUpperCase() ?? ''}
            placeholder="Auto-populated Country"
            className="w-full cursor-not-allowed"
          />
          <CustomFormField
            label="State"
            name="State"
            type="text"
            disabled
            value={locationData?.stateName?.toUpperCase() ?? ''}
            placeholder="Auto-populated State"
            className="w-full cursor-not-allowed"
          />
          <CustomFormField
            label="City / District"
            name="City"
            type="text"
            disabled
            value={locationData?.cityName?.toUpperCase() ?? ''}
            placeholder="Auto-populated City"
            className="w-full cursor-not-allowed"
          />
          <CustomFormField
            label="Area"
            type="select"
            name="Area"
            required
            value={formData.Area}
            onChange={onChange}
            options={additionalAreaData}
            placeholder="Select Area"
            className="w-full"
            isInvalid={!!errors.Area}
            errorMessage={errors.Area}
          />
          <CustomFormField
            label="Address"
            type="text"
            name="Address"
            required
            value={formData.Address}
            onChange={onChange}
            placeholder="Enter Address"
            className="w-full sm:col-span-2"
            isInvalid={!!errors.Address}
            errorMessage={errors.Address}
          />
          <CustomFormField
            label="Religion"
            type="select"
            name="Religion"
            required
            value={formData.Religion}
            onChange={onChange}
            options={religionResponse}
            placeholder="Select Religion"
            className="w-full"
            isInvalid={!!errors.Religion}
            errorMessage={errors.Religion}
          />
          <CustomFormField
            label="Language"
            type="select"
            name="Language"
            required
            value={formData.Language}
            onChange={onChange}
            options={languageResponse}
            placeholder="Select Language"
            className="w-full"
            isInvalid={!!errors.Language}
            errorMessage={errors.Language}
          />
          <CustomFormField
            label="Blood Group"
            type="select"
            name="BloodGroup"
            value={formData.BloodGroup}
            onChange={onChange}
            options={bloodGroupResponse}
            placeholder="Select Blood Group"
            className="w-full"
            isInvalid={!!errors.BloodGroup}
            errorMessage={errors.BloodGroup}
          />
          <CustomFormField
            label="Special assistance?"
            type="select"
            name="Special_Assistance"
            required
            value={
              formData?.Special_Assistance === undefined
                ? ''
                : formData.Special_Assistance
            }
            onChange={onChange}
            options={[
              {value: true, label: 'Yes'},
              {value: false, label: 'No'},
            ]}
            placeholder="Select Yes or No"
            className="w-full"
            isInvalid={!!errors.Special_Assistance}
            errorMessage={errors.Special_Assistance}
          />
          {formData?.Special_Assistance === 'true' && (
            <CustomFormField
              label="Select Special Assistance"
              type="select"
              name="Select_Special_Assistance"
              value={formData.Select_Special_Assistance}
              onChange={onChange}
              options={[
                {value: '', label: 'Select Special Assistance'},
                {value: 'Wheel Chair', label: 'WHEEL CHAIR'},
                {value: 'Stretcher', label: 'STRETCHER'},
                {value: 'Not Applicable', label: 'NOT APPLICABLE'},
                {value: 'Others', label: 'OTHERS'},
              ]}
              placeholder="Select Special Assistance"
              className="w-full"
              isInvalid={!!errors.Select_Special_Assistance}
              errorMessage={errors.Select_Special_Assistance}
            />
          )}
          {formData?.Special_Assistance === 'true' &&
            formData?.Select_Special_Assistance === 'Others' && (
              <CustomFormField
                label="Other Special Assistance"
                type="text"
                name="Spl_Assist_Remarks"
                value={formData.Spl_Assist_Remarks}
                onChange={onChange}
                placeholder="Enter Other Special Assistance"
                className="w-full"
                isInvalid={!!errors.Spl_Assist_Remarks}
                errorMessage={errors.Spl_Assist_Remarks}
              />
            )}
        </div>
        <div className="flex flex-wrap justify-end gap-3 px-4 pb-4">
          <Button variant="secondary" type="button" onClick={onReset}>
            Clear
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="md"
            // onClick={onContinue}
          >
            Save & Continue
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdditionalDetailsForm;
