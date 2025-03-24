import React, { useState, useEffect } from "react";
import { Row, Col, Form, Accordion, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faSwatchbook,
  faTimesCircle,
  faTimesSquare,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";

import CustomFormInput from "../../../common/CustomFormInput/CustomFormInput";
import CustomDropDown from "../../../common/CustomDropDown/CustomDropDown";

const Block = () => {
  // const [timeValue, setTimeValue] = useState(["10:00", "11:00"]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const timeOnChange = (newTime) => {
  //   // setTimeValue(newTime);
  //   // //console.log("time range select value: " + newTime);
  // };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>
          <h5>Appointment Blocking</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Form.Group as={Col} xs={12} sm={12} md={6} lg={6}>
              <CustomDropDown
                name="Department"
                additionalname="DepartmentName"
                label="Department Name"
                type="text"
                className="select"
                placeholder="Select Department"
                options={[{ columnName: "23", columnCode: "23" }]}
                value=""
               
              />
            </Form.Group>

            <Form.Group as={Col} xs={12} sm={12} md={6} lg={6}>
              <CustomDropDown
                name="Doctor"
                additionalname="DoctorName"
                label="Doctor Name"
                type="text"
                className="select"
                placeholder="Select Doctor"
                options={[{ columnName: "23", columnCode: "23" }]}
                value=""
               
              />
            </Form.Group>
          </Row>
          <Row>
            <Col>
              {" "}
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>Start Date</Form.Label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <DatePicker
                    className="select"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormat="MMMM d, yyyy HH:mm" // Format for displaying selected date
                    yearDropdownItemNumber={150}
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    scrollableMonthDropdown
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    maxDate={new Date()}
                    minDate={new Date("1900")}
                    placeholderText="Select Date"
                  />
                  <span className="icon">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>End Date</Form.Label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <DatePicker
                    className="select"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormat="MMMM d, yyyy" // Format for displaying selected date
                    yearDropdownItemNumber={150}
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    scrollableMonthDropdown
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    maxDate={new Date()}
                    minDate={new Date("1900")}
                    placeholderText="Select Date"
                  />
                  <span className="icon">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <div style={{ textAlign: "center" }}>
            {" "}
            <Button>Clear</Button>
            <Button>Save</Button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Block;
