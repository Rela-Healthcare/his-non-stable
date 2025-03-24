import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { OPModuleAgent } from "../../../agent/agent";
import "./Barcode.css";

const BarcodeGen = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { regID } = params;
  const [data, setData] = useState("");
  let startRedirection = false;

  useEffect(() => {
    fetchData();
    const handlePrint = () => {
      const timeout = setTimeout(() => {
        window.print();
      }, 1000);
      startRedirection = true;
      return () => {
        clearTimeout(timeout);
      };
    };

    // Initiate printing when the component mounts
    handlePrint();
  }, []);

  useEffect(() => {
    if (startRedirection) {
      const timeout = setTimeout(() => {
        navigate("/op-dashboard");
      }, 10000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  const fetchData = async () => {
    try {
      const fetchResponse = (await OPModuleAgent.getCaseSheetInfo(regID)).data;
      console.log(fetchResponse);
      if (fetchResponse) setData(fetchResponse);
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  //console.log(data);
  return (
    <div
      className="barcode-label"
      style={{
        fontSize: "8px",

        // marginLeft: "5px",
        fontWeight: "900",
        fontFamily: "Ubuntu, sans-serif",
      }}
    >
      <span className="text">UHID: {data.patientId}</span> <br />
      <span className="text">{data.patientFirstName}</span> <br />
      <span className="text">
        Gender:{data.gender === ("MALE" || "Male") ? "M" : "F"},{" "}
      </span>
      <span className="text">
        DOB:{data.dob !== undefined && data.dob.split(" ")[0]}
      </span>{" "}
      <br />
      <Barcode
        width="1cm"
        height="7cm"
        fontSize="10px"
        value={data.patientId}
        color="white"
      />
    </div>
  );
};

export default BarcodeGen;
