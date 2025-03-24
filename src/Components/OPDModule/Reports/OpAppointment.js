import React, { useState, useEffect } from "react";
import { Table, DatePicker, Input, Select, Button, Space, message } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";

const { RangePicker } = DatePicker;
const { Option } = Select;

const OpAppointment = () => {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    doctorName: "",
    departmentName: "",
  });

  const columns = [
    { title: "UHID", dataIndex: "mrn", key: "mrn" },
    { title: "Name", dataIndex: "patientName", key: "patientName" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Payment Type", dataIndex: "his_Online", key: "paymentType" },
    { title: "Department", dataIndex: "departmentName", key: "departmentName" },
    { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
    { title: "Appointment Booked", dataIndex: "appointmentDate", key: "appointmentDate" },
    { title: "Appointment Time", dataIndex: "appointmentTime", key: "appointmentTime" },
    { title: "Appointment Status", dataIndex: "appointmentStatus", key: "appointmentStatus" },
    { title: "Visit Date", dataIndex: "appBookedDate", key: "appBookedDate" },
  ];

  // Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      if (!filters.fromDate || !filters.toDate) return;
      setLoading(true);

      try {
        console.log("Fetching data with filters:", filters);

        const response = await OPModuleAgent.getAppointmentSearch(filters.fromDate, filters.toDate);

        console.log("API Response data :", response);

        if (Array.isArray(response.data)) {
          setData(response.data);
          // Initial filtering on data load
          const initialFilteredData = filterData(response.data, filters);
          setFilteredData(initialFilteredData);

          // Extract unique doctor and department names
          const uniqueDoctors = [...new Set(response.data.map((item) => item.doctorName))];
          const uniqueDepartments = [...new Set(response.data.map((item) => item.departmentName))];

          setDoctorOptions(uniqueDoctors);
          setDepartmentOptions(uniqueDepartments);
        } else {
          message.error("Invalid data format received.");
          setData([]); // Clear data on error
          setFilteredData([]); // Clear filtered data on error
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error fetching data. Please try again later.");
        setData([]); // Clear data on error
        setFilteredData([]); // Clear filtered data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.fromDate, filters.toDate, filters.search, filters.doctorName, filters.departmentName]);



const handleDateChange = (dates) => {
  if (dates && dates.length === 2) {
    setFilters({
      ...filters,
      fromDate: dates[0].format("YYYY-MM-DD"), // Extract only date
      toDate: dates[1].format("YYYY-MM-DD"),
    });
  } else {
    setFilters({ ...filters, fromDate: null, toDate: null });
    setData([]); // Clear data when date range is cleared
    setFilteredData([]); // Clear filtered data when date range is cleared
    setDoctorOptions([]); // Clear doctor options
    setDepartmentOptions([]); // Clear department options
  }
};


  // Handle Search Input
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleDepartmentChange = (value) => {
    setFilters({ ...filters, departmentName: value });
  
    // Filter doctors who belong to the selected department
    const filteredDoctors = data
      .filter((item) => item.departmentName === value)
      .map((item) => item.doctorName)
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
    setDoctorOptions(filteredDoctors); // Update dropdown options
    setFilters({ ...filters, doctorName: "" }); // Reset doctor selection
  };
  


  // Perform Search Filtering - Moved to a separate function for reusability
  const filterData = (dataToFilter, filterParams) => {
    if (!dataToFilter || dataToFilter.length === 0) return []; // Handle empty data

    let filtered = [...dataToFilter];

    // Date Range filtering is already handled in useEffect, so we don't repeat it here.

    if (filterParams.search) {
      const searchTerm = filterParams.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.mrn && item.mrn.toLowerCase().includes(searchTerm)) ||
       //   (item.patientName && item.patientName.toLowerCase().includes(searchTerm)) ||
          (item.patientName && item.patientName.trim().toLowerCase().includes(searchTerm)) || // Trim applied
          (item.mobileNo && item.mobileNo.toLowerCase().includes(searchTerm))
      );
    }

    if (filterParams.doctorName) {
      filtered = filtered.filter((item) => item.doctorName === filterParams.doctorName);
    }

    if (filterParams.departmentName) {
      filtered = filtered.filter((item) => item.departmentName === filterParams.departmentName);
    }
    return filtered;
  };


  // const handleSearch = () => {
  //   console.log("Applying filters:", filters);
  //   const filtered = filterData(data, filters);
  //   console.log("Filtered data:", filtered);
  //   setFilteredData(filtered);
  // };

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredData.length ? filteredData : data; // Export either filtered or original data
    if (exportData.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OP Appointment Report");
    XLSX.writeFile(wb, `OP_Appointment_Report_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <div>
      <h1>OP Appointment Report</h1>
      <Space style={{ marginBottom: 16 }}>
        <RangePicker onChange={handleDateChange} style={{ width: 250 }} allowClear format="YYYY-MM-DD" />

        <Select showSearch placeholder="Select Department" onChange={handleDepartmentChange} style={{ width: 180 }}>
          {departmentOptions.map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>

        <Select
  showSearch
  placeholder="Select Doctor"
  value={filters.doctorName || undefined} // Ensures placeholder is shown when no selection
  onChange={(value) => setFilters({ ...filters, doctorName: value })}
  style={{ width: 180 }}
  options={doctorOptions.map((name) => ({ label: name, value: name }))}
/>

        <Input
          placeholder="Search by UHID, Name, Mobile No."
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={handleSearchChange}
          style={{ width: 250 }}
        />
       
        {/* <Button type="primary" onClick={handleSearch}>
          Search
        </Button> */}
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="mrn"
        loading={loading}
      />
    </div>
  );
};

export default OpAppointment;