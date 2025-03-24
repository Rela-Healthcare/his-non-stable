import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Header from "../../../../assets/Header.png";
import Footer from "../../../../assets/Footer.png";
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

// import { numberToWords } from "../Invoice/utils";
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
    documentTitle: "Invoice",
    onAfterPrint: () => {
      targetRef.current = null;
      // navigate("/op-search");
    },
  });

  const targetRef = useRef(null);

  const loginData = useSelector((state) => state.loginInfo.formData);
  const existingData = useSelector((state) => state.updatePatientInfo.formData.existingPatientData);
  const serviceData = useSelector((state) => state.serviceCart.serviceList);
  const visitData = useSelector((state) => state.opdashBoard.formData);
  //console.log(visitData);
  
  const paymentData = useSelector((state) => state.paymentInfo);
  //console.log(existingData);
  const ExistingResponse = useSelector(
    (state) => state.opdResponseInfo.formData.existingResponse
  );
  //console.log(ExistingResponse);
  const netAmount = serviceData.reduce((total, item) => total + item.Amount, 0);
  return (
    <div ref={targetRef} className="mothers">
      {true && (
        <>
          <div className="header">
            <img src={Header} alt="Header" />
          </div>
          <div style={{ textAlign: "center", marginTop: "75px" }}>
            <b>Bill Cum Receipt</b>
            <br />
            <b>(Original)</b>
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
                <b>:</b>&nbsp;{existingData.uhid}
              </td>
              <td>
                <b>Episode No</b>
              </td>
              <td>
                <b>:</b>&nbsp;{ExistingResponse.visitId}
              </td>
              <td>
                <b>Bill No</b>
              </td>
              <td>
                <b>:</b>&nbsp;{ExistingResponse.surrogatedID}
              </td>
            </tr>
            <tr>
              <td>
                <b>Patient Name</b>
              </td>
              <td>
                <b>:</b>
                &nbsp;{existingData.patientName}
              </td>
              <td>
                <b>Doctor Name</b>
              </td>
              <td>
                <b>:</b>&nbsp;{existingData.doctorName}
              </td>
              <td>
                <b>Bill Date</b>
              </td>
              <td>
                <b>:</b>&nbsp;{existingData.billDate}
              </td>
            </tr>
            <tr style={{ borderBottom: "2px solid black" }}>
              <td>
                <b>DOB/Gender</b>
              </td>
              <td>
                <b>:</b>&nbsp;{existingData.dob} / {existingData.gender}
              </td>
              <td>
                <b>Visit Date</b>
              </td>
              <td>
                <b>:</b>
                &nbsp;{visitData.VisitDate}
              </td>
              <td>
                <b>GST No</b>
              </td>
              <td>
                <b>:</b>&nbsp;33AAECJ0310M1ZY
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
            {/* mapping of services if length of services more than 10   */}
            {serviceData.length >= 0 && (
              <>
                {serviceData.map((event) => {
                  return (
                    <>
                      <tr>
                        <td style={{ textAlign: "center" }}>17-10-2023</td>
                        <td>{event.Service}</td>
                        <td style={{ textAlign: "center" }}>Estd Time</td>
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
                          {parseInt(event.Amount)}.00
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
                <b>Net Amount</b>
              </td>
              <td style={{ textAlign: "center" }}>{netAmount}.00</td>
            </tr>
            {/* <tr>{numberToWords(netAmount)} Rupees Only /-</tr> */}
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
          bottom: "50px",
          left: "10px",
          right: "10px",
        }}
      ></div>
      <div className="footer">
        <img src={Footer} alt="Footer" />
      </div>
    </div>
  );
};

export default Invoice;
