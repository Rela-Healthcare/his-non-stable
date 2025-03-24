

import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;


function CashCollectionReport() {
  const [dateRange, setDateRange] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const[loading,setLoading] =useState(false);


const fetchData = async(fromDate, toDate) =>{
if(!fromDate || !toDate)
  return;
setLoading(true)
try{
  const response = await OPModuleAgent.getCashCollectionReport(fromDate, toDate)
  console.log("Cash Collection API Response:", response);

if(response && Array.isArray(response.data)){
  setData(response.data);
  setFilteredData(response.data);
}
else{
  setData([]);// data clear
  setFilteredData([]);
   message.warn("No cash collection data found for the selected date range."); 
}
}
catch(error){
  console.error("Error fetching cash collection data:", error);
      message.error("Failed to fetch cash collection data. Please try again."); // Show an error message
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
        setData([]); // Clear the data if date range is cleared
        setFilteredData([]);
        setSearchTerm("");
      }
    };
  

  // Handle Search Input
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) => {
        // Use optional chaining and handle null/undefined values
        const matchesSearch = (
          item.collectionType?.toLowerCase().includes(lowerSearchTerm) ||
          item.userName?.toLowerCase().includes(lowerSearchTerm) ||
          item.departmentName?.toLowerCase().includes(lowerSearchTerm)
        );
        return matchesSearch;
      }
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Handle Search Button Click
  // const handleSearch = () => {
  //   console.log("Filters:", { dateRange, selectedDoctor, selectedDepartment });
  //   // Here you could make an additional API call if needed to refine the data.  Currently, data is being fetched already based on date range.  You could add doctor/department filtering here if needed.
  // };

  // Columns for Ant Design Table
  const columns = [

    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "User Department",dataIndex: "departmentName",    key: "departmentName", },
    { title: "Collection Type",dataIndex: "collectionType",key: "collectionType", },
    { title: "Cash", dataIndex: "cash", key: "cash" },
    { title: "Card", dataIndex: "card", key: "card" },
    { title: "Cheque", dataIndex: "cheque", key: "cheque" },
    { title: "Contra", dataIndex: "contra", key: "contra" },
    { title: "Total", dataIndex: "total", key: "total" },
  ];

     const handleExport = () => {
      const exportData = filteredData.length ? filteredData : data; // Export either filtered or original data
      if (exportData.length === 0) {
        message.warning("No data available to export.");
        return;
      }
  
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "CashCollection Report");
      XLSX.writeFile(wb, `CashCollection_Report${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
    };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment Collection Report</h1>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker
           onChange={handleDateRangeChange}
          style={{ width: "250px" }}
          allowClear  // Allow clearing of the date range
        />
      
        <Input
          placeholder="Search by User Name, Department ,Collection Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "500px" }}
        />

{/* <Button type="primary" onClick={handleSearch}>
          Search
        </Button> */}

        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>

{loading ?(
<div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
):(
      <Table columns={columns} dataSource={filteredData} rowKey="billNo" />

  )}
</div>
  );
}
export default CashCollectionReport;