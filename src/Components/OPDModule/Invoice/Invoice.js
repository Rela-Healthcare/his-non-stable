import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Header from "../../../assets/Header.png";
import Footer from "../../../assets/Footer.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSquare,
  faSquareCheck,
  faSquareFull,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./Invoice.css";
import { numberToWords } from "./utils.js";
const Invoice = () => {
  const [isPrinted, setIsPrinted] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isPrinted) {
      generatePDF();
      setIsPrinted(true);
    }
  }, []);

  const generatePDF = useReactToPrint({
    content: () => targetRef.current,
    documentTitle: "Case Sheet",
    onAfterPrint: () => {
      targetRef.current = null;
      navigate("/op-search/invoice");
    },
  });

  const targetRef = useRef(null);

  const patientDataForCaseSheet = useSelector(
    (state) => state.patientCreation.formData
  );
  const patientData = useSelector((state) => state.patientCreation.formData);
  const serviceListData = useSelector(
    (state) => state.serviceCreation.formData
  );
  const serviceData = useSelector((state) => state.serviceCart.serviceList);
  //////////console.log(serviceData);

  const visitData = useSelector(
    (state) => state.appointmentVisitSchedule.formData
  );

  const paymentData = useSelector((state) => state.paymentInfo);
  //////////console.log(paymentData);
  //////////console.log(patientDataForCaseSheet);
  const netAmount = serviceData.reduce((total, item) => total + item.Amount, 0);
  const netRateAmount = serviceData.reduce(
    (total, item) => total + item.Rate,
    0
  );
  //////////console.log(netAmount, netRateAmount);

  const loginData = useSelector((state) => state.loginInfo.formData);
  //////////console.log(loginData);
  
  return (
    <div ref={targetRef} className="mothers">
      {/* button to trigger printing of target component */}
      {/* <ReactToPrint
          trigger={() => <Button>Get Case Sheet</Button>}
          content={() => targetRef.current}
        /> */}
      {true && (
        <>
          <div className="header">
            <img src={Header} alt="Header" />
          </div>
          <div style={{ textAlign: "center", marginTop: "150px" }}>
            <b>Bill Cum Receipt</b>
            <br />
            <b>(Orginal)</b>
          </div>
          <table
            className="table2"
            style={{
              margin: "5px",
              padding: "5px",
            }}
          >
            <tr>
              <td>
                <b>UHID</b>
              </td>
              <td>
                <b>:</b> {patientData.UHID}
              </td>
              <td>
                <b>Episode No</b>
              </td>
              <td>
                <b>:</b> 4328743287
              </td>
              <td>
                <b>Bill No</b>
              </td>
              <td>
                <b>:</b> 4328743287
              </td>
            </tr>
            <tr>
              <td>
                <b>Patient Name</b>
              </td>
              <td>
                <b>:</b> {patientData.SalutationName} {patientData.PatientName}
              </td>
              <td>
                <b>Doctor Name</b>
              </td>
              <td>
                <b>:</b> {visitData.DoctorName}
              </td>
              <td>
                <b>Bill Date</b>
              </td>
              <td>
                <b>:</b> {new Date().getDate()}/{new Date().getMonth() + 1}/
                {new Date().getFullYear()}{" "}
                {new Date().toTimeString().split(" ")[0]}
              </td>
            </tr>
            <tr style={{ borderBottom: "2px solid black" }}>
              <td>
                <b>DOB/Gender</b>
              </td>
              <td>
                <b>:</b> {patientData.DOB} / {patientData.Age}
              </td>
              <td>
                <b>Payer</b>
              </td>
              <td>
                <b>:</b>
                {visitData.PayorName}
              </td>
              <td>
                <b>GST No</b>
              </td>
              <td>
                <b>:</b> 33AAECJ0310M1ZY
              </td>
            </tr>
          </table>
          <table
            className="table2"
            style={{
              margin: "5px",
              padding: "5px",
            }}
          >
            <tr
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <th style={{ textAlign: "center" }}>
                Date of <br />
                Services
              </th>
              <th style={{ textAlign: "center" }}>Services</th>
              <th style={{ textAlign: "center" }}>Result Time *</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "center" }}>
                Unit
                <br /> Price
              </th>
              <th style={{ textAlign: "center" }}>Discount</th>
              <th style={{ textAlign: "center" }}>
                Gross <br />
                Amount{" "}
              </th>
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>
                {new Date().toLocaleDateString()}
              </td>
              <td>Registration Fees</td>
              <td style={{ textAlign: "center" }}></td>
              <td style={{ textAlign: "center" }}></td>
              <td style={{ textAlign: "center" }}>100.00</td>
              <td style={{ textAlign: "center" }}></td>
              <td style={{ textAlign: "center" }}> 100.00</td>
            </tr>
            {/* mapping of services if length of services more than 10   */}
            {serviceData.length >= 0 && (
              <>
                {serviceData.map((event) => {
                  return (
                    <>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          {new Date().toLocaleDateString}
                        </td>
                        <td>{event.Service}</td>
                        <td style={{ textAlign: "center" }}>4 hours</td>
                        <td style={{ textAlign: "center" }}>{event.Unit}</td>
                        <td style={{ textAlign: "center" }}>
                          {parseInt(event.Rate)}.00
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {event.Discount}
                          {event.DiscountType === "A" ? " .00" : " %"}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {" "}
                          {parseInt(event.Rate)}.00
                        </td>
                      </tr>
                    </>
                  );
                })}
              </>
            )}

            {/* Net Amount table row */}

            <tr
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: "center" }}>
                <b>Gross Total</b>
              </td>
              <td style={{ textAlign: "center" }}>{netRateAmount + 100}.00</td>
            </tr>
            {parseInt(netRateAmount) - parseInt(netAmount) !== 0 && (
              <>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "center" }}>
                    <b>Discount</b>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {parseInt(netRateAmount) - parseInt(netAmount)}.00
                  </td>
                </tr>
              </>
            )}

            <tr
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: "center" }}>
                <b>Net Amount</b>
              </td>
              <td style={{ textAlign: "center" }}>{netAmount + 100}.00</td>
            </tr>
            {/* <tr>{numberToWords(netAmount)}</tr> */}
          </table>
          &nbsp;
          {/* <Button onClick={() => generatePDF(targetRef)}>Get Invoice</Button> */}
          <div className="footer">
            <img src={Footer} alt="Footer" />
          </div>
        </>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "100px",
          left: "100px",
          right: "0px",
        }}
      >
        Printed by: {loginData.userName}
      </div>
      <div className="footer">
        <img src={Footer} alt="Footer" />
      </div>
    </div>
  );
};

export default Invoice;
