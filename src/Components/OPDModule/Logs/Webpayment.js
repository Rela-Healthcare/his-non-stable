import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button, Space, DatePicker, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { OPModuleAgent } from "../../../agent/agent";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Webpayment = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    doctorName: "",
    fromDate: null,
    toDate: null,
  });

  const columns = [
    { title: "S.No", dataIndex: "sNo", key: "sno" },
    { title: "UHID", dataIndex: "uhid", key: "uhid" },
    { title: "Name", dataIndex: "patientName", key: "name" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
    { title: "Service Type", dataIndex: "refType", key: "servicetype" },
    { title: "Transaction Date Time", dataIndex: "transDate", key: "transactiondatetime" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Transaction ID", dataIndex: "patRefID", key: "transactionid" },
    { title: "Payment Status", dataIndex: "paymentStatus", key: "paymentstatus" },
  ];

  const fetchData = async () => {
    try {
      const { fromDate, toDate } = filters;
      const response = await OPModuleAgent.getpaymentlog(fromDate, toDate);
      const rawData = Array.isArray(response.data) ? response.data : [];
      
      // Extract unique doctors for dropdown
      const uniqueDoctors = [...new Set(rawData.map((item) => item.doctorName))];
      setDoctors(uniqueDoctors);

      setData(rawData);
      applyFilters(rawData);
    } catch (error) {
      message.error("Error fetching data. Please try again later.");
    }
  };

  const applyFilters = (rawData) => {
    const { search, doctorName } = filters;
    let filtered = rawData;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.patientName?.toLowerCase().includes(searchLower) ||
          item.mobileNo?.toLowerCase().includes(searchLower) ||
          item.uhid?.toLowerCase().includes(searchLower)
      );
    }

    if (doctorName) {
      filtered = filtered.filter((item) => item.doctorName === doctorName);
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, [filters.fromDate, filters.toDate]);

  useEffect(() => {
    applyFilters(data);
  }, [filters.search, filters.doctorName, data]);

  return (
    <div>
      <h1 style={{ color: "#3C4B64" }}>Web Payment Logs</h1>
      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          onChange={(dates) =>
            setFilters({
              ...filters,
              fromDate: dates ? dates[0].format("YYYY-MM-DD") : null,
              toDate: dates ? dates[1].format("YYYY-MM-DD") : null,
            })
          }
        />

        <Input
          placeholder="Search by Name, Mobile No, or UHID"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ width: 250 }}
        />

        <Select
          placeholder="Select Doctor"
          style={{ width: 200 }}
          allowClear
          value={filters.doctorName}
          onChange={(value) => setFilters({ ...filters, doctorName: value })}
        >
          {doctors.map((doc) => (
            <Option key={doc} value={doc}>
              {doc}
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="sNo"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Webpayment;
