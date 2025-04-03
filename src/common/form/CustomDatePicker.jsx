import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import {Form} from 'react-bootstrap';

const CustomDatePicker = ({
  label,
  name,
  value,
  onChange,
  error,
  disabled,
  className,
}) => {
  // Ensure value has a valid date or set it to the current date by default
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const handleDatePickerChange = (date) => {
    setSelectedDate(date); // Update the internal state
    onChange({target: {name, value: date}});
  };

  return (
    <Form.Group controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}

      <DatePicker
        className={`select ${error ? 'is-invalid' : className}`}
        dateFormat="MMMM d, yyyy"
        placeholderText="Select Date"
        yearDropdownItemNumber={150}
        showYearDropdown
        showMonthDropdown
        scrollableYearDropdown
        scrollableMonthDropdown
        maxDate={new Date()}
        minDate={new Date('1900-01-01')}
        name={name}
        selected={selectedDate}
        onChange={handleDatePickerChange}
        disabled={disabled}
        required
        shouldCloseOnSelect={false} // Prevent closing on select
      />

      {error && (
        <Form.Control.Feedback type="invalid" style={{display: 'block'}}>
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default CustomDatePicker;
