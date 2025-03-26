import React, {useState, useEffect, useRef, createRef} from 'react';
import {Form} from 'react-bootstrap';
import './CustomDropDown.css';
import {useDispatch, useSelector} from 'react-redux';
import {patientInformation} from '../../features/OPDModule/PatientCreation/PatientCreationSlice';
import {visitInformation} from '../../features/OPDModule/AppointmentSchedule/AppointmentScheduleSlice';
import {serviceInformation} from '../../features/OPDModule/ServiceDetails/ServiceDetailsSlice';
import {depositInformation} from '../../features/OPDModule/DepositAllocation/DepositSlice';
import {paymentInformation} from '../../features/OPDModule/Payment/PaymentSlice';
import {appointmentScheduler} from '../../features/Appointments/AppointmentScheduleForCallCenter/AppointmentScheduleForCallCenter';
import {scheduleInformation} from '../../features/OPDModule/DoctorSchedule/DoctorSchedule';

//CustomDropDown created using Form.Control and List items). Main goal of this customdropdown is to list the dropdown values as an option, and the user can able to search the each option. (State Management all be done using redux toolkit.)
const CustomDropDown = (props) => {
  const dispatch = useDispatch();
  //Getting neccessary state value from selector=> mainly for performing some specific tasks.
  const serviceData = useSelector((state) => state.serviceCreation.formData);
  const visitData = useSelector(
    (state) => state.appointmentVisitSchedule.formData
  );
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); //to allow the user to type the input in the form.control.
  const {options} = props; //options will carry the value from the component and passing it to the lists.
  const [filteredOptions, setFilteredOptions] = useState([]); // used to store filtered values from the type results..

  let optionRefs;

  optionRefs = useRef(filteredOptions.map(() => createRef(0)));

  useEffect(() => {
    //this useeffect will do the filtering actions whenever the options or the user typed in side the form.control.
    if (options.length !== 0) {
      const filteredData = options.filter((option) =>
        option.columnName.toLowerCase().includes(inputValue.toLowerCase())
      );
      //filteredOptionsRef
      setFilteredOptions(filteredData);
    } else {
      setFilteredOptions([]);
    }
  }, [inputValue, options]);
  let filteredOptionsRef;
  //to reset the input check value
  useEffect(() => {
    //whever the dropdown value un selected from the options, the input value should be re setted to default.
    const resetInputValue = () => {
      if (serviceData[props.name] === '') setInputValue('');
    };
    resetInputValue();
  }, [serviceData[props.name]]);

  useEffect(() => {
    //to not allow the value to be laoded when the particular value is PayorID.
    if (props.name === 'PayorID') {
      if (visitData.PatientType === 's') {
        setInputValue('');
      }
    }
  }, [visitData.PatientType]);

  // const handleInputChange = (event) => {
  //   const { value } = event.target;
  //   setIsDropDownOpen(true);
  //   if (value !== "") {
  //     const formattedValue = value.toUpperCase().replace(/[^A-Z a-z 0-9]/g, "");
  //     setInputValue(formattedValue);
  //   } else {
  //     setInputValue("");
  //   }
  // };
  const handleInputChange = (event) => {
    //handle input change alow user to enter the search content.
    const {value} = event.target;
    if (value !== '') {
      const formattedValue = value.toUpperCase().replace(/[^A-Z a-z 0-9]/g, '');
      setInputValue(formattedValue);
    } else {
      setInputValue('');
    }
  };

  // useEffect(() => {
  //   setIsDropDownOpen(true);
  // }, [inputValue]);

  const handleSelectOption = (value) => {
    //to store the value from the list by onmousedown event and pass the values to redux by dispatching the actions.
    //wherever the customdropdwon is used, that particular redux slice should be updated through the actions.
    setInputValue(value.columnName);
    setIsDropDownOpen(false);
    setTimeout(() => {
      dispatch(
        patientInformation({name: props.name, value: value.columnCode || ''})
      );
      dispatch(
        patientInformation({
          name: props.additionalname,
          value: value.columnName,
        })
      );
      dispatch(
        visitInformation({name: props.name, value: value.columnCode || ''})
      );
      dispatch(
        visitInformation({
          name: props.additionalname,
          value: value.columnName,
        })
      );
      //serviceDispatch
      dispatch(
        serviceInformation({name: props.name, value: value.columnCode || ''})
      );
      dispatch(
        serviceInformation({
          name: props.additionalname,
          value: value.columnName,
        })
      );
      dispatch(depositInformation({name: props.name, value: value.columnCode}));
      dispatch(
        depositInformation({name: 'paymentModeCode', value: value.columnName})
      );
      dispatch(
        serviceInformation({
          name: props.additionalname,
          value: value.columnName,
        })
      );
      dispatch(paymentInformation({name: props.name, value: value.columnCode}));
      dispatch(
        appointmentScheduler({name: props.name, value: value.columnCode})
      );
      dispatch(
        appointmentScheduler({
          name: props.additionalname,
          value: value.columnName,
        })
      );
      dispatch(
        scheduleInformation({name: props.name, value: value.columnName})
      );
      dispatch(
        scheduleInformation({
          name: props.additionalname,
          value: value.columnCode,
        })
      );
    }, 0);
  };

  const handleClick = () => {
    setIsDropDownOpen(true);
  };

  return (
    <div style={{position: 'relative'}}>
      <Form.Label className="mandatory">{props.label}</Form.Label>
      <Form.Control
        type={props.type}
        className={props.className}
        onChange={handleInputChange}
        placeholder={props.placeholder}
        value={props.value ? props.value : inputValue}
        // value={inputValue.columnName}
        // defaultValue={props.defaultValue}
        onInput={() => setIsDropDownOpen(true)}
        onFocus={() => setIsDropDownOpen(true)}
        onClick={handleClick}
        onBlur={() => setIsDropDownOpen(false)}
        disabled={props.disabled}
      />
      {/* isDropDownOpen flag value used for the customized dropdpown. */}
      {isDropDownOpen && (
        <>
          {' '}
          <ul
            className="options"
            style={{
              position: 'absolute',
              top: '100%',
              left: 2,
              listStyle: 'none',
              padding: 0,
              margin: 0,
              backgroundColor: 'white',
              boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
              height: '150px',
              overflow: 'scroll',
              width: '100%',
              zIndex: '9999',
            }}>
            {filteredOptions.map((value, index) => {
              return (
                <li
                  ref={optionRefs.current[index]}
                  key={index + value.columnCode + value.columnName}
                  // onClick={() => handleSelectOption(value)}
                  onMouseDown={() =>
                    handleSelectOption(
                      props.defaultValue !== undefined
                        ? props.defaultValue
                        : value
                    )
                  }
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ccc',
                  }}>
                  {value.columnName}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default CustomDropDown;
