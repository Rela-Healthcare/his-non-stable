import React from 'react';
import {Form} from 'react-bootstrap';

const SalutationNameField = ({
  salutationValue,
  salutationOptions,
  onSalutationChange,
  salutationName,
  name,
  value,
  onChange,
  onBlur,
  isInvalid,
}) => {
  return (
    <div className="sm:mb-[2em] w-full">
      <label className="block mb-[1.3em] text-sm text-black font-bold">
        Full Name <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-col md:flex-row w-full">
        {/* Salutation Select */}
        <div className="w-full md:w-[20%] h-[40px] border-y border-l border-black border-r-0 rounded-t-md md:rounded-l-md md:rounded-tr-none">
          <Form.Select
            name={salutationName}
            value={salutationValue}
            onChange={onSalutationChange}
            onBlur={onBlur}
            required
            className="w-full h-full border-none focus:outline-none focus:ring-0 shadow-none text-sm text-black font-semibold"
            isInvalid={isInvalid}>
            <option disabled value="">
              Title
            </option>
            {salutationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Name Input */}
        <div className="w-full md:w-[80%] h-[40px] border-y border-r border-y-black border-r-black border-l-gray-400 border-l-2 rounded-b-md md:rounded-r-md md:rounded-bl-none">
          <Form.Control
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter full name"
            required
            className="w-full h-full border-0 focus:outline-none focus:ring-0 shadow-none text-sm text-black font-semibold"
            isInvalid={isInvalid}
          />
        </div>
      </div>
    </div>
  );
};

export default SalutationNameField;
