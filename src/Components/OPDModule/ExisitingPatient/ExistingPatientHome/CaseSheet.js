import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Header from "../../../../assets/Header.png";
import Footer from "../../../../assets/Footer.png";
import { useSelector } from "react-redux";
import "./CaseSheet.css";

const CaseSheet = () => {
  const loginData = useSelector((state) => state.loginInfo.formData);
  const caseSheetData = useSelector((state) => state.opdResponseInfo.formData);
  const existingData = useSelector(
    (state) => state.updatePatientInfo.formData.existingPatientData
  );
  const existingResponse = useSelector(
    (state) => state.opdResponseInfo.formData.existingResponse
  );
  const [isPrinted, setIsPrinted] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    fetchData();
  }, []);
  const generateRegisterID = () => {
    // const id = existingData.visitId;
    //console.log(existingResponse.visitId);
    const idAlone = existingResponse.visitId
      .split("")
      .filter((value) => !isNaN(parseInt(value)));
    return idAlone.reduce((accum, currentValue) => accum + currentValue);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.15.3/NewHIS/api/his/getPatientRegistrationPdf?RegId=${generateRegisterID()}`
      );
      setData(response.data);
    } catch (error) {
      //console.log("Error", error);
    }
  };

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

    },
  });

  const targetRef = useRef(null);

  const patientDataForCaseSheet = useSelector(
    (state) => state.updatePatientInfo.formData
  );

  const serviceDataForCaseSheet = useSelector(
    (state) => state.serviceCreation.formData
  );

  const paymentDataForCaseSheet = useSelector(
    (state) => state.paymentInfo.formData
  );

  return (
    <div ref={targetRef} className="mothers">
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
            <b>Registration Form (Original)</b>
          </div>

          <table className="table3">
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
                      : {existingData.uhid}
                    </div>
                  </td>
                </div>
              </td>
              <td>
                {" "}
                <div style={{ width: "100px", height: "10px" }}>
                  <th>
                    <div style={{ width: "110px", height: "20px" }}>
                      Date of Birth
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "10px" }}>
                      : {existingData.dob}
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
                    <div style={{ width: "200px", height: "20px" }}>
                      {" "}
                      : {existingData.patientName}
                    </div>
                  </td>
                </div>
              </td>
              <td>
                <div style={{ width: "100%", height: "10px" }}>
                  {" "}
                  <th>
                    <div style={{ width: "110px", height: "20px" }}>
                      Gender/Age
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "20px" }}>
                      : {existingData.gender}
                      {existingData.gender ? "/" : ""}
                      {existingData.age}
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
                      : {data.patIDNo}
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
                      : {data.nationality}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
            <tr>
              {/* <td>
                <div style={{ width: "100px", height: "10px" }}>
                  {" "}
                  <th>
                    <div style={{ width: "110px", height: "10px" }}>
                      Preferred Language
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "100px", height: "10px" }}>
                      : {data.language}
                    </div>
                  </td>
                </div>
              </td> */}
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
                      : {data.maritialStatus}
                    </div>
                  </td>
                </div>
              </td>
              <td>
                <div style={{ width: "100%", height: "20px" }}>
                  <th>
                    <div style={{ width: "110px", height: "20px" }}>
                      Occupation
                    </div>
                  </th>
                  <td>
                    <div style={{ width: "200px", height: "20px" }}>
                      : {data.occupationName}
                    </div>
                  </td>
                </div>
              </td>
            </tr>
          </table>
          <table className="table3">
            <tr>
              <td style={{ borderRight: "1px solid black" }}>
                <span
                  style={{
                    fontWeight: "bolder",
                    textDecoration: "underline",
                  }}>
                  Additional Info
                </span>
                <tr
                  style={{
                    display: "flex",

                    justifyContent: "flex-start",
                  }}
                >
                  <th style={{ width: "80px", height: "10px" }}>Address</th>
                  <td style={{ width: "300px", height: "30px" }}>
                    : {data.conAddress1} {data.conAddress2} {data.conAddress3}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <th
                    style={{
                      width: "80px",
                      height: "10px",
                    }}
                  >
                    Pincode
                  </th>
                  <td style={{ width: "80px", height: "10px" }}>
                    : {data.postBoxNo}
                  </td>
                  <th style={{ width: "25px", height: "10px" }}>City</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {data.cityCode}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <th style={{ width: "80px", height: "10px" }}>State</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {data.stateCode}
                  </td>
                  <th style={{ width: "50px", height: "10px" }}>Country</th>
                  <td style={{ width: "50px", height: "10px" }}>
                    : {data.countryName}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <th style={{ width: "80px", height: "10px" }}>Mobile No.</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {data.mobileNumber}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <th style={{ width: "80px", height: "10px" }}>Email</th>
                  <td style={{ width: "200px", height: "10px" }}>
                    : {data.emailId}
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
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>
                  <th style={{ width: "80px", height: "10px" }}>Name</th>
                  <td style={{ width: "200px", height: "10px" }}>
                    : {data.kinName}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>

                  <th style={{ width: "80px", height: "10px" }}>Address</th>
                  <td style={{ width: "300px", height: "40px" }}>
                    : {data.kinAddress}
                    {data.kinAddress1}
                    {data.kinAddress2}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>

                  <th style={{ width: "80px", height: "10px" }}>Pincode</th>
                  <td style={{ width: "100px", height: "10px" }}>
                    : {data.kinPostalCode}
                  </td>
                  <th style={{ width: "25px", height: "10px" }}>City</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {data.kinCityCode}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>

                  <th style={{ width: "80px", height: "10px" }}>State</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {data.kinStateCode}
                  </td>
                  <th style={{ width: "80px", height: "10px" }}>Country</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {data.kinCountry}
                  </td>
                </tr>
                <tr
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>
                  <th style={{ width: "80px", height: "10px" }}>Mobile No</th>
                  <td style={{ width: "110px", height: "10px" }}>
                    : {data.kinMobileNumber}
                  </td>
                </tr>
              </td>
            </tr>
          </table>
         
          <table className="table3" style={{ border: "1px solid black" }}>
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
              <td>: </td>
              <th>Time of Reg</th>
              <td>: {new Date().toDateString()}</td>
            </tr>
          </table>
        </div>
        <div>
          <table className="table3">
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
            <div>{`Printed by :${loginData.userName}`}</div>
            <div>{`Page 1 of 1`}</div>
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
        <div></div>
      </div>

      <div className="footer">
        <img src={Footer} alt="Footer" />
      </div>
    </div>
  );
};

export default CaseSheet;
