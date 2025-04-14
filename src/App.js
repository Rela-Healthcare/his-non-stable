import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Login from './Components/Login/Login.js';
import Home from './Components/Home/Home.js';
import Invoice from './Components/OPDModule/Invoice/Invoice.js';
import EPInvoice from './Components/OPDModule/OPDashboard/Invoice.js';
import EPInvoiceOrg from './Components/OPDModule/ExisitingPatient/ExistingPatientHome/Invoice.js';
import EPCaseSheet from './Components/OPDModule/OPDashboard/CaseSheet.js';
import CaseSheet from './Components/OPDModule/CaseSheet/CaseSheet.js';
import EPCaseSheetOrg from './Components/OPDModule/ExisitingPatient/ExistingPatientHome/CaseSheet.js';
import PatientDataProvider from './ContextProvider/patientDataProvider.js';
import './App.css';
import SideBar from './LayoutComponents/SideBar/SideBar.js';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Appointments from './Components/OPDModule/Appointments/Appointments.js';
import OPDashboard from './Components/OPDModule/OPDashboard/OPDashboard.js';
import Reports from './Components/OPDModule/Reports/Reports.js';
import ExistingPatientHome from './Components/OPDModule/ExisitingPatient/ExistingPatientHome/ExistingPatientHome.js';
import Deposit from './Components/OPDModule/Deposit/Deposit.js';
import OPServicesOnly from './Components/OPDModule/OPDashboard/OPServices/OPServicesOnly.js';
import VerifyPaymentModal from './Components/OPDModule/NewPatient/Payment/VerifyPaymentModal.js';
import {useSelector, useDispatch} from 'react-redux';
import Logout from './Components/Logout/Logout.js';
import IDProof from './Components/OPDModule/OPDashboard/IDProof.js';
import BarcodeGen from './Components/Barcode.js';
import ExisitingBarcodeGen from './Components/OPDModule/OPDashboard/Barcode.js';
import UserMaster from './Components/UserMaster/UserMaster.js';
import Testing from './common/TestingDropDown/TestingDropDown.js';
// import AuditTracking from "./Components/OPDModule/Logs/AuditTracking.js";
import SmsLog from './Components/OPDModule/Logs/SmsLogs.js';
import WebPayment from './Components/OPDModule/Logs/Webpayment.js';
import WhatsApp from './Components/OPDModule/Logs/WhatsappLogs.js';
import IndentRequest from './Components/OPDModule/Inventory/IndentRequest.js';
import IndentApproval from './Components/OPDModule/Inventory/IndentApproval.js';
import ServicePriceList from './Components/OPDModule/Helpdesk/ServicePriceList.js';
import PackagePriceList from './Components/OPDModule/Helpdesk/PackagePriceList.js';
import AppSequence from './Components/OPDModule/Appointments/Sequence.js';
import AppMaster from './Components/OPDModule/Appointments/AppMaster.js';
import Block from './Components/OPDModule/Appointments/Block.js';
import HomePage from './Components/Home/Dashboard.js';
import OpAppointmentReport from './Components/OPDModule/Reports/OpAppointment.js';
import CashCollectionReport from './Components/OPDModule/Reports/CashCollectionReport.js';
import BillCancellationReport from './Components/OPDModule/Reports/BillCancellation.js';
import DepositReport from './Components/OPDModule/Reports/Deposit.js';
import RefundReport from './Components/OPDModule/Reports/Refund.js';
import CreditNoteReport from './Components/OPDModule/Reports/CreditNote.js';
import PatientRegistrationReport from './Components/OPDModule/Reports/PatientRegisterReport.js';
import OpInvoiceReport from './Components/OPDModule/Reports/Invoice.js';
import OpRevenueReport from './Components/OPDModule/Reports/OpRevenueReport.js';
import ConcessionReport from './Components/OPDModule/Reports/ConcessionReport.js';
import {loginInformation} from './features/Login/LoginSlice';
import Refund from './Components/OPDModule/Deposit/Refund.js';
import ErrorBoundary from './Components/ErrorBoundary.js';

