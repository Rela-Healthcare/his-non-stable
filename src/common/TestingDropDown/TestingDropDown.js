import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function Testing() {
  const [selectedOption, setSelectedOption] = useState(null);
  console.log(selectedOption);
  const handleChange = (event) => {
    console.log(event);
  };
  return (
    <div style={{ width: "50%" }}>
      <Select
        name="one"
        defaultValue={selectedOption}
        onChange={(e) => handleChange(e)}
        options={options}
        noOptionsMessage={() => "No Options"}
        isSearchable={true}
        // isDisabled={}
      />
    </div>
  );
}
