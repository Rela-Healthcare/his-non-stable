import React, { useState, useEffect } from "react";
import { Table,Input,Select, Button,Space,DatePicker,message,Modal,Form,} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { OPModuleAgent } from "../../../agent/agent";

const { Option } = Select;
const { RangePicker } = DatePicker;

const WhatsappLogs = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search :"",
    doctorName: "",
    department: "",
    fromDate: null,
    toDate: null,
  });


  const [selectedWhatsappType, setSelectedWhatsappType] = useState(null);

  const handleWhatsappTypeChange = (value) => {
    setSelectedWhatsappType(value);
  };
  
  const filteredData = data.filter((item) =>
    selectedWhatsappType ? item.whatsapptype === selectedWhatsappType : true
  );
  

  const columns = [
    { title: "S.No", dataIndex: "sNo", key: "sno" },
    { title: "Name", dataIndex: "patientName", key: "name" },
    { title: "UHID", dataIndex: "uhid", key: "uhid" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Message Initiated", dataIndex: "message", key: "message" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Whatsapp Content", dataIndex: "whatappcontent", key: "whatappcontent" },
    {title: "Whatsapp Type",dataIndex: "whatsapptype",key: "whatsapptype"},
  ];

  
   const fetchData = async () => {
      try {
        const { fromDate, toDate ,search } = filters;
        const response = await OPModuleAgent.getwhatsapplog(fromDate,toDate);
    
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
      <h1 style={{ color: "#3C4B64" }}>Whatsapp Logs</h1>
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
      placeholder="Search by Mobile No or UHID"
      prefix={<SearchOutlined />}
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })} 
      onPressEnter={fetchData} // Allows pressing Enter to search
      style={{ width: 250 }}
    />
    

        {/* <Select showSearch placeholder="Select Whatsapp Type" onChange={handleselect} style={{ width: 180 }}>
        <Option value="Appointment Scheduled">Appointment Scheduled</Option>
        <Option value="Doctor Confirmation">Doctor Confirmation</Option>
        <Option value="OP Invoice">OP Invoice</Option>
        <Option value="IP Invoice">IP Invoice</Option>
        <Option value="OTC Pharmacy">OTC Pharmacy</Option>
        <Option value="ULTRASOUND">ULTRASOUND</Option>
        <Option value="Doctor Appointment Cancellation">Doctor Appointment Cancellation</Option>
      </Select> */}

              
        <Select
          showSearch
          placeholder="Select Whatsapp Type"
          onChange={handleWhatsappTypeChange}
          style={{ width: 180 }}>
          {[
            "Appointment Cancelled",
            "Appointment Rescheduled",
            "Appointment Scheduled",
            "CT Contrast",
            "DEXA",
            "DoctorAppointmentCancellation",
            "DoctorAppointmentReschedule",
            "DoctorConfirmation",
            "Interim Bill Dtl",
            "MRI Contrast",
            "MRI Plain",
            "OP Invoice",
            "OTC Pharmacy",
            "PatientRegistrationConfirmation",
            "RT",
            "ULTRASOUND"

          ].map((type) => (
            <Option key={type} value={type}>
              {type}
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

export default WhatsappLogs;
