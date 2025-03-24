import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { OPModuleAgent } from "../../../agent/agent";


const PackagePriceList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const columns = [
    { title: "S.No", dataIndex: "no", key: "no" },
    { title: "Service Group", dataIndex: "serviceGroup", key: "serviceGroup" },
    { title: "Service Code", dataIndex: "serviceCode", key: "serviceCode" },
    { title: "Service Name", dataIndex: "serviceName", key: "serviceName" },
    { title: "Amount", dataIndex: "serviceRate", key: "serviceRate" },
    { title: "ChargeId", dataIndex: "chargeId", key: "chargeId" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OPModuleAgent.getpackagePriceList();
        setData(response.data);
        setFilteredData(response.data); 
      } catch (error) {
        message.error("Error fetching data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  // Handle search dynamically
  useEffect(() => {
    if (!searchText) {
      setFilteredData(data); // Reset when search is cleared
    } else {
      const lowerSearchText = searchText.toLowerCase();
      const filtered = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value || "").toLowerCase().includes(lowerSearchText)
        )
      );
      setFilteredData(filtered);
    }
  }, [searchText, data]);

  return (
    <div>
      <h1 style={{ color: "royalblue", fontSize: 40 }}>Package Price List</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by any field"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 500 }}
          allowClear
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey="no" />
    </div>
  );
};

export default PackagePriceList;
