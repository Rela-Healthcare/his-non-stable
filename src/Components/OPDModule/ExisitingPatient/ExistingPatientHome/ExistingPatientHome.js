import React, {useState, useEffect} from 'react';
import {Tabs, Tab, Form, Button, Row, Col, Accordion} from 'react-bootstrap';
import CustomFormInput from '../../../../common/CustomFormInput/CustomFormInput';
import DatePicker from 'react-datepicker';
import {useSelector, useDispatch} from 'react-redux';
import {resetInformation} from '../../../../features/OPDModule/PatientCreation/PatientCreationSlice';
import {resetServiceInformation} from '../../../../features/OPDModule/ServiceDetails/ServiceDetailsSlice';
import {resetVisitInformation} from '../../../../features/OPDModule/AppointmentSchedule/AppointmentScheduleSlice';
import {
  resetPaymentInformation,
  paymentInformation,
} from '../../../../features/OPDModule/Payment/PaymentSlice';
import ServiceList from '../../NewPatient/ServiceList/ServiceList';
import VisitCreation from '../../NewPatient/VisitCreation/VisitCreation';
import Payment from '../../NewPatient/Payment/Payment';
import {OPModuleAgent} from '../../../../agent/agent';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {getResponseInformation} from '../../../../features/OPDModule/OPDModuleResponse/OPDModuleResponseSlice';
import VerifyPaymentModal from '../../NewPatient/Payment/VerifyPaymentModal';
import ServiceCreation from '../../../OPDModule/NewPatient/ServiceCreation/ServiceCreation';
import {
  resetPatientInfo,
  patientUpdating,
} from '../../../../features/OPDModule/PatientUpdation/PatientUpdation';
import {resetItemsInServiceCart} from '../../../../features/OPDModule/ServiceList/ServiceListSlice';
import {getFormattedDate, getFormattedShortDate} from '../../../../utils/utils';

