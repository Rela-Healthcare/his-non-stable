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
import "./CaseSheet.css";

const CaseSheet = () => {
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

  const serviceDataForCaseSheet = useSelector(
    (state) => state.serviceCreation.formData
  );

  const visitDataForCaseSheet = useSelector(
    (state) => state.appointmentVisitSchedule.formData
  );

  const paymentDataForCaseSheet = useSelector(
    (state) => state.paymentInfo.formData
  );

  //console.log(patientDataForCaseSheet);

  const OPDResponse = useSelector((state) => state.opdResponseInfo.formData);
  return (
    <div ref={targetRef} className="mothers">
      {/* button to trigger printing of target component */}
      {/* <ReactToPrint
          trigger={() => <Button>Get Case Sheet</Button>}
          content={() => targetRef.current}
        /> */}

      <div className="page1">
        <div className="header">
          <img src={Header} alt="Header" />
        </div>
        <div
          style={{
            border: "1px solid black",
            marginTop: "100px",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <b>Registration Form</b>
          </div>

          <table className="table1">
            <tr>
              <td>
                {" "}
                <div style={{ width: "100px", height: "10px" }}>
                  <th>
                    <div style={{ width: "70px", height: "10px" }}>UHID</div>
                  </th>
                  <td>
                    {" "}
                    <div style={{ width: "100px", height: "10px" }}>
                      : {OPDResponse.response.referenceNumber}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ width: "100px", height: "10px" }}>
                  <th>
                    <div style={{ width: "70px", height: "10px" }}>Name</div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "10px" }}>
                      {" "}
                      : {patientDataForCaseSheet.SalutationName}{" "}
                      {patientDataForCaseSheet.PatientName}
                    </div>
                  </td>
                </div>
              </td>

              <td>
                {" "}
                <div style={{ width: "100px", height: "10px" }}>
                  <th>
                    <div style={{ width: "110px", height: "10px" }}>
                      Date of Birth
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "100px", height: "10px" }}>
                      : {patientDataForCaseSheet.DOB}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ width: "100px", height: "10px" }}>
                  {" "}
                  <th>
                    <div style={{ width: "70px", height: "10px" }}>ACN</div>
                  </th>
                  <td>
                    <div style={{ width: "100px", height: "10px" }}>
                      : {patientDataForCaseSheet.IDNo}
                    </div>
                  </td>
                </div>
              </td>
              <td>
                <div style={{ width: "100px", height: "10px" }}>
                  <th>
                    <div style={{ width: "110px", height: "10px" }}>
                      Nationality
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "100px", height: "10px" }}>
                      : {patientDataForCaseSheet.NationalityName}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ width: "100%", height: "20px" }}>
                  {" "}
                  <th>
                    <div style={{ width: "70px", height: "20px" }}>
                      Gender/Age
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "20px" }}>
                      : {patientDataForCaseSheet.Gender}/
                      {patientDataForCaseSheet.Age}
                    </div>
                  </td>
                </div>
              </td>
              <td>
                <div style={{ width: "100px", height: "10px" }}>
                  {" "}
                  <th>
                    <div style={{ width: "110px", height: "10px" }}>
                      Preferred Language
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "100px", height: "10px" }}>
                      : {patientDataForCaseSheet.LanguageName}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid black" }}>
              <td>
                <div style={{ width: "100%", height: "20px" }}>
                  {" "}
                  <th>
                    <div style={{ width: "70px", height: "20px" }}>
                      Marital Status
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "20px" }}>
                      : {patientDataForCaseSheet.MaritalStatus}
                    </div>
                  </td>
                </div>
              </td>
              <td>
                <div style={{ width: "100%", height: "20px" }}>
                  <th>
                    <div style={{ width: "110px", height: "20px" }}>
                      Employement Status
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "20px" }}>
                      : {patientDataForCaseSheet.OccupationName}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
          </table>
          <table className="table1">
            <tr style={{ borderBottom: "1px solid black" }}>
              <td>
                <span
                  style={{
                    fontWeight: "bolder",
                    textDecoration: "underline",
                  }}
                >
                  Additional Info
                </span>
                <tr>
                  <th style={{ width: "70px", height: "10px" }}>Address</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {patientDataForCaseSheet.Address}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "70px", height: "10px" }}>Post Code</th>
                  <td style={{ width: "50px", height: "10px" }}>
                    : {patientDataForCaseSheet.Pincode}
                  </td>
                  <th style={{ width: "40px", height: "10px" }}>City</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {patientDataForCaseSheet.City}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "70px", height: "10px" }}>State</th>
                  <td style={{ width: "50px", height: "10px" }}>
                    : {patientDataForCaseSheet.State}
                  </td>
                  <th style={{ width: "70px", height: "10px" }}>Country</th>
                  <td style={{ width: "50px", height: "10px" }}>
                    : {patientDataForCaseSheet.Country}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "40px", height: "10px" }}>Mobile No.</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {patientDataForCaseSheet.MobileNo}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "70px", height: "10px" }}>Email</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {patientDataForCaseSheet.EmailId}
                  </td>
                </tr>
              </td>

              <td>
                <span
                  style={{
                    fontWeight: "bolder",
                    textDecoration: "underline",
                  }}
                >
                  Next of Kin/Emergency Contact
                </span>
                <tr>
                  <th style={{ width: "40px", height: "10px" }}>Name</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {patientDataForCaseSheet.kinSalutation}{" "}
                    {patientDataForCaseSheet.RelationName}
                  </td>
                </tr>
                <tr>
                  <th
                    style={{ display: "flex", width: "40px", height: "10px" }}
                  >
                    Address
                  </th>
                  <td style={{ width: "200px", height: "10px" }}>
                    : {patientDataForCaseSheet.kinAddress}
                  </td>
                </tr>
                <tr>
                  <th
                    style={{ display: "flex", width: "70px", height: "10px" }}
                  >
                    Pincode
                  </th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {patientDataForCaseSheet.kin_Pincode}
                  </td>
                  <th style={{ width: "70px", height: "10px" }}>City</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {patientDataForCaseSheet.kinCity}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "70px", height: "10px" }}>State</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {patientDataForCaseSheet.kinState}
                  </td>
                  <th style={{ width: "70px", height: "10px" }}>Country</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {patientDataForCaseSheet.kinCountry}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: "70px", height: "10px" }}>Mobile No.</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    {patientDataForCaseSheet.RelationMobileNo}
                  </td>
                </tr>
              </td>
            </tr>
          </table>
          <table className="table1">
            <tr style={{ borderBottom: "1px solid black" }}>
              <th>
                <div style={{ width: "50px" }}>Special Assistance</div>
              </th>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  :{" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="specialassist"
                    checked={
                      patientDataForCaseSheet.specialAssistanceNeeded === "1" &&
                      true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                      border: "1px solid black",
                    }}
                    type="checkbox"
                    name="specialassist"
                    checked={
                      patientDataForCaseSheet.specialAssistanceNeeded === "0" &&
                      true
                    }
                  />
                  No
                  {patientDataForCaseSheet.specialAssistanceNeeded === "1" && (
                    <input
                      type="text"
                      value={
                        patientDataForCaseSheet.specialAssistanceDetailsIfYes
                      }
                    />
                  )}
                  {patientDataForCaseSheet.specialAssistanceNeeded === "0" && (
                    <input type="text" value={""} />
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th>Referral Source</th>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  {" "}
                  :{" "}
                  <div>
                    {" "}
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 1 && true}
                    />
                    Walk In
                  </div>
                  <div>
                    {" "}
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 3 && true}
                    />
                    Newspaper
                  </div>
                  <div>
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 4 && true}
                    />
                    Social Media
                  </div>
                  <div>
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 5 && true}
                    />
                    Friend/Family
                  </div>
                  <div>
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 6 && true}
                    />
                    Corporate Tie-up
                  </div>
                  <br />
                  <div>
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 2 && true}
                    />
                    Website
                  </div>
                  <div>
                    {" "}
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                        marginLeft: "13px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 7 && true}
                    />
                    Neighbourhood
                  </div>
                  <div>
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={patientDataForCaseSheet.RefSource === 8 && true}
                    />
                    Doctor Referral
                  </div>
                  <div>
                    <input
                      style={{
                        padding: "5px",
                        height: "10px",
                        width: "10px",
                        margin: "5px",
                      }}
                      type="checkbox"
                      name="specialassist"
                      checked={
                        patientDataForCaseSheet.RefSource ===
                          (13 || 9 || 12 || 10 || 14 || 16 || 15) && true
                      }
                    />
                    Others
                  </div>
                  <div>
                    <input
                      type="text"
                      style={{ border: "1px solid black", height: "30px" }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <table className="table1">
            <tr>
              <th style={{ width: "80px", height: "10px" }}>Payment Type</th>
              <td>: {paymentDataForCaseSheet.paymentMethod}</td>
              <th style={{ width: "80px", height: "10px" }}>Policy/Mem.ID</th>
              <td>: Some ID No</td>
              <th style={{ width: "80px", height: "10px" }}>Eligiblity</th>
              <td>: Self Paying</td>
            </tr>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th>Sponsor Type</th>
              <td>: Sponsor type</td>
              <th>Reg User</th>
              <td>: MahaLakshmi R</td>
              <th>Time of Reg</th>
              <td>: {new Date().toDateString()}</td>
            </tr>
          </table>
          <table className="table1">
            <tr>
              <td>
                1. Are you suffering from fever, cough or any respiratory
                symptoms in last one week?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_symptoms === "1" && true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_symptoms === "0" && true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                2. Do you have any history of fever and rashes in the past two
                weeks?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_historyoffever === "1" &&
                      true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_historyoffever === "0" &&
                      true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                3. Have you travelled out of country in last 1 month? if yes
                mention the name of the country?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_outofcountry1month ===
                        "1" && true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_outofcountry1month ===
                        "0" && true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                3. Has there been any disease outbreak(like Swine flu, Ebola,
                Covid-19) in your country?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_diseaseoutbreak === "1" &&
                      true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_diseaseoutbreak === "0" &&
                      true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                3. Are you a healcareworker (Nurse, Physician, allied health
                service personnel, Laboratory worker)?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_healthcareworker === "1" &&
                      true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_healthcareworker === "0" &&
                      true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                6. Have you been exposed to any of the following disease in last
                1 month?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_disease_last1month ===
                        "1" && true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_disease_last1month ===
                        "0" && true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_chickenpox === "0" && true
                    }
                  />
                  Checken Pox
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_measles === "0" && true
                    }
                  />
                  Measles
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_mumps === "0" && true
                    }
                  />
                  Mumps
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_rubella === "0" && true
                    }
                  />
                  Rubella
                </div>
              </td>
            </tr>
            <tr>
              <td>7. Currently are you having diarrhea symptoms?</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_diarrheasymptoms === "1" &&
                      true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_diarrheasymptoms === "0" &&
                      true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
            <tr>
              <td>
                8. Have you ever been told/referred by a health care provider
                that you have a active TB?
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {" "}
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_activeTB === "1" && true
                    }
                  />
                  Yes
                  <input
                    style={{
                      padding: "5px",
                      height: "10px",
                      width: "10px",
                      margin: "5px",
                    }}
                    type="checkbox"
                    name="diseaseScreening"
                    checked={
                      patientDataForCaseSheet.pat_Is_activeTB === "0" && true
                    }
                  />
                  No
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div>
          <table>
            <tr>
              <th>Disclaimer</th>
            </tr>
            <tr>
              {" "}
              <td>
                I hereby consent/authorize the hospital physician & personnel to
                perform physical examination,and to give treatment.I permit all
                persons caring for me at this facility to treat me in a ways
                they judge are benefitial to me.I understand that this care may
                includes tests,examinations,x-rays and collection of blood or
                other bodily fluids.
              </td>
            </tr>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "fixed",
              bottom: "60px",
              right: "15px",
              left: "15px",
              borderTop: "1px solid black",
            }}
          >
            <div>{`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}</div>
            <div>{`Printed by :${patientDataForCaseSheet.Address}`}</div>
            <div>{`Page 1 of 2`}</div>
          </div>
        </div>
      </div>
      <div
        className="page2"
        style={{
          marginTop: "100px",
          // display: "block",
        }}
      >
        <div>
          {" "}
          <div style={{ textAlign: "center" }}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <b>General Consent</b>
          </div>
          <div style={{ padding: "5px" }}>
            <div style={{ marginBottom: "10px" }}>
              The undersigned patient and / or responsible relative or person
              here by consent to and authorize Dr.Rela Institute & Medical
              Centre's physicians and medical professionals to administer and
              perform medical examinations, routine investigations, medical
              reatments out patient procedures vaccinations and immunizations
              during the patient's care, be deemed necessary.
            </div>
            <div style={{ marginBottom: "10px" }}>
              I have been explained that in the event of need of specific
              tests/procedures, a separate consent will be obtained.
            </div>
            <div style={{ marginBottom: "10px" }}>
              The undersigned also gives consent to receive communication on
              treatment related information via text messages and e-mail as per
              the details provided at the time of registration.
            </div>
            <div style={{ marginBottom: "10px" }}>
              The undersigned also gives consent to the hospital to use medical
              information for insurance coverage and to contact him or her by
              telephone, if needed regarding appointments and follow-up needs.
            </div>
          </div>
          <div>
            <table style={{ border: "1px solid black" }}>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black", width: "15%" }}> </th>
                <th style={{ border: "1px solid black", width: "30%" }}>
                  Signature
                </th>
                <th style={{ border: "1px solid black", width: "30%" }}>
                  Name
                </th>
                <th style={{ border: "1px solid black", width: "15%" }}>
                  Date
                </th>
                <th style={{ border: "1px solid black", width: "10%" }}>
                  Time
                </th>
              </tr>
              <tr style={{ border: "1px solid black" }}>
                <td style={{ height: "90px", border: "1px solid black" }}>
                  Patient/Patient's
                  <br /> Representative
                </td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
                <td style={{ height: "90px", border: "1px solid black" }}>
                  <br />
                  <br />
                  If representative, relationship:
                </td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
              </tr>
            </table>
            <br />
            <div style={{ fontWeight: "bold", textAlign: "center" }}>
              These details are mandatory and need to be filled in compulsorily.
            </div>
            <br />
            <div>For office use only</div>
            <table style={{ border: "1px solid black" }}>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black", width: "15%" }}> </th>
                <th style={{ border: "1px solid black", width: "30%" }}>
                  Signature
                </th>
                <th style={{ border: "1px solid black", width: "15%" }}>
                  Name
                </th>
                <th style={{ border: "1px solid black", width: "15%" }}>
                  Emp.No
                </th>
                <th style={{ border: "1px solid black", width: "15%" }}>
                  Date
                </th>
                <th style={{ border: "1px solid black", width: "10%" }}>
                  Time
                </th>
              </tr>
              <tr style={{ border: "1px solid black" }}>
                <td style={{ height: "90px", border: "1px solid black" }}>
                  Pcs Staff
                </td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
                <td style={{ height: "90px", border: "1px solid black" }}>
                  <br />
                  <br />
                  If representative, relationship:
                </td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
                <td style={{ height: "90px", border: "1px solid black" }}></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "fixed",
            bottom: "60px",
            right: "15px",
            left: "15px",
            borderTop: "1px solid black",
          }}
        >
          <div>{`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}</div>
          <div>{`Printed by :${patientDataForCaseSheet.Address}`}</div>
          <div>{`Page 1 of 2`}</div>
        </div>
      </div>
      <div className="footer">
        <img src={Footer} alt="Footer" />
      </div>
    </div>
  );
};

export default CaseSheet;
