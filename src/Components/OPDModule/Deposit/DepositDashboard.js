import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import moment from "moment";
import { Button, Input, Spin, message, DatePicker } from "antd";
import { OPModuleAgent } from "../../../agent/agent";
import { faPrint,faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { CloseOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal } from "react-bootstrap";

const { RangePicker } = DatePicker;


const DepositDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);
 
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [reason, setReason] = useState(""); // Store the reason input
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(""); // Store the action type
  const [selectedDepositType, setSelectedDepositType] = useState(""); // New state for dropdown


  const itemsPerPage = 15;


  const userName = localStorage.getItem("userName");
  console.log("userid",userName)

  const fetchData = async (fromDate, toDate, Uhid = "") => {
    try {
      setLoading(true);
      const formattedFromDate = fromDate.format("M/D/YYYY");
      const formattedToDate = toDate.format("M/D/YYYY");
      const searchUhid = searchTerm || Uhid;
      const response = await OPModuleAgent.getDepositDetailsList(
        formattedFromDate,
        formattedToDate,
        searchUhid
      );

      if (response && Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      message.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Data on Search Term Change
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.patientName?.toLowerCase().includes(lowerSearchTerm) ||
        item.pin?.toLowerCase().includes(lowerSearchTerm) ||
        item.depositno?.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      fetchData(dates[0], dates[1]);
    }
  };

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

  const showConfirmationModal = (actionType, deposit) => {
    setAction(actionType);
    setSelectedDeposit(deposit);
    setReason(""); // Reset reason input when opening modal
    setShowModal(true);
  };


  const handleModalOk = async () => {
    try {
      setLoading(true);
      let response = null;
  
      if (!selectedDeposit) {
        message.error("No deposit selected.");
        return;
      }
  
      const { depositno, pin, amount,  internalno, } = selectedDeposit;
  
      if (!reason.trim()) {
        message.error(`Please enter a reason for ${action.toLowerCase()}.`);
        return;
      }
  
      if (action === "Type Change" && !selectedDepositType) {
        message.error("Please select a deposit type.");
        return;
      }
  
      const requestData =
        action === "Cancel"
          ? { 
              sReceiptNo: depositno, 
              sReason: reason, 
              UserId: userName 
            }
          : {
              InternalNo: internalno,
              PatientId: parseInt(pin) || 0,  
              DepositType: selectedDepositType,
              DepositAmount: amount,
              Reason: reason,
              UserId: userName,
            };
  
      console.log("Request Data:", requestData);
  
      response = action === "Cancel"
        ? await OPModuleAgent.SaveDepositCancellation(requestData)
        : await OPModuleAgent.SaveDepositType_Change(requestData);
  
      console.log("API Response:", response);
  
      if (response?.data?.msgDesc?.toLowerCase().includes("success")) {
        message.success(response.data.msgDesc);
        fetchData(dateRange[0], dateRange[1]); // Refresh data
      } else {
        message.error(response.data?.msgDesc || "Failed to update record. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("An error occurred while processing your request.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };
  
  

const handleModalCancel = () => {
  setShowModal(false);
  setReason(""); // Clear reason on cancel
};


  const columns = [
    { dataField: "sno", text: "S.No" },
    { dataField: "pin", text: "UHID" },
    { dataField: "patientName", text: "Patient Name" },
    { dataField: "internalno", text: "Internal No" },
    { dataField: "depositno", text: "Deposit No" },
    { dataField: "amount", text: "Receipt Amount" },
    { dataField: "depositDate", text: "Deposit Date" },
    { dataField: "depositType", text: "Deposit Type" },
    {text: "Print Deposit Receipt",dataField: "print",
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
            onClick={() => showConfirmationModal("Cancel", row)}
            icon={<CloseOutlined />}
            type="primary"
            danger
            size="small">
            Cancel
          </Button>
          <Button
            onClick={() => showConfirmationModal("Type Change", row)}
            icon={<SwapOutlined />}
            type="default"
            size="small">
            Type Change
          </Button>
        </div>
      ),
    }
    
  ];

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
    <div className="container">
   
      {/* Search and Date Filter */}
      <div className="d-flex justify-content-center mb-3">
        <RangePicker onChange={handleDateRangeChange} style={{ width: "400px", marginRight: "10px" }} />
        <Input
          placeholder="Search by Bill No, UHID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={() => fetchData(dateRange[0], dateRange[1])}>
          Search
        </Button>
      </div>

      {/* Data Table with Pagination */}
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
    <FontAwesomeIcon
      icon={faExclamationCircle}
      style={{ color: "rgb(250, 173, 20)", marginRight: "5px", height: "22px" }}
    />
    <Modal.Title>Confirm {action}</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <p style={{ fontSize: "16px", fontWeight: "bolder" }}>
      Are you sure you want to proceed with <strong>{action}</strong>? This action cannot be undone.
    </p>

    {/* Show dropdown only when action is "Type Change" */}
    {action === "Type Change" && (
      <>
        <label style={{ fontWeight: "bold", marginTop: "10px" }}>Select Deposit Type:</label>
        <select
          value={selectedDepositType}
          onChange={(e) => setSelectedDepositType(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Type</option>
          <option value="IP">IP</option>
          <option value="OP">OP</option>
          <option value="Daycare">Daycare</option>
        </select>
      </>
    )}

    <label style={{ fontWeight: "bold", marginTop: "10px" }}>Reason:</label>
    <Input.TextArea
      placeholder="Enter reason..."
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      rows={3}
      style={{ marginTop: "10px" }}
    />
  </Modal.Body>

  <Modal.Footer>
    <Button style={{ background: "rgb(173, 16, 5)", color: "white" }} onClick={handleModalCancel}>
      No
    </Button>
    <Button style={{ background: "rgb(9, 124, 201)", color: "white" }} onClick={handleModalOk}>
      Yes, Confirm
    </Button>
  </Modal.Footer>
</Modal>




    </div>
  );
};

export default DepositDashboard;
