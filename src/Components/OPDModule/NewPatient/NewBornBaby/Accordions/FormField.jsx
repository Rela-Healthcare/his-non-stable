import {useMemo} from 'react';
import {Col, Form} from 'react-bootstrap';
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
        <Form.Label style={{color: disabled ? '#2a3439' : 'black'}}>
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
            className={
              !disabled ? 'select form-control' : 'select-disabled form-control'
            }
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

export default FormField;
