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
    documentTitle: "Case Sheet",
    onAfterPrint: () => {
      targetRef.current = null;
      navigate("/op-dashboard");
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
  //console.log(serviceData);

  const visitData = useSelector(
    (state) => state.opdashBoard.formData.InvoiceInfo
  );
  //console.log(visitData);

  const paymentData = useSelector((state) => state.paymentInfo);
  //console.log(paymentData);
  //console.log(patientDataForCaseSheet);
  const netAmount = serviceData.reduce((total, item) => total + item.Amount, 0);
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
          <div style={{ textAlign: "center", marginTop: "75px" }}>
            <b>Bill Cum Receipt</b>
            <br />
            <b>(Duplicate)</b>
          </div>
          <table
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
                <b>:</b>&nbsp;{visitData.UHID}
              </td>
              <td>
                <b>Episode No</b>
              </td>
              <td>
                <b>:</b>&nbsp;{visitData.VisitID}
              </td>
              <td>
                <b>Bill No</b>
              </td>
              <td>
                <b>:</b>&nbsp;4328743287
              </td>
            </tr>
            <tr>
              <td>
                <b>Patient Name</b>
              </td>
              <td>
                <b>:</b>
                &nbsp;{visitData.PatientName}
              </td>
              <td>
                <b>Doctor Name</b>
              </td>
              <td>
                <b>:</b>&nbsp;{visitData.DoctorDetails}
              </td>
              <td>
                <b>Bill Date</b>
              </td>
              <td>
                <b>:</b>&nbsp;{new Date().getDate()}/{new Date().getMonth() + 1}
                /{new Date().getFullYear()}{" "}
                {new Date().toTimeString().split(" ")[0]}
              </td>
            </tr>
            <tr style={{ borderBottom: "2px solid black" }}>
              <td>
                <b>DOB/Gender</b>
              </td>
              <td>
                <b>:</b>&nbsp;{visitData.DOB} / {visitData.Gender}
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
