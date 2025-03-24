

import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {PaginationProvider, PaginationListStandalone,} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import moment from "moment";
import { Button, Input, Spin, message, DatePicker } from "antd";
import { OPModuleAgent } from "../../../agent/agent";
import { faPrint,faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "react-bootstrap";


const RefundDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(""); 
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [reason,setReason]= useState("");
  const userName = localStorage.getItem("userName");
  

  const itemsPerPage = 15; 

  const fetchData = async (Uhid = "") => {
    try {
      setLoading(true);
      const searchUhid = Uhid || searchTerm;
      if (!searchUhid) {
        message.warning("Please enter a UHID.");
        return;
      }
  
      const response = await OPModuleAgent.getrefundDetailsList(searchUhid);
      console.log("API Response:", response.data); // Debugging line
  
      if (response && Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
        message.warning("No records found.");
      }
    } catch (error) {
      message.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uhidFromURL = urlParams.get("uhid");
  
    if (uhidFromURL) {
      fetchData(uhidFromURL);
    }
  }, []);
  
  
  const handleSelectDeposit = (deposit) => {
    setSelectedDeposit(deposit);
  };
  

  const showConfirmationModal = (actionType) => {
    setAction(actionType);
    setShowModal(true);
  };

  
  const handleModalOk = async () => {
    try {
      setLoading(true);
  
      if (!selectedDeposit) {
        message.error("No deposit selected.");
        setLoading(false);
        return;
      }
  
      const { refundAmt, patientId, receiptNo, internalNo, sRefundNo } = selectedDeposit;
  
      if (!reason.trim()) {
        message.error(`Please enter a reason for ${action.toLowerCase()}.`);
        setLoading(false);
        return;
      }
  
      const requestData = {
        PatientId: patientId,
        sRefundNo: sRefundNo || "", 
        sReceiptNo: receiptNo,
        InternalNo: internalNo,
        RefundAmount: refundAmt,
        sReason: reason.trim(),
        UserId: userName,
      };
  
      console.log("Sending Cancellation Data:", requestData);
  
      const response = await OPModuleAgent.SaveDepositCancellation(requestData);
  
      if (response?.data?.msgDesc?.toLowerCase().includes("success")) {
        message.success(response.data.msgDesc);
        fetchData(searchTerm); // Refresh data
      } else {
        message.error(response.data?.msgDesc || "Failed to update record. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("An error occurred while processing your request.");
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedDeposit(null); // Reset selected deposit
      setReason(""); // Clear reason
    }
  };
  

  const handleModalCancel = () => {
    console.log(`${action} canceled.`);
    setShowModal(false);
  };


  const columns = [
    { dataField: "patientId", text: "PatientId" },
    { dataField: "surrogateID", text: "SurrogateID" },
    { dataField: "internalNo", text: "Internal Number" },
    { dataField: "receiptNo", text: "Receipt Number" },
    { dataField: "receiptDate", text: "Receipt Date" },
    { dataField: "receiptTime", text: "Receipt Time" },
    { dataField: "depositType", text: "Deposit Type" },
    {
      text: "Print Deposit Receipt",
      dataField: "print",
      formatter: (cell, row) => (
        <FontAwesomeIcon
          icon={faPrint}
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleExport(row)}
        />
      ),
    },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (cell, row) => (
        <div className="d-flex gap-2">
          <Button
            onClick={() => {
              handleSelectDeposit(row); // Select the deposit
              showConfirmationModal("Cancel"); // Open modal
            }}
            icon={<CloseOutlined />}
            type="primary"
            danger
            size="small"
          >
            Cancel
          </Button>
        </div>
      ),
    },
    
  ];

  
  const handleExport = () => {
    const exportData = filteredData.length ? filteredData : data;
    if (exportData.length === 0) {
      message.warning("No data available to export.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deposit Dashboard");
    XLSX.writeFile(wb, `Deposit_Dashboard_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };


  const paginationOptions = {
    custom: true,
    totalSize: filteredData.length,
    sizePerPage: itemsPerPage,
    sizePerPageList: [10, 15, 20],
    page: currentPage,
    onPageChange: (page) => setCurrentPage(page),
  };

  const mappedData = filteredData.map((event, index) => ({
    ...event,
    sno: index + 1,
  }));

  return (
   
      <div className="container" style={{ overflowX: "auto",}}>
      {/* Search and Date Filter */}
      <div className="d-flex justify-content-center mb-3">
        {/* <RangePicker onChange={handleDateRangeChange} style={{ width: "400px", marginRight: "10px" }} /> */}
        <Input
          placeholder="Search by Bill No, UHID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
   <Button type="primary" onClick={() => fetchData(searchTerm)}>
  Search
</Button>
      </div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <div>
              <BootstrapTable
                keyField="sno"
                data={mappedData}
                columns={columns}
                {...paginationTableProps}
              />
              <PaginationListStandalone {...paginationProps} />
            </div>
          )}
        </PaginationProvider>
      )}

      {/* Modal for Confirmation */}
      <Modal show={showModal} onHide={handleModalCancel} centered>
        <Modal.Header closeButton>
        <FontAwesomeIcon icon={faExclamationCircle} style={{ color:"rgb(250, 173, 20)", marginRight: "5px", height:"22px"}} />
          <Modal.Title>Confirm {action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{fontSize:"16px",fontWeight:"bolder"}}>Are you sure you want to proceed with <strong>{action}</strong>? This action cannot be undone.</p>
         <label style={{ fontWeight: "bold", marginTop: "10px" }}>Reason:</label>
           <Input.TextArea
             placeholder="Enter reason..."
             value={reason}
             onChange={(e) => setReason(e.target.value)}
             rows={3}
             style={{ marginTop: "10px" }}/>
        </Modal.Body>
        <Modal.Footer>
          <Button style = {{background:"rgb(173, 16, 5)",color:"white"}} variant="secondary" onClick={handleModalCancel}>
            No
          </Button>
          <Button  style = {{background:"rgb(9, 124, 201)",color:"white"}}variant="primary" onClick={handleModalOk}>
            Yes, Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RefundDashboard;
