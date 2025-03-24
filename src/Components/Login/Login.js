import React, { useState } from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import {faUser,faKey,faLocationPin} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OPModuleAgent } from "../../agent/agent";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { loginInformation } from "../../features/Login/LoginSlice";
import { message } from "antd";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginData = useSelector((state) => state.loginInfo.formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await OPModuleAgent.hislogin({
        userId: loginData.userName,
        password: loginData.password,
      });
  
      if (response.status === "success" && response.data.userCode >= 0) {
        // Store user details in localStorage
        localStorage.setItem("userName", response.data.userID);
        localStorage.setItem("validEntry", true);
  
        // Dispatch login info to Redux
        dispatch(loginInformation({ name: "userName", value: response.data.userID }));
        dispatch(loginInformation({ name: "validEntry", value: true }));
  
        navigate("/op-search");
        message.success("Login Successful!");
      } else {
        toast.warn("Invalid Credentials!");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
    }
  };
  
  
  
  return (
    <div className={classes.mother}>
      <Row className={classes.container}>
        <Col className={classes.col1} style={{ backgroundColor: "whitesmoke" }}>
          
        </Col>
        <Col className={classes.col2}>
          {" "}
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-4 pt-2" style={{ textAlign: "center" }}>
              User Login
            </h5>
            <Form.Group
              style={{height: "50px",display: "flex",alignItems: "center",gap: "10px",backgroundColor: "white",margin: "5px",          
                borderRadius: "15px",fontWeight: "bolder",border: "1px solid gray",
                boxShadow: "21px 15px 53px -13px rgba(21,89,89,0.75)"}}>
              <FontAwesomeIcon
                icon={faUser}style={{ padding: "5px 5px 5px 10px" }}>               
                </FontAwesomeIcon>
              <Form.Control
                value={loginData.userName}
                style={{
                  fontWeight: "bolder",
                  border: "none",}}
                placeholder="UserName"
                type="text"
                onChange={(event) =>
                  dispatch(
                    loginInformation({
                      name: "userName",
                      value: event.target.value,}))}>                  
                </Form.Control>
            </Form.Group>
            <Form.Group
              style={{height: "50px",display: "flex",alignItems: "center",gap: "10px",margin: "5px",backgroundColor: "white",
              border: "1px solid gray",boxShadow: "21px 15px 53px -13px rgba(21,89,89,0.75)",borderRadius: "15px",}}>
              <FontAwesomeIcon
                icon={faKey}style={{ padding: "5px 5px 5px 10px" }}>                 
                </FontAwesomeIcon>
              <Form.Control
                style={{fontWeight: "bolder",border: "none",}}
                value={loginData.password}
                placeholder="Password"
                type="password"
                onChange={(event) =>dispatch(loginInformation({name: "password",value: event.target.value}))}>                 
                </Form.Control>
            </Form.Group>
            <Form.Group
              style={{height: "50px",display: "flex",alignItems: "center",gap: "10px",margin: "5px",backgroundColor: "white",
                border: "1px solid gray",boxShadow: "21px 15px 53px -13px rgba(21,89,89,0.75)",borderRadius: "15px"}}>
              <FontAwesomeIcon
                icon={faLocationPin}
                style={{ padding: "5px 5px 5px 10px" }}>
                </FontAwesomeIcon>
              <Form.Select
                style={{fontWeight: "bolder",border: "none"}}
                placeholder="Location"
                type="text">
                <option disabled value="">Select location</option>
                <option>RIMC-Chromepet</option>       
              </Form.Select>
            </Form.Group>
            <div style={{ textAlign: "center" }}>
              <Button
                style={{boxShadow: "21px 15px 53px -13px rgba(21,89,89,0.75)",}}
                type="submit" className="mt-4  mb-4 pt-2  py-2 px-5  text-bold-300 rounded-lg">Sign in</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
