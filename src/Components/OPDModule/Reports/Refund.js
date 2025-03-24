
import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input, message, Spin } from "antd";
import { OPModuleAgent } from "../../../agent/agent";
import "antd/dist/reset.css";
import { DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import * as XLSX from "xlsx";

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
      const response = await OPModuleAgent.getRefundReport(fromDate, toDate);
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
          item.billNo?.toLowerCase().includes(lowerSearchTerm) || // Use optional chaining and handle null/undefined
          item.mrn?.toLowerCase().includes(lowerSearchTerm) || // Use optional chaining and handle null/undefined
          item.patientName?.toLowerCase().includes(lowerSearchTerm) // Use optional chaining and handle null/undefined
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Columns for Ant Design Table
  const columns = [
    {
      title: "UHID",
      dataIndex: "mrn",
      key: "uhid",
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientname",
    },
    {
      title: "BillNo",
      dataIndex: "billNo",
      key: "billNo",
    },
    
    {
      title: "Refund Date",
      dataIndex: "refundDate",
      key: "refunddate",
    },
    {
      title: "Refund No",
      dataIndex: "refundNo",
      key: "refundNo",
    },
    {
      title: "DepositNo",
      dataIndex: "depositNo",
      key: "depositNo",
    },
    {
      title: "DepositAmt",
      dataIndex: "depositAmt",
      key: "depositAmt",
    },
    {
      title: "Refund Amount",
      dataIndex: "refundAmt",
      key: "amount",
    },
    {
      title: "User Detail",
      dataIndex: "userId",
      key: "userdetails",
    },
    {
      title: "Reason",
      dataIndex: "refundReason",
      key: "reason",
    },
  ];

  const handleExport = () => {
    const exportData = filteredData.length ? filteredData : data; // Export either filtered or original data
    if (exportData.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient Refund Report");
    XLSX.writeFile(
      wb,`Patient_Refund _Report_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Refund Report</h1>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ width: "250px" }}
          allowClear // Allow clearing the date range
        />
        <Input
          placeholder="Search by Bill No, UHID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "500px" }}
        />

        {/* <Button type="primary" onClick={handleSearch}>
          Search
        </Button> */}
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          Export
        </Button>
      </div>
      {/* Loading Spinner */}
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        // Data Display
        <Table columns={columns} dataSource={filteredData} rowKey="billNo" />
      )}
    </div>
  );
}

export default Refund;