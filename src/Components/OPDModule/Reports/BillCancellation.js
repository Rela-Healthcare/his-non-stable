
import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;


function BillCancellation() {
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
  const response = await OPModuleAgent.getBillCancellationReport(fromDate, toDate)
  console.log("Bill Cancellation API Response:", response); // Add this for debugging

if(response  && Array.isArray(response.data)){
  setData(response.data);
  setFilteredData(response.data);
}
else{
  setData([]);// data clear
  setFilteredData([]);
   message.warn("No bill cancellation data found for the selected date range."); 
}
}
catch(error){
  console.error("Error fetching data:", error);
      message.error("Failed to fetch bill cancellation data. Please try again."); // Show an error message
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
          setData([]);
          setFilteredData([]);
          setSearchTerm("");
      }
    };
  

  // Handle Search Input
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) => {
        // Use optional chaining for safe access to potentially undefined properties
        return (
          item.billnum?.toLowerCase().includes(lowerSearchTerm) ||
          item.uhid?.toLowerCase().includes(lowerSearchTerm) ||
          item.patientname?.toLowerCase().includes(lowerSearchTerm)
        );
      }
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Handle Search Button Click
  // const handleSearch = () => {
  //   console.log("Filters:", { dateRange, selectedDoctor, selectedDepartment });
  //   // Here you could make an additional API call if needed to refine the data.  Currently, data is fetched on date range change
  // };

  const columns = [
    {
      title: "Patientname",
      dataIndex: "patientname",
      key: "patientname",
    },
    {
      title: "Bill Date", 
      dataIndex: "billdate", 
      key: "billDate", 
    },
    {
      title: "Bill No",
      dataIndex: "billnum",
      key: "billNo",
    },
    {
      title: "UHID",
      dataIndex: "uhid",
      key: "uhid",
    },

    // {
    //   title: "Cancellation Date", 
    //   dataIndex: "cancellationDate",
    //   key: "cancellationDate",
    // },
    // {
    //   title: "Reason for Cancellation",
    //   dataIndex: "reasonforcancellation",
    //   key: "reasonforcancellation",
    // },
    {
      title: "User Detail",
      dataIndex: "patientStatus",
      key: "patientStatus",
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
    XLSX.utils.book_append_sheet(wb, ws, "Patient Invoice Cancellation Report");
    XLSX.writeFile(wb, `Patient_Invoice_Cancellation_Report${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Invoice Cancellation Report</h1>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker
           onChange={handleDateRangeChange}
          style={{ width: "250px" }}
          allowClear
        />
        <Input
          placeholder="Search by Bill No, UHID, PatientName "
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
export default BillCancellation;