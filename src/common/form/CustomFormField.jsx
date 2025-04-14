import React, {useMemo} from 'react';
import {Form, Col, OverlayTrigger, Tooltip} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {FaInfoCircle} from 'react-icons/fa';
import {motion} from 'framer-motion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import SalutationNameField from './SalutationNameField ';
import {capitalize, lowerCase, upperCase} from '../../utils/utils';

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
  validateOnBlur = false,
  validIcon = false,
  salutationValue,
  salutationOptions,
  onSalutationChange,
  salutationName,
  maxLength,
  TextCase = 'Capital', // Upper | Lower | Capital - Capital is default case
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
        {capitalize(option.label)}
      </option>
    ));
  }, [options]);

  const disabledStyle = 'select-disabled cursor-not-allowed';

  return (
    <Form.Group
      as={combinedField ? Col : undefined}
      className={`${className}`}
      style={{position: 'relative'}}>
      <label className={`block mb-[1.3em] text-sm font-bold`}>
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Tooltip Icon - Positioned at top-right */}
      {isInvalid && errorMessage && (
        <div style={{position: 'absolute', top: 25, right: -12, zIndex: 10}}>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{errorMessage}</Tooltip>}>
            <span>
              <FaInfoCircle
                style={{color: 'red', cursor: 'pointer', fontSize: '18px'}}
              />
            </span>
          </OverlayTrigger>
        </div>
      )}

      {/* Custom input field */}
      {combinedField ? (
        <SalutationNameField
          salutationValue={salutationValue}
          salutationOptions={salutationOptions}
          onSalutationChange={onChange}
          salutationName={salutationName}
          name={name}
          value={capitalize(value)}
          onChange={onChange}
          isInvalid={isInvalid}
        />
      ) : type === 'select' ? (
        <div className={`w-full ${disabled ? 'cursor-not-allowed' : ''}`}>
          <Form.Select
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`select w-full ${className} ${
              disabled ? disabledStyle : ''
            }`}
            {...props}>
            <option value="">
              {placeholder || `Select ${label === 'Salutation' && ''}`}
            </option>
            {selectOptions}
          </Form.Select>
        </div>
      ) : type === 'date' ? (
        <DatePicker
          className={`select w-full !my-0 form-control placeholder:text-gray-900 ${
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
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          {...props}
        />
      ) : (
        <div className="relative">
          <Form.Control
            type={type}
            name={name}
            placeholder={placeholder}
            value={
              TextCase === 'Capital'
                ? capitalize(value ?? '')
                : TextCase === 'Upper'
                ? upperCase(value)
                : lowerCase(value)
            }
            onChange={(e) => {
              const newValue = e.target.value;
              if (maxLength) {
                // Allow only digits and limit maxLength
                if (/^\d*$/.test(newValue) && newValue.length <= maxLength) {
                  onChange(e); // pass event to your handler
                }
              } else {
                onChange(e);
              }
            }}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className={`select w-full ${disabled ? disabledStyle : className}`}
            {...props}
          />
          {validIcon && (
            <motion.span
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.5}}
              className="text-green-500 absolute top-[32%] right-2">
              <FontAwesomeIcon icon={faCircleCheck} size="md" />
            </motion.span>
          )}
        </div>
      )}

      {isInvalid && type !== 'date' && <Form.Control.Feedback type="invalid" />}
    </Form.Group>
  );
};

export default CustomFormField;
