import React, { useState, useEffect } from "react";
import { DatePicker, Select, Button, Table, Input } from "antd";
import "antd/dist/reset.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

function ServiceOrder() {
  const [dateRange, setDateRange] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [data, setData] = useState([]); // API data
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table
  const [searchTerm, setSearchTerm] = useState("");

  // Mock API URL
  const API_URL = "https://api.example.com/bill-cancellations";

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle Search Input
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.billNo.toLowerCase().includes(lowerSearchTerm) ||
        item.doctorName.toLowerCase().includes(lowerSearchTerm) ||
        item.department.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Handle Search Button Click
  const handleSearch = () => {
    console.log("Filters:", { dateRange, selectedDoctor, selectedDepartment });
    // Here you could make an additional API call if needed to refine the data.
  };

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
      dataIndex: "patientname",
      key: "patientname",
    },
    {
      title: "Service Group",
      dataIndex: "servicegroup",
      key: "servicegroup",
    },
    {
      title: "Service Name",
      dataIndex: "servicename",
      key: "servicename",
    },

    {
      title: "Department Name",
      dataIndex: "departmentname",
      key: "departmentname",
    },

    {
      title: "Doctor Name",
      dataIndex: "doctorname",
      key: "doctorname",
    },
    {
      title: "Payor Type",
      dataIndex: "payortype",
      key: "payortype",
    },
    {
      title: "Payor Name",
      dataIndex: "payorname",
      key: "payorname",
    },
    {
      title: "Bill Date",
      dataIndex: "billdate",
      key: "billdate",
    },
    {
      title: "Bill No",
      dataIndex: "billno",
      key: "billno",
    },
    {
      title: "Bill Amount",
      dataIndex: "billamount",
      key: "billamount",
    },
    {
      title: "Discount Amount",
      dataIndex: "discountamount",
      key: "discountamount",
    },
    {
      title: "Net Amount",
      dataIndex: "netamount",
      key: "netamount",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Service Wise Report</h1>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker
          onChange={(dates) => setDateRange(dates)}
          style={{ width: "250px" }}
        />
        {/* <Select
          placeholder="Select Doctor"
          onChange={(value) => setSelectedDoctor(value)}
          style={{ width: "200px" }}
        >
          <Option value="Dr. Smith">Dr. Smith</Option>
          <Option value="Dr. Johnson">Dr. Johnson</Option>
        </Select>
        <Select
          placeholder="Select Department"
          onChange={(value) => setSelectedDepartment(value)}
          style={{ width: "200px" }}
        >
          <Option value="Cardiology">Cardiology</Option>
          <Option value="Neurology">Neurology</Option>
        </Select> */}
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
        <Input
          placeholder="Search by Bill No, UHID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "500px" }}
        />
      </div>

      {/* Data Display */}
      <Table columns={columns} dataSource={filteredData} rowKey="billNo" />
    </div>
  );
}

export default ServiceOrder;
