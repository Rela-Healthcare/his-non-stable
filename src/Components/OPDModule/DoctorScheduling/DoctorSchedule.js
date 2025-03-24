import React, { useState, useEffect } from "react";
import { Row, Col, Form, Accordion, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSwatchbook } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import CustomFormInput from "../../../common/CustomFormInput/CustomFormInput";
import CustomDropDown from "../../../common/CustomDropDown/CustomDropDown";
import { OPModuleAgent } from "../../../agent/agent";
import {
  dropdownInformation,
  resetInformation,
} from "../../../features/OPDModule/DoctorSchedule/DoctorSchedule";

const DoctorSchedule = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleStartDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0].split("-");
    let startDate =
      formattedDate[2] + "/" + formattedDate[1] + "/" + formattedDate[0];
    setFormattedDate((prev) => ({ ...prev, startDate }));
    setStartDate(date);
    const startTime = date.toLocaleTimeString();
    setStartTime(startTime);
  };
  const handleEndDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0].split("-");
    let endDate =
      formattedDate[2] + "/" + formattedDate[1] + "/" + formattedDate[0];
    setFormattedDate((prev) => ({ ...prev, endDate }));
    setEndDate(date);
    const endTime = date.toLocaleTimeString();
    setEndTime(endTime);
  };

  //console.log(formattedDate, startTime, endTime);
  const doctorScheduledData = useSelector(
    (state) => state.doctorScheduler.formData
  );
  console.log(doctorScheduledData);
  const loginData = useSelector((state) => state.loginInfo.formData);

  useEffect(() => {
    dispatch(resetInformation());
  }, []);

  useEffect(() => {
    departmentData();
    dropdownInformation({
      name: "DoctorList",
      value: [],
    });
    // eslint-disable-next-line
  }, [doctorScheduledData.Department]);

  useEffect(() => {
    if (doctorScheduledData.Department !== "") {
      doctorData();
    } else return;
    // eslint-disable-next-line
  }, [doctorScheduledData.Department]);

  const payload = {
    DoctorId: doctorScheduledData.DoctorName,
    FromDate: formattedDate.startDate,
    ToDate: formattedDate.endDate,
    SessionStartTime: startTime,
    SessionEndingTime: endTime,
    UserId: loginData.userName,
  };

  const saveData = async () => {
    try {
      const saveResponse = (await OPModuleAgent.saveAppointmentSlot(payload)).data;
      setStartDate(new Date());
      setStartTime("");
      setEndDate(new Date());
      setEndTime("");
      dispatch(resetInformation());
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  async function departmentData() {
    try {
      const departmentsResponse = (await OPModuleAgent.getDepartments()).data;
      dispatch(
        dropdownInformation({
          name: "DepartmentList",
          value: departmentsResponse || [],
        })
      );
      //console.log(1);
    } catch (error) {
      //console.log("Error fetching Data:", error);
    }
  }

  async function doctorData() {
    try {
      const doctorListByDepartmentResponse = (
        await OPModuleAgent.getDoctorListByDepartment(
          doctorScheduledData.DepartmentName
        )
      ).data;
      //console.log(2);

      dispatch(
        dropdownInformation({
          name: "DoctorList",
          value: doctorListByDepartmentResponse || [],
        })
      );
    } catch (error) {
      //console.log("Error fetching Data:", error);
    }
  }
  return (
    <div>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <h5>Doctor's Scheduling</h5>
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomDropDown
                  name="Department"
                  additionalname="DepartmentName"
                  label="Department Name"
                  type="text"
                  className="select"
                  placeholder="Select Department"
                  options={doctorScheduledData.DepartmentList}
                  value=""
                  disabled={
                    doctorScheduledData.DepartmentList !== "" ? false : true
                  }
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomDropDown
                  name="Doctor"
                  additionalname="DoctorName"
                  label="Doctor Name"
                  type="text"
                  className="select"
                  placeholder="Select Doctor"
                  options={doctorScheduledData.DoctorList}
                  value=""
                  disabled={
                    doctorScheduledData.Department !== "" ? false : true
                  }
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomDropDown
                  className="select"
                  type="text"
                  name="SlotInfo"
                  options={doctorScheduledData.SlotGapList || []}
                  label="Slot Gap"
                  placeholder="Select Slot Gap"
                  disabled={
                    doctorScheduledData.Department !== "" ? false : true
                  }
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>Start Date & Start Time</Form.Label>
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
                    dateFormat="dd/MM/yyy HH:mm" // Format for displaying selected date
                    yearDropdownItemNumber={150}
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    scrollableMonthDropdown
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={parseInt(doctorScheduledData.SlotInfo)}
                    // maxDate={new Date()}
                    minDate={new Date()}
                    placeholderText="Select Date"
                  />
                  <span className="icon">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                </div>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>End Date & End Time</Form.Label>
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
                    selected={endDate}
                    onChange={handleEndDateChange}
                    dateFormat="dd/MM/yyy HH:mm" // Format for displaying selected date
                    yearDropdownItemNumber={150}
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    scrollableMonthDropdown
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={parseInt(doctorScheduledData.SlotInfo)}
                    // maxDate={new Date()}
                    minDate={new Date()}
                    placeholderText="Select Date"
                  />
                  <span className="icon">
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                </div>
              </Form.Group>
            </Row>
            {/* <Row style={{ backgroundColor: "#e9ecef" }}>
              <Form.Label>
                <h3>Break</h3>
              </Form.Label>
            </Row>
            <Row>
              <Col>
                {" "}
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <Form.Label>Start Time</Form.Label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="Pp"
                      className="select"
                    />
                    <span className="icon">
                      <FontAwesomeIcon icon={faSwatchbook} />
                    </span>
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <Form.Label>End Time</Form.Label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="Pp"
                      className="select"
                    />
                    <span className="icon">
                      <FontAwesomeIcon icon={faSwatchbook} />
                    </span>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ backgroundColor: "#e9ecef" }}>
              <Form.Label>
                <h3>Video Consultation</h3>
              </Form.Label>
            </Row>
            <Row>
              <Col>
                {" "}
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <Form.Label>Start Time</Form.Label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="Pp"
                      className="select"
                    />
                    <span className="icon">
                      <FontAwesomeIcon icon={faSwatchbook} />
                    </span>
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <Form.Label>End Time</Form.Label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="Pp"
                      className="select"
                    />
                    <span className="icon">
                      <FontAwesomeIcon icon={faSwatchbook} />
                    </span>
                  </div>
                </Form.Group>
              </Col>
            </Row> */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div style={{ textAlign: "center", margin: "10px" }}>
        {/* <Button>Clear</Button> */}
        <Button onClick={saveData}>Submit</Button>
      </div>
    </div>
  );
};

export default DoctorSchedule;
