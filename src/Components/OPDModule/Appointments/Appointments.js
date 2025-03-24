import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Reschedule from "../Reschedule/Reschedule";
import Block from "../Blocking/Block";
import Booking from "../Booking/Booking";
import DoctorSchedule from "../DoctorScheduling/DoctorSchedule";

const Appointments = () => {
  return (
    <>
      <Tabs
        defaultActiveKey="Appointment Scheduling"
        id="justify-tab-example"
        className="mb-3 text-white"
        fill
        style={{ backgroundColor: "#006dad", color: "white" }}>
        <Tab eventKey="Appointment Scheduling" title="Appointment Scheduling">
          <Booking />
        </Tab>
        <Tab eventKey="DoctorSchedule" title="Doctor Slot">
          <DoctorSchedule />
        </Tab>
        <Tab eventKey="Rescheduling" title="Rescheduling">
          <Reschedule />
        </Tab>
        <Tab eventKey="Block" title="Block">
          <Block />
        </Tab>
      </Tabs>
    </>
  );
};

export default Appointments;
