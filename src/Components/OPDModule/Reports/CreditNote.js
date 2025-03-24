import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
import { OPModuleAgent } from "../../../agent/agent";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

function Refund() {
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]); // API data
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch data from API
  const fetchData = async (fromDate, toDate) => {
    if (!fromDate || !toDate) return; // Prevent API call if dates are not selected

    setLoading(true); // Start loading

    try {
      const response = await OPModuleAgent.getCreditNoteReport(fromDate,toDate);
      console.log("API Response:", response);

      if (response && Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setData([]); // Clear the data if response is invalid
        setFilteredData([]); // Clear filtered data
        message.warn("No refund data found for the selected date range."); // Show a warning
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch refund data. Please try again."); // Show an error message
      setData([]); // Clear data on error
      setFilteredData([]); // Clear filtered data on error
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const fromDate = dates[0]?.format("MM-DD-YYYY");
      const toDate = dates[1]?.format("MM-DD-YYYY");
      fetchData(fromDate, toDate); // Fetch data with selected date range
    } else {
      // Clear data and searchTerm if the date range is cleared
      setData([]);
      setFilteredData([]);
      setSearchTerm("");
    }
  };

  // Apply filters: search term
  useEffect(() => {
    let filtered = [...data];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.visitNo?.toLowerCase().includes(lowerSearchTerm) ||  // Use optional chaining and handle null/undefined
          item.mrn?.toLowerCase().includes(lowerSearchTerm) ||  // Use optional chaining and handle null/undefined
          item.patientName?.toLowerCase().includes(lowerSearchTerm) || // Use optional chaining and handle null/undefined
          item.invoiceNo?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Columns for Ant Design Table
  const columns = [

     
    {title: "UHID",dataIndex: "mrn",key: "uhid",},
    {title: "Patient Name",dataIndex: "patientName",key: "patientname",},
    {title: "Bill Date",dataIndex: "date",key: "billdate",},
    {title: "Credit Note No",dataIndex: "creditNoteNo",key: "creditNoteNo",},
    {title: "InvoiceNo",dataIndex: "invoiceNo",key: "invoiceNo",},
    {title: "VisitNo",dataIndex: "visitNo",key: "visitNo",},
    {title: "Amount",dataIndex: "amount",key: "amount",},
    {title: "Reason",dataIndex: "remarks",key: "reason",},
  ];


  const handleExport = () => {
    const exportData = filteredData.length ? filteredData : data; // Export either filtered or original data
    if (exportData.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient Deposit Report");
    XLSX.writeFile(wb, `Patient_Depost_Reports${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1> Patient Credit Note Report</h1>
      {/* Filters */}
      <Space style={{ marginBottom: "20px" }}>
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ width: "250px" }}
          allowClear 
        />
        <Input
          placeholder="Search by VisitNo, UHID, Name, invoiceNo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "500px" }}
        />

<Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </Space>

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
      
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="billNo"
        />
      )}
    </div>
  );
}

export default Refund;