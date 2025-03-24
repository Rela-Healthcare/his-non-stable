import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Table,
  message,
  DatePicker,
} from "antd";

const { Option } = Select;

function IndentRequest() {
  const [dep, setDep] = useState("");
  const [store, setStore] = useState("");
  const [item, setItem] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  const [requestedQty, setRequestedQty] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [gridData, setGridData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState(null);

  // Mock Past Orders
  const [pastOrders, setPastOrders] = useState([
    { key: 1, date: "2024-11-01", item: "Pen", qty: 10, status: "Pending" },
    { key: 2, date: "2024-11-02", item: "Paper", qty: 20, status: "Approved" },
    { key: 3, date: "2024-11-03", item: "Pen", qty: 15, status: "Pending" },
  ]);

  const handleItemSelect = (value) => {
    setItem(value);
    // Mock: Load available quantity for the selected item
    const mockAvailableQty = value === "pen" ? 50 : 100;
    setAvailableQty(mockAvailableQty);
  };

  const addItemToGrid = () => {
    if (!dep || !store || !item || !requestedQty) {
      message.error("Please fill all required fields.");
      return;
    }

    const newItem = {
      key: gridData.length + 1,
      dep,
      store,
      item,
      availableQty,
      requestedQty,
      remarks,
    };

    setGridData([...gridData, newItem]);
    resetFields();
  };

  const resetFields = () => {
    setItem("");
    setAvailableQty(0);
    setRequestedQty(0);
    setRemarks("");
  };

  const handleDelete = (key) => {
    const updatedData = gridData.filter((row) => row.key !== key);
    setGridData(updatedData);
  };

  const handleSave = () => {
    if (gridData.length === 0) {
      message.error("No items to save.");
      return;
    }
    message.success("Data saved successfully!");
    console.log("Saved Data:", gridData);
    setGridData([]);
  };

  const handlePastOrderDelete = (key) => {
    const updatedPastOrders = pastOrders.filter((order) => order.key !== key);
    setPastOrders(updatedPastOrders);
    message.success("Item deleted successfully!");
  };

  const filteredPastOrders = pastOrders.filter(
    (order) =>
      (!filterDate || order.date === filterDate.format("YYYY-MM-DD")) &&
      (!searchText ||
        order.item.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: "Department",
      dataIndex: "dep",
      key: "dep",
    },
    {
      title: "Store",
      dataIndex: "store",
      key: "store",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Available Qty",
      dataIndex: "availableQty",
      key: "availableQty",
    },
    {
      title: "Requested Qty",
      dataIndex: "requestedQty",
      key: "requestedQty",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.key)}>
          Delete
        </Button>
      ),
    },
  ];

  const pastOrdersColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div>
      <h1>New Indent Request</h1>
      <Form>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="User Location" required>
              <Select
                placeholder="Select location"
                value={dep}
                onChange={(value) => setDep(value)}
              >
                <Option value="it">IT</Option>
                <Option value="pcs">PCS</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Store">
              <Select
                placeholder="Select Store"
                value={store}
                onChange={(value) => setStore(value)}
              >
                <Option value="gstore">General Stores</Option>
                <Option value="hstore">Hazmat Stores</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Item Name" required>
              <Select
                placeholder="Select Item"
                value={item}
                onChange={handleItemSelect}
              >
                <Option value="pen">Pen</Option>
                <Option value="paper">Paper</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Available Qty">
              <Input value={availableQty} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Requested Qty" required>
              <Input
                type="number"
                value={requestedQty}
                onChange={(e) => setRequestedQty(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Remarks">
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={addItemToGrid}>
              Add Item
            </Button>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={gridData}
        columns={columns}
        pagination={false}
        style={{ marginTop: 20 }}
      />

      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={handleSave}
        disabled={gridData.length === 0}
      >
        Save
      </Button>

      <h2 style={{ marginTop: 40 }}>Indent Request History</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <DatePicker
            onChange={(date) => setFilterDate(date)}
            style={{ width: "100%" }}
            placeholder="Filter by Date"
          />
        </Col>
        <Col span={8}>
          <Input
            placeholder="Search Item"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredPastOrders}
        columns={pastOrdersColumns}
        pagination={false}
      />
    </div>
  );
}

export default IndentRequest;
