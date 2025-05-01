import React from 'react';
import {Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaInfoCircle} from 'react-icons/fa';

type Option = {
  label: string;
  value: string;
};

interface Props {
  salutationValue: string;
  salutationOptions: Option[];
  onSalutationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  salutationName: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: any) => void;
  isInvalid: boolean;
  errorMessage?: string;
}

const SalutationNameField: React.FC<Props> = ({
  salutationValue,
  salutationOptions,
  onSalutationChange,
  salutationName,
  name,
  value,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
}) => {
  errorMessage = 'please enter your full name with salutation';
  return (
    <div className="relative">
      {/* Tooltip Icon - Top right */}
      {isInvalid && errorMessage && (
        <div className="absolute top-[-0.7rem] right-[-0.6rem] z-10">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{errorMessage}</Tooltip>}>
            <span>
              <FaInfoCircle
                style={{
                  color: 'red',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              />
            </span>
          </OverlayTrigger>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full mb-[0.9rem]">
        {/* Salutation Select */}
        <div className="w-full md:w-[20%] h-[40px] border-y border-l border-black border-r-0 rounded-t-md md:rounded-l-md md:rounded-tr-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <Form.Select
            name={salutationName}
            value={salutationValue ?? ''}
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
        <div className="w-full md:w-[80%] h-[40px] border-y border-r border-y-black border-r-black border-l-gray-400 border-l-2 rounded-b-md md:rounded-r-md md:rounded-bl-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <Form.Control
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter full name"
            required
            isInvalid={isInvalid}
            className="w-full h-full border-0 focus:outline-none focus:ring-0 shadow-none text-sm text-black font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default SalutationNameField;
