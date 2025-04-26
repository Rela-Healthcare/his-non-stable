import {Button, Container, Form} from 'react-bootstrap';
import CustomFormField from '../../../../common/form/CustomFormField';
import {stringToObjectDate} from '../../../../utils/utils';
import FormActionButtons from './FormActionButtons';

const ScheduleAppointmentForm = ({
  formData,
  errors,
  dropdownData,
  onChange,
  onBlur,
  onSubmit,
  onReset,
}) => {
  const {
    departmentsResponse,
    doctorListByDepartmentResponse,
    appointmentDetailsResponse,
    payorsListResponse,
    refSrcListResponse,
    internalDoctorListResponse,
    externalDoctorListResponse,
  } = dropdownData;
  return (
    <Container className="px-2 md:px-6">
      <Form noValidate onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
          <CustomFormField
            label="Department Name"
            type="select"
            name="Department_Name"
            required
            value={formData?.Department_Name}
            onChange={onChange}
            onBlur={onBlur}
            options={departmentsResponse}
            placeholder="Select Department"
            isInvalid={!!errors?.Department_Name}
            errorMessage={errors?.Department_Name}
          />

          <CustomFormField
            label="Appointment Date"
            type="date"
            name="Appointment_Date"
            required
            value={stringToObjectDate(formData?.Appointment_Date)}
            onChange={onChange}
            onBlur={onBlur}
            minDate={new Date()}
            maxDate={new Date().setFullYear(new Date().getFullYear() + 2)}
            placeholder="Select Date"
            isInvalid={!!errors?.Appointment_Date}
            errorMessage={errors?.Appointment_Date}
          />

          <CustomFormField
            label="Doctor Name"
            type="select"
            name="Doctor_Name"
            required
            value={formData?.Doctor_Name}
            disabled={!formData?.Department_Name}
            onChange={onChange}
            onBlur={onBlur}
            options={doctorListByDepartmentResponse}
            placeholder="Select Doctor"
            isInvalid={!!errors?.Doctor_Name}
            errorMessage={errors?.Doctor_Name}
          />

          <CustomFormField
            label="Sequence No"
            type="select"
            name="Sequence_No"
            required
            value={formData?.Sequence_No}
            onChange={onChange}
            onBlur={onBlur}
            options={appointmentDetailsResponse}
            disabled={
              !(
                formData?.Department_Name &&
                formData?.Doctor_Name &&
                formData?.Appointment_Date &&
                appointmentDetailsResponse?.length > 0
              )
            }
            placeholder="Select Sequence"
            isInvalid={!!errors?.Sequence_No}
            errorMessage={errors?.Sequence_No}
          />

          <CustomFormField
            label="Visit Type"
            type="select"
            name="Visit_Type"
            required
            value={formData?.Visit_Type}
            onChange={onChange}
            onBlur={onBlur}
            options={[
              {value: '3', label: 'OPD Consults'},
              {value: '7', label: 'Health Check'},
              {value: '9', label: 'OP Video Consults'},
              {value: '11', label: 'Diagnostics'},
              {value: '12', label: 'Home Collection'},
              {value: '16', label: 'Referral Visit'},
            ]}
            placeholder="Select Visit Type"
            isInvalid={!!errors?.Visit_Type}
            errorMessage={errors?.Visit_Type}
          />

          <CustomFormField
            label="Patient Type"
            type="select"
            name="Patient_Type"
            required
            value={formData?.Patient_Type}
            onChange={onChange}
            onBlur={onBlur}
            options={[
              {value: 's', label: 'Self'},
              {value: 'c', label: 'Corporate'},
              {value: 'i', label: 'Insurance'},
            ]}
            placeholder="Select Patient Type"
            isInvalid={!!errors?.Patient_Type}
            errorMessage={errors?.Patient_Type}
          />

          <CustomFormField
            label="Payor Name"
            type="select"
            name="Payor_Name"
            required
            value={formData?.Payor_Name}
            onChange={onChange}
            onBlur={onBlur}
            disabled={formData?.Patient_Type === 's'}
            options={formData?.Patient_Type === 's' ? [] : payorsListResponse}
            placeholder="Select Payor"
            isInvalid={!!errors?.Payor_Name}
            errorMessage={errors?.Payor_Name}
          />

          <CustomFormField
            label="Referral Source"
            type="select"
            name="Referral_Source"
            required
            value={formData?.Referral_Source}
            onChange={onChange}
            onBlur={onBlur}
            options={refSrcListResponse}
            placeholder="Select Referral Source"
            isInvalid={!!errors?.Referral_Source}
            errorMessage={errors?.Referral_Source}
          />

          {Number(formData?.Referral_Source) === 58 && (
            <CustomFormField
              label="Doctor Type"
              type="select"
              name="Doctor_Type"
              required
              value={formData?.Doctor_Type}
              onChange={onChange}
              onBlur={onBlur}
              options={[
                {value: '1', label: 'Internal'},
                {value: '0', label: 'External'},
              ]}
              placeholder="Select Doctor Type"
              isInvalid={!!errors?.Doctor_Type}
              errorMessage={errors?.Doctor_Type}
            />
          )}
          {Number(formData?.Referral_Source) === 58 &&
            formData?.Doctor_Type === '1' && (
              <CustomFormField
                label="Internal Doctor Name"
                type="select"
                name="Internal_Doctor_Name"
                required
                value={formData?.Internal_Doctor_Name}
                onChange={onChange}
                onBlur={onBlur}
                options={internalDoctorListResponse}
                placeholder="Select Internal Doctor"
                isInvalid={!!errors?.Internal_Doctor_Name}
                errorMessage={errors?.Internal_Doctor_Name}
              />
            )}
          {Number(formData?.Referral_Source) === 58 &&
            formData?.Doctor_Type === '0' && (
              <CustomFormField
                label="External Doctor Name"
                type="select"
                name="External_Doctor_Name"
                required
                value={formData?.External_Doctor_Name}
                onChange={onChange}
                onBlur={onBlur}
                options={externalDoctorListResponse}
                placeholder="Select External Doctor"
                isInvalid={!!errors?.External_Doctor_Name}
                errorMessage={errors?.External_Doctor_Name}
              />
            )}
          {Number(formData?.Referral_Source) === 76 && (
            <CustomFormField
              label="Staff Employee ID"
              type="text"
              name="Staff_Employee_ID"
              required
              value={formData?.Staff_Employee_ID}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Enter Employee ID"
              isInvalid={!!errors?.Staff_Employee_ID}
              errorMessage={errors?.Staff_Employee_ID}
            />
          )}

          <CustomFormField
            label="Package Details"
            type="text"
            name="Package_Details"
            required
            value={formData?.Package_Details}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter Package Details"
            isInvalid={!!errors?.Package_Details}
            errorMessage={errors?.Package_Details}
          />
        </div>
        <FormActionButtons onClear={onReset} /> {/* Clear and Save Button */}
      </Form>
    </Container>
  );
};

export default ScheduleAppointmentForm;
