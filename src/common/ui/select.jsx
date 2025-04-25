import React, {useMemo, useState} from 'react';
import {Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaInfoCircle} from 'react-icons/fa';
import TruncatedText from '../TruncatedText';

const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const Select = ({
  label,
  isLabelNeeded = true,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled = false,
  required = false,
  isInvalid = false,
  errorMessage = '',
  className = '',
  middleEllipsis = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const selectOptions = useMemo(() => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        <TruncatedText
          text={capitalize(option.label)}
          hideTooltipIfFits={false}
          middleEllipsis={middleEllipsis}
          maxLength={14}
          className="font-semibold text-sm px-2"
        />
      </option>
    ));
  }, [middleEllipsis, options]);

  const selectOptionsOnBlur = useMemo(() => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {capitalize(option.label)}
      </option>
    ));
  }, [options]);

  return (
    <Form.Group className={className}>
      {isLabelNeeded && (
        <label className="block mb-2 text-sm font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {isInvalid && errorMessage && (
        <div className="absolute top-[-0.7rem] right-[-0.6rem] z-10">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{errorMessage}</Tooltip>}>
            <span>
              <FaInfoCircle
                style={{
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              />
            </span>
          </OverlayTrigger>
        </div>
      )}

      <Form.Select
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        disabled={disabled}
        required={required}
        className={
          `flex h-9 w-full items-center justify-between whitespace-nowrap 
          rounded-md border border-input bg-transparent px-3 py-2 text-sm !shadow-sm
          ring-offset-background placeholder:text-muted-foreground 
          focus:outline-none 
          focus:shadow-md focus:shadow-blue-100
          transition-all duration-200 ease-in-out
          disabled:cursor-not-allowed disabled:opacity-50
          [&>span]:line-clamp-1 
          ${isInvalid ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${disabled ? 'select-disabled cursor-not-allowed' : ''}
          ${className}`
        }
        style={{
          '--tw-ring-color': isInvalid ? '#ef4444' : '#3b82f6',
        }}>
        <option value="">{placeholder || `Select ${label}`}</option>
        {isFocused ? selectOptionsOnBlur : selectOptions}
      </Form.Select>

      {isInvalid && <Form.Control.Feedback type="invalid" />}
    </Form.Group>
  );
};

export default Select;
