import React, {useCallback, useMemo} from 'react';
import {Row, Form, Col} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {OPModuleAgent} from '../../../../agent/agent';
import DatePicker from 'react-datepicker';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  options = [],
  required = false,
}) => {
  const selectOptions = useMemo(() => {
    return options.map((option, index) => (
      <option key={`${index}-${option.value}`} value={option.value}>
        {option.label}
      </option>
    ));
  }, [options]);

  return (
    <Col xs={12} sm={12} md={6} lg={4}>
      <Form.Group>
        <Form.Label style={{color: disabled ? 'gray' : 'black'}}>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
        {type === 'select' ? (
          <Form.Select
            className="select"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}>
            <option disabled value="">
              Select one
            </option>
            {selectOptions}
          </Form.Select>
        ) : type === 'date' ? (
          <DatePicker
            className="select form-control"
            dateFormat="MMMM d, yyyy"
            placeholderText="Date of Birth"
            yearDropdownItemNumber={150}
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            scrollableMonthDropdown
            maxDate={new Date()}
            minDate={new Date('1900-01-01')}
            name={name}
            selected={value}
            onChange={(date) => onChange({target: {name, value: date}})}
            disabled={disabled}
            required
          />
        ) : (
          <Form.Control
            className={!disabled ? 'select' : 'select-disabled'}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          />
        )}
      </Form.Group>
    </Col>
  );
};

const NewBornBabyForm = ({
  formData,
  setFormData,
  setIsLoading,
  setPatientData,
}) => {
  const fetchData = useCallback(async (uhid) => {
    if (!uhid || uhid.length < 6) return;
    let fullUhid = uhid.length > 6 ? uhid : '12018' + uhid;
    try {
      const response = await OPModuleAgent.getExistingPatientDetails(
        Number(fullUhid)
      );
      return response?.data?.[0] || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleBlur = async (e) => {
    setIsLoading(true);
    try {
      const data = await fetchData(e.target.value);
      setFormData((prev) => ({
        ...prev,
        motherName: data?.patientName || '',
      }));
      if (!data?.patientName) toast.warn('Invalid UHID!');
      if (data?.patientName) setPatientData(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form>
      <Row style={{marginBottom: '20px'}}>
        <FormField
          label="Mother's UHID"
          name="parentUHID"
          value={formData.parentUHID}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <FormField
          label="Mother's Name"
          name="motherName"
          value={formData.motherName}
          disabled
          required
        />
        <FormField
          label="Baby Gender"
          type="select"
          name="gender"
          options={[
            {value: 'M', label: 'Male'},
            {value: 'F', label: 'Female'},
            {value: 'T', label: 'Third Gender'},
          ]}
          value={formData.gender}
          onChange={handleChange}
          required
        />
        <FormField
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          onChange={handleChange}
          value={formData.dateOfBirth}
          required
        />
      </Row>
    </Form>
  );
};

export default NewBornBabyForm;
