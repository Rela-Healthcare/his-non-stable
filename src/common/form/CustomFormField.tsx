import React, {useMemo} from 'react';
import {Form, Col, OverlayTrigger, Tooltip} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import {FaInfoCircle} from 'react-icons/fa';
import {motion} from 'framer-motion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import SalutationNameField from './SalutationNameField ';
import {capitalize, lowerCase, upperCase} from '../../utils/utils';

type Option = {
  label: string;
  value: string;
};

type CustomFormFieldProps = {
  label?: string;
  type?: 'text' | 'select' | 'date' | string;
  name: string;
  value: any;
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  placeholder?: string;
  disabled?: boolean;
  options?: Option[];
  required?: boolean;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  combinedField?: boolean;
  validateOnBlur?: boolean;
  validIcon?: boolean;
  salutationValue?: string;
  salutationOptions?: Option[];
  onSalutationChange?: (e: any) => void;
  salutationName?: string;
  maxLength?: number;
  TextCase?: 'Capital' | 'Upper' | 'Lower';
  [x: string]: any; // allows spreading additional props
};

const CustomFormField: React.FC<CustomFormFieldProps> = ({
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
  TextCase = 'Capital',
  ...props
}) => {

  const handleBlur = (e: any) => {
    if (onBlur) {
      onBlur(e);
    }
    if (validateOnBlur && required && !value) {
      onBlur?.({target: {name, value}});
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
      {label && (
        <label className={`block mb-[1.3em] text-sm font-bold`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

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

      {combinedField ? (
        <SalutationNameField
          salutationValue={salutationValue ?? ''}
          salutationOptions={salutationOptions ?? []}
          onSalutationChange={onChange}
          salutationName={salutationName ?? ''}
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
            <option value="" className="bg-slate-300">
              {placeholder || `Select ${label === 'Salutation' ? '' : label}`}
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
          scrollableMonthYearDropdown={true}
          maxDate={new Date()}
          minDate={new Date('1900-01-01')}
          name={name}
          selected={value}
          onChange={(date: Date | null) => onChange({target: {name, value: date}})}
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
                if (/^\d*$/.test(newValue) && newValue.length <= maxLength) {
                  onChange(e);
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
              <FontAwesomeIcon icon={faCircleCheck} size={'lg'} />
            </motion.span>
          )}
        </div>
      )}

      {isInvalid && type !== 'date' && <Form.Control.Feedback type="invalid" />}
    </Form.Group>
  );
};

export default CustomFormField;
