import React, { useState, useEffect } from "react";
import {Table, Input,Select,Button, Space,DatePicker,message,Modal, Form,} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { OPModuleAgent } from "../../../agent/agent";


const { Option } = Select;
const { RangePicker } = DatePicker;

const SmsLogs = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    doctorName: "",
    department: "",
    fromDate: null,
    toDate: null,
  });


  const columns = [
    { title: "S.No", dataIndex: "sNo", key: "sno" },
   // { title: "Name", dataIndex: "patientName", key: "name" },
    { title: "UHID", dataIndex: "uhid", key: "uhid" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "SMSDate", dataIndex: "smsDate", key: "smsDate" },
    { title: "Status", dataIndex: "reply", key: "reply" },
    { title: "SMS Content", dataIndex: "message", key: "message" },
    {title: "SMS Type",dataIndex: "smsType",key: "smsType",},
  ];

  
  const fetchData = async () => {
    try {
      const { fromDate, toDate, search } = filters;
      const response = await OPModuleAgent.getSMSapplog(fromDate, toDate);
  
      // Ensure response.data is an array
      let rawData = Array.isArray(response.data) ? response.data : [];
  
      let filteredData = rawData;
  
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = rawData.filter(
          (item) =>
            item.mobileNo?.toLowerCase().includes(searchLower) ||
            item.uhid?.toLowerCase().includes(searchLower)
        );
      }
  
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data. Please try again later.");
    }
  };
  


  useEffect(() => {
    fetchData();
  }, [filters]);
  
 

  return (
    <div>
      <h1 style={{ color: "#3C4B64" }}>SMS Logs</h1>
      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          onChange={(dates) =>
            setFilters({
              ...filters,
              fromDate: dates ? dates[0].format("YYYY-MM-DD") : null,
              toDate: dates ? dates[1].format("YYYY-MM-DD") : null,
            })
          }/>
      
      <Input
        placeholder="Search by Mobile No or UHID"
        prefix={<SearchOutlined />}
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })} 
        onPressEnter={fetchData} // Allows pressing Enter to search
        style={{ width: 250 }}
      />

      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="sNo"
        pagination={{ pageSize: 10 }}
      />
     
    </div>
  );
};

export default SmsLogs;
