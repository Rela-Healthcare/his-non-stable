import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ServiceCreation from "../../NewPatient/ServiceCreation/ServiceCreation";
import ServiceList from "../../NewPatient/ServiceList/ServiceList";
import { Form, Col, Row, Button } from "react-bootstrap";
import { resetServiceInformation } from "../../../../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import { resetItemsInServiceCart } from "../../../../features/OPDModule/ServiceList/ServiceListSlice";
import { resetPaymentInformation } from "../../../../features/OPDModule/Payment/PaymentSlice";
import Payment from "../../../../Components/OPDModule/NewPatient/Payment/Payment";
import { OPModuleAgent } from "../../../../agent/agent";
import { toast } from "react-toastify";

const OPServicesOnly = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const existingVisitData = useSelector(
    (state) => state.opdashBoard.formData.ServiceInfo
  );
  const loginData = useSelector((state) => state.loginInfo.formData);
  const serviceData = useSelector((state) => state.serviceCreation.formData);
  const serviceListData = useSelector((state) => state.serviceCart.serviceList);
  const paymentData = useSelector((state) => state.paymentInfo.formData);
  const netAmount = useSelector((state) => state.serviceCart.totalAmount);
  console.log(existingVisitData, serviceData, serviceListData, paymentData);

  //comeback to the destination page when targeted page refreshed unnecessarily!
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo(0, 0);
      navigate("/op-dashboard", { replace: true });
    };
    window.onpopstate = handlePopState;
    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);

  useEffect(() => {
    if (existingVisitData === "") {
      window.scrollTo(0, 0);
      navigate("/op-dashboard", { replace: true });
    }
  }, [navigate, existingVisitData]);

  useEffect(() => {
    dispatch(resetItemsInServiceCart());
    dispatch(resetServiceInformation());
    dispatch(resetPaymentInformation());
    // eslint-disable-next-line
  }, []);

  // const payloadServices = serviceListData;
  const payloadForSave = {
    UHID: existingVisitData.UHID,
    DoctorID: existingVisitData.DoctorId,
    UserID: loginData.userName,
    GrossAmount: 100, //TotalGross Amount
    DiscountAmount: 0, //TotalDiscount Amount
    GLAmount: 0,
    PatientResponsibility: "100",
    NetAmount: netAmount,
    OPBillRecepitLine: [
      {
        RegistrationID: existingVisitData.VisitID, //visit ID
        ServiceID: 1561,
        Unit: 1,
        Rate: 0,
        DiscType: 0,
        Discount: 0,
        Amount: 100,
        PriorityType: "",
        Remarks: "remarks",
      },
    ],
    OPReceipt_Payment_Line: [
      {
        PayMode: paymentData.paymentMethod,
        Amount: netAmount,
        RefNo: "test",
      },
    ],
  };
  const saveData = async () => {
    try {
      const saveServiceDataWithPaymentInfoResponse = (
        await OPModuleAgent.saveServiceDataWithPaymentInfo(payloadForSave)
      ).data;
     
      navigate("/op-dashboard");
      toast.success("Service created successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <div style={{ height: "80vh", overflow: "scroll" }}>
      <Row style={{ margin: "5px 5px" }}>
        <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
          <Form.Label>UHID</Form.Label>
          <Form.Control
            type="text"
            className="select"
            value={existingVisitData.UHID}
            disabled
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
          <Form.Label>Patient Name</Form.Label>
          <Form.Control
            type="text"
            className="select"
            value={existingVisitData.PatientName}
            disabled
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
          <Form.Label>Visit ID</Form.Label>
          <Form.Control
            type="text"
            className="select"
            value={existingVisitData.VisitID}
            disabled
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row style={{ margin: "5px 5px" }}>
        <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
          <Form.Label>Visit Date</Form.Label>
          <Form.Control
            type="text"
            className="select"
            value={existingVisitData.VisitDate}
            disabled
          ></Form.Control>
        </Form.Group>
      
        <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
          <Form.Label>Doctor Name</Form.Label>
          <Form.Control
            type="text"
            className="select"
            value={
              existingVisitData.DoctorName !== ""
                ? existingVisitData.DoctorName
                : ""
            }
            disabled
          ></Form.Control>
        </Form.Group>
      </Row>
      
      <div>
        <ServiceCreation />
      </div>
      <div>
        <ServiceList />
      </div>
      <div>
        <Payment registrationFee={0} />
      </div>
      <div style={{ textAlign: "center", margin: "10px 0px" }}>
        <Button onClick={saveData}>Proceed for Checkout</Button>
      </div>
    </div>
  );
};

export default OPServicesOnly;
