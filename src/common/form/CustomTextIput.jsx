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
  className,
  disabled = true,
}) => {
  return (
    <Form.Group as={Row} controlId={name}>
      {label && (
        <Form.Label column sm={3}>
          {label}
        </Form.Label>
      )}
      <Col sm={9}>
        <Form.Control
          className={!className ? 'select' : className}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isInvalid={!!error}
        />
        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </Col>
    </Form.Group>
  );
};

export default CustomTextInput;
