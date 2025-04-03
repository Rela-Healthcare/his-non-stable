import React from 'react';
import Select from 'react-select';
import {Form} from 'react-bootstrap';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #000000',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'black',
    fontWeight: '600',
    padding: '5px',
    height: '40px',
    margin: '15px 5px',
    boxShadow: state.isFocused ? 'none' : provided.boxShadow,
    borderColor: state.isFocused ? '#3c4b64' : '#000000',
    '&:hover': {
      transition: '0.1s',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
  }),
};

const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  isDisabled,
}) => {
  return (
    <Form.Group controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}

      <Select
        name={name}
        value={options.find((option) => option.value === value)}
        onChange={(selectedOption) =>
          onChange({
            target: {name, value: selectedOption ? selectedOption.value : ''},
          })
        }
        options={options}
        placeholder={placeholder || 'Select an option...'}
        isDisabled={isDisabled}
        isSearchable
        styles={customStyles} // Apply custom styles
      />

      {error && (
        <Form.Control.Feedback type="invalid" style={{display: 'block'}}>
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default CustomSelect;
