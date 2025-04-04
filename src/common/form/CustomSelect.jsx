import React, {useState} from 'react';
import {FormControl, Dropdown} from 'react-bootstrap';

const CustomSelect = ({options, onSelect, placeholder, className}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  // Ensure options are strings before calling .toLowerCase()
  const filteredOptions = options
    .filter((option) => typeof option === 'string')
    .filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Dropdown
      show={show}
      onToggle={(isOpen) => setShow(isOpen)}
      className={className}>
      <Dropdown.Toggle variant="outline-primary" id="custom-select">
        {selected || placeholder || 'Select an option'}
      </Dropdown.Toggle>

      {/* ✅ FIX: Renders dropdown outside the accordion */}
      <Dropdown.Menu
        className="custom-dropdown-menu"
        flip={false}
        popperConfig={{modifiers: []}}>
        {/* Search Input */}
        <FormControl
          autoFocus
          placeholder="Search..."
          className="m-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dropdown Items */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => {
                setSelected(option);
                onSelect(option);
                setShow(false);
              }}>
              {option}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No results found</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomSelect;
