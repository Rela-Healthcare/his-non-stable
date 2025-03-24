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
import { numberToWords } from "../Invoice/utils";
const Invoice = () => {
  const [isPrinted, setIsPrinted] = useState(false);
  const navigate = useNavigate();

  const opdashboardData = useSelector(
    (state) => state.opdashBoard.formData.BillInfo
  );
  //console.log(opdashboardData);
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
      navigate("/op-dashboard");
    },
  });

  const targetRef = useRef(null);

  const patientDataForCaseSheet = useSelector(
    (state) => state.patientCreation.formData
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
            <b>(Duplicate)</b>
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
                <b>:</b>&nbsp;{opdashboardData.BillNo}
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
                <b>:</b>&nbsp;{opdashboardData.GSTNo}
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
              {/* <th style={{ textAlign: "center" }}>Discount</th> */}
              <th style={{ textAlign: "center" }}>
                Gross <br />
                Amount{" "}
              </th>
            </tr>
            {/* mapping of services if length of services more than 10   */}
            {opdashboardData.InvoiceList.length >= 0 && (
              <>
                {opdashboardData.InvoiceList.map((event, index) => {
                  return (
                    <>
                      <tr key={event.service_Name + index}>
                        <td style={{ textAlign: "center" }}>
                          {event.dateofService}
                        </td>
                        <td>{event.services}</td>
                        <td style={{ textAlign: "center" }}>
                          {event.resultTime}
                        </td>
                        <td style={{ textAlign: "center" }}>{event.qty}</td>
                        <td style={{ textAlign: "center" }}>
                          {event.unitPrice}
                        </td>
                        {/* <td style={{ textAlign: "center" }}>
                          {event.Discount}
                          {event.DiscountType === "A" ? " .00" : " %"}
                        </td> */}

                        <td style={{ textAlign: "center" }}>
                          {" "}
                          {event.groupTotal}
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

              <td style={{ textAlign: "center" }}>
                <b>Total Gross Amount</b>
              </td>
              <td style={{ textAlign: "center" }}>
                {opdashboardData.TotalGrossAmount}
              </td>
            </tr>
            <tr
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <td></td>
              <td></td>
              <td></td>
              <td></td>

              <td style={{ textAlign: "center" }}>
                <b>Discount Amount</b>
              </td>
              <td style={{ textAlign: "center" }}>
                {opdashboardData.TotalDiscount}
              </td>
            </tr>
            <tr
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <td></td>
              <td></td>
              <td></td>
              <td></td>

              <td style={{ textAlign: "center" }}>
                <b>Net Amount</b>
              </td>
              <td style={{ textAlign: "center" }}>
                {opdashboardData.TotalNetAmount}
              </td>
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
      >
        <p>Printed by: {opdashboardData.CashierSignature}</p>
      </div>
      {/* <div className="footer">
        <img src={Footer} alt="Footer" />
      </div> */}
    </div>
  );
};

export default Invoice;
