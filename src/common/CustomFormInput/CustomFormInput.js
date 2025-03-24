import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./CustomFormInput.css";
import { useDispatch } from "react-redux";
import { patientInformation } from "../../features/OPDModule/PatientCreation/PatientCreationSlice";
import { visitInformation } from "../../features/OPDModule/AppointmentSchedule/AppointmentScheduleSlice";
import { serviceInformation } from "../../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

let maxLength = 100;

const CustomFormInput = (props) => {
  const [inputValue, setInputValue] = useState("");
  const serviceData = useSelector((state) => state.serviceCreation.formData);
  const [validationProps, setValidationProps] = useState({
    borderColor: "black",
    validationText: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    resetInputValue();
  }, [serviceData[props.name]]);

  const resetInputValue = () => {
    if (serviceData[props.name] === "") setInputValue("");
  };
  const handleInputChange = (event) => {
    const { value } = event.target;

    switch (props.type) {
      case "text": {
        const formattedValue = value.replace(/[^A-Z a-z 0-9]/g, "");
        const addressFormattedValue = value.replace(
          /[^A-Za-z0-9\s!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/g,
          ""
        );
        const mobileNumberFormattedValue = value.replace(/[^0-9]/g, "");

        switch (props.IDtype) {
          case 1014: {
            const aadharpattern = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
            maxLength = 12;
            const validCheck = aadharpattern.test(formattedValue);
            console.log(validCheck);
            if (validCheck) {
              setInputValue(formattedValue);
              setValidationProps({
                ...validationProps,
                borderColor: "green",
                validationText: <FontAwesomeIcon icon={faCheck} />,
              });
            } else {
              setValidationProps({
                ...validationProps,
                borderColor: "red",
                validationText: `Invalid card number!`,
              });
            }
            break;
          }
          default: {
          }
        }
        if (props.name === "Address" || props.name === "kinAddress") {
          setInputValue(addressFormattedValue);
        } else {
          setInputValue(formattedValue);
        }
        break;
      }
      case "number": {
        // console.log(props.pattern);
        const formattedValue = value.replace(/[1-9]{1}[0-9]{10}/g, "");
        switch (props.name) {
          case "MobileNo":
          case "RelationMobileNo": {
            const formattedValue = value.replace(/[1-9]{1}[0-9]{10}/g, "");
            const pattern = props.pattern;
            const validCheck = pattern.test(formattedValue);

            if (validCheck) {
              setInputValue(formattedValue);
              setValidationProps({
                ...validationProps,
                borderColor: "green",
                validationText: <FontAwesomeIcon icon={faCheck} />,
              });
            } else {
              setValidationProps({
                ...validationProps,
                borderColor: "red",
                validationText: `Invalid mobile number!`,
              });
              if (
                formattedValue.toString().length < 10 ||
                formattedValue.toString().length > 10
              ) {
              }
            }
            break;
          }
          case "Pincode":
          case "kin_Pincode": {
            const formattedValue = value.replace(/[1-9]{1}[0-9]{6}/g, "");
            const pattern = props.pattern;
            const validCheck = pattern.test(formattedValue);
            if (validCheck) {
              setInputValue(formattedValue);
              setValidationProps({
                ...validationProps,
                borderColor: "green",
                validationText: <FontAwesomeIcon icon={faCheck} />,
              });
            } else {
              setValidationProps({
                ...validationProps,
                borderColor: "red",
                validationText: "Invalid pincode number!",
              });
            }
            break;
          }
          default: {
          }
        }
        setInputValue(formattedValue);
        break;
      }
      case "email": {
        const formattedValue = value;
        maxLength = 70;
        // console.log(props.pattern);
        if (props.name === "EmailId") {
          const pattern = props.pattern;
          const validCheck = pattern.test(formattedValue);
          if (validCheck) {
            setInputValue(formattedValue);
            setValidationProps({
              ...validationProps,
              borderColor: "green",
              validationText: <FontAwesomeIcon icon={faCheck} />,
            });
            maxLength = 70;
          } else {
            setValidationProps({
              ...validationProps,
              borderColor: "red",
              validationText: "Invalid email id!",
            });
          }
        }
        setInputValue(formattedValue);
        break;
      }
      default: {
      }
    }

    dispatch(
      serviceInformation({
        name: props.name,
        value: value || "",
      })
    );

    dispatch(
      patientInformation({
        name: props.name,
        value: value || "",
      })
    );
    dispatch(
      visitInformation({
        name: props.name,
        value: value || "",
      })
    );
  };
  return (
    <>
      <Form.Label className="mandatory">{props.label}</Form.Label>
      <Form.Control
        type={props.type}
        name={props.name}
        maxLength={maxLength}
        className={props.className}
        onChange={handleInputChange}
        placeholder={props.placeholder}
        value={props.value ? props.value : inputValue}
        style={{ borderColor: validationProps.borderColor }}
        disabled={props.disabled}
      />
      <span
        style={{
          color: validationProps.borderColor,
          fontSize: "12px",
          fontWeight: "bolder",
        }}
      >
        {validationProps.validationText}
      </span>
    </>
  );
};

export default CustomFormInput;
