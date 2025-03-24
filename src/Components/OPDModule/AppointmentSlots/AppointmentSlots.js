import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import classes from "../Home/Home.module.css";
import { Button } from "react-bootstrap";
import Services from "../Services/Services";

const AppointmentSlots = () => {
  const [patientData, setPatientData] = useState({
    Department: "",
    consultant: "",
    availableSlots: "",
    multipleConsultants: [],
  });
  const [addConsultant, setAddConsultant] = useState(1);

  const handleMoreConsultant = (event) => {
    setAddConsultant((prev) => prev + 1);
    //console.log(addConsultant);
    //reset the state values of consultant details and push the existing details into the multipleConsultants if addmoreConsultant Clicked.
  };

  return (
    <div>
      <Row>
        <Form.Group as={Col}>
          <Form.Control
            className={`${classes.select}`}
            type="text"
            value={patientData.Department}
            onChange={{}}
            placeholder="Department"
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Control
            className={`${classes.select} `}
            type="text"
            value={patientData.consultant}
            onChange={{}}
            placeholder="Consultant"
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Select
            className={`${classes.select} `}
            type="time"
            value={patientData.availableSlots}
            onChange={{}}
            placeholderText="Available Slots"
          >
            <option value="" selected disabled>
              Select Available Slot
            </option>
            <option>1-1.30</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            className={`${classes.select} `}
            type="text"
            value={patientData.consultantCharge}
            onChange={{}}
            placeholder="Fees"
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className={`${classes.select} `}
            type="text"
            value={patientData.consultantCharge}
            onChange={{}}
            placeholder="Fees"
          >
            <option>Mode of Payment</option>
            <option>Self</option>
            <option>POS</option>
            <option>UPI</option>
            <option>Deposit</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Control
            className={`${classes.select} `}
            type="text"
            value={patientData.discount}
            onChange={{}}
            placeholder="Consultation Discount"
          ></Form.Control>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Control
            className={`${classes.select} `}
            type="text"
            value={patientData.quantity}
            onChange={{}}
            placeholder="Quantity"
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row>
        <Services />
      </Row>
      <Form.Group as={Col}>
        <Button
          onClick={handleMoreConsultant}
          className={classes.select}
          style={{ border: "none", color: "white", width: "100px" }}
        >
          Add+
        </Button>
      </Form.Group>
    </div>
  );
};

export default AppointmentSlots;