const ExistingPatientHome = (props) => {
  const [process, setProcess] = useState('');
  const [newRegistration, setnewRegistration] = useState(false);
  const [registrationfee, setRegistrationFee] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [selectTab, setSelectTab] = useState('Tab1');
  const [enableEdit, setEnableEdit] = useState(false);
  const handleEnabler = () => {
    setEnableEdit(true);
  };
  const dispatch = useDispatch();

  // Redux states
  const patientData = useSelector((state) => state.patientCreation.formData);
  const existingData = useSelector((state) => state.updatePatientInfo.formData);
  const visitData = useSelector(
    (state) => state.appointmentVisitSchedule.formData
  );
  const serviceListData = useSelector((state) => state.serviceCart.serviceList);
  const paymentData = useSelector((state) => state.paymentInfo.formData);
  const loginData = useSelector((state) => state.loginInfo.formData);
  const existingPatientData = useSelector(
    (state) => state.updatePatientInfo.formData
  );
  // Get the payment method from Redux store
  const paymentMethod = useSelector(
    (state) => state.paymentInfo.formData.paymentMethod
  );
  const [netPayableAmount, setNetPayableAmount] = useState(
    paymentData.newBalanceAmountToPay || 0
  );
  const netAmount = useSelector((state) => state.serviceCart.totalAmount);

  //console.log(props.values);
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo(0, 0);
      navigate('/op-search', {replace: true});
    };
    window.onpopstate = handlePopState;
    return () => {
      window.onpopstate = null;
    };
  }, []);

  //re setting the store using useEffect Initially!
  useEffect(() => {
    dispatch(resetInformation());
    dispatch(resetServiceInformation());
    dispatch(resetVisitInformation());
    dispatch(resetPaymentInformation());
  }, []);

  const handleClick = (k) => {
    setSelectTab(k);
  };
  const servicePayload = serviceListData.map((value) => ({
    ServiceID: value.ServiceID,
    Unit: value.Unit,
    Rate: value.Rate,
    DiscType: value.DiscountType === 'P' ? 1 : 2,
    Discount: value.Discount,
    Amount: value.Amount,
    PriorityType: value.PriorityType.toString(),
    Remarks: value.Remarks,
  }));

  const handleNextTab = () => {
    if (existingData?.existingPatientData) setSelectTab('Tab2');
  };

  useEffect(() => {
    console.log(newRegistration, netAmount);
    dispatch(
      paymentInformation({
        name: 'actualAmountToPay',
        value: newRegistration ? netAmount + 100 : netAmount,
      })
    );
  }, [netAmount, newRegistration]);

  //reset information when the component initialy loadded info the frst time
  useEffect(() => {
    dispatch(resetInformation());
    dispatch(resetItemsInServiceCart());
    dispatch(resetPatientInfo());
    setSearch('');
  }, [newRegistration]);

  const handleNetAmountChange = (amount) => {
    console.log('Net Amount Changed:', amount);
    setNetPayableAmount(amount);
  };

  serviceListData.map((value) => {
    return servicePayload.push({
      ServiceID: value.ServiceID,
      Unit: value.Unit,
      Rate: value.Rate,
      DiscType: value.DiscountType === 'P' ? 1 : 2,
      Discount: value.Discount,
      Amount: value.Amount,
      PriorityType: value.PriorityType,
      Remarks: value.Remarks,
    });
  });

  const patientID = () => {
    if (existingData?.existingPatientData?.uhid) {
      return parseInt(existingData.existingPatientData.uhid.substring(5));
    }
    // toast.warn("Patient details not selected!");
    return 0;
  };

  // Prepare the payload for the POST request
  const existingPayload = {
    ExistsOPBillRecepitLine: servicePayload,
    OPReceipt_Payment_Line: [
      {
        PayMode: paymentData?.paymentMethod || 'C',
        Amount: netAmount || 0,
        RefNo: 'Ref1',
      },
    ],
    PatientID: String(patientID()), // Ensure ID is a string as the API expects it
    Gender: existingData?.existingPatientData?.gender === 'Male' ? 'M' : 'F',
    MobileNo: existingData?.existingPatientData?.mobileNo || '',
    EmailId: existingData?.existingPatientData?.email || '',
    UserID: loginData?.userName || '',
    docId: existingData?.docId || 0,
    appointmentId: 0,
    RefSource: existingData?.RefSource || 0,
    VistType: existingData?.VisitType || 0,
    PatientType: existingData?.PatientType || 'S',
    PayorID: existingData?.PayorID || 0,
    Remarks: existingData?.Remarks || '',
    InternalDocId: 0,
    ExternalDocId: 0,
    GrossAmount: netAmount,
    DiscountAmount: 0,
    GLAmount: 0,
    PatientResponsibility: netAmount || 0,
    NetAmount: netAmount || 0,
    APPStartDate: new Date().toISOString(),
    Package: '',
    AppRemarks: '',
    AppRefSource: existingData?.RefSource || '13', // Defaulting to "13" if not provided
  };

  const saveExistingOPDModule = async () => {
    console.log('Calling saveExistingOPDModule with payload:', existingPayload); // Debugging

    try {
      const response = await OPModuleAgent.saveExistingOPDModule(
        existingPayload
      );
      console.log('API Response:', response); // Debugging

      const saveExistingModuleResponse = response?.data;

      if (saveExistingModuleResponse?.msgDescp === 'Done') {
        toast.success(
          `Details Updated Successfully. Patient Visit no is ${saveExistingModuleResponse.visitId}`
        );
        dispatch(
          getResponseInformation({
            name: 'existingResponse',
            value: saveExistingModuleResponse,
          })
        );
        navigate('epat-casesheet-original');
      } else {
        console.warn('API Response Non-Success:', saveExistingModuleResponse);
        toast.warn('Failed to update details. Please check your input.');
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to save data. Please try again.');
    }
  };

  const handleSubmit = async () => {
    console.log(
      'Existing patient data for submission:',
      existingData?.existingPatientData
    ); // Debugging
    if (existingData?.existingPatientData) {
      await saveExistingOPDModule();
    } else {
      console.log('Existing patient data is undefined or null');
      toast.warn('Please select a valid existing patient.');
    }
  };

  // handlePOS
  const handlePOS = async () => {
    const processingId = () => {
      return (
        existingData.existingPatientData.mobileNo.toString().substring(5) +
        '' +
        existingData.existingPatientData.dob.split('-')[0] +
        '' +
        new Date().toLocaleTimeString('en-US').split(':')[0] +
        '' +
        new Date().toLocaleTimeString('en-US').split(':')[1] +
        '' +
        existingData.existingPatientData.dob.split('-')[2]
      );
    };

    localStorage.setItem('processingid', processingId());

    const UpdatedNetAmount = netAmount; // Retrieve the net amount
    const uhid = existingData.existingPatientData.uhid; // Get UHID
    const patientName = existingData.existingPatientData.patientName; // Get Patient Name

    let RefID =
      new Date().getFullYear() +
      '' +
      (new Date().getMonth() + 1) +
      '' +
      existingData.existingPatientData.mobileNo.toString().substring(7) +
      '' +
      existingData.existingPatientData.dob.split('-')[0] +
      '' +
      new Date().toLocaleTimeString('en-US').split(':')[0] +
      '' +
      new Date().toLocaleTimeString('en-US').split(':')[1] +
      '' +
      existingData.existingPatientData.dob.split('-')[2];

    localStorage.setItem('referenceid', RefID);

    // Ensure patientData is fully populated
    if (!patientData || Object.keys(patientData).length === 0) {
      toast.warn('Please fill all the fields', {
        position: 'top-center',
        autoClose: 5000,
      });
      return;
    }

    // const payload = {
    //   PaymentID: 0,
    //   RefID,
    //   PatientName: patientName || "",
    //   UHID: uhid || "", // Replace with the UHID value
    //   MobileNo: existingData.existingPatientData.mobileNo || "",
    //   EmailID: existingData.existingPatientData.email || "",
    //   DoctorID: visitData?.docId || "",
    //   TransactionAmount: UpdatedNetAmount , // Transaction amount
    //   CardType: paymentData?.CardType || "",
    //   Religion: existingData.existingPatientData.religion || "",
    //   PrefferedLanguage: existingData.existingPatientData.prefferedLanguages || "",
    //   BloodGroup: existingData.existingPatientData.BloodGroup || "",
    //   APPStartDate: visitData?.AppointmentDate || "",
    //   APPEndDate: visitData?.AppointmentDate || "",
    //   AppointmentId: 0,
    // };

    const payload = {
      PaymentID: 0,
      RefID,
      RefType: 'POS',
      PatientID: String(patientID()), //'122811'
      PatientName: existingData?.existingPatientData?.patientName, //'SARANYA DEVI'
      DoctorID: 0,
      TransactionDate: getFormattedShortDate(), //'24/Mar/2025'
      TransactionID: '',
      TransactionAmount: '1.00',
      PaymentMode: '',
      StatusCode: '',
      StatusMsg: '',
      PaymentStatus: 'Pending',
      Remarks: 'test',
      IsActiveflg: 0,
      PaymentMethod: 'cash-remote-deposit',
      CreatedCode: 'MEFTECmeftec',
      CreatedDate: getFormattedDate(),
    };

    try {
      const posResponse = (await OPModuleAgent.updatePOSPayment(payload)).data;

      if (posResponse) {
        const url = `http://180.235.120.78/DataAegis_Live/?patientName=${encodeURIComponent(
          patientName || ''
        )}&uhid=${encodeURIComponent(
          uhid || ''
        )}&chargerate=${encodeURIComponent(
          UpdatedNetAmount || ''
        )}&email=${encodeURIComponent(
          existingData.existingPatientData.EmailId || ''
        )}&mobileno=${encodeURIComponent(
          existingData.existingPatientData.MobileNo || ''
        )}&processingid=${encodeURIComponent(
          processingId()
        )}&uname=${encodeURIComponent(
          loginData?.userName || ''
        )}&paymode=${encodeURIComponent(paymentData.CardType || '')}`;

        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error in POS Payment Update:', error);
    }
  };

  const handleVerifyPayment = async () => {};

  return (
    <div>
      {true ? (
        <Tabs
          defaultActiveKey={selectTab}
          id="justify-tab-example"
          activeKey={selectTab}
          fill
          style={{backgroundColor: '#3c4b64', color: 'white'}}
          onSelect={(k) => handleClick(k)}>
          <Tab eventKey={'Tab1'} title="Patient Details">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '1rem',
                alignItems: 'center',
              }}>
              <div>
                <Button onClick={handleEnabler} style={{margin: '5px'}}>
                  Edit Patient Details&nbsp;?
                </Button>
              </div>
              {enableEdit && <Button disabled={true}>Update Details</Button>}
            </div>
            <div>
              <Accordion style={{marginBottom: '10px'}} defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Body>
                    <Row>
                      <Form.Group as={Col} xs={12} sm={6} md={6} lg={4} xl={4}>
                        <CustomFormInput
                          className="select"
                          name="PatientName"
                          label="Patient Name"
                          type="text"
                          required
                          value={existingData.existingPatientData.patientName}
                          placeholder="Patient Name"
                          pattern="[A-Za-z]+"
                          inputMode="text"
                          disabled={!enableEdit}
                        />
                      </Form.Group>
                      <Form.Group as={Col} xs={12} sm={6} md={6} lg={4} xl={4}>
                        <Form.Label style={{paddingLeft: '12px'}}>
                          DOB
                        </Form.Label>
                        <div>
                          <DatePicker
                            className="select form-control"
                            selected={
                              existingData.existingPatientData !== '' &&
                              existingData.existingPatientData.dob !== ''
                                ? new Date(
                                    existingData.existingPatientData.dob.split(
                                      '/'
                                    )[1] +
                                      '/' +
                                      existingData.existingPatientData.dob.split(
                                        '/'
                                      )[0] +
                                      '/' +
                                      existingData.existingPatientData.dob.split(
                                        '/'
                                      )[2]
                                  )
                                : new Date()
                            }
                            placeholderText="Date of Birth"
                            dateFormat="dd/MM/yyyy" // Format for displaying selected date
                            yearDropdownItemNumber={150}
                            showYearDropdown
                            showMonthDropdown
                            scrollableYearDropdown
                            scrollableMonthDropdown
                            maxDate={new Date()}
                            minDate={new Date('1900')}
                            disabled={!enableEdit}
                          />
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} xs={12} sm={6} md={6} lg={4} xl={4}>
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          className="select"
                          name="Age"
                          type="text"
                          required
                          readOnly
                          placeholder="Age"
                          value={existingData.existingPatientData.age}
                          disabled={!enableEdit}
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} xs={12} sm={6} md={6} lg={3} xl={4}>
                        <CustomFormInput
                          className="select"
                          name="UHID"
                          label="UHID"
                          type="text"
                          required
                          value={existingData.existingPatientData.uhid}
                          placeholder="UHID"
                          pattern="[0-9]+"
                          disabled={!enableEdit}
                        />
                      </Form.Group>
                      <Form.Group as={Col} xs={12} sm={6} md={6} lg={3} xl={4}>
                        <CustomFormInput
                          className="select"
                          name="Mobile"
                          label="Mobile"
                          type="number"
                          required
                          value={existingData.existingPatientData.mobileNo}
                          placeholder="Mobile No"
                          pattern="[0-9]+"
                          disabled={!enableEdit}
                        />
                      </Form.Group>
                      <Form.Group as={Col} xs={12} sm={6} md={6} lg={3} xl={4}>
                        {' '}
                        <CustomFormInput
                          className="select"
                          name="Email"
                          label="Email"
                          type="email"
                          required
                          value={existingData.existingPatientData.email}
                          placeholder="Email Id"
                          pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                          disabled={!enableEdit}
                        />
                      </Form.Group>
                    </Row>{' '}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div style={{textAlign: 'center', margin: '10px 0px'}}>
              <Button
                onClick={() => handleNextTab()}
                disabled={existingData.existingPatientData === '' && true}>
                Next
              </Button>
            </div>
          </Tab>
          <Tab
            eventKey={'Tab2'}
            title="Check-In"
            disabled={existingData.existingPatientData === '' && true}>
            <VisitCreation />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}></div>
            <div style={{marginBottom: '10px'}}>
              <ServiceCreation />
            </div>
            <div style={{marginBottom: '10px'}}>
              <ServiceList />
            </div>
            <div style={{marginBottom: '10px'}}>
              <Payment
                registrationFee={100}
                registrationFees={registrationfee}
                onNetAmountChange={handleNetAmountChange}
              />
            </div>

            {paymentData.paymentMethod !== '' && (
              <Row>
                <Form.Group as={Col} xl={3} lg={3} md={6} sm={6} xs={12}>
                  <Button
                    style={{
                      width: '225px',
                      marginTop: '45px',
                    }}
                    disabled={
                      paymentMethod === 'C' ||
                      paymentMethod === 'Q' ||
                      paymentMethod === 'T'
                    }
                    onClick={handlePOS}>
                    <span
                      style={{width: '225px', marginTop: '45px'}}
                      className="search-select">
                      POS Payment
                    </span>
                  </Button>
                </Form.Group>
                {paymentData.verifyPaymentFlag && (
                  <Form.Group as={Col} xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Button
                      style={{
                        width: '225px',
                        marginTop: '45px',
                      }}
                      onClick={handleVerifyPayment}>
                      <span
                        style={{marginRight: '10px'}}
                        className="search-select">
                        Verify Payment
                      </span>
                    </Button>
                  </Form.Group>
                )}
              </Row>
            )}

            <div
              style={{
                textAlign: 'center',
                margin: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <div>
                <Button onClick={handleSubmit} disabled={paymentMethod === 'R'}>
                  Submit & Proceed for Checkout
                </Button>
              </div>

              {paymentData.verifyPaymentFlag && (
                <div style={{textAlign: 'center', margin: '10px 0px'}}>
                  <VerifyPaymentModal processingID={process} />
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      ) : (
        <>
          <div>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>
                  <div>Appointment Confirmation</div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>UHID</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Doctor Name</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Department Name</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Appointment Date</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Appointment Slot</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Visit Type</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Patient Type</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} md={6} lg={4}>
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control className="select" />
                    </Form.Group>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
};

export default ExistingPatientHome;
