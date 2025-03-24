// import React, { useState, useEffect } from "react";
// import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
// import "antd/dist/reset.css";
// import { OPModuleAgent } from "../../../agent/agent";

// const { RangePicker } = DatePicker;

// function ConcessionReport() {
//   const [dateRange, setDateRange] = useState(null);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchData = async (fromDate, toDate) => {
//     if (!fromDate || !toDate) return;
//     setLoading(true);
//     try {
//       const response = await OPModuleAgent.getConcessionReport(fromDate, toDate);
//       console.log("Concession Report API Response:", response); // Debugging

//       if (response && Array.isArray(response.data)) {
//         setData(response.data);
//         setFilteredData(response.data);
//       } else {
//         setData([]);
//         setFilteredData([]);
//         message.warn("No concession data found for the selected date range.");
//       }
//     } catch (error) {
//       console.error("Error fetching concession data:", error);
//       message.error("Failed to fetch concession data. Please try again.");
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateRangeChange = (dates) => {
//     setDateRange(dates);
//     if (dates) {
//       const fromDate = dates[0]?.format("MM-DD-YYYY");
//       const toDate = dates[1]?.format("MM-DD-YYYY");
//       fetchData(fromDate, toDate);
//     } else {
//       setData([]);
//       setFilteredData([]);
//       setSearchTerm("");
//     }
//   };

//   useEffect(() => {
//     const lowerSearchTerm = searchTerm.toLowerCase();
//     const filtered = data.filter((item) => {
//       return (
//         item.uhid?.toLowerCase().includes(lowerSearchTerm) ||
//         item.patientName?.toLowerCase().includes(lowerSearchTerm) ||
//         item.reason_for_Concession?.toLowerCase().includes(lowerSearchTerm) //Added Search for reason
//       );
//     });
//     setFilteredData(filtered);
//   }, [searchTerm, data]);

//   const handleSearch = () => {
//     console.log("Search triggered with filters:", { dateRange, searchTerm });
//   };

//   const columns = [
//     {
//       title: "S No",
//       dataIndex: "sNo",
//       key: "sNo",
//     },
//     {
//       title: "UHID",
//       dataIndex: "uhid",
//       key: "uhid",
//     },
//     {
//       title: "Patient Name",
//       dataIndex: "patientName",
//       key: "patientname",
//     },
//     {
//       title: "Refund Date", // Corrected from refunddate to refundDate (assuming casing matters)
//       dataIndex: "refundDate", //  Corrected from refunddate to refundDate (assuming casing matters)
//       key: "refundDate", // Corrected from refunddate to refundDate (assuming casing matters)
//     },
//     {
//       title: "Refund Amount",
//       dataIndex: "amount",
//       key: "amount",
//     },
//     {
//       title: "User Detail",
//       dataIndex: "userdetails",
//       key: "userdetails",
//     },
//     {
//       title: "Reason",
//       dataIndex: "reason_for_Concession",
//       key: "reason_for_Concession",
//     },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Concession Report</h1>
//       <Space style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//         <RangePicker
//           onChange={handleDateRangeChange}
//           style={{ width: "250px" }}
//           allowClear
//         />
//         <Button type="primary" onClick={handleSearch}>
//           Search
//         </Button>
//         <Input
//           placeholder="Search by UHID, Patient Name, Reason"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ width: "500px" }}
//         />
//       </Space>

//       {loading ? (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//           <Spin size="large" />
//         </div>
//       ) : (
//         <Table columns={columns} dataSource={filteredData} rowKey="sNo" />
//       )}
//     </div>
//   );
// }

// export default ConcessionReport;

import React, { useState, useEffect } from "react";
import { DatePicker, Button, Table, Input, message, Spin, Space } from "antd";
import "antd/dist/reset.css";
import * as XLSX from "xlsx";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

function ConcessionReport() {
  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (fromDate, toDate) => {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const response = await OPModuleAgent.getConcessionReport(fromDate, toDate);
      console.log("Concession Report API Response:", response); 
      if (response && Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
        message.warn("No concession data found for the selected date range.");
      }
    } catch (error) {
      console.error("Error fetching concession data:", error);
      message.error("Failed to fetch concession data. Please try again.");
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const fromDate = dates[0]?.format("MM-DD-YYYY");
      const toDate = dates[1]?.format("MM-DD-YYYY");
      fetchData(fromDate, toDate);
    } else {
      setData([]);
      setFilteredData([]);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.uhid?.toLowerCase().includes(lowerSearchTerm) ||
        item.patientName?.toLowerCase().includes(lowerSearchTerm) ||
        item.reason_for_Concession?.toLowerCase().includes(lowerSearchTerm) //Added Search for reason
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // const handleSearch = () => {
  //   console.log("Search triggered with filters:", { dateRange, searchTerm });
  // };

  const columns = [
    {
      title: "S No",
      dataIndex: "sNo",
      key: "sNo",
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
      title: "Refund Date", 
      dataIndex: "bill_Date", 
      key: "refundDate", 
    },
    {
      title: "Bill No",
      dataIndex: "bill_No",
      key: "billNo",
    },
    {
      title: "Refund Amount",
      dataIndex: "concession_Amount",
      key: "amount",
    },
    {
      title: "User Detail",
      dataIndex: "user_Name",
      key: "userdetails",
    },
    {
      title: "Reason",
      dataIndex: "reason_for_Concession",
      key: "reason_for_Concession",
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
      <h1>Concession Report</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ width: "250px" }}
          allowClear
        />
        <Input
          placeholder="Search by UHID, Patient Name, Reason"
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

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="sNo" />
      )}
    </div>
  );
}

export default ConcessionReport;