import React, { useState, useEffect } from "react";
import { Row, Col, Form, Accordion, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { OPModuleAgent } from "../../../agent/agent";
import CustomDropDown from "../../../common/CustomDropDown/CustomDropDown";
import CustomFormInput from "../../../common/CustomFormInput/CustomFormInput";
import {
  dropDownInformation,
  appointmentScheduler,
  resetAppointmentInformation,
} from "../../../features/Appointments/AppointmentScheduleForCallCenter/AppointmentScheduleForCallCenter";
import { toast } from "react-toastify";

const Booking = () => {
  const scheduleData = useSelector(
    (state) => state.appointmentScheduler.formData
  );
  console.log(scheduleData);
  const dispatch = useDispatch();

  // //console.log(scheduleData);

  useEffect(() => {
    departmentData();
    resetAppointmentInformation({
      name: "DoctorList",
      value: [],
    });
    // eslint-disable-next-line
  }, [scheduleData.Dept]);

  useEffect(() => {
    if (scheduleData.Dept !== "") {
      doctorData();
    } else return;
    // eslint-disable-next-line
  }, [scheduleData.Dept, scheduleData.DocId]);

  useEffect(() => {
    if (
      scheduleData.Dept !== "" &&
      scheduleData.DocId !== "" &&
      scheduleData.AppointmentDate !== ""
    ) {
      slotData();
    } else return;
    // eslint-disable-next-line
  }, [
    scheduleData.Dept,
    scheduleData.DocId,
    scheduleData.AppointmentDate,
  ]);

  const [startDate, setStartDate] = useState(new Date());

  const handleStartDateChange = (date) => {
    setStartDate(date);
    const formattedDate = new Date(date.toDateString())
      .toLocaleDateString()
      .split("/");
    // //console.log(startDate);
    dispatch(
      appointmentScheduler({
        name: "AppointmentDate",
        value:
          formattedDate[2] + "-" + formattedDate[0] + "-" + formattedDate[1],
      })
    );
  };

  const handleSlotData = (event) => {
    const { value } = event.target;

    // Split the time string into hours and minutes
    const [hoursStr, minutesStr] = value.split(":");

    // Convert hours and minutes to numbers
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Create a Date object with the specified time components
    const timeDate = new Date();
    timeDate.setHours(hours);
    timeDate.setMinutes(minutes);
    // timeDate.setSeconds(seconds);
    // timeDate.setMilliseconds(milliseconds);

    // Convert the Date object to a string in the desired format
    const timeString = `${timeDate.getHours()}:${timeDate.getMinutes()}:00.000`;

    // //console.log(timeString);

    // Dispatch the timeString or the Date object, depending on your needs
    dispatch(
      appointmentScheduler({
        name: "SlotInfo",
        value: timeString,
      })
    );
  };

  async function departmentData() {
    try {
      const departmentsResponse = (await OPModuleAgent.getDepartments()).data;
      dispatch(
        dropDownInformation({
          name: "DepartmentList",
          value: departmentsResponse || [],
        })
      );
    } catch (error) {
    }
  }

  async function doctorData() {
    try {
      const doctorListByDepartmentResponse = (
        await OPModuleAgent.getDoctorListByDepartment(scheduleData.Dept)
      ).data;

      dispatch(
        dropDownInformation({
          name: "DoctorList",
          value: doctorListByDepartmentResponse || [],
        })
      );
    } catch (error) {
      //console.log("Error fetching Data:", error);
    }
  }

  async function slotData() {
    try {
      const appointmentSlotResponse = (
        await OPModuleAgent.getAppointmentDetails(
          scheduleData.AppointmentDate,
          scheduleData.DocId
        )
      ).data;
      dispatch(
        appointmentScheduler({
          name: "SlotList",
          value: appointmentSlotResponse,
        })
      );
    } catch (error) {
      //console.log("Error fetching Data:", error);
    }
  }
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>
          <h3>Appointment Scheduling</h3>
        </Accordion.Header>
        <Accordion.Body>
          {" "}
          <Row>
            <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
              <Form.Label>Appointment Date</Form.Label>
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
                  selected={scheduleData.AppointmentDate !== "" && startDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  placeholderText="Select Date"
                />
                <span className="icon">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
              </div>
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
              <CustomDropDown
                name="Dept"
                additionalname="DeptName"
                label="Department Name"
                type="text"
                className="select"
                placeholder="Select Department"
                options={scheduleData.DepartmentList}
                value=""
                disabled={scheduleData.DepartmentList !== "" ? false : true}
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
              <CustomDropDown
                name="DocId"
                additionalname="DocName"
                label="Doctor Name"
                type="text"
                className="select"
                placeholder="Select Doctor"
                options={scheduleData.DoctorList}
                disabled={scheduleData.Department !== "" ? false : true}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
              <Form.Label>Sequence No</Form.Label>
              <Form.Select
                name="appointmentId"
                required
                placeholder="Sequence No"
                className="select"
                onChange={handleSlotData}
                disabled={scheduleData.AppointmentDate !== "" ? false : true}
                // value={scheduleData.SlotInfo !== "" ? scheduleData.SlotInfo : ""}
                defaultValue={""}
              >
                <option value="" disabled>
                Sequence No
                </option>
                {`// eslint-disable-next-line`}
                {scheduleData.SlotList.length > 0 &&
                  scheduleData.SlotList.map((event, index) => (
                    <option key={index} value={event.startDateTime}>
                      {event.startDateTime}-{event.endDateTime}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
              <CustomFormInput
                name="UHID"
                label="UHID"
                type="text"
                className="select"
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
              <CustomFormInput
                name="Mobile Number"
                label="Mobile Number"
                type="text"
                className="select"
              />
            </Form.Group>
          </Row>
          <div style={{ textAlign: "center" }}>
            <Button onClick={() => toast.info("Api Yet To Come!")}>Save</Button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Booking;
