import React, {useMemo} from 'react';
import {Form, Col} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomFormField = ({
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
  className = '',
  combinedField = false, // New Prop for combined Salutation + Name
  salutationValue = '',
  salutationOptions = [],
  onSalutationChange = () => {},
}) => {
  // Memoized select options to prevent unnecessary re-renders
  const selectOptions = useMemo(() => {
    return options.map((option, index) => (
      <option key={`${index}-${option.value}`} value={option.value}>
        {option.label}
      </option>
    ));
  }, [options]);

  const disabledStyle = `select-disabled cursor-not-allowed`;

  return (
    <Form.Group as={Col} xs={12} sm={6} md={4} lg={4} className={className}>
      {/* Label with optional required indicator */}
      <Form.Label style={{color: disabled ? 'gray' : 'black'}}>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>

      {/* Special Case: Combined Salutation + Name Field */}
      {combinedField ? (
        <div className="flex gap-2 w-[500px] bg-red-300">
          {/* Salutation Dropdown */}
          <Form.Select
            name="Salutation"
            value={salutationValue}
            onChange={onSalutationChange}
            required
            className={`select w-[10%] min-w-[100px]`}>
            <option disabled value="">
              Select
            </option>
            {salutationOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>

          {/* Full Name Input */}
          <Form.Control
            type="text"
            name="Name"
            value={value}
            onChange={onChange}
            placeholder="Enter full name"
            required
            className="select w-[90%]"
          />
        </div>
      ) : type === 'select' ? (
        /* Select Input */
        <Form.Select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`select ${!disabled ? className : disabledStyle}`}>
          <option disabled value="" selected>
            Select one
          </option>
          {selectOptions}
        </Form.Select>
      ) : type === 'date' ? (
        /* Date Picker Input */
        <DatePicker
          className={`form-control select ${
            disabled ? 'select-disabled' : className
          }`}
          dateFormat="MMMM d, yyyy"
          placeholderText={placeholder || 'Select a date'}
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
          required={required}
        />
      ) : (
        /* Text Input */
        <Form.Control
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`select ${disabled ? disabledStyle : className}`}
        />
      )}
    </Form.Group>
  );
};

export default CustomFormField;
