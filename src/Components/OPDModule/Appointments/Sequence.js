import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button, Space, 
  //DatePicker, 
  message, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { DownloadOutlined } from "@ant-design/icons";
import DatePicker from "react-datepicker";

const { Option } = Select;
// const { RangePicker } = DatePicker;

const Sequence = () => {
  const [data, setData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    doctorName: "",
    departmentName: "",
    // fromDate: null,
    // toDate: null,
    fromDate: moment().format("YYYY-MM-DD"),
    toDate:moment().format("YYYY-MM-DD")
 
  });


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const appointmentStatuses = [
    "Available",
    "Blocked",
    "Reschedule",
    "Book Appointment",
    "Cancel Appointment",
  ];

  const columns = [
    { title: "S.No", dataIndex: "sNo", key: "sno" },
    { title: "Department Name", dataIndex: "departmentName", key: "departmentName" },
    { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
    { title: "Name", dataIndex: "patientName", key: "name" },
    { title: "UHID", dataIndex: "mrn", key: "uhid" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Seq No", dataIndex: "sequenceNo", key: "seqNo" },
    { title: "Appointment Date", dataIndex: "appointmentDate", key: "appoitmenttime" },
    { title: "Created Date", dataIndex: "appBookedDate", key: "createdDate" },
    { title: "Created User", dataIndex: "appBookedUserId", key: "createdUser" },
    { title: "Appointment Status", dataIndex: "appointmentStatus", key: "appointmentStatus" },
    { title: "Action", key: "action", render: (_, record) => (<Button type="link" onClick={() => handleModify(record)} disabled={record.appointmentStatus === "Check-In"}>Modify</Button>) },
  ];

  const fetchData = async () => {
    try {
      const { fromDate, toDate, doctorName, departmentName, search } = filters;
      const appointmentResponse = await OPModuleAgent.getAppointmentPatientsearchDetails(fromDate, toDate);

      if (appointmentResponse && appointmentResponse.data) {
        let filteredData = appointmentResponse.data;

        // Apply the department filter
        if (departmentName) {
          filteredData = filteredData.filter(item => item.departmentName === departmentName);
        }

        // Apply the doctor filter
        if (doctorName) {
          filteredData = filteredData.filter(item => item.doctorName === doctorName);
        }

        // Apply the search filter (name, mobile no, or UHID)
        if (search) {
          filteredData = filteredData.filter(item =>
            item.patientName.toLowerCase().includes(search.toLowerCase()) ||
            item.mobileNo.toLowerCase().includes(search.toLowerCase()) ||
            item.mrn.toLowerCase().includes(search.toLowerCase())
          );
        }

        const uniqueDoctors = [...new Set(filteredData.map((item) => item.doctorName))];
        const uniqueDepartments = [...new Set(filteredData.map((item) => item.departmentName))];

        setData(filteredData);
        setDoctors(uniqueDoctors);
        setDepartments(uniqueDepartments);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]); // Fetch data whenever any filter changes

  const [appointmentStatusOptions, setAppointmentStatusOptions] = useState([]);


  const handleModify = (record) => {
    setSelectedRecord(record);

    let filteredStatuses = [];
    switch (record.appointmentStatus) {
      case "Available":
        filteredStatuses = ["Book Appointment", "Blocked"];
        break;
      case "Blocked":
        filteredStatuses = ["Book Appointment", "Available"];
        break;
      case "Cancel":
        filteredStatuses = ["Book Appointment", "Blocked"];
        break;
      case "Confirmed":
        filteredStatuses = ["Reschedule", "Cancel Appointment"];
        break;
      case "Check-In":
        filteredStatuses = appointmentStatuses;
        break;
      default:
        filteredStatuses = appointmentStatuses;
    }

    form.setFieldsValue({
      name: record.patientName,
      department: record.departmentName,
      doctor: record.doctorName,
      seqNo: record.sequenceNo,
      mobile: record.mobileNo,
      appointmentStatus: filteredStatuses[0],
    });

    setAppointmentStatusOptions(filteredStatuses);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const updatedData = form.getFieldsValue();
      const response = await axios.put(`http://your-update-api-url`, { ...selectedRecord, ...updatedData });
      if (response.status === 200) {
        message.success("Details updated successfully.");
        setIsModalVisible(false);
        fetchData(); // Refresh data
      }
    } catch (error) {
      message.error("Error updating details. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  
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

        // Handle date changes and update state with formatted date
  const handleDateChange = (date, field) => {
    setFilters((prev) => ({
      ...prev,
      [field]: moment(date).format("YYYY-MM-DD"), // Convert to correct format
    }));
  };



  return (
    <div>
      <h1 style={{ color: "#3C4B64" }}>Appointment Patient Search</h1>
      <Space style={{ marginBottom: 16 }}>
        {/* <RangePicker
          onChange={(dates) =>
            setFilters({
              ...filters,
              fromDate: dates ? dates[0].format("YYYY-MM-DD") : null,
              toDate: dates ? dates[1].format("YYYY-MM-DD") : null,
            })
          }/> */}

<label>From Date: </label>
      <DatePicker
        selected={moment(filters.fromDate, "YYYY-MM-DD").toDate()} // Convert string to Date object
        onChange={(date) => handleDateChange(date, "fromDate")}
        dateFormat="yyyy-MM-dd"
      />

      <label>To Date: </label>
      <DatePicker
        selected={moment(filters.toDate, "YYYY-MM-DD").toDate()} // Convert string to Date object
        onChange={(date) => handleDateChange(date, "toDate")}
        dateFormat="yyyy-MM-dd"
      />


{/* 

<RangePicker
  value={[
    filters.fromDate ? moment(filters.fromDate) : null,
    filters.toDate ? moment(filters.toDate) : null,
  ]}
  onChange={(dates) =>
    setFilters({
      ...filters,
      fromDate: dates ? dates[0].format("YYYY-MM-DD") : null,
      toDate: dates ? dates[1].format("YYYY-MM-DD") : null,
    })
  }
/> */}


        <Select
          placeholder="Select Department"
          onChange={(value) => setFilters({ ...filters, departmentName: value })}
          style={{ width: 180 }}
          allowClear>
          {departments.map((dept, index) => (
            <Option key={index} value={dept}>{dept}</Option>
          ))}
        </Select>
        <Select
          placeholder="Select Doctor"
          onChange={(value) => setFilters({ ...filters, doctorName: value })}
          style={{ width: 180 }}
          allowClear>
          {doctors.map((doc, index) => (
            <Option key={index} value={doc}>{doc}</Option>
          ))}
        </Select>
        <Input
          placeholder="Search by Name, Mobile No, or UHID"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ width: 250 }}
        />
        <Button type="primary" onClick={fetchData}>
          Search
        </Button>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="sNo"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Modify Appointment Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        // onOk={handleSave}
        >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Patient Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select>
              {departments.map((dept, index) => (
                <Option key={index} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="doctor" label="Doctor Name" rules={[{ required: true }]}>
            <Select>
              {doctors.map((doc, index) => (
                <Option key={index} value={doc}>{doc}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="seqNo" label="Sequence No" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="mobile" label="Mobile No" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="appointmentStatus" label="Appointment Status" rules={[{ required: true }]}>
            <Select>
              {appointmentStatusOptions.map((status, index) => (
                <Option key={index} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sequence;
