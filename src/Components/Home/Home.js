import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, Row, Col, Container, Button} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import VisitCreation from '../OPDModule/NewPatient/VisitCreation/VisitCreation';
import PatientCreation from '../OPDModule/NewPatient/PatientCreation/PatientCreation';
import ServiceCreation from '../OPDModule/NewPatient/ServiceCreation/ServiceCreation';
import ServiceList from '../OPDModule/NewPatient/ServiceList/ServiceList';
import {OPModuleAgent} from '../../agent/agent';
import Payment from '../OPDModule/NewPatient/Payment/Payment';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import ExistingPatientHome from '../OPDModule/ExisitingPatient/ExistingPatientHome/ExistingPatientHome';
import {
  patientUpdating,
  resetPatientInfo,
} from '../../features/OPDModule/PatientUpdation/PatientUpdation';
import {resetInformation} from '../../features/OPDModule/PatientCreation/PatientCreationSlice';
import {resetItemsInServiceCart} from '../../features/OPDModule/ServiceList/ServiceListSlice';
import EvaluationModal from '../OPDModule/NewPatient/EvaluationModal/EvaluationModal';
import {toast} from 'react-toastify';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleXmark, faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {getResponseInformation} from '../../features/OPDModule/OPDModuleResponse/OPDModuleResponseSlice';
import VerifyPaymentModal from '../OPDModule/NewPatient/Payment/VerifyPaymentModal';
import {
  paymentInformation,
  posPaymentInformation,
} from '../../features/OPDModule/Payment/PaymentSlice';
import {
  getFormattedDate,
  getFormattedShortDate,
  generateProcessingId,
} from '../../utils/utils';