const App = () => {
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(true);
  const loginData = useSelector((state) => state.loginInfo.formData);
  const check = localStorage.getItem('validEntry');

  const dispatch = useDispatch();
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      dispatch(loginInformation({name: 'userName', value: storedUserName}));
    }
  }, [dispatch]);

  // Page refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      alert(
        'Warning: You are refreshing the page! Unsaved changes may be lost.'
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="App">
      {/* <ErrorBoundary> */}
      <PatientDataProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          {JSON.parse(check) ? (
            <>
              {' '}
              <Route
                path="/*"
                element={
                  <>
                    {' '}
                    <div className="wrapper">
                      {showSideBar ? (
                        <SideBar showSideBar={showSideBar}>
                          <Routes>
                            <Route
                              path="user-rights"
                              element={<UserMaster />}
                            />

                            <Route index path="op-search" element={<Home />} />
                            <Route
                              path="appointments"
                              element={<Appointments />}
                            />

                            <Route path="home" element={<HomePage />} />

                            <Route
                              path="op-dashboard"
                              element={<OPDashboard />}
                            />
                            <Route path="op-reports" element={<Reports />} />

                            <Route path="deposit" element={<Deposit />} />
                            <Route
                              path="op-reports/smslog"
                              element={<SmsLog />}
                            />
                            <Route
                              path="op-reports/webpayment"
                              element={<WebPayment />}
                            />

                            <Route
                              path="op-reports/whatsapp"
                              element={<WhatsApp />}
                            />
                            <Route
                              path="op-reports/indentrequest"
                              element={<IndentRequest />}
                            />
                            <Route
                              path="op-reports/indentapproval"
                              element={<IndentApproval />}
                            />
                            <Route
                              path="op-reports/search"
                              element={<AppSequence />}
                            />

                            <Route
                              path="op-reports/appmaster"
                              element={<AppMaster />}
                            />

                            <Route
                              path="op-reports/block"
                              element={<Block />}
                            />

                            <Route
                              path="op-reports/servicepricelist"
                              element={<ServicePriceList />}
                            />
                            <Route
                              path="op-reports/packagepricelist"
                              element={<PackagePriceList />}
                            />
                            {/* <Route
                              path="DepositDashboard"
                              element={<DepositDashboard/>}
                            /> */}
                            <Route path="Refund" element={<Refund />} />

                            <Route
                              element={<OPServicesOnly />}
                              path="op-dashboard/op-search/epat-service"
                            />
                            <Route
                              index
                              element={<IDProof />}
                              path="op-dashboard/op-search/epat-idproof"
                            />

                            {/* reports section */}
                            <Route
                              path="op-reports/opappointment"
                              element={<OpAppointmentReport />}
                            />
                            <Route
                              path="op-reports/deposit"
                              element={<DepositReport />}
                            />
                            <Route
                              path="op-reports/refund"
                              element={<RefundReport />}
                            />
                            <Route
                              path="op-reports/creditnote"
                              element={<CreditNoteReport />}
                            />
                            <Route
                              path="op-repors/patientregistration"
                              element={<PatientRegistrationReport />}
                            />
                            <Route
                              path="op-reports/opinvoice"
                              element={<OpInvoiceReport />}
                            />

                            <Route
                              path="op-reports/oprevenue"
                              element={<OpRevenueReport />}
                            />
                            <Route
                              path="op-reports/cashcollection"
                              element={<CashCollectionReport />}
                            />
                            <Route
                              path="op-reports/concessionreport"
                              element={<ConcessionReport />}
                            />
                            <Route
                              path="op-reports/billcancellation"
                              element={<BillCancellationReport />}
                            />
                          </Routes>
                        </SideBar>
                      ) : (
                        <Route element={<Logout navigate={navigate} />} />
                      )}
                    </div>
                  </>
                }
              />
              <Route index element={<Invoice />} path="op-search/invoice" />
              <Route index element={<CaseSheet />} path="op-search/casesheet" />
              <Route
                index
                element={<EPInvoice />}
                path="op-search/epat-invoice"
              />
              <Route
                index
                element={<EPCaseSheet />}
                path="op-search/epat-casesheet"
              />
              <Route
                index
                element={<EPCaseSheetOrg />}
                path="op-search/epat-casesheet-original"
              />
              <Route
                index
                element={<EPInvoiceOrg />}
                path="op-search/epat-invoice-original"
              />
              <Route element={<BarcodeGen />} path="barcode" />
              <Route element={<Testing />} path="testing" />
              <Route
                element={<ExisitingBarcodeGen />}
                path="op-search/epat-barcode/:regID"
              />
            </>
          ) : (
            <Route path="/*" element={<Logout navigate={navigate} />} />
          )}
        </Routes>
      </PatientDataProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* </ErrorBoundary> */}
    </div>
  );
};

export default App;
