// import React, { useState, useEffect } from "react";
// import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
// import "antd/dist/reset.css";
// import { OPModuleAgent } from "../../../agent/agent";

// const { RangePicker } = DatePicker;


// function Invoice() {
//   const [dateRange, setDateRange] = useState(null);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]); 
//   const [searchTerm, setSearchTerm] = useState("");
//   const[loading,setLoading] =useState("");


//  // 
// const fetchData = async(fromDate, toDate) =>{
// if(!fromDate || !toDate)
//   return;
// setLoading(true)
// try{
//   const response = await OPModuleAgent.getInvoice(fromDate, toDate)
// if(response  && Array.isArray(response.data)){
//   setData(response.data);
//   setFilteredData(response.data);
// }
// else{
//   setData([]);// data clear
//   setFilteredData([]);
//    message.warn("No refund data found for the selected date range."); 
// }}
// catch(error){
//   console.error("Error fetching data:", error);
//       message.error("Failed to fetch refund data. Please try again."); // Show an error message
//       setData([]); // Clear data on error
//       setFilteredData([]); // Clear filtered data on error
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//     // Handle date range change
//     const handleDateRangeChange = (dates) => {
//       setDateRange(dates);
//       if (dates) {
//         const fromDate = dates[0]?.format("MM-DD-YYYY");
//         const toDate = dates[1]?.format("MM-DD-YYYY");
//         fetchData(fromDate, toDate); // Fetch data with selected date range
//       }
//     };
  

//   // Handle Search Input
//   useEffect(() => {
//     const lowerSearchTerm = searchTerm.toLowerCase();
//     const filtered = data.filter(
//       (item) =>
//         item.billNo.toLowerCase().includes(lowerSearchTerm) ||
//         item.doctorName.toLowerCase().includes(lowerSearchTerm) ||
//         item.department.toLowerCase().includes(lowerSearchTerm)
//     );
//     setFilteredData(filtered);
//   }, [searchTerm, data]);

//   // Handle Search Button Click
//   const handleSearch = () => {
//     console.log("Filters:", { dateRange, selectedDoctor, selectedDepartment });
//     // Here you could make an additional API call if needed to refine the data.
//   };

//   // Columns for Ant Design Table
//   const columns = [
//     {
//       title: "S No",
//       dataIndex: "sno",
//       key: "sno",
//     },
//     {
//       title: "Visit Date",
//       dataIndex: "visitdate",
//       key: "visitdate",
//     },
//     {
//       title: "UHID",
//       dataIndex: "uhid",
//       key: "uhid",
//     },
//     {
//       title: "Patient Name",
//       dataIndex: "patientname",
//       key: "patientname",
//     },
//     {
//       title: "Doctor Name",
//       dataIndex: "doctorName",
//       key: "doctorname",
//     },
//     {
//       title: "Department Name",
//       dataIndex: "departmentName",
//       key: "departmentname",
//     },
//     {
//       title: "Bill Date",
//       dataIndex: "billDate",
//       key: "billDate",
//     },
//     {
//       title: "Bill No",
//       dataIndex: "billNo",
//       key: "billNo",
//     },
//     {
//       title: "Bill Amount",
//       dataIndex: "billAmount",
//       key: "billAmount",
//     },
 
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Patient Invoice Report</h1>
//       {/* Filters */}
//       <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//         <RangePicker
//            onChange={handleDateRangeChange}
//           style={{ width: "250px" }}/>
      
//         <Button type="primary" onClick={handleSearch}>
//           Search
//         </Button>
//         <Input
//           placeholder="Search by Bill No, UHID, Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ width: "500px" }}
//         />
//       </div>

// {loading ?(
// <div style={{ textAlign: "center", marginTop: "20px" }}>
//           <Spin size="large" />
//         </div>
// ):(
//       <Table columns={columns} dataSource={filteredData} rowKey="billNo" />

//   )}
// </div>
//   );
// }
// export default Invoice;


import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input, message, Spin } from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

function Invoice() {
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Data
  const fetchData = async (fromDate, toDate) => {
    if (!fromDate || !toDate) return;
    setLoading(true);

    try {
      const response = await OPModuleAgent.getInvoice(fromDate, toDate);

      if (response && Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
        message.warn("No refund data found for the selected date range.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch refund data. Please try again.");
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Date Range Change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const fromDate = dates[0]?.format("MM-DD-YYYY");
      const toDate = dates[1]?.format("MM-DD-YYYY");
      fetchData(fromDate, toDate);
    }
  };

  // Handle Search Functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }
  
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        (item?.billNo?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (item?.uhid?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (item?.patientName?.toLowerCase() || "").includes(lowerSearchTerm) ||  // ✅ Fixed Field Name
        (item?.doctorName?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (item?.departmentName?.toLowerCase() || "").includes(lowerSearchTerm)
      );
    });
  
    setFilteredData(filtered);
  }, [searchTerm, data]);
  

  // Table Columns
  const columns = [
    { title: "S No", dataIndex: "sno", key: "sno" },
    { title: "Visit Date", dataIndex: "visitDate", key: "visitdate" },
    { title: "UHID", dataIndex: "uhid", key: "uhid" },
    { title: "Patient Name", dataIndex: "patientName", key: "patientname" },
    { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
    { title: "Department Name", dataIndex: "departmentName", key: "departmentName" },
    { title: "Bill Date", dataIndex: "billDate", key: "billDate" },
    { title: "Bill No", dataIndex: "billNo", key: "billNo" },
    { title: "Bill Amount", dataIndex: "billAmount", key: "billAmount" },
    { title: "Payor Type", dataIndex: "partyName", key: "partyName" },
    { title: "Payor Name", dataIndex: "partyName", key: "partyName" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
    { title: "Status", dataIndex: "isCancelled", key: "isCancelled" }


  ];

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredData.length ? filteredData : data;

    if (exportData.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient Invoice Report");
    XLSX.writeFile(wb, `Patient_Invoice_Report_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Invoice Report</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker onChange={handleDateRangeChange} style={{ width: "250px" }} />
        <Input
          placeholder="Search by Bill No, UHID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "400px" }}
        />
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>

      {/* Table or Loader */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="billNo" />
      )}
    </div>
  );
}

export default Invoice;