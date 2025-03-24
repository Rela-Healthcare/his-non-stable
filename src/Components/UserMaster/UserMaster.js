import React, { useState, useEffect } from "react";
import classes from "./UserMaster.module.css";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Button,
  Accordion,
  ButtonGroup,
} from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const UserMaster = () => {
  const [formData, setFormData] = useState({});
  const handleSubmit = async () => {
    try {
      const payload = {};
      const response = await axios.post("", payload);
      console.log(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className={classes.usermaster_mother}>
      <h5> User Master Access!</h5>
      <div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col} sm={12} lg={4} xl={3}>
              <Form.Control type="text" placeholder="Search Paitent here.." />
            </Form.Group>

            <ButtonGroup as={Col} sm={12} lg={4} xl={2}>
              <Button>
                Search{" "}
                <span>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </Button>
            </ButtonGroup>
          </Row>
        </Form>
        <Form>
          <Row>
            <Form.Group></Form.Group>
          </Row>
          <Row>
            <Form.Group></Form.Group>
          </Row>
        </Form>
        <Row>
          <Form.Group></Form.Group>
        </Row>
      </div>
    </div>
  );
};

export default UserMaster;
