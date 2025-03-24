import React, { useRef } from "react";
import relahos from "../../../assets/RelaHospital.jpeg";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "react-bootstrap";


const IDProof = () => {
  const navigate = useNavigate();
  const generatePDF = useReactToPrint({
    content: () => targetRef.current,
    documentTitle: "Invoice",

    onAfterPrint: () => {
      targetRef.current = null;
      navigate("/op-dashboard");
    },
  });

  const targetRef = useRef(null);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "80%" }} ref={targetRef}>
        <h5 style={{ textAlign: "center" }}>Your Identity Proof</h5>
        <img src={relahos} alt="Your ID Proof" />
      </div>
      <div style={{ height: "80%", margin: "10px 0px", textAlign: "center" }}>
        <Button onClick={generatePDF}>Print ID Proof</Button>
      </div>
    </div>
  );
};

export default IDProof;
