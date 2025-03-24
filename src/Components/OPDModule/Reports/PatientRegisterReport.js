import React, { useState, useEffect } from "react";
import "antd/dist/reset.css";
import { OPModuleAgent } from "../../../agent/agent";
import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
import * as XLSX from "xlsx";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";


const { RangePicker } = DatePicker;

function PatientRegisterReport() {
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]); // API data
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch data from API

  const fetchData = async (fromDate, toDate, patientType, nationalityId, visitType) => {
    if (!fromDate || !toDate) return; 
    setLoading(true)
    try {
 
      const response = await OPModuleAgent.getRegistrationReport (fromDate, toDate, patientType, nationalityId, visitType)
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
    }
  };

  // Apply filters: search term
  useEffect(() => {
    let filtered = [...data];

  // Apply the search filter (name, mobile no, or UHID)

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>   
          item.uhid.toLowerCase().includes(lowerSearchTerm) ||
          item.patientName.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Columns for Ant Design Table
  const columns = [
    {
      title: "S No",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "UHID",
      dataIndex: "uhid",
      key: "uhid",
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientname",
    },

    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
    },

    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },

    {
      title: "Payor Type",
      dataIndex: "payorType",
      key: "payortype",
    },
    {
      title: "Payor Name",
      dataIndex: "payorName",
      key: "payorname",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Registration Date",
      dataIndex: "visit_Date",
      key: "registrationdate",
    },
    {
      title: "Department",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorname",
      key: "doctorname",
    },
    {
      title: "Country",
      dataIndex: "nationality",
      key: "country",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Mobile No",
      dataIndex: "mobile",
      key: "mobileno",
    },
    {
      title: "Ref Source",
      dataIndex: "referalSourceName",
      key: "refsource",
    },
    {
      title: "User Details",
      dataIndex: "visitCreatedUser",
      key: "visitcreateduser",
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
    XLSX.utils.book_append_sheet(wb, ws, "Patient Deposit Report");
    XLSX.writeFile(wb, `Patient_Depost_Reports${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>New Patient Registration Report</h1>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ width: "250px" }}/>
        <Input
          placeholder="Search by UHID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "500px" }}
        />
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>Export</Button>
      </div>

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

export default PatientRegisterReport;
