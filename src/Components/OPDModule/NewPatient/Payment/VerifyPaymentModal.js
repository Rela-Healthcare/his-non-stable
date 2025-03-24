import React, {useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { OPModuleAgent } from "../../../../agent/agent.js";
import { useSelector } from "react-redux";

const VerifyPaymentModal = (props) => {
  const { processingID } = props;
  //console.log(processingID);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    const verification = window.confirm("Are You sure to go back?");
    if (verification) setShow(false);
    if (!verification) setShow(true);
  };

  const handleShow = () => setShow(true);

  const handleVerifyPayment = async () => {
    const verifyPaymentResponse = (
      await OPModuleAgent.verifyPaymentInfo(processingID)
    ).data;
    //console.log(verifyPaymentResponse);
  };
  const verifyCheck = useSelector((state) => state.paymentInfo.formData);

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        disabled={!verifyCheck.verifyPaymentFlag}
      >
        Verify Payment
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <h5>Payment Verification</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={handleVerifyPayment}>Verify</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VerifyPaymentModal;
