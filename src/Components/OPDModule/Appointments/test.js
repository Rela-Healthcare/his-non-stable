
import React, { useState, useEffect } from "react";
import { Form, Select, Button, Input,Space, Row, Col, Table, Spin, DatePicker, message, Statistic, Card } from "antd";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { useSelector } from "react-redux";
import { Checkbox } from "antd"; 
import { PlusOutlined, DeleteOutlined, EditOutlined, StopOutlined, AppstoreAddOutlined } from "@ant-design/icons";


const { Option } = Select;

const AppMaster = () => {

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [totalSlots, setTotalSlots] = useState(0);
  const [slotGap, setSlotGap] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [tableData, setTableData] = useState([]); 
  const [tableData1, setTableData1] = useState([]); 
  const loginData = useSelector((state) => state.loginInfo.formData);
  const userName = localStorage.getItem("userName");
  const [isDoctorEditable, setIsDoctorEditable] = useState(false); 
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reason, setReason] = useState(""); 

  const disableFromDate = (currentDate) => {
    return currentDate && currentDate.isBefore(moment().startOf("minute"));
  };

  const handleFromDateChange = (date) => {
    form.setFieldsValue({ fromDate: date });
    setFromDate(date);
    if (date) {
      form.setFieldsValue({ toDate: null }); // Clear toDate when fromDate changes

    }
  };


  const disableToDate = (currentDate) => {
  const fromDateVal = form.getFieldValue("fromDate");
  // Allow past dates to be selectable if they are the same as fromDate day
  return (
    currentDate && 
    (currentDate.isBefore(moment().startOf("minute")) || 
    (fromDateVal && currentDate.isBefore(fromDateVal.startOf('day'))) || 
    currentDate.isSame(moment(fromDateVal).startOf('day')) && currentDate.isSame(moment(fromDateVal), 'minute'))
  );
};

const handleToDateChange = (date) => {
  const fromDateValue = form.getFieldValue("fromDate");

  // Case where 'To Date' is cleared
  if (!date) {
    setToDate(null);
    form.setFieldsValue({ toDate: null });
    return;
  }

  // If "To Date" is earlier than "From Date", do not allow it
  if (fromDateValue && date.isBefore(fromDateValue)) {
    message.warning("To Date cannot be earlier than From Date."); // Notify user
    form.setFieldsValue({ toDate: null }); // Reset To Date

    setToDate(null); // Reset internal state as well
    return;
  }

  // If both dates are the same and the time is the same, do not allow it
  if (fromDateValue && date.isSame(fromDateValue, 'day') && date.isSame(fromDateValue, 'minute')) {
    message.warning("To Date cannot be the same time as From Date on the same day."); // Notify user
    form.setFieldsValue({ toDate: null }); // Reset To Date
    setToDate(null); // Reset internal state as well
    return;
  }

  // Valid date selected, update state
  setToDate(date);
  form.setFieldsValue({ toDate: date });
};



const fetchMasterSlotData = async () => {
  // Fetch your data from API
  setLoading(true);
  try {
    const response = await OPModuleAgent.getMasterSlot();
    if (response.status === "success" && response.data) {
      setTableData(response.data);
    } else {
      message.error("Failed to fetch data for the table.");
    }
  } catch (error) {
    message.error("Error fetching data.");
  } finally {
    setLoading(false);
  }
};


const fetchdetailSlotData = async () => {
  // Fetch your data from API
  setLoading(true);
  try {
    const response = await OPModuleAgent.getDetailSlot();
    if (response.status === "success" && response.data) {
      setTableData1(response.data);
    } else {
      message.error("Failed to fetch data for the table.");
    }
  } catch (error) {
    message.error("Error fetching data.");
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  fetchMasterSlotData();
}, []);

const daysOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  useEffect(() => {
    form.setFieldsValue({ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] });
  }, [form]);


  const columns = [
    
    {

      title: 'Session ID',
      dataIndex: 'slot_Session_Id',
      key: "slot_Session_Id",
    },
    
    {

      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    { 
      title: "Doctor Name", 
      dataIndex: "doctorName", 
      key: "doctorName" 
    },
    {
      title: "From date",
      dataIndex: "fromDatetime",
      key: "fromDate",
    },
    {
      title: "To date",
      dataIndex: "toDatetime",
      key: "todate",
    },


    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
        <Button type="link" icon={<EditOutlined />} onClick={() => handleModify(record)} />
      </Space>
      ),
    },
  ];
  

  useEffect(() => {
    fetchdetailSlotData();
  }, []);
  
  const columns1 = [
    {

      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    { 
      title: "Doctor Name", 
      dataIndex: "doctorName", 
      key: "doctorName" 
    },
 
    {
      title: "SlotDate",
      dataIndex: "slotDate",
      key: "slotDate",
    },   
    {
      title: "Type",
      dataIndex: "appointmenttype",
      key: "appointmenttype",
    },
    {
      title: "Seqnbr",
      dataIndex: "seqnbr",
      key: "seqnbr",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space>
    //     <Button type="link" icon={<EditOutlined />} onClick={() => handleModify(record)} />
    //   </Space>
    //   ),
    // },
  ];

  
  const handleDoctorChange = (doctorId) => {
      setSelectedDoctorId(doctorId); 
      form.setFieldsValue({ doctor: doctorId }); 
  };
  
  // Fetch the department list
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await OPModuleAgent.getDepartments(); // Use the agent method
        if (response.status === "success" && response.data) {
          setDepartments(response.data); // Update departments state with fetched data
        } else {
          message.error("No departments found.");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        message.error("Error fetching departments. Please try again.");
      }
    };
  
    fetchDepartments(); 
  }, []);
  

  const fetchDoctors = async (departmentId) => {
    if (departmentId) {
      setLoading(true);
      try {
        const response = await OPModuleAgent.getDoctorListByDepartment(departmentId); 
        if (response.status === "success" && response.data) {
          setDoctors(response.data); 
        } else {
          message.error("No doctors found for this department.");
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        message.error("Error fetching doctor data. Please try again.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    } else {
      setDoctors([]);
    }
  };
  
  // Then in the `useEffect`, you can call `fetchDoctors(departmentId)`
  useEffect(() => {
    fetchDoctors(departmentId);
  }, [departmentId]);
  

  const handleDepartmentChange = (value) => {
    setDepartmentId(value);
    setIsEditMode(false); // Reset edit mode on department change
    form.setFieldsValue({ doctor: undefined });
    setIsDoctorEditable(true);  // Enable doctor field when a department is selected
    fetchDoctors(value); // Fetch doctors based on the selected department
  };
  
  
  // Filtered Data
  const filteredTableData = tableData.filter(item => 
    (!departmentId || item.departmentId === departmentId) && 
    (!selectedDoctorId || item.doctorId === selectedDoctorId)
  );

  const filteredTableData1 = tableData1.filter(item => 
    (!departmentId || item.departmentId === departmentId) && 
    (!selectedDoctorId || item.doctorId === selectedDoctorId)
  );

  const handleCancelEdit = () => {
    setSelectedRecord(null);
    setIsEditMode(false); // Enable Save button
    form.resetFields();
  };
  
  
  const handleModify = (record) => {
    console.log("selected SequenceCount", record.sequenceCount);
    console.log("selected Doctor", record.doctorName);
    console.log("Full Record Data:", record);
  
    const selectedDays = [];
    if (record.sunday) selectedDays.push("Sun");
    if (record.monday) selectedDays.push("Mon");
    if (record.tuesday) selectedDays.push("Tue");
    if (record.wednesday) selectedDays.push("Wed");
    if (record.thursday) selectedDays.push("Thu");
    if (record.friday) selectedDays.push("Fri");
    if (record.saturday) selectedDays.push("Sat");
  
    console.log("Formatted Days:", selectedDays);
    
    setSelectedRecord(record); 
    setIsDoctorEditable(true); // Enable the doctor field when in edit mode
  
    form.setFieldsValue({
      department: record.departmentName,       
      doctor: record.doctorName,
      days: selectedDays,  
      fromDate: moment(record.fromDatetime), 
      toDate: moment(record.toDatetime),   
      maxCapping: record.maxCapping, 
      sequence: record.sequenceCount,
      appointmentType: record.appointmenttype, 
      appointmentStatus: record.appointmentStatus ,
      userName: record.createUser,
      reason:record.reason
    });
  
    // Show the form/modal for editing
    setIsModalVisible(true); 
    setIsEditMode(true);
  };
  

 // Fetch slot gap for the selected doctor
 useEffect(() => {
  const fetchSlotGap = async () => {
    if (selectedDoctorId) {
      try {
        const response = await OPModuleAgent.GetDoctorseqSlotGap(selectedDoctorId);
        if (response.status === "success" && response.data.length > 0) {
          const fetchedSlotGap = response.data[0].mdoc_DoctorseqSlotGap_Nbr;
          setSlotGap(fetchedSlotGap);
          form.setFieldsValue({ maxCapping: fetchedSlotGap });
        } else {
          setSlotGap(0);
          form.setFieldsValue({ maxCapping: 0 });
        }
      } catch (error) {
        console.error("Error fetching slot gap:", error);
        message.error("Error fetching slot gap. Please try again.");
      }
    }
  };

  fetchSlotGap();
}, [selectedDoctorId]);


// useEffect(() => {
//   const fetchAvailableSlots = async () => {
//       console.log("Selected Doctor ID:", selectedDoctorId);
//       console.log("Formatted From Date:", moment(fromDate).format('DD-MMM-YYYY hh:mm A'));
//       console.log("Formatted To Date:", moment(toDate).format('DD-MMM-YYYY hh:mm A'));
//       console.log("From Date:", fromDate ? fromDate.format("YYYY-MM-DD") : "Not Selected");
//       console.log("To Date:", toDate ? toDate.format("YYYY-MM-DD") : "Not Selected");

//       if (selectedDoctorId && fromDate && toDate) {
//           // Ensure you are pulling the correct date values here before API call
//           const formattedFromDate = moment(fromDate).format("YYYY-MM-DD");
//           const formattedToDate = moment(toDate).format("YYYY-MM-DD");

//           console.log("Making API call with:", {
//               DoctorId: selectedDoctorId,
//               FromDate: formattedFromDate,
//               ToDate: formattedToDate
//           });

//           try {
//               const response = await OPModuleAgent.AvailableSlotConsultant(
//                   selectedDoctorId, 
//                   formattedFromDate, 
//                   formattedToDate
//               );

//               console.log("API Response:", response);

//               if (response.status === "success" && response.data && response.data.length > 0) {
//                   setTotalSlots(response.data[0].totalSlot);
//                   console.log("Available Slots:", response.data[0].totalSlot);
//               } else {
//                   message.error("No slots available.");
//                   setTotalSlots(0);
//               }
//           } catch (error) {
//               console.error("Error during API call:", error);
//               message.error("Error fetching available slots. Please try again.");
//           }
//       } else {
//           console.log("Required variables are not set. Waiting for valid selectedDoctorId and dates before fetching slots.");
//       }
//   };
//   // Call function to fetch available slots
//   fetchAvailableSlots();
// }, [selectedDoctorId, fromDate, toDate]);

useEffect(() => {
  const fetchAvailableSlots = async () => {
      const logSelectedDoctorId = selectedDoctorId;
      const logFromDate = fromDate ? fromDate.format("YYYY-MM-DD") : "Not Selected"; // From Date
      const logToDate = toDate ? toDate.format("YYYY-MM-DD") : "Not Selected"; // To Date

      console.log("Selected Doctor ID:", logSelectedDoctorId);
      console.log("From Date:", logFromDate);
      console.log("To Date:", logToDate);

      // Validate all required fields
      if (logSelectedDoctorId && fromDate && toDate) {
          try {
              // Format dates for the API
              const formattedFromDate = fromDate.format("YYYY-MM-DD");
              const formattedToDate = toDate.format("YYYY-MM-DD");

              // Log API call data
              console.log("Making API call with:", {
                  DoctorId: logSelectedDoctorId,
                  FromDate: formattedFromDate,
                  ToDate: formattedToDate
              });

              // API call
              const response = await OPModuleAgent.AvailableSlotConsultant(
                  logSelectedDoctorId, 
                  formattedFromDate, 
                  formattedToDate
              );

              console.log("API Response:", response);

              if (response.status === "success" && response.data && response.data.length > 0) {
                  setTotalSlots(response.data[0].totalSlot);
                  console.log("Available Slots:", response.data[0].totalSlot);
              } else {
                  message.error("No slots available.");
                  setTotalSlots(0);
              }
          } catch (error) {
              console.error("Error during API call:", error);
              message.error("Error fetching available slots. Please try again.");
          }
      } else {
          console.log("Required variables are not set. Waiting for valid selectedDoctorId and dates before fetching slots.");
      }
  };

  fetchAvailableSlots();
}, [selectedDoctorId, fromDate, toDate]);


  const handleDelete = async () => {
    if (!selectedRecord) {
      message.error("No record selected for deletion.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (!confirmed) {
      return; 
    }
    try {
      setLoading(true);
      // Constructing the delete payload
      const deletePayload = {
        Slot_Session_Id: selectedRecord.slot_Session_Id,
        FromDatetime: selectedRecord.fromDatetime,  
        ToDatetime:toDate ? toDate.format("YYYY-MM-DD HH:mm A") : selectedRecord.toDatetime,
      };
      console.log("Delete Payload:", deletePayload); // Log the payload to debug
      console.log("Selected Record:", selectedRecord);
      // Calling the delete function
      const response = await OPModuleAgent.deleteDetailslotDatewise(deletePayload);
      // Checking the response
      if (response.status === "success" && response.data.msgDesc === "Row Deleted Successfully") {
        message.success("Slot deleted successfully.");
        fetchMasterSlotData();
        setSelectedRecord(null); 
      } else {
        message.error(`Failed to delete record: ${response.data}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      message.error("Error deleting the record. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  const handleUpdate = async () => {
    if (!selectedRecord) {
      message.error("No record selected for updating.");
      return;
    }
  
    const confirmed = window.confirm("Are you sure you want to update this record?");
    if (!confirmed) {
      return;
    }
  
    try {
      setLoading(true);
  
      const updatedPayload = {
        SessionId: selectedRecord.slot_Session_Id,
        FromDate: fromDate ? fromDate.format("YYYY-MM-DD HH:mm:ss") : selectedRecord.fromDatetime,
        ToDate: toDate ? toDate.format("YYYY-MM-DD HH:mm:ss") : selectedRecord.toDatetime,
        CreateUser: userName,
      };
  
      console.log("Update Payload:", updatedPayload);
  
      const response = await OPModuleAgent.updatedetailslot(updatedPayload);
  
      if (response.data?.msgDesc?.toLowerCase().includes("updated")) {
        message.success("Slot updated successfully.");
        fetchMasterSlotData();
        setSelectedRecord(null);
    } else {
        message.error(`Failed to update record: ${JSON.stringify(response.data)}`);
    }
    } catch (error) {
      console.error("Error updating record:", error);
      message.error("Error updating the record. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    
  

const handleSubmit = async (values) => {
    // Validate inputs
    if (!selectedDoctorId || !fromDate || !toDate) {
      message.error('Please make sure to select a doctor and valid date range.');
      return;
    }
    // Check if From Date and To Date are the same and have the same time
    if (fromDate.isSame(toDate, 'minute')) { // 'minute' will check the time as well
      message.error('You cannot book a slot for the same time.');
      return;
    }
    const sequenceCount = parseInt(values.sequence) || 0;
    // Ensure valid sequence count
    if (isNaN(sequenceCount) || sequenceCount <= 0) {
      message.error('Please enter a valid sequence count greater than 0.');
      return;
    }
    try {
      setLoading(true);

     // Retrieve and define department and doctor names based on column structure
     const selectedDepartment = departments.find(dept => dept.columnCode === departmentId);
     const selectedDoctor = doctors.find(doc => doc.columnCode === selectedDoctorId);

     if (!selectedDepartment || !selectedDoctor) {
         message.error('Invalid department or doctor selection.');
         return;
     }


      const headerPayload = {
        Slot_Session_Id: 0,
        Doc_DepartmentId: selectedDepartment.columnCode, 
        DepartmentName: selectedDepartment.columnName,
        Doc_DoctorId:selectedDoctor.columnCode,
        DoctorName: selectedDoctor.columnName,
        FromDatetime: fromDate.format('DD-MMM-YYYY hh:mm A'),
        ToDatetime: toDate.format('DD-MMM-YYYY hh:mm A'),
        MaxCapping: slotGap,
        SequenceCount: sequenceCount,
        Sunday: form.getFieldValue("days")?.includes("Sun") || false,
        Monday: form.getFieldValue("days")?.includes("Mon") || false,
        Tuesday: form.getFieldValue("days")?.includes("Tue") || false,
        Wednesday: form.getFieldValue("days")?.includes("Wed") || false,
        Thursday: form.getFieldValue("days")?.includes("Thu") || false,
        Friday: form.getFieldValue("days")?.includes("Fri") || false,
        Saturday: form.getFieldValue("days")?.includes("Sat") || false,
        Slot_CreatedBy_id: userName,
        Slot_LastModifiedBy_id: userName,
        Reason: form.getFieldValue("reason"),
        Appointmenttype: form.getFieldValue("appointmentType") || "",
        AppointmentStatus: parseInt(form.getFieldValue("appointmentStatus")) || 0,
      };  
      console.log("Header Payload:", headerPayload);
      // Call the header API to get session ID
      const headerResponse = await OPModuleAgent.SaveMasterHeader(headerPayload);
      console.log('Header Response:', headerResponse);
      // Check the header response
      if (!headerResponse || !headerResponse.data || !headerResponse.data.slot_Session_Id) {
        console.error('Header response not valid:', headerResponse);
        message.error('Failed to create appointment header. Please check the input.');
        return;
      }
      const sessionId = headerResponse.data.slot_Session_Id; // Correct retrieval of session ID
      console.log('Session ID:', sessionId);
      // Prepare detail payload for SaveAppointmentMaster
      const ordersItems = [];
      const startDate = moment(headerPayload.FromDatetime, 'DD-MMM-YYYY hh:mm A');
      const endDate = moment(headerPayload.ToDatetime, 'DD-MMM-YYYY hh:mm A');
      // Calculate the number of days between the dates
      const totalDays = endDate.diff(startDate, 'days') + 1; 
      // Generate slots for each day in the range
      for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
        const currentDate = startDate.clone().add(dayOffset, 'days');
  
        const fromTime = currentDate.clone().set({
          hour: fromDate.hour(),
          minute: fromDate.minute(),
        });
        const toTime = currentDate.clone().set({
          hour: toDate.hour(),
          minute: toDate.minute(),
        });
        const totalDurationMinutes = toTime.diff(fromTime, 'minutes');
        const slotDurationMinutes = Math.floor(totalDurationMinutes / sequenceCount);

        for (let slotIndex = 0; slotIndex < sequenceCount; slotIndex++) {
          const slotTime = fromTime.clone().add(slotIndex * slotDurationMinutes, 'minutes');
  
          // Push the slot into ordersItems
          ordersItems.push({
            SlotDate: slotTime.format('DD-MMM-YYYY hh:mm A'),
            SlotStart: slotIndex + 1,
          });
        }
      }
  
      const masterDetailPayload = {
        SessionId: sessionId,
        DepartmentId: selectedDepartment.columnCode, 
        DepartmentName: selectedDepartment.columnName,
        DoctorId: selectedDoctor.columnCode,
        DoctorName: selectedDoctor.columnName,
        MaxCapping: slotGap,
        Seqnbr: sequenceCount,
        Sunday: form.getFieldValue("days")?.includes("Sun") || false,
        Monday: form.getFieldValue("days")?.includes("Mon") || false,
        Tuesday: form.getFieldValue("days")?.includes("Tue") || false,
        Wednesday: form.getFieldValue("days")?.includes("Wed") || false,
        Thursday: form.getFieldValue("days")?.includes("Thu") || false,
        Friday: form.getFieldValue("days")?.includes("Fri") || false,
        Saturday: form.getFieldValue("days")?.includes("Sat") || false,
        CreateUser: userName,
        Reason: form.getFieldValue("reason"),
        Appointmenttype: "", 
        AppointmentStatus: "",
        PubHolidayId: 0, 
        AppointmentId: 0, 
        Orders_items: ordersItems, 
      };
  
      // Log the updated master detail payload for debugging
      console.log("Master Detail Payload:", masterDetailPayload);
  
      // Call the detail API to save appointment
      const detailResponse = await OPModuleAgent.SaveAppointmentMaster(masterDetailPayload);
      console.log('Detail Response:', detailResponse);
  
      // Check the response to determine if the appointment was saved successfully
      if (!detailResponse || !detailResponse.data || !detailResponse.data.success) {
        const errorMessage = detailResponse?.data?.message || 'Unknown error';
        console.error(`Failed to save appointment slots: ${errorMessage}`);
        message.error(`Failed to save appointment slots: ${errorMessage}`);
        return; 
      }
  
      // Display success message if the appointment was saved successfully
      message.success('Slot saved successfully.');
  
    } catch (error) {
      console.error('Error saving details:', error);
      message.error('Error saving details. Please try again.');
    } finally {
      setLoading(false);
    }
  };


 
//   return (
//     <div>
//       <h1 style={{ color: "#3C4B64" }}>Appointment Master</h1>
//       <Form form={form} layout="vertical" onFinish={handleSubmit} >
//         <Row gutter={16}>
//           <Col span={6}>
//             <Form.Item
//               name="department"
//               label="Department"
//               rules={[{ required: true, message: "Please select a department" }]}>
//               <Select
//                 placeholder="Select Department"
//                 style={{ width: "100%" }}
//                 onChange={handleDepartmentChange}
               
//                 showSearch
//                 filterOption={(input,option)=>
//                   option.children.toLowerCase().includes(input.toLowerCase())
//                 } 

//                 disabled={isEditMode}>
//                 {departments.map((department) => (
//                   <Option key={department.columnCode} value={department.columnCode}>
//                     {department.columnName}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>


//           <Col span={6}>
//             <Form.Item
//               name="doctor"
//               label="Doctor"
//               rules={[{ required: true, message: "Please select a doctor" }]}>
//               <Spin spinning={loading} tip="Loading doctors...">
//                 <Select
//                   placeholder="Select Doctor"             
//                   style={{ width: "100%" }}
//                   onChange={handleDoctorChange}
//                   value={form.getFieldValue("doctor")}
//                   disabled={!isDoctorEditable} 
//                   showSearch
//                   filterOption={(input,option)=>
//                   option.children.toLowerCase().includes(input.toLowerCase())

//                   }
//                   >
//                   {doctors.map((doctor) => (
//                     <Option key={doctor.columnCode} value={doctor.columnCode}>
//                       {doctor.columnName}
//                     </Option>
//                   ))}
//                 </Select>
//               </Spin>
//             </Form.Item>
//           </Col>
//           <Col span={6}>
//               <Table
//                 dataSource={tableData}
//                 columns={columns}
//                 rowKey={record => record.slot_Session_Id} />
//             </Col>
//           </Row>
       
 
// <Row>   
//         <Col span={4}>
//           <Form.Item
//             name="fromDate"
//             label="From Date & Time"
//             rules={[{ required: true, message: "Please select From Date & Time" }]}
//           >
//             <DatePicker
//                 showTime={{
//                   use12Hours: true,
//                   format: "hh:mm A",
//                 }}
//               format="DD-MM-YYYY hh:mm A" 
//               style={{ width: "100%" }}
//               onChange={handleFromDateChange}
//               disabledDate={disableFromDate}
//             />
//           </Form.Item>
//         </Col>

//         <Col span={4}>
//           <Form.Item
//             name="toDate"
//             label="To Date & Time"
//             rules={[{ required: true, message: "Please select To Date & Time" }]}>
//             <DatePicker
//                 showTime={{
//                   use12Hours: true,
//                   format: "hh:mm A",
//                 }}
//               format="DD-MM-YYYY hh:mm A" 
//               style={{ width: "100%" }}
//               onChange={handleToDateChange}
//               disabledDate={disableToDate}/>
//           </Form.Item>
//         </Col>

//         {error && <Col span={20}><div style={{ color: "red" }}>{error}</div></Col>}
//           <Col span={10}>
//             <Form.Item
//               name="days"
//               label="Days"
//               rules={[{ required: true, message: "Please select at least one day" }]}>
//               <Checkbox.Group>
//                 <Row justify="start">
//                   {daysOptions.map((day) => (
//                     <Col span={25} key={day} style={{ marginLeft: 20 }}>
//                       <Checkbox
//                         value={day}              
//                         checked={form.getFieldValue("days")?.includes(day)} >
//                         {day}
//                       </Checkbox>
              
//                     </Col>
//                   ))}
//                 </Row>
//               </Checkbox.Group>
//             </Form.Item>
//           </Col>

//           <Col span={30}>
//     <Form.Item
//       style={{marginBottom: 0,}}>
              
//           <Card
//             style={{
//               border: "1px solid #d9d9d9", 
//               borderRadius: 10, 
//               padding: "8px", 
//               width: "200px", 
//               height: "auto", 
//               textAlign: "center", 
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
//             }}
//           >
//             <Statistic
//               value={totalSlots}
//               valueStyle={{
//                 fontSize: '14px', 
//                 fontWeight: "bold", 
//                 color: totalSlots === 0 ? 'red' : '#3f8600',
//               }}
//               prefix="Available: "
//               suffix=" slots"
//             />
//           </Card>
//               </Form.Item>
//             </Col>
//         </Row>


//        <Row  gutter={16}>
//           <Col span={4}>
//             <Form.Item name="sequence" label="Sequence Count"
//                rules={[{ required: true}]}>       
//               <Input type="number" placeholder="Enter Sequence" />
//             </Form.Item>
//           </Col>

//           <Col span={4}>
//             <Form.Item name="maxCapping" label="Max Capping"
//               rules={[{ required: true }]}>
//               <Input type="number" placeholder="Enter Max Capping" defaultValue={slotGap} readOnly />
//             </Form.Item>
//           </Col>

          
//           <Col span={4}>
//         <Form.Item 
//           name="reason" 
//           label="Reason"
//           rules={[{ required: true, message: "Please enter a reason" }]}
//         >
//           <Input type="text" placeholder="Enter the Reason" defaultValue={form.getFieldValue("reason")} />
//         </Form.Item>
//       </Col>


//           {/* <Col span={4}>
//           <Form.Item
//             name="appointmentType"
//             label="Appointment Type"
//             rules={[{ required: true, message: "Please select a Appointment Type" }]}>
//             <Select
//               placeholder="Select Appointment Type"
//               style={{ width: "100%" }}
//               onChange={(value) => console.log(value)}>
//               <Option value="Walk-in">Walk-in</Option>
//               <Option value="Video Consultation">Video Consultation</Option>
//               <Option value="Direct">Direct</Option>
//             </Select>
//           </Form.Item>
//         </Col> */}
//         </Row>
//         <Form.Item style={{ textAlign: "center" }}>
//           <Space size="middle">
//             <Button type="primary" htmlType="submit" style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}>
//               Save
//             </Button>
//             <Button type="default"   disabled={!selectedRecord} onClick={handleUpdate}>Update</Button>     
//             <Button type="default"   onClick={handleDelete} disabled={!selectedRecord} >Delete</Button>       
//           </Space>
//         </Form.Item>
//       </Form>

  
// <Table
//         dataSource={tableData1}
//         columns={columns1}
//         rowKey={record => record.slot_Session_Id} />
     
    
//     </div>
//   );
// };

// export default AppMaster;

return (
  <div >
    <Card title="Appointment Master" bordered={false} style={{ backgroundColor: "#f8f9fa" }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          {/* Left column for the form */}
          <Col span={12}>
            <Row gutter={16}>
              <Col span={12}>
              <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please select a department" }]}>
              <Select
                placeholder="Select Department"
                style={{ width: "100%" }}
                onChange={handleDepartmentChange}     
                showSearch
                filterOption={(input,option)=>
                  option.children.toLowerCase().includes(input.toLowerCase())
                } 

                disabled={isEditMode}>
                {departments.map((department) => (
                  <Option key={department.columnCode} value={department.columnCode}>
                    {department.columnName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
              </Col>

              <Col span={12}>
              <Form.Item
              name="doctor"
              label="Doctor"
              rules={[{ required: true, message: "Please select a doctor" }]}>
              <Spin spinning={loading} tip="Loading doctors...">
                <Select
                  placeholder="Select Doctor"             
                  style={{ width: "100%" }}
                  onChange={handleDoctorChange}
                  value={form.getFieldValue("doctor")}
                  disabled={!isDoctorEditable} 
                  showSearch
                  filterOption={(input,option)=>
                  option.children.toLowerCase().includes(input.toLowerCase())

                  }
                  >
                  {doctors.map((doctor) => (
                    <Option key={doctor.columnCode} value={doctor.columnCode}>
                      {doctor.columnName}
                    </Option>
                  ))}
                </Select>
              </Spin>
            </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="fromDate" label="From Date & Time" rules={[{ required: true, message: "Please select From Date & Time" }]}>
                  <DatePicker
                    showTime={{ use12Hours: true, format: "hh:mm A" }}
                    format="DD-MM-YYYY hh:mm A"
                    style={{ width: "100%" }}
                    onChange={handleFromDateChange}
                    disabledDate={disableFromDate}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="toDate" label="To Date & Time" rules={[{ required: true, message: "Please select To Date & Time" }]}>
                  <DatePicker
                    showTime={{ use12Hours: true, format: "hh:mm A" }}
                    format="DD-MM-YYYY hh:mm A"
                    style={{ width: "100%" }}
                    onChange={handleToDateChange}
                    disabledDate={disableToDate}
                  />
                </Form.Item>
              </Col>

              {error && <Col span={20}><div style={{ color: "red" }}>{error}</div></Col>}
          <Col span={30}>
            <Form.Item
              name="days"
              label="Days"
              rules={[{ required: true, message: "Please select at least one day" }]}>
              <Checkbox.Group>
                <Row justify="start">
                  {daysOptions.map((day) => (
                    <Col span={25} key={day} style={{ marginLeft: 20 }}>
                      <Checkbox
                        value={day}              
                        checked={form.getFieldValue("days")?.includes(day)} >
                        {day}
                      </Checkbox>
              
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>

          {/* <Col span={45}>
    <Form.Item
      style={{marginBottom: 0,}}>
              
          <Card
            style={{
              border: "1px solid #d9d9d9", 
              borderRadius: 10, 
              padding: "8px", 
              width: "150px", 
              height: "auto", 
              textAlign: "center", 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
            }}
          >
            <Statistic
              value={totalSlots}
              valueStyle={{
                fontSize: '14px', 
                fontWeight: "bold", 
                color: totalSlots === 0 ? 'red' : '#3f8600',
              }}
              prefix="Available: "
              suffix=" slots"
            />
          </Card>
              </Form.Item>
            </Col> */}
        </Row>


       <Row  gutter={16}>
          <Col span={6}>
            <Form.Item name="sequence" label="Sequence Count"
               rules={[{ required: true}]}>       
              <Input type="number" placeholder="Enter Sequence" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="maxCapping" label="Max Capping"
              rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter Max Capping" defaultValue={slotGap} readOnly />
            </Form.Item>
          </Col>

          
          <Col span={6}>
        <Form.Item 
          name="reason" 
          label="Reason"
          rules={[{ required: true, message: "Please enter a reason" }]}
        >
          <Input type="text" placeholder="Enter the Reason" defaultValue={form.getFieldValue("reason")} />
        </Form.Item>
      </Col>


            </Row>



            {/* Continue with the rest of the form fields in a similar grid layout */}

            <Form.Item style={{ textAlign: "center" }}>
              <Space size="middle">
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} disabled={isEditMode}>Save</Button>
                <Button type="default" disabled={!selectedRecord} onClick={handleUpdate} icon={<EditOutlined />}>Update Time</Button>
                <Button type="default" onClick={handleDelete} disabled={!selectedRecord} icon={<DeleteOutlined />}>Delete</Button>
                <Button type="default" disabled={!selectedRecord}  icon={<StopOutlined/>}>Block</Button>
                <Button type="default"  disabled={!selectedRecord} icon={<AppstoreAddOutlined/>}>Addition</Button>
              </Space>
            </Form.Item>
          </Col>

          {/* Right column for session details table */}
          <Col span={12}>
            <h3 style={{ marginBottom: 10 }}>Session Details</h3>
            <Table dataSource={tableData} columns={columns} rowKey={record => record.slot_Session_Id} />
          </Col>
        </Row>
      </Form>
    </Card>

    {/* The second table */}
    <h3 style={{ marginBottom: 10 }}>Appointment Details</h3>
    <Table dataSource={tableData1} columns={columns1} rowKey={(record) => record.slot_Session_Id} style={{ marginTop: "20px" }} />
  </div>
);

}
 export default AppMaster;
