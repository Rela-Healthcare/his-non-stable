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
  isInvalid = false,
  errorMessage = '',
  combinedField = false,
  salutationValue = '',
  salutationOptions = [],
  onSalutationChange = () => {},
  validateOnBlur = false,
  ...props
}) => {
  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
    if (validateOnBlur && required && !value) {
      onBlur({target: {name, value}});
    }
  };

  const selectOptions = useMemo(() => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  }, [options]);

  const disabledStyle = 'select-disabled cursor-not-allowed';

  return (
    <Form.Group
      as={combinedField ? Col : undefined}
      className={`mb-3 ${className}`}>
      <Form.Label style={{color: disabled ? 'gray' : 'black'}}>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>

      {combinedField ? (
        <div className="flex gap-2 w-[500px]">
          <Form.Select
            name="Salutation"
            value={salutationValue}
            onChange={onSalutationChange}
            onBlur={handleBlur}
            required
            className={`select w-[10%] min-w-[100px] ${
              isInvalid ? 'is-invalid' : ''
            }`}
            isInvalid={isInvalid}>
            <option disabled value="">
              Select
            </option>
            {salutationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>

          <Form.Control
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder="Enter full name"
            required
            className={`select w-[90%] ${isInvalid ? 'is-invalid' : ''}`}
            isInvalid={isInvalid}
          />
        </div>
      ) : type === 'select' ? (
        <Form.Select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          isInvalid={isInvalid}
          className={`select ${!disabled ? className : disabledStyle}`}
          {...props}>
          <option value="">
            {placeholder || `Select ${label === 'Salutation' && ''}`}
          </option>
          {selectOptions}
        </Form.Select>
      ) : type === 'date' ? (
        <>
          <DatePicker
            className={`form-control select ${
              disabled ? 'select-disabled' : className
            } ${isInvalid ? 'is-invalid' : ''}`}
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
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            {...props}
          />
          {isInvalid && (
            <div className="invalid-feedback d-block">{errorMessage}</div>
          )}
        </>
      ) : (
        <Form.Control
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          isInvalid={isInvalid}
          className={`select ${disabled ? disabledStyle : className}`}
          {...props}
        />
      )}

      {isInvalid && type !== 'date' && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default CustomFormField;
