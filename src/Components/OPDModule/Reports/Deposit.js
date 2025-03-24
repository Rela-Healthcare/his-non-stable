import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Button,
  Table,
  Input,
  Spin,
  message,
  Space, 
} from "antd";
import "antd/dist/reset.css";
import { OPModuleAgent } from "../../../agent/agent";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import moment from "moment";
const { RangePicker } = DatePicker;

function Deposit() {
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]); // Raw data state
  const [filteredData, setFilteredData] = useState([]); // Filtered data state
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch data from API
  const fetchData = async (fromDate, toDate, Uhid = "") => {
    try {
      setLoading(true); // Start loading

      const formattedFromDate = fromDate.format("M/D/YYYY");
      const formattedToDate = toDate.format("M/D/YYYY");
      const searchUhid = searchTerm || Uhid;

      const response = await OPModuleAgent.getDepositReport(
        formattedFromDate,
        formattedToDate,
        searchUhid
      );
      console.log("API Response:", response);

      if (response && Array.isArray(response.data)) {
        setData(response.data); // Set raw data
        setFilteredData(response.data); // Initially show all data
      } else {
        console.warn("No valid data found in response.");
        setData([]); // Clear the data.
        setFilteredData([]); // Reset the filtered data.
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data. Please try again."); // Show error message
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle date range selection
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const fromDate = dates[0];
      const toDate = dates[1];
      fetchData(fromDate, toDate);
    }
  };

  // Handle search term change
  // const handleSearch = () => {
  //   let filtered = [...data]; // Copy of the data

  //   if (searchTerm) {
  //     const lowerSearchTerm = searchTerm.toLowerCase();
  //     filtered = filtered.filter((item) => {
  //       return (
  //         (item.billNo && item.billNo.toLowerCase().includes(lowerSearchTerm)) ||
  //         (item.uhid && item.uhid.toLowerCase().includes(lowerSearchTerm)) ||
  //         (item.patientname &&
  //           item.patientname.toLowerCase().includes(lowerSearchTerm))
  //       );
  //     });
  //   }
  //   setFilteredData(filtered); // Update filtered data
  // };

  // Initialize data on first render
  useEffect(() => {
    if (dateRange) {
      const [fromDate, toDate] = dateRange;
      fetchData(fromDate, toDate); // Fetch data once component mounts
    }
  }, [dateRange, searchTerm]); // Run effect when dateRange or searchTerm changes

  const columns = [
    { title: "UHID", dataIndex: "pin", key: "pin" },
    { title: "Patient Name", dataIndex: "patientName", key: "patientName" },
    { title: "Deposit No", dataIndex: "depositno", key: "depositno" },
    { title: "Deposit Date", dataIndex: "depositDate", key: "depositDate" },
    { title: "Salutation", dataIndex: "salutation", key: "salutation" },
    { title: "Deposit Amount", dataIndex: "amount", key: "amount" },
    { title: "Deposit Type", dataIndex: "depositType", key: "depositType" },
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
      <h1>Patient Deposit Report</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker onChange={handleDateRangeChange} style={{ width: "500px" }} />
        <Input
          placeholder="Please enter the UHID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "500px" }}
        />
        {/* <Button type="primary" onClick={handleSearch} >
          Search
        </Button> */}
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>

      {/* Show loading spinner while fetching data */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="pin" />
      )}
    </div>
  );
}

export default Deposit;