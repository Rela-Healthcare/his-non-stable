import React from 'react';
import {Row, Form, Col} from 'react-bootstrap';

const CustomTextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  className = '', // Default to an empty string if not provided
  style = {}, // Allow passing custom styles via props
  disabled = false, // Set default to `false`
}) => {
  return (
    <Form.Group as={Col} controlId={name} xs={12} sm={6} md={4} lg={2} xl={2}>
      {label && (
        <Form.Label column sm={3} className="mandatory">
          {label}
        </Form.Label>
      )}
      <Form.Control
        className={`select ${className}`} // Merge default and custom classNames
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={!!error}
        style={style} // Apply custom styles
        disabled={disabled} // Apply disabled state
      />
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default CustomTextInput;
