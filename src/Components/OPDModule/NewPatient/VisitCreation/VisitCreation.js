import React, { useState, useEffect } from "react";
import { Row, Col, Form, Accordion } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleCheck,faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import CustomDropDown from "../../../../common/CustomDropDown/CustomDropDown";
import CustomFormInput from "../../../../common/CustomFormInput/CustomFormInput";
import {visitInformation,resetVisitInformation,dropDownInformation}
from "../../../../features/OPDModule/AppointmentSchedule/AppointmentScheduleSlice";
import { OPModuleAgent } from "../../../../agent/agent";


const VisitCreation = () => {
  const dispatch = useDispatch();
  const visitData = useSelector(
    (state) => state.appointmentVisitSchedule.formData
  );
  
  //console.log(visitData);

  useEffect(() => {
    dispatch(resetVisitInformation());
  }, []);
  //resetting the appointment schedule information
  useEffect(() => {
    fetchData(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    departmentData();
    resetVisitInformation({
      name: "DoctorList",
      value: [],
    });
    // eslint-disable-next-line
  }, [visitData.Department]);

  useEffect(() => {
    if (visitData.Department !== "") {
      doctorData();
    } else return;
    // eslint-disable-next-line
  }, [visitData.Department, visitData.docId]);

  useEffect(() => {
    if (
      visitData.Department !== "" &&
      visitData.docId !== "" &&
      visitData.AppointmentDate !== ""
    ) {
      slotData();
    } else return;
    // eslint-disable-next-line
  }, [visitData.Department, visitData.docId, visitData.AppointmentDate]);

  useEffect(() => {
    if (visitData.PatientType !== "") {
      payorsData();
    } else return;
    // eslint-disable-next-line
  }, [visitData.PatientType]);
  const [startDate, setStartDate] = useState(new Date());

  //check for validateInfo
  useEffect(() => {
    validateVisitInfo();
  }, [visitData]);

  useEffect(() => {}, []);
  const validateVisitInfo = () => {
    if (
      visitData.Department !== "" &&
      visitData.docId !== "" &&
      visitData.DoctorName !== "" &&
      visitData.VisitType !== "" &&
      visitData.AppointmentDate !== "" &&
      visitData.SlotInfo !== "" &&
      visitData.RefSource !== ""
    ) {
      if (visitData.PatientType === "s") {
        dispatch(
          visitInformation({
            name: "PayorID",
            value: "",
          })
        );
        dispatch(
          visitInformation({
            name: "PayorName",
            value: "",
          })
        );
        dispatch(
          visitInformation({
            name: "visitInfo",
            value: true,
          })
        );
      } else if (
        visitData.PatientType !== "s" &&
        visitData.PayorID !== "" &&
        visitData.PayorName !== ""
      ) {
        dispatch(
          visitInformation({
            name: "visitInfo",
            value: true,
          })
        );
      } else {
        dispatch(
          visitInformation({
            name: "visitInfo",
            value: false,
          })
        );
      }
    } else {
      dispatch(
        visitInformation({
          name: "visitInfo",
          value: false,
        })
      );
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    const formattedDate = new Date(date.toDateString())
      .toLocaleDateString()
      .split("/");
    // //console.log(startDate);
    dispatch(
      visitInformation({
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


    // Convert the Date object to a string in the desired format
    const timeString = `${timeDate.getHours()}:${timeDate.getMinutes()}:00.000`;

    // Dispatch the timeString or the Date object, depending on your needs
    dispatch(
      visitInformation({
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
      //console.log("Error fetching Data:", error);
    }
  }

  async function doctorData() {
    try {
      const doctorListByDepartmentResponse = (
        await OPModuleAgent.getDoctorListByDepartment(visitData.Department)
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
        await OPModuleAgent.getAppointmentDetails({
          SlotDate: visitData.AppointmentDate, 
          DoctorID: visitData.docId,           
          SlotType: 0                           
        })
      ).data;  // The response from the API
  
      // Dispatch the fetched data to Redux
      dispatch(
        visitInformation({
          name: "SlotList",
          value: appointmentSlotResponse,
        })
      );
    } catch (error) {
      // Handle error if needed
      console.log("Error fetching Data:", error);
    }
  }
  
  
  async function payorsData() {
    try {
      const payorsListResponse = (
        await OPModuleAgent.getPayorsList(visitData.PatientType)
      ).data;

      dispatch(
        dropDownInformation({
          name: "PayorsList",
          value: payorsListResponse || [],
        })
      );
    } catch (error) {
      //console.log("Error fetching Data:", error);
    }
  }

  
  async function fetchData() {
    try {
      const referralSourceResponse = (await OPModuleAgent.getRefSrcList()).data;
      dispatch(
        dropDownInformation({
          name: "ReferralSourceList",
          value: referralSourceResponse || [],
        })
      );
      const internalDocResponse = (await OPModuleAgent.getInternalDoctorList()).data;

      dispatch(
        dropDownInformation({
          name: "InternalDoctorList",
          value: internalDocResponse || [],
        })
      );
      const externalDocResponse = (await OPModuleAgent.getExternalDoctorList())
        .data;
      dispatch(
        dropDownInformation({
          name: "ExternalDoctorList",
          value: externalDocResponse || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
 
  return (
    <>
      <Accordion mb={3} defaultActiveKey="1">
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <h5>Appointment Schedule & Visit</h5>
            {visitData.visitInfo ? (
              <div style={{ marginLeft: "7px" }}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{
                    color: "green",
                    width: "20px",
                    height: "20px",
                    textAlign: "center",
                  }}
                />
              </div>
            ) : (
              <div style={{ marginLeft: "7px" }}>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{
                    color: "red",
                    width: "20px",
                    height: "20px",
                    textAlign: "center"}}/></div>)}
          </Accordion.Header>

          <Accordion.Body>
            <Row mb={3}>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomDropDown
                  name="Department"
                  additionalname="DepartmentName"
                  label="Department Name"
                  type="text"
                  className="select"
                  placeholder="Select Department"
                  options={visitData.DepartmentList}
                  value=""
                  disabled={visitData.DepartmentList !== "" ? false : true}/>
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomDropDown
                  name="docId"
                  additionalname="DoctorName"
                  label="Doctor Name"
                  type="text"
                  className="select"
                  placeholder="Select Doctor"
                  options={visitData.DoctorList}
                  disabled={visitData.Department !== "" ? false : true}/>
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                {" "}
                <CustomDropDown
                  name="VisitType"
                  additionalname="PatientVisitType"
                  label="Visit Type"
                  type="text"
                  className="select"
                  placeholder="Select Visit Type"
                  options={visitData.VisitTypeList || []}
                  disabled={visitData.VisitTypeList !== "" ? false : true}/>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4} xl={4}>
                <Form.Label className="mandatory">Appointment Date</Form.Label>
                <div>
                  <DatePicker
                    className="select form-control "
                    selected={visitData.AppointmentDate !== "" && startDate}
                    onChange={handleStartDateChange}             
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"/>
                </div>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                <Form.Label className="mandatory">Sequence No</Form.Label>
                <Form.Select
                  name="appointmentId"
                  required
                  placeholder="Appointment Time"
                  className="select"
                  onChange={handleSlotData}
                  disabled={visitData.AppointmentDate !== "" ? false : true}
                  defaultValue={""}>
                  <option value="" disabled defaultValue>
                  Sequence No
                  </option>
                  {visitData.SlotList.length > 0 &&
                    visitData.SlotList.map((event, index) => (
                      <option key={index} value={event.startDateTime}>
                        {event.startDateTime}                
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                <CustomDropDown
                  name="PatientType"
                  label="Patient Type"
                  type="text"
                  className="select"
                  placeholder="Select Patient Type"
                  options={visitData.PatientTypeList}/>
              </Form.Group>
            </Row>

            <Row>
              {" "}
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomDropDown
                  name="PayorID"
                  additionalname="PayorName"
                  label="Payor's Name"
                  type="text"
                  className="select"
                  placeholder="Select Payors Name"
                  options={visitData.PayorsList}
                  disabled={visitData.PatientType === "s" ? true : false}/>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                {" "}
                <CustomDropDown
                  name="RefSource"
                  additionalname="RefSourceDetails"
                  label="Referral Source"
                  type="text"
                  className="select"
                  placeholder="Select RefSource"
                  options={visitData.ReferralSourceList}/>
              </Form.Group>
              {visitData.RefSource === 8 && (
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <Form.Label className="mandatory">Doctor Type</Form.Label>
                  <Form.Select
                    className="select"
                    value={visitData.RefSourceNameIfDoctor}
                    onChange={(event) =>
                      dispatch(
                        visitInformation({
                          name: "RefSourceNameIfDoctor",
                          value: event.target.value}))}>
                    <option value="" disabled>
                      Select One
                    </option>
                    <option value="1">Internal</option>
                    <option value="0">External</option>
                  </Form.Select>
                </Form.Group>
              )}
              {visitData.RefSourceNameIfDoctor === "1" && (
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <CustomDropDown
                    name="InternalDoctorID"
                    additionalname="InternalDoctorName"
                    label="Internal Doctor"
                    type="text"
                    className="select"
                    placeholder="Select RefSource"
                    options={visitData.InternalDoctorList}
                  />
                </Form.Group>
              )}
              {visitData.RefSourceNameIfDoctor === "0" && (
                <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                  <CustomDropDown
                    name="ExternalDoctorID"
                    additionalname="ExternalDoctorName"
                    label="External Doctor"
                    type="text"
                    className="select"
                    placeholder="Select RefSource"
                    options={visitData.ExternalDoctorList}/>
                </Form.Group>
              )}
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <CustomFormInput
                  name="package"
                  label="Package Details"
                  type="text"
                  className="select"
                  placeholder="Package Details"/>
              </Form.Group>
            </Row>
            
            <Row></Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default VisitCreation;
