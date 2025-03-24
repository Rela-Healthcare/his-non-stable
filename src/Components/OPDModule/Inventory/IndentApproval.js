import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  message,
  DatePicker,
  Row,
  Col,
} from "antd";
import moment from "moment";

const { Search } = Input;
const { RangePicker } = DatePicker;

function IndentApproval({ requests, setRequests }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState(requests);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);

  // Handle Modify
  const handleModify = (record) => {
    setCurrentItem(record);
    setIsModalVisible(true);
  };

  // Handle Approve
  const handleApprove = (key) => {
    message.success("Request approved successfully!");
    setRequests(
      requests.map((req) =>
        req.key === key ? { ...req, status: "Approved" } : req
      )
    );
  };

  // Handle Reject
  const handleReject = (key) => {
    message.error("Request rejected!");
    setRequests(requests.filter((req) => req.key !== key));
  };

  // Save Changes from Modal
  const saveChanges = () => {
    setRequests(
      requests.map((req) => (req.key === currentItem.key ? currentItem : req))
    );
    message.success("Changes saved successfully!");
    setIsModalVisible(false);
  };

  // Handle Search Filter
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    filterRequests(value, dateRange);
  };

  // Handle Date Filter
  const handleDateFilter = (dates) => {
    setDateRange(dates);
    filterRequests(searchTerm, dates);
  };

  // Filter Requests
  const filterRequests = (term, range) => {
    const filtered = requests.filter((req) => {
      const matchesSearch = term
        ? req.dep.toLowerCase().includes(term) ||
          req.item.toLowerCase().includes(term) ||
          req.store.toLowerCase().includes(term)
        : true;

      const matchesDate =
        range && range.length === 2
          ? moment(req.date).isBetween(range[0], range[1], "day", "[]")
          : true;

      return matchesSearch && matchesDate;
    });

    setFilteredRequests(filtered);
  };

  // Table Columns
  const columns = [
    { title: "Department", dataIndex: "dep", key: "dep" },
    { title: "Store", dataIndex: "store", key: "store" },
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Requested Qty", dataIndex: "requestedQty", key: "requestedQty" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleModify(record)}>
            Modify
          </Button>
          <Button type="link" onClick={() => handleApprove(record.key)}>
            Approve
          </Button>
          <Button type="link" danger onClick={() => handleReject(record.key)}>
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ color: "#3C4B64" }}>Indent Approval</h1>
      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <RangePicker
            onChange={handleDateFilter}
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <Search
            placeholder="Search by department, store, or item"
            enterButton
            onSearch={handleSearch}
            allowClear
          />
        </Col>
      </Row>

      {/* Data Table */}
      <Table
        dataSource={filteredRequests}
        columns={columns}
        pagination={false}
      />

      {/* Modify Modal */}
      {isModalVisible && (
        <Modal
          title="Modify Request"
          visible={isModalVisible}
          onOk={saveChanges}
          onCancel={() => setIsModalVisible(false)}
        >
          <Input
            placeholder="Requested Qty"
            value={currentItem.requestedQty}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, requestedQty: e.target.value })
            }
          />
          <Input
            placeholder="Remarks"
            style={{ marginTop: 10 }}
            value={currentItem.remarks}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, remarks: e.target.value })
            }
          />
        </Modal>
      )}
    </div>
  );
}

export default IndentApproval;