const Home = () => {
  const [process, setProcess] = useState('');
  const [newRegistration, setnewRegistration] = useState(false);
  const [registrationfee, setRegistrationFee] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUHID, setShowUHID] = useState(false);
  const [searchType, setSearchType] = useState('mobile');

  // State to manage UHID
  const [uhid, setUhid] = useState('');

  //reset information when the component initialy loadded info the frst time
  useEffect(() => {
    dispatch(resetInformation());
    dispatch(resetItemsInServiceCart());
    dispatch(resetPatientInfo());
    setSearch('');
  }, [newRegistration]);

  const patientData = useSelector((state) => state.patientCreation.formData);
  const visitData = useSelector(
    (state) => state.appointmentVisitSchedule.formData
  );
  const serviceListData = useSelector((state) => state.serviceCart.serviceList);
  const existingPatientData = useSelector(
    (state) => state.updatePatientInfo.formData
  );
  const loginData = useSelector((state) => state.loginInfo.formData);

  const userName = localStorage.getItem('userName');
  console.log('userid:', userName);

  // Get the payment method from Redux store
  const paymentMethod = useSelector(
    (state) => state.paymentInfo.formData.paymentMethod
  );
  const paymentData = useSelector((state) => state.paymentInfo.formData);
  const netAmount = useSelector((state) => state.serviceCart.totalAmount);

  const finalAmount = useSelector(
    (state) => state.serviceCreation.formData.finalAmount
  );
  console.log('Final Amount from Payment:', finalAmount);

  // State to track net payable amount
  const [netPayableAmount, setNetPayableAmount] = useState(0);

  // Update local state when finalAmount changes
  useEffect(() => {
    setNetPayableAmount(finalAmount);
  }, [finalAmount]);

  useEffect(() => {
    console.log('Updated Net Payable Amount:', netPayableAmount);
  }, [netPayableAmount]); // Logs when netPayableAmount updates

  // Handle net amount change
  const handleNetAmountChange = (newAmount) => {
    console.log('Home Net Amount Changed:', newAmount);
    setNetPayableAmount(newAmount);
  };

  // Adjust actual amount to pay when finalAmount or newRegistration changes
  useEffect(() => {
    console.log(newRegistration, finalAmount);
    dispatch(
      paymentInformation({
        name: 'actualAmountToPay',
        value: newRegistration ? finalAmount + 100 : finalAmount,
      })
    );
  }, [finalAmount, newRegistration, dispatch]);

  console.log(
    'Final Net Amount:',
    finalAmount,
    'Net Payable Amount:',
    netPayableAmount
  );

  const servicePayload = [];
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

  const payload = {
    OPBillRecepitLine: servicePayload,
    OPReceipt_Payment_Line: [
      {
        PayMode: paymentData.paymentMethod,
        Amount: finalAmount,
        RefNo: 'REF',
      },
    ],
    PatientTitle: patientData.patientTitle,
    SalutationName: patientData.SalutationName,
    PatientName: patientData.PatientName,
    DOB: patientData.DOB,
    Gender: patientData.Gender,
    MaritalStatus: patientData.MaritalStatus,
    IDtype: patientData.IDtype,
    IDNo: parseInt(patientData.IDNo),
    Nationality: patientData.Nationality,
    Language: patientData.Language,
    Occupation: patientData.Occupation,
    MobileNo: patientData.MobileNo,
    EmailId: patientData.EmailId,
    Address: patientData.Address,
    StateCode: patientData.StateCode,
    CityCode: patientData.CityCode,
    CountryCode: patientData.CountryCode,
    Pincode: parseInt(patientData.Pincode),
    BirthCountry: patientData.CountryCode,
    PassportNo: '',
    VISANo: '',
    VISAType: 0,
    VISAValidity: '',
    FormCstatus: '',
    Mob_CountryCode: '+91',
    AltMob_CountryCode: '+91',
    AltMobileNo: '',
    CurrAddress: '',
    PermAddress: '',
    Area: patientData.Area,
    Pat_Is_symptoms: parseInt(patientData.pat_Is_symptoms),
    Pat_Is_historyoffever: parseInt(patientData.pat_Is_historyoffever),
    Pat_Is_outofcountry1month: parseInt(patientData.pat_Is_outofcountry1month),
    Pat_Is_diseaseoutbreak: parseInt(patientData.pat_Is_diseaseoutbreak),
    Pat_Is_healthcareworker: parseInt(patientData.pat_Is_healthcareworker),
    Pat_Is_disease_last1month: parseInt(patientData.pat_Is_disease_last1month),
    Pat_Is_chickenpox:
      parseInt(patientData.pat_Is_disease_last1month) === 0
        ? 0
        : parseInt(patientData.pat_Is_chickenpox),
    Pat_Is_measles:
      parseInt(patientData.pat_Is_disease_last1month) === 0
        ? 0
        : parseInt(patientData.pat_Is_measles),
    Pat_Is_mumps:
      parseInt(patientData.pat_Is_disease_last1month) === 0
        ? 0
        : parseInt(patientData.pat_Is_mumps),
    Pat_Is_rubella:
      parseInt(patientData.pat_Is_disease_last1month) === 0
        ? 0
        : parseInt(patientData.pat_Is_rubella),
    Pat_Is_diarrheasymptoms: parseInt(patientData.pat_Is_diarrheasymptoms),
    Pat_Is_activeTB: parseInt(patientData.pat_Is_activeTB),
    Pat_Is_receivewhatsapp: 0,
    RelationType: patientData.RelationTypeCode,
    RelationName: patientData.RelationName,
    RelationMobileno: patientData.RelationMobileNo,
    UserID: userName,
    annualincome: 0,
    prefferedLanguages: patientData.Language,
    religion: patientData.religion,
    kin_Address: patientData.kin_Address,
    kin_StateCode: patientData.kin_StateCode,
    kin_CityCode: patientData.kin_CityCode,
    kin_CountryCode: patientData.kin_CountryCode,
    kin_Pincode: patientData.kin_Pincode,
    kin_Area: patientData.kinArea,
    OccRemark: 'unknown payload',
    BloodGroup: patientData.BloodGroup,
    docId: visitData.docId,
    appointmentId: 0,
    RefSource: visitData.RefSource,
    VistType: visitData.VisitType,
    // VistType: 9,
    PatientType: visitData.PatientType,
    PayorID: visitData.PatientType === 's' ? 0 : visitData.PayorID,
    Remarks: visitData.Remarks,
    InternalDocId: 0,
    ExternalDocId: 0,
    GrossAmount: 0,
    DiscountAmount: 0,
    GLAmount: 0,
    PatientResponsibility: 0,
    NetAmount: finalAmount,
    APPStartDate: visitData.AppointmentDate + ' ' + visitData.SlotInfo,
    Package: visitData.package,
    AppRemarks: 'string',
    AppRefSource: visitData.RefSource,
  };

  console.log(paymentData);
  const handleNewRegistration = () => {
    setnewRegistration((prev) => !prev);
    console.log(newRegistration);
    if (newRegistration) setRegistrationFee(100);
    if (!newRegistration) setRegistrationFee(0);
  };

  async function fetchData(searchInput) {
    try {
      const getExistingResponse = (
        await OPModuleAgent.getExistingPatientDetails(searchInput)
      ).data;
      if (getExistingResponse.length > 0) {
        toast.success('Data fetched successfully!');
        setShowUHID(true);
        dispatch(
          patientUpdating({
            name: 'existingPatientDetails',
            value: getExistingResponse,
          })
        );
      } else {
        toast.warn('No records found!');
        setShowUHID(false);
        dispatch(
          patientUpdating({
            name: 'existingPatientDetails',
            value: '',
          })
        );
      }
    } catch (error) {
      //console.log("Error :", error);
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearch(''); // Reset the search input when changing search type
  };

  const handleSearch = () => {
    fetchData(search);
  };

  const handleExistingPatientSelect = (uhid) => {
    const selectedPatientData = existingPatientData.existingPatientDetails.find(
      (u) => u.uhid === uhid
    );

    dispatch(
      patientUpdating({
        name: 'existingPatientData',
        value: selectedPatientData,
      })
    );
  };

  const handleCollectedAmountChange = (event) => {
    const formattedValue = event.target.value.replace(/[^0-9]/g, '');
    console.log(formattedValue);
    if (parseInt(formattedValue) > paymentData.actualAmountToPay) {
      dispatch(
        paymentInformation({
          name: 'collectedAmountInHand',
          value: 0,
        })
      );
      dispatch(
        paymentInformation({
          name: 'newBalanceAmountToPay',
          value: paymentData.actualAmountToPay,
        })
      );
    } else {
      dispatch(
        paymentInformation({
          name: 'collectedAmountInHand',
          value: parseInt(formattedValue),
        })
      );

      dispatch(
        posPaymentInformation({
          actualAmount: paymentData.actualAmountToPay,
          collectedAmount: parseInt(formattedValue),
        })
      );
    }
  };

  const saveData = async () => {
    const processingId = () =>
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

    setProcess(processingId());

    try {
      // Confirm that patient data is available
      if (
        patientData.patientInfo &&
        patientData.additionalInfo &&
        patientData.kinInfo
      ) {
        const saveOPDResponse = (await OPModuleAgent.saveOPDModule(payload))
          .data;

        dispatch(
          getResponseInformation({
            name: 'response',
            value: saveOPDResponse,
          })
        );

        if (saveOPDResponse.msgDescp === 'Done') {
          // Handle payment logic
          if (paymentData.paymentMethod === 'C') {
            navigate('/op-search/casesheet');
          } else if (paymentData.paymentMethod === 'R') {
            dispatch(
              paymentInformation({name: 'verifyPaymentFlag', value: true})
            );

            // Generate UHID
            const generatedUhid =
              patientData.MobileNo.toString().substring(7) +
              new Date().getHours().toString().padStart(2, '0') +
              new Date().getMinutes().toString().padStart(2, '0') +
              new Date().getSeconds().toString().padStart(2, '0');

            let amountToSend = Math.round(parseFloat(finalAmount)); // Ensure it's rounded
            console.log('Final Amount Calculated:', finalAmount); // Log raw amount
            console.log('Amount to Send:', amountToSend); // Log final amount to send

            // Validate amount before sending
            if (!isNaN(amountToSend) && amountToSend > 0) {
              // Log details about the payment being sent
              console.log(`Sending Payment Details:
                            Patient Name: ${patientData.PatientName}, 
                            UHID: ${generatedUhid}, 
                            Amount: ${amountToSend}`);

              // Construct URL for payment gateway
              const paymentURL = `http://180.235.120.78/DataAegis_Live/?patientName=${encodeURIComponent(
                patientData.PatientName
              )}&uhid=${generatedUhid}&chargerate=${amountToSend}&email=${encodeURIComponent(
                patientData.EmailId
              )}&mobileno=${encodeURIComponent(
                patientData.MobileNo
              )}&processingid=${processingId()}&uname=${userName}&paymode=${
                paymentData.CardType
              }`;

              console.log('Payment URL to Open:', paymentURL); // Log final URL for debugging

              // Open the payment gateway URL
              window.open(paymentURL, '_blank');
            } else {
              toast.warn('Error: Invalid amount specified.');
              console.log('Invalid amount detected:', amountToSend);
            }
          }
        }
      } else {
        toast.warn('Please fill all the fields.', {
          position: 'top-center',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error fetching Data:', error);
    }
  };

  const handlePOS = async () => {
    if (
      !patientData?.PatientName ||
      !patientData?.MobileNo ||
      isNaN(finalAmount) ||
      finalAmount <= 0
    ) {
      toast.warn('Missing or invalid patient/payment details.');
      return;
    }

    // Generate Processing ID & UHID
    const processingId = generateProcessingId(patientData.MobileNo);
    const generatedUhid = processingId;

    if (
      !patientData.PatientName ||
      !patientData.MobileNo ||
      isNaN(finalAmount) ||
      finalAmount <= 0
    ) {
      toast.warn('Missing or invalid patient/payment details.');
      return;
    }

    let amountToSend = Math.round(parseFloat(finalAmount));

    console.log(`POS Payment Details:
      Patient: ${patientData.PatientName}
      UHID: ${generatedUhid}
      Amount: ${amountToSend}
      Processing ID: ${processingId}`);

    // Open Payment Redirect API URL
    const paymentURL = `https://www.relainstitute.in/DataAegis_Live/?patientName=${encodeURIComponent(
      patientData.PatientName
    )}&uhid=${generatedUhid}&chargerate=${amountToSend}&email=${encodeURIComponent(
      patientData.EmailId
    )}&mobileno=${encodeURIComponent(patientData.MobileNo)}
    &processingid=${processingId}&uname=MEFTECmeftec&paymode=cash-remote-deposit`;

    window.open(paymentURL, '_blank');

    // Prepare Payment Update Payload
    // const paymentPayload = {
    //   PaymentID: 0,
    //   RefID: processingId,
    //   RefType: 'POS',
    //   PatientID: generatedUhid,
    //   PatientName: patientData.PatientName,
    //   DoctorID: 0,
    //   TransactionDate: getFormattedShortDate(new Date()), // "24/Mar/2025"
    //   TransactionID: '',
    //   TransactionAmount: amountToSend.toString(),
    //   PaymentMode: '',
    //   StatusCode: '',
    //   StatusMsg: '',
    //   PaymentStatus: 'Pending',
    //   Remarks: '',
    //   IsActiveflg: 0,
    //   PaymentMethod: 'cash-remote-deposit',
    //   CreatedCode: 'MEFTECmeftec',
    //   CreatedDate: getFormattedDate(new Date()), // "24/03/2025 11:29:06 AM"
    // };
    const paymentPayload = {
      PaymentID: 0,
      RefID: '20250324112750',
      RefType: 'POS',
      PatientID: '122811',
      PatientName: 'SARANYA DEVI',
      DoctorID: 0,
      TransactionDate: '24/Mar/2025',
      TransactionID: '',
      TransactionAmount: '1.00',
      PaymentMode: '',
      StatusCode: '',
      StatusMsg: '',
      PaymentStatus: 'Pending',
      Remarks: '',
      IsActiveflg: 0,
      PaymentMethod: 'cash-remote-deposit',
      CreatedCode: 'MEFTECmeftec',
      CreatedDate: '24/03/2025 11:29:06 AM',
    };

    console.log('📤 Sending Payment Update:', paymentPayload);

    try {
      const posResponse = (await OPModuleAgent.updatePOSPayment(payload)).data;

      const data = await posResponse;
      console.log('✅ Payment Update Response:', data);
      toast.success('Payment status updated successfully.');
    } catch (error) {
      console.error('❌ Error updating payment:', error);
      toast.error('Failed to update payment status.');
    }
  };

  const handleSubmit = () => {
    saveData();
  };

  const handleVerifyPayment = async () => {};

  return (
    <div style={{height: '80vh', overflow: 'scroll'}}>
      <Form>
        <Form.Group>
          <Form.Check
            inline
            type="radio"
            label="Mobile"
            name="searchType"
            checked={searchType === 'mobile'}
            onChange={() => handleSearchTypeChange('mobile')}
          />

          <Form.Check
            inline
            type="radio"
            label="UHID"
            name="searchType"
            checked={searchType === 'uhid'}
            onChange={() => handleSearchTypeChange('uhid')}
          />
        </Form.Group>

        <Row
          className="mb-3 mx-5"
          style={{backgroundColor: 'rgb(248,249,250)'}}>
          {!newRegistration && (
            <>
              <Form.Group as={Col} xl={3} lg={3} md={6} sm={6} xs={12}>
                <Form.Control
                  className="select"
                  value={search}
                  onChange={handleSearchChange}
                  type="text"
                  placeholder={
                    searchType === 'mobile'
                      ? 'Search by Mobile No'
                      : 'Search by UHID'
                  }></Form.Control>
              </Form.Group>

              <Form.Group as={Col} xl={3} lg={3} md={6} sm={6} xs={12}>
                <Button
                  style={{
                    width: '125px',
                    marginTop: '15px',
                  }}
                  onClick={handleSearch}>
                  <span style={{marginRight: '10px'}} className="search-select">
                    Search
                  </span>
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Form.Group>
              {showUHID && (
                <>
                  <Form.Group as={Col} xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Form.Select
                      type="text"
                      className="select"
                      disabled={
                        existingPatientData.existingPatientDetails.length > 0
                          ? false
                          : true
                      }
                      onChange={(event) =>
                        handleExistingPatientSelect(event.target.value)
                      }>
                      <option value="">Select UHID</option>
                      {existingPatientData.existingPatientDetails.length > 0 &&
                        existingPatientData.existingPatientDetails.map(
                          (val) => (
                            <option value={val.uhid}>
                              {val.uhid}&nbsp;&nbsp;
                              {val.patientName}
                            </option>
                          )
                        )}
                    </Form.Select>
                  </Form.Group>
                </>
              )}
            </>
          )}

          <Form.Group as={Col}>
            <Button
              style={{
                width: '250px',
                marginTop: '15px',
              }}
              onClick={handleNewRegistration}>
              {!newRegistration ? (
                <>New Registration&nbsp;?</>
              ) : (
                <>Existing Patient&nbsp;?</>
              )}
            </Button>
          </Form.Group>
        </Row>
        <Row>
          {!newRegistration && (
            <>
              <div>
                <ExistingPatientHome />
              </div>
            </>
          )}
        </Row>
        {newRegistration && (
          <>
            <Row>
              <div style={{marginBottom: '10px'}}>
                <PatientCreation />
              </div>
              <div>
                <div
                  style={{
                    textAlign: 'center',
                    margin: '10px 0px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <EvaluationModal />
                  {patientData.evaluationInfo ? (
                    <div style={{marginLeft: '7px'}}>
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{
                          color: 'green',
                          width: '20px',
                          height: '20px',
                          textAlign: 'center',
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{marginLeft: '7px'}}>
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        style={{
                          color: 'red',
                          width: '20px',
                          height: '20px',
                          textAlign: 'center',
                        }}
                      />
                    </div>
                  )}
                </div>
                <div style={{marginBottom: '10px'}}>
                  <VisitCreation />
                </div>
              </div>
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
                  netPayableAmount={netPayableAmount}
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
                  <Button
                    onClick={handleSubmit}
                    disabled={paymentMethod === 'R'}>
                    Submit & Proceed for Checkout
                  </Button>
                </div>

                {paymentData.verifyPaymentFlag && (
                  <div style={{textAlign: 'center', margin: '10px 0px'}}>
                    <VerifyPaymentModal processingID={process} />
                  </div>
                )}
              </div>
            </Row>
          </>
        )}
      </Form>
    </div>
  );
};

export default Home;
