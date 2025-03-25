/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import {useDispatch, useSelector} from 'react-redux';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faMoneyCheck,
  faPrint,
  faHospital,
  faIdCard,
  faLink,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {OPModuleAgent} from '../../../agent/agent';
import {Col, Form, Button, ButtonGroup} from 'react-bootstrap';
import {dashBoardFormData} from '../../../features/OPDModule/OPDashBoard/OPDashBoard';
import './OPDashboard.css';
import DatePicker from 'react-datepicker';
import DepositLinkModal from './DepositLinkModal';

const AllPatientData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });

  const [startDate, setStartDate] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });
  const opdashboardData = useSelector((state) => state.opdashBoard.formData);
  //console.log(opdashboardData);

  const [data, setData] = useState([]);
  const [decider, setDecider] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [depositLinkModalOpen, setDepositLinkModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [tableData, setTableData] = useState([]);
  const handleDepositLinkStatus = (sno) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.sno === sno ? {...row, buttonText: 'Re-send Link'} : row
      )
    );
  };

  useEffect(() => {
    setTableData(
      (filteredData.length > 0 ? filteredData : data).map((row) => ({
        ...row,
        buttonText: 'Send Link',
      }))
    );
  }, [data, filteredData]);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setDepositLinkModalOpen(true);
  };

  const handleFilterChange = (event) => {
    setSearchInput(event.target.value);
    if (event.target.value !== '') {
      const filteredData = data.filter(
        (value) =>
          value.uhid.includes(event.target.value) ||
          value.patientName.includes(event.target.value) ||
          value.visitDate.includes(event.target.value)
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(data);
    }
  };

  useEffect(() => {
    if (decider) {
      getData();
    }
    if (!decider) {
      getData2();
    }
  }, [decider, date]);

  // Number of items to display per page
  const itemsPerPage = 15;
  // Calculate the range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const options = {
    custom: true,
    totalSize: data.length,
  };

  const getData = async () => {
    try {
      const getOutPatientListResponse = (
        await OPModuleAgent.getOutPatientList(
          searchInput,
          date.fromDate,
          date.toDate
        )
      ).data;
      if (getOutPatientListResponse) {
        setData(getOutPatientListResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getData2 = async () => {
    try {
      const getOutPatientListresponse = (
        await OPModuleAgent.getOutPatientLists(searchInput)
      ).data;
      if (getOutPatientListresponse) {
        // //console.log(getOutPatientListResponse);
        setData(getOutPatientListresponse);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const handleCaseSheetClick = (row) => {
    //console.log(row.regId);
    getCaseSheetData(row.regId);
  };

  const getCaseSheetData = async (registrationId) => {
    try {
      const caseSheetResponse = (
        await OPModuleAgent.getCaseSheetInfo(registrationId)
      ).data;
      //console.log(caseSheetResponse);
      dispatch(
        dashBoardFormData({
          name: 'CaseSheetInfo',
          value: caseSheetResponse,
        })
      );
      navigate('/op-search/epat-casesheet');
    } catch (error) {}
  };

  const fetchInvoiceData = async (billNum) => {
    try {
      const invoiceResponse = await OPModuleAgent.getInvoiceDetails(billNum);
      dispatch(
        dashBoardFormData({
          name: 'BillInfo',
          value: {
            PayorType: invoiceResponse.data.payor,
            BillDate: invoiceResponse.data.billDate,
            BillNo: invoiceResponse.data.billNum,
            EpisodeNo: invoiceResponse.data.episodeNo,
            GSTNo: invoiceResponse.data.gstNo,
            TotalGrossAmount: invoiceResponse.data.totalGrossAmount,
            TotalDiscount: invoiceResponse.data.totalDiscount,
            TotalNetAmount: invoiceResponse.data.totalNetAmount,
            PaymentType: invoiceResponse.data.payment_Type,
            SettleAmount: invoiceResponse.data.settleAmount,
            InvoiceList: invoiceResponse.data.invoiceLine1,
            CashierSignature: invoiceResponse.data.casherSignature,
          },
        })
      );
      navigate('/op-search/epat-invoice');
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvoiceClick = (row) => {
    //console.log(row);
    dispatch(
      dashBoardFormData({
        name: 'InvoiceInfo',
        value: {
          UHID: row.uhid,
          PatientName: row.patientName,
          VisitID: row.visitNo,
          VisitDate: row.visitDate,
          DoctorDetails: row.doctorName,
          Gender: row.gender,
          DOB: row.dob,
        },
      })
    );
    fetchInvoiceData(row.billNum);
  };

  const handleServiceClick = (row) => {
    // //console.log(row.uhid, row.doctor, row.department);
    dispatch(
      dashBoardFormData({
        name: 'ServiceInfo',
        value: {
          UHID: row.uhid,
          PatientName: row.patientName,
          VisitID: row.visitNo,
          VisitDate: row.visitDate,
          DoctorName: row.doctorName,
          DoctorId: row.doctorId,
          Gender: row.gender,
          DOB: row.dob,
        },
      })
    );
    navigate('op-search/epat-service');
  };
  const handleIDClick = (row) => {
    const verify = window.confirm('Do you want to visit the ID Proof?');
    if (verify) navigate('op-search/epat-idproof');
  };
  const columns = [
    {
      dataField: 'sno',
      text: 'S.No',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'uhid',
      text: 'UHID',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'patientName',
      text: 'Patient Name',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },

    {
      dataField: 'visitNo',
      text: 'Visit ID',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'visitDate',
      text: 'Visit Date',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'doctorName',
      text: 'Doctor Name',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'billNo',
      text: 'Bill No',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'partyName',
      text: 'Payor Type',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'partyName' + 'sno',
      isDummyField: true,
      text: "Add Service's",
      formatter: (cell, row) => (
        <>
          <FontAwesomeIcon
            icon={faHospital}
            onClick={() => handleServiceClick(row)}
          />
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'sno' + ' ' + 'partyName',
      isDummyField: true,
      text: 'Invoice',
      formatter: (cell, row) => (
        <>
          <FontAwesomeIcon
            icon={faFileInvoice}
            onClick={() => handleInvoiceClick(row)}
          />
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },

    {
      dataField: 'partyName' + 'sno',
      isDummyField: true,
      text: 'Deposit',
      formatter: (cell, row) => (
        <>
          <FontAwesomeIcon
            icon={faMoneyCheck}
            onClick={() => handleServiceClick(row)}
          />
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'partyName' + 'sno',
      isDummyField: true,
      text: 'Invoice Cancel',
      formatter: (cell, row) => (
        <>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => handleServiceClick(row)}
          />
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
  ];
  const columns2 = [
    {
      dataField: 'sno',
      text: 'S.No',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'uhid',
      text: 'UHID',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'patientName',
      text: 'Patient Name',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'visitID',
      text: 'Visit ID',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'visitDate',
      text: 'Visit Date',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'doctor.columnName',
      text: 'Doctor Name',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'department.columnName',
      text: 'Department',
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'sno' + 'patientName',
      isDummyField: true,
      text: 'Registration Form',
      formatter: (cell, row) => (
        <>
          <FontAwesomeIcon
            icon={faPrint}
            onClick={() => handleCaseSheetClick(row)}
          />
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'patientName' + 'sno',
      isDummyField: true,
      text: 'ID Proof',
      formatter: (cell, row) => (
        <>
          <FontAwesomeIcon icon={faIdCard} onClick={() => handleIDClick(row)} />
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
    {
      dataField: 'deposit_link',
      text: 'Deposit Link',
      formatter: (cell, row) => (
        <>
          <a
            onClick={() => handleOpenModal(row)}
            aria-label="Open Deposit Link Modal">
            <FontAwesomeIcon icon={faLink} />
          </a>
          {row.buttonText === 'Re-send Link' && (
            <Button size="sm" variant="link">
              Verify
            </Button>
          )}
        </>
      ),
      style: {
        width: '1px',
        backgroundColor: 'whitesmoke',
        fontWeight: 'bolder',
      },
    },
  ];

  const tableStyle = {
    // Add styles to the entire table
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  };
  const handleFromDateChange = (date) => {
    setStartDate((prev) => ({...prev, fromDate: date}));
    const convertedDate = date.toISOString().split('T')[0];
    setDate((prev) => ({...prev, fromDate: convertedDate}));
  };
  const handleToDateChange = (date) => {
    setStartDate((prev) => ({...prev, toDate: date}));
    const convertedDate = date.toISOString().split('T')[0];
    setDate((prev) => ({...prev, toDate: convertedDate}));
  };
  return (
    <div style={{height: '80vh', overflowX: 'scroll'}}>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Form.Group as={Col} sm={12} md={6} lg={3} xl={3}>
          {/* <Form.Label>Search By UHID, Patient Name, etc..</Form.Label> */}
          <Form.Control
            type="text"
            value={searchInput}
            onChange={handleFilterChange}
            placeholder="Search by UHID, Patient Name, Visit Date."
            className="select"
          />
        </Form.Group>

        <ButtonGroup sm={12} md={6} lg={3} xl={3}>
          {decider ? (
            <Button onClick={() => setDecider(false)}>OP Visit List?</Button>
          ) : (
            <Button onClick={() => setDecider(true)}>
              {' '}
              Invoice List & Service Addition?
            </Button>
          )}
        </ButtonGroup>
        {decider && (
          <>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <DatePicker
                className="select form-control"
                selected={startDate.fromDate}
                onChange={handleFromDateChange}
                placeholderText="Date of Birth"
                dateFormat="MMMM d, yyyy" // Format for displaying selected date
                yearDropdownItemNumber={150}
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                scrollableMonthDropdown
                maxDate={new Date()}
                minDate={new Date('1900')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <DatePicker
                className="select form-control"
                selected={startDate.toDate}
                onChange={handleToDateChange}
                placeholderText="Date of Birth"
                dateFormat="MMMM d, yyyy" // Format for displaying selected date
                yearDropdownItemNumber={150}
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                scrollableMonthDropdown
                maxDate={new Date()}
                minDate={new Date('1900')}
              />
            </Form.Group>
          </>
        )}
      </div>
      {decider ? (
        <>
          <div style={{margin: '5px 3px 0px 3px'}}>
            <PaginationProvider pagination={paginationFactory(options)}>
              {({paginationProps, paginationTableProps}) => (
                <>
                  <h5>Invoice List & Service Addition</h5>
                  <BootstrapTable
                    bordered
                    hover
                    striped
                    keyField="sno"
                    data={filteredData.length > 0 ? filteredData : data}
                    columns={columns}
                    {...paginationTableProps}
                    style={tableStyle}
                  />
                  <PaginationListStandalone {...paginationProps} />
                </>
              )}
            </PaginationProvider>
          </div>
        </>
      ) : (
        <>
          <h5>Out Patient List</h5>
          <div style={{margin: '5px 3px 0px 3px'}}>
            <PaginationProvider pagination={paginationFactory(options)}>
              {({paginationProps, paginationTableProps}) => (
                <>
                  <BootstrapTable
                    TableHeaderColumn="One"
                    bordered
                    hover
                    striped
                    keyField="sno"
                    // data={filteredData.length > 0 ? filteredData : data}
                    data={
                      tableData.length > 0
                        ? tableData
                        : filteredData.length > 0
                        ? filteredData
                        : data
                    }
                    columns={columns2}
                    {...paginationTableProps}
                    style={tableStyle}
                  />
                  <PaginationListStandalone {...paginationProps} />
                </>
              )}
            </PaginationProvider>
          </div>
        </>
      )}
      <DepositLinkModal
        handleDepositLinkStatus={handleDepositLinkStatus}
        width={1000}
        isVisible={depositLinkModalOpen}
        onClose={() => setDepositLinkModalOpen(false)}
        rowData={selectedRow} // Pass row data to modal
      />
    </div>
  );
};

export default AllPatientData;
