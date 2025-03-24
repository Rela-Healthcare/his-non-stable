import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input } from "antd";
import "antd/dist/reset.css";
import axios from "axios";

const { RangePicker } = DatePicker;

function OpRevenueReport() {
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]); // API data
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table
  const [searchTerm, setSearchTerm] = useState("");

  // API URL
  const API_URL = "http://192.168.15.3/NewHIS/api/his/OPIPREVENUE_Date";

  // Fetch Data from API
  const fetchData = async (fromDate, toDate) => {
    try {
      const response = await axios.get(
        `${API_URL}?FromDate=${fromDate}&ToDate=${toDate}&Pattype=ALL&IVF_flg=0`
      );
      const result = response.data || [];
      setData(result);
      setFilteredData(result); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle Date Range Change
  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const [fromDate, toDate] = dates.map((date) => date.format("YYYY-MM-DD"));
      fetchData(fromDate, toDate);
    }
  };

  // Filter Data on Search Term Change
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.billNo?.toLowerCase().includes(lowerSearchTerm) ||
        item.doctorName?.toLowerCase().includes(lowerSearchTerm) ||
        item.departmentName?.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Columns for Ant Design Table
  const columns = [ 
    { title: "Bill Date", dataIndex: "billDate", key: "billDate" },
    { title: "UHID", dataIndex: "uhid", key: "uhid" },
    { title: "Department Name",dataIndex: "orderDepartment",key: "orderDepartment",},
    { title: "Doctor Name", dataIndex: "orderDoctor", key: "orderDoctor" },
    { title: "Service Group", dataIndex: "serviceGroup", key: "serviceGroup" },
    { title: "Service Name", dataIndex: "serviceName", key: "serviceName" },
    { title: "Bill No", dataIndex: "billNo", key: "billNo" },
    { title: "Payor Type", dataIndex: "payorType", key: "payorType" },
    { title: "Payor Name", dataIndex: "payer", key: "payer" },
    { title: "Bill Amount", dataIndex: "billAmount", key: "billAmount" },
    {title: "Discount Amount",dataIndex: "discount",key: "discount",},
    { title: "Net Amount", dataIndex: "net", key: "net" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>OPD Revenue Report</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker onChange={handleDateChange} style={{ width: "250px" }} />
        {/* <Button type="primary" onClick={() => fetchData(dateRange)}>
          Search
        </Button> */}
        <Input
          placeholder="Search by Bill No, UHID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      {/* Data Display */}
      <Table columns={columns} dataSource={filteredData} rowKey="billNo" />
    </div>
  );
}

export default OpRevenueReport;
