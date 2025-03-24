
import React, { useState, useEffect } from "react";
import { Form, Select, Button, Input,Space, Row, Col, Table, Spin, DatePicker, message, Statistic, Card } from "antd";
import moment from "moment";
import { OPModuleAgent } from "../../../agent/agent";
import { useSelector } from "react-redux";
import { Checkbox ,Switch} from "antd"; 
import { PlusOutlined, CheckCircleOutlined,DeleteOutlined, EditOutlined, StopOutlined, AppstoreAddOutlined } from "@ant-design/icons";


const { Option } = Select;

const AppMaster = () => {

  const [departmentId, setDepartmentId] = useState(null);
  const [error, setError] = useState('');
  const [slotGap, setSlotGap] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); 
  const loginData = useSelector((state) => state.loginInfo.formData);
  const userName = localStorage.getItem("userName");
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDoctorEditable, setIsDoctorEditable] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [reason, setReason] = useState(""); 
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentName, setDepartmentName] = useState(null);
  const [doctorName, setDoctorName] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [form] = Form.useForm();
  const [sequenceCount, setSequenceCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([])
  const [isBlockEnabled, setIsBlockEnabled] = useState(false);  
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [manualSelectionValid, setManualSelectionValid] = useState(false);
  // Define separate state variables
  const [allowSequenceEdit, setAllowSequenceEdit] = useState(true); // Initially enabled
  
  
    const [filterFromDate, setFilterFromDate] = useState(''); // Separate state for date filtering
    const [filterToDate, setFilterToDate] = useState('');   // Separate state for date filtering
  

  const handleFromDateChange = (date) => {
    form.setFieldsValue({ fromDate: date });
    setFromDate(date);
    setFilterFromDate(date);  // date filter
    if (date) {
      form.setFieldsValue({ toDate: null }); // Clear toDate when fromDate changes

    }
  };

  
  const disableFromDate = (currentDate) => {
    return currentDate && currentDate.isBefore(moment().startOf("minute"));
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
  setFilterToDate(date);  // date filter
  form.setFieldsValue({ toDate: date });
};


  // Function to update SeqFrom and SeqTo in the form
  const updateFormFields = (selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      const selectedSeqNumbers = selectedRowKeys.map(key => {
        const parts = key.split("-");
        return parseInt(parts[0]); // Extract seqnbr
      });
  
      const minSeq = Math.min(...selectedSeqNumbers);
      const maxSeq = Math.max(...selectedSeqNumbers);
  
      form.setFieldsValue({ SeqFrom: minSeq, SeqTo: maxSeq });
    } else {
      form.setFieldsValue({ SeqFrom: "", SeqTo: "" });
    }
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
  fetchdetailSlotData();
}, []);



useEffect(() => {
  fetchMasterSlotData();
}, []);

  // Fetch departments on mount
 
   useEffect(() => {
     const fetchDepartments = async () => {
       try {
         const response = await OPModuleAgent.getDepartments();
         if (response.status === "success" && response.data) {
           setDepartments(response.data);
         } else {
           message.error("No departments found.");
         }
       } catch (error) {
         message.error("Error fetching departments.");
       }
     };
     fetchDepartments();
   }, []);
  
   
   
     const fetchDoctors = async (departmentId, savedDoctorName = null) => {
       if (!departmentId) {
         setDoctors([]);
         return;
       }
     
       setLoading(true);
       try {
         const response = await OPModuleAgent.getDoctorListByDepartment(departmentId);
         if (response.status === "success" && response.data) {
           setDoctors(response.data);
           console.log("Fetched doctors:", response.data); // Log the fetched doctors
           // Set the doctor name in the form after fetching doctors
           if (savedDoctorName) {
             setDoctorName(savedDoctorName); // Update the doctorName state
             form.setFieldsValue({ doctor: savedDoctorName }); // Set doctor in form
           }
         } else {
           setDoctors([]);
           message.error("No doctors found for this department.");
         }
       } catch (error) {
         setDoctors([]);
         message.error("Error fetching doctor data.");
       } finally {
         setLoading(false);
       }
     };
     

const filteredTableData = tableData.filter(item =>
  (!departmentName || item.departmentName === departmentName) &&
  (!doctorName || item.doctorName === doctorName)
);


// Helper function to parse the date and time string
const parseSlotDate = (slotDateString) => {
  const [datePart, timePart, period] = slotDateString.split(' ');  
  const [day, month, year] = datePart.split('-');  
  let [hours, minutes] = timePart.split(':');  
  hours = parseInt(hours, 10);

  // Correctly convert 12-hour format to 24-hour format
  if (period === 'PM' && hours !== 12) {
      hours += 12;  
  } else if (period === 'AM' && hours === 12) {
      hours = 0;  
  }

  // Create ISO-compatible date string
  const formattedDateString = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${minutes}:00`;
  return new Date(formattedDateString);
};


// Correct and Efficient Date Filtering.  Using the separate state variables
const filteredTableData1 = tableData1.filter(item => {
  const slotDate = parseSlotDate(item.slotDate);  
  const fromDateInput = filterFromDate ? new Date(filterFromDate) : null;
  const toDateInput = filterToDate ? new Date(filterToDate) : null;

  // Ensure `toDateInput` covers the whole end day
  if (toDateInput) {
    toDateInput.setHours(23, 59, 59, 999);  // Extend to end of the day
  }

  return (!fromDateInput || slotDate >= fromDateInput) &&
         (!toDateInput || slotDate <= toDateInput);
});



const daysOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  useEffect(() => {
    form.setFieldsValue({ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] });
  }, [form]);

 // Define columns for master table
 const columns = [
     { title: "Session ID", dataIndex: "slot_Session_Id", key: "slot_Session_Id" },
     { title: "Department Name", dataIndex: "departmentName", key: "departmentName" },
     { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
     { title: "From Date", dataIndex: "fromDatetime", key: "fromDatetime" },
     { title: "To Date", dataIndex: "toDatetime", key: "toDatetime" },
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



// Function to handle "Select All" checkbox
const handleOverallSelect = (e) => {
  const isChecked = e.target.checked;
  const allRowKeys = new Set(
    isChecked
      ? filteredTableData1.map(item => `${item.seqnbr}-${item.slotDate}-${item.departmentName}`)
      : []
  );
  setSelectedRows(Array.from(allRowKeys));
  updateFormFields(Array.from(allRowKeys));
};


const columns1 = [
  { title: "Department Name", dataIndex: "departmentName", key: "departmentName" },
  { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
  { title: "Slot Date", dataIndex: "slotDate", key: "slotDate" },
  { title: "Type", dataIndex: "appointmenttype", key: "appointmenttype" },
  { title: "Seqnbr", dataIndex: "seqnbr", key: "seqnbr" },
  { title: "Reason", dataIndex: "reason", key: "reason" },
  { 
      title: "AppointmentStatus", 
      dataIndex: "blockedStatus",  
      key: "blockedStatus",
      render: (text) => (
          <span style={{ color: text === "Blocked" ? "red" : "green", fontWeight: "bold" }}>
              {text}
          </span>
      )
  },
  {
    title: (
      <Checkbox
        onChange={handleOverallSelect}
        checked={selectedRows.length === filteredTableData1.length && filteredTableData1.length > 0}
        indeterminate={selectedRows.length > 0 && selectedRows.length < filteredTableData1.length}
      />
    ),
      key: "select",
      render: (_, record) => {
        const rowKey = `${record.seqnbr}-${record.slotDate}-${record.departmentName}`;
          return (
           <Checkbox
                     checked={selectedRows.includes(rowKey)}
                     onChange={(e) => handleCheckboxChange(e, record)}
                   />
          );
      },
  }
];



  const fetchTableData = async () => {
    setLoading(true);
    try {
      const masterResponse = await OPModuleAgent.getMasterSlot();
      setTableData(masterResponse.data);
      const detailResponse = await OPModuleAgent.getDetailSlot();
      setTableData1(detailResponse.data);
    } catch (error) {
      message.error("Error fetching table data");
    } finally {
      setLoading(false);
    }
  };
  
  // Call fetchTableData inside useEffect
  useEffect(() => {
    fetchTableData();
  }, []);
  



const allBlocked = selectedRows.every(seq => {
  const slot = tableData1.find(record => record.seqnbr === seq);
  return slot?.blockedStatus === "Blocked";
});

const allUnblocked = selectedRows.every(seq => {
  const slot = tableData1.find(record => record.seqnbr === seq);
  return slot?.blockedStatus === "Unblocked";
});


// Function to update form values when a checkbox is selected
useEffect(() => {
  if (selectedRecord) {
      form.setFieldsValue({
          SeqFrom: selectedRecord?.seqnbr || "",  
          SeqTo: selectedRecord?.seqnbr || "",
      });
       setFilterFromDate(moment(selectedRecord.fromDatetime).toDate());
       setFilterToDate(moment(selectedRecord.toDatetime).toDate());
  }
}, [selectedRecord, form]);

// CheckboxChanges 

const handleCheckboxChange = (e, record) => {
  if (useManualEntry) return; // Prevent checkbox selection in manual mode

  const { checked } = e.target;
  let updatedSelections = [...selectedRows];

  // Create a unique key using seqnbr, slotDate, and departmentName
  const rowKey = `${record.seqnbr}-${record.slotDate}-${record.departmentName}`;

  if (checked) {
    // Add only if it doesn't exist
    if (!updatedSelections.includes(rowKey)) {
      updatedSelections.push(rowKey);
    }
  } else {
    // Remove only if it exists
    updatedSelections = updatedSelections.filter(seq => seq !== rowKey);
  }

  setSelectedRows(updatedSelections); // This updates the state, but is async!

  // Log updated selection to debug
  console.log("Updated Selected Rows:", updatedSelections);

  // Extract seqnbr values and update form fields
  const seqNumbers = updatedSelections.map(k => parseInt(k.split('-')[0]));

  if (seqNumbers.length > 0) {
    const minSeq = Math.min(...seqNumbers);
    const maxSeq = Math.max(...seqNumbers);
    form.setFieldsValue({ SeqFrom: minSeq, SeqTo: maxSeq });
  } else {
    form.setFieldsValue({ SeqFrom: "", SeqTo: "" });
  }
};

// BlockStatus

const getBlockStatus = () => {
  if (!selectedRows.length) return null;

  const selectedSlots = selectedRows
    .map(seq => tableData1.find(record =>
        `${record.seqnbr}-${record.slotDate}-${record.departmentName}` === seq
    ))
    .filter(slot => slot !== undefined);

  console.log("Slots to Process:", selectedSlots);

  const allBlocked = selectedSlots.every(slot => slot.blockedStatus === "Blocked");
  const allUnblocked = selectedSlots.every(slot => slot.blockedStatus === "Unblocked");

  if (allBlocked) return "Unblock"; // Action to take if all selected are blocked
  if (allUnblocked) return "Block";  // Action to take if all selected are unblocked

  return "Mixed"; // If there's a mix of blocked and unblocked
};


// Block and Unblock

const handleBlockUnblock = async () => {
  const seqFrom = form.getFieldValue("SeqFrom");
  const seqTo = form.getFieldValue("SeqTo");
  const selectedDate = form.getFieldValue("slotDate"); // Get slotDate input from form

  let selectedSlots = [];

  // Case 1: Manual Entry (Use seqFrom and seqTo)
  if (useManualEntry && seqFrom && seqTo) {
    selectedSlots = tableData1.filter(record => 
      record.seqnbr >= parseInt(seqFrom) &&
       record.seqnbr <= parseInt(seqTo) &&
       record.slotDate === selectedDate // Ensure it matches the slot date entered
    );
  } 
  // Case 2: Using Selected Rows (Checkbox Selection)
  else if (selectedRows.length > 0) {
    selectedSlots = tableData1.filter(record => 
      selectedRows.some(key => 
        `${record.seqnbr}-${record.slotDate}-${record.departmentName}` === key
      )
    );
  }

  // Debugging: Log selected slots before proceeding
  console.log("Selected Slots:", selectedSlots);

  if (selectedSlots.length === 0) {
    console.log("No valid slots found:", { selectedRows, seqFrom, seqTo });
    message.error("Please select at least one slot or enter SeqFrom and SeqTo.");
    return;
  }

  // Determine if blocking or unblocking
  const isBlocking = selectedSlots.some(record => record.blockedStatus === "Unblocked");
  const isUnblocking = selectedSlots.every(record => record.blockedStatus === "Blocked");
  
  console.log("Blocking:", isBlocking, "Unblocking:", isUnblocking);

// Ensure we proceed only if blocking/unblocking is valid
if (!isBlocking && !isUnblocking) {
  console.error("No valid blocking/unblocking action detected.");
  message.error("Error: Slot status is unclear. Please check slot details.");
  return;
}

  const confirmed = window.confirm(
    `Are you sure you want to ${isBlocking ? "block" : "unblock"} these slots?`
  );
  if (!confirmed) return;

  setLoading(true);

  try {
   
    
    // Convert to required format
    const firstSlot = selectedSlots[0];
    const lastSlot = selectedSlots[selectedSlots.length - 1];

    // Debugging: Log the final payload
    const payload = {
      SessionId: firstSlot?.slot_Session_Id || null,
      FromDate: firstSlot?.slotDate ? moment(firstSlot.slotDate, "DD-MM-YYYY hh:mm A").format("YYYY-MM-DD HH:mm:ss") : null,
      ToDate: lastSlot?.slotDate ? moment(lastSlot.slotDate, "DD-MM-YYYY hh:mm A").format("YYYY-MM-DD HH:mm:ss") : null,
      CreateUser: userName,
      SeqFrom: seqFrom || firstSlot?.seqnbr,
      SeqTo: seqTo || lastSlot?.seqnbr,
      Block: isBlocking ? 1 : 0,
    };

    console.log("Sending payload:", payload);

    const response = await OPModuleAgent.SlotBlockingandUnblocking(payload);

    // Debugging: Log API response
    console.log("API Response:", response);

    if (response?.data?.msgDesc?.toLowerCase().includes("successfully")) {
      message.success(
        `Slots from ${seqFrom || selectedSlots[0]?.seqnbr} to ${seqTo || selectedSlots[selectedSlots.length - 1]?.seqnbr} ${isBlocking ? "blocked" : "unblocked"} successfully.`
      );
      fetchTableData();
      setSelectedRows([]);
      form.resetFields(["SeqFrom", "SeqTo"]);
    } else {
      console.error("Failed Response:", response?.data);
      message.error(`Failed to update slots: ${JSON.stringify(response?.data)}`);
    }
  } catch (error) {
    console.error("Error:", error);
    message.error("Error updating the slots.");
  } finally {
    setLoading(false);
  }
};




useEffect(() => {
  console.log("Updated Selected Rows:", selectedRows);
}, [selectedRows]);


useEffect(() => {
  if (doctorName) {
    form.setFieldsValue({ doctor: doctorName });
  }
}, [doctorName]);

    useEffect(() => {
      if (departmentName) {
        const selectedDepartment = departments.find(dep => dep.columnName === departmentName);
        if (selectedDepartment) {
          fetchDoctors(selectedDepartment.columnCode);
        }
      }
    }, [departmentName, departments]);


    const handleDepartmentChange = (value) => {
      const selectedDepartment = departments.find(dep => dep.columnName === value);
      if (selectedDepartment) {
        setDepartmentId(selectedDepartment.columnCode); // Ensure you store department ID as well
        setDepartmentName(value);
        setDoctorName(null);
        form.resetFields(["doctor"]);
        fetchDoctors(selectedDepartment.columnCode); // Pass departmentId to fetch doctors
        setIsDoctorEditable(true);
      }
    };

    const handleDoctorChange = (doctorId) => {
      const selectedDoctor = doctors.find(doc => doc.columnCode === doctorId);
      if (selectedDoctor) {
        setSelectedDoctorId(selectedDoctor.columnCode); // Store Doctor ID
        setDoctorName(selectedDoctor.columnName); // Store Doctor Name if needed
        form.setFieldsValue({ doctor: doctorId }); // Store doctor ID in form
      }
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
}, [selectedDoctorId,form]);


  const handleCancelEdit = () => {
    setSelectedRecord(null);
    setIsEditMode(false); // Reset edit mode when canceling
    form.resetFields();
  };


 const handleModify = async (record) => {
  setIsEditMode(true);
   setSelectedRecord(record);  // <-- Add this line

     console.log("selected SequenceCount", record.sequenceCount);
     console.log("selected Doctor", record.doctorName);
     console.log("Full Record Data:", record);
     console.log("Department:", record.departmentName);
     console.log("Doctor:", record.doctorName);

     const selectedDays = [];
     if (record.sunday) selectedDays.push("Sun");
     if (record.monday) selectedDays.push("Mon");
     if (record.tuesday) selectedDays.push("Tue");
     if (record.wednesday) selectedDays.push("Wed");
     if (record.thursday) selectedDays.push("Thu");
     if (record.friday) selectedDays.push("Fri");
     if (record.saturday) selectedDays.push("Sat");

     console.log("Formatted Days:", selectedDays);

     const selectedDepartment = departments.find(dep => dep.columnName === record.departmentName);
     setDepartmentName(record.departmentName);
     setIsDoctorEditable(true); // Allow editing of doctor
     setAllowSequenceEdit(false);

   form.setFieldsValue({
        department: record.departmentName,
        doctor: record.doctorId,
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
   
   setFilterFromDate(moment(record.fromDatetime).toDate());   // date filter
   setFilterToDate(moment(record.toDatetime).toDate());    // date filter
     if (selectedDepartment) {
       await fetchDoctors(selectedDepartment.columnCode, record.doctorName); // Fetch doctors and set doctor in form
     }

   };


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
      if (response.status === "success" && response.data.msgDesc.includes("Deleted Successfully")) {
        message.success("Slot deleted successfully.");
        fetchMasterSlotData();
        fetchdetailSlotData();
        setSelectedRecord(null);
      } else {
        message.error(`Failed to delete record: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      message.error("Error deleting the record. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  //  -------------- Update  --------------------  //

const handleUpdate = async () => {
  setIsBlockEnabled(true);

  if (!selectedRecord) {
    message.error("No record selected for updating.");
    return;
  }

  const confirmed = window.confirm("Are you sure you want to update/add this slot?");
  if (!confirmed) return;

  const newSequenceCount = form.getFieldValue("sequence"); // User input
  const maxCapping = selectedRecord?.maxCapping ?? 0;
  const existingSequenceCount = selectedRecord?.sequenceCount ?? 0;

  console.log("🟢 Existing Sequence Count:", existingSequenceCount);
  console.log("🟢 New Sequence Count:", newSequenceCount);
  console.log("🟢 Max Capping:", maxCapping);
  console.log("🟢 Allow Sequence Edit (Switch):", allowSequenceEdit);

  if (maxCapping === 0) {
    message.error("Max Capping is not available. Please wait.");
    return;
  }

  let addSeq = 0; // Default: No sequence update

  if (allowSequenceEdit) {  // Ignore sequence validation if switch is OFF
    const parsedSequenceCount = parseInt(newSequenceCount, 10);
    if (isNaN(parsedSequenceCount) || parsedSequenceCount <= 0) {
      message.error("Please enter a valid sequence count greater than 0.");
      return;
    }

    const totalSequenceCount = existingSequenceCount + parsedSequenceCount;
    console.log("🟢 Total Sequence Count after update:", totalSequenceCount);
  
    if (totalSequenceCount > maxCapping) {
      message.error(`Total sequence count (${totalSequenceCount}) exceeds the max capping (${maxCapping}).`);
      return;
    }
  
    addSeq = parsedSequenceCount;
  } else {
    console.log("🟢 Sequence Edit Disabled, Keeping Original Count");
    addSeq = 0;  // Ensure no sequence update
  }

  console.log("🟢 Final AddSeq (should be 0 for time update):", addSeq);

  try {
    setLoading(true);

    const updatedPayload = {
      SessionId: selectedRecord.slot_Session_Id,
      FromDate: fromDate ? fromDate.format("YYYY-MM-DD HH:mm:ss") : selectedRecord.fromDatetime,
      ToDate: toDate ? toDate.format("YYYY-MM-DD HH:mm:ss") : selectedRecord.toDatetime,
      CreateUser: userName,
      Addseq: addSeq, // Ensuring 0 for time updates
    };

    console.log("🟢 Final Update Payload:", updatedPayload);

    const response = await OPModuleAgent.updatedetailslot(updatedPayload);

    if (response.data?.msgDesc?.toLowerCase().includes("successfully")) {
      message.success(response.data.msgDesc);
      await fetchdetailSlotData();
      setSelectedRecord(null);
      form.resetFields();
    } else {
      message.error(`Failed to update/add record: ${response.data.msgDesc}`);
    }
  } catch (error) {
    console.error("Error updating/adding record:", error);
    message.error("Error updating/adding the record. Please try again.");
  } finally {
    setLoading(false);
    setIsBlockEnabled(false);
  }
};



//  handleSubmit

  const handleSubmit = async (values) => {
    console.log("Selected Doctor ID:", selectedDoctorId);
    console.log("Department ID:", departmentId);

    if (!selectedDoctorId || !fromDate || !toDate) {
      message.error('Please make sure to select a doctor and valid date range.');
      return;
    }

    if (fromDate.isSame(toDate, 'minute')) {
      message.error('You cannot book a slot for the same time.');
      return;
    }

    const sequenceCount = parseInt(values.sequence) || 0;
    const maxCapping = slotGap; // Use slotGap directly
    console.log("MaxCapping",maxCapping)

    if (isNaN(sequenceCount) || sequenceCount <= 0) {
      message.error('Please enter a valid sequence count greater than 0.');
      return;
    }

if (sequenceCount > maxCapping) {
    message.error(`Sequence count cannot exceed the Max Capping of ${maxCapping}.`);
    return;
}


    try {
      setLoading(true);

      const selectedDepartment = departments.find(dept => dept.columnCode === departmentId);
      const selectedDoctor = doctors.find(doc => doc.columnCode === selectedDoctorId);

      if (!selectedDepartment || !selectedDoctor) {
        message.error('Invalid department or doctor selection.');
        return;
      }

      // Get selected days dynamically

      const selectedDays = form.getFieldValue("days") || [];
      const daysMapping = {
        Sun: false, Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false
      };


      // Populate days based on selection
      selectedDays.forEach(day => {
        daysMapping[day] = true;
      });


      const headerPayload = {
        Slot_Session_Id: 0,
        Doc_DepartmentId: selectedDepartment.columnCode,
        DepartmentName: selectedDepartment.columnName,
        Doc_DoctorId: selectedDoctor.columnCode,
        DoctorName: selectedDoctor.columnName,
        FromDatetime: fromDate.format('DD-MMM-YYYY hh:mm A'),
        ToDatetime: toDate.format('DD-MMM-YYYY hh:mm A'),
        MaxCapping: slotGap,
        SequenceCount: sequenceCount,
        Sunday: daysMapping.Sun,
        Monday: daysMapping.Mon,
        Tuesday: daysMapping.Tue,
        Wednesday: daysMapping.Wed,
        Thursday: daysMapping.Thu,
        Friday: daysMapping.Fri,
        Saturday: daysMapping.Sat,
        Slot_CreatedBy_id: userName,
        Slot_LastModifiedBy_id: userName,
        Reason: form.getFieldValue("reason"),
        Appointmenttype: form.getFieldValue("appointmentType") || "",
        AppointmentStatus: 0,
      };

      console.log("Header Payload:", headerPayload);
      const headerResponse = await OPModuleAgent.SaveMasterHeader(headerPayload);
      console.log('Header Response:', headerResponse);

      if (!headerResponse || !headerResponse.data || !headerResponse.data.slot_Session_Id) {
        console.error('Header response not valid:', headerResponse);
        message.error('Failed to create appointment header. Please check the input.');
        return;
      }

      const sessionId = headerResponse.data.slot_Session_Id;
      console.log('Session ID:', sessionId);

      const ordersItems = [];
      const startDate = moment(headerPayload.FromDatetime, 'DD-MMM-YYYY hh:mm A');
      const endDate = moment(headerPayload.ToDatetime, 'DD-MMM-YYYY hh:mm A');

      for (let currentDate = startDate.clone(); currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day'); currentDate.add(1, 'day')) {
        const dayOfWeek = currentDate.format('ddd'); // Get short day name (e.g., "

        if (!selectedDays.includes(dayOfWeek)) continue; // Skip unselected days

        const fromTime = currentDate.clone().set({ hour: fromDate.hour(), minute: fromDate.minute() });
        const toTime = currentDate.clone().set({ hour: toDate.hour(), minute: toDate.minute() });

        const totalDurationMinutes = toTime.diff(fromTime, 'minutes');
        const slotDurationMinutes = Math.floor(totalDurationMinutes / sequenceCount);

        for (let slotIndex = 0; slotIndex < sequenceCount; slotIndex++) {
          const slotTime = fromTime.clone().add(slotIndex * slotDurationMinutes, 'minutes');

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
        Sunday: daysMapping.Sun,
        Monday: daysMapping.Mon,
        Tuesday: daysMapping.Tue,
        Wednesday: daysMapping.Wed,
        Thursday: daysMapping.Thu,
        Friday: daysMapping.Fri,
        Saturday: daysMapping.Sat,
        CreateUser: userName,
        Reason: form.getFieldValue("reason"),
        Appointmenttype: "",
        AppointmentStatus: 0,
        Orders_items: ordersItems,
      };

      console.log("Master Detail Payload:", masterDetailPayload);
      const detailResponse = await OPModuleAgent.SaveAppointmentMaster(masterDetailPayload);
      console.log('Detail Response:', detailResponse);

      if (!detailResponse || !detailResponse.data || !detailResponse.data.success) {
        const errorMessage = detailResponse?.data?.message || 'Unknown error';
        console.error(`Failed to save appointment slots: ${errorMessage}`);
        message.error(`Failed to save appointment slots: ${errorMessage}`);
        return;
      }
      message.success('Slot saved successfully.');
      fetchMasterSlotData();   // Refresh Master Data (Table 1)
      fetchdetailSlotData();  // Refresh Detail Data (Table 2)

      form.resetFields();   // Reset the form if you want
    } catch (error) {
      console.error('Error saving details:', error);
      message.error('Error saving details. Please try again.');
    } finally {
      setLoading(false);
    }
  };


return (
  <div >
    <Card title="Appointment Master" bordered={false} style={{ backgroundColor: "#f8f9fa" }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          {/* Left column for the form */}
          <Col span={12}>
            <Row gutter={16}>
              <Col span={6}>
              <Form.Item name="department" label="Department" rules={[{ required: true, message: "Please select a department" }]}>
              <Select
                placeholder="Select Department"
                style={{ width: "100%" }}
                onChange={handleDepartmentChange}
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                {departments.map(department => (
                  <Option key={department.columnCode} value={department.columnName}>
                    {department.columnName}
                  </Option>
                ))}
              </Select>
              </Form.Item>
              </Col>

              <Col span={6}>
               <Form.Item name="doctor" label="Doctor" rules={[{ required: true, message: "Please select a doctor" }]}>
                <Spin spinning={loading} tip="Loading doctors...">
                  <Select
                    placeholder="Select Doctor"
                    style={{ width: "100%" }}
                    onChange={handleDoctorChange}
                    value={form.getFieldValue("doctor")}
                    disabled={!isDoctorEditable} // enable doctor field                        
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                    {doctors.map(doctor => (
                      <Option key={doctor.columnCode} value={doctor.columnCode}>
                        {doctor.columnName}
                      </Option>
                    ))}
                  </Select>
        
                </Spin>
              </Form.Item>
              </Col>
          

              <Col span={6}>
                <Form.Item name="fromDate" label="From Date" rules={[{ required: true, message: "Please select From Date & Time" }]}>
                  <DatePicker
                    showTime={{ use12Hours: true, format: "hh:mm A" }}
                    format="DD-MM-YYYY hh:mm A"
                    style={{ width: "100%" }}
                    onChange={handleFromDateChange}
                    disabledDate={disableFromDate}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="toDate" label="To Date" rules={[{ required: true, message: "Please select To Date & Time" }]}>
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
        </Row>

     

          <Row gutter={16}>
            <Switch checked={allowSequenceEdit}onChange={(checked) => setAllowSequenceEdit(checked)}
            checkedChildren="Update Time Only"unCheckedChildren="Enable Addition"/>

              <Col span={6}>
                <Form.Item name="sequence"label="Sequence Count"
                  rules={[{ required: allowSequenceEdit }]}>
                  <Input
                    type="number"
                    placeholder="Enter Sequence"
                    disabled={!allowSequenceEdit}
                    onChange={(e) => setSequenceCount(Number(e.target.value))} // Update sequence count
                  />
                </Form.Item>
              </Col>


            <Col span={6}>
              <Form.Item name="maxCapping" label="Max Capping"
                rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter Max Capping" defaultValue={slotGap} readOnly />
              </Form.Item>
            </Col>

{/* 
          <Switch checked={useManualEntry} 
            onChange={(checked) => {setUseManualEntry(checked);
                setSelectedRows([]); // Clear selected checkboxes when switching to manual entry
                form.setFieldsValue({ SeqFrom: "", SeqTo: "" }); // Reset input fields
            }} checkedChildren="Manual Entry" unCheckedChildren="Use Selection"/> */}
</Row>
<Row gutter={16}>
              <Col span={6}>
                  <Form.Item name="SeqFrom" label="Seq From"
                      rules={[{ required: useManualEntry, message: "Enter Seq From" }]}>
                      <Input type="number"placeholder="Enter Seq From"disabled={!useManualEntry}/>
                  </Form.Item>
              </Col>

              <Col span={6}>
                  <Form.Item
                      name="SeqTo"
                      label="Seq To"
                      rules={[{ required: useManualEntry, message: "Enter Seq To" }]}>
                      <Input type="number"placeholder="Enter Seq To"disabled={!useManualEntry}/>
                  </Form.Item>
              </Col>


           <Col span={6}>
                <Form.Item 
                  name="reason" 
                  label="Reason"
                  rules={[{ required: true, message: "Please enter a reason" }]}>
                  <Input type="text" placeholder="Enter the Reason" defaultValue={form.getFieldValue("reason")} />
                </Form.Item>
              </Col>
              <Col span={6} style={{alignItems:"center"}}>
              <Button type="primary"  htmlType="submit"  icon={<PlusOutlined style={{ color: "white" }} />} disabled={isEditMode}>Save</Button>
              </Col>
              
            </Row>
            
            {/* Continue with the rest of the form fields in a similar grid layout */}
            <Form.Item style={{ textAlign: "center" }}>
              <Space size="middle">
             
              <Button type="default" disabled={!selectedRecord } onClick={handleUpdate} icon={<EditOutlined style={{ color: "blue" }} />} >Update Time/Addition</Button>
              <Button type="default" onClick={handleDelete} disabled={!selectedRecord } icon={<DeleteOutlined style={{ color: "red" }} />} > Delete</Button>           
              <Button type="default" disabled={ !selectedRecord &&!(useManualEntry && manualSelectionValid)}onClick={handleBlockUnblock}
              icon={getBlockStatus() === "Block" ? <StopOutlined style={{ color: "orange" }} /> : <CheckCircleOutlined style={{ color: "green" }} />}>
              {getBlockStatus() || "Block/Unblock"}
              </Button>
              </Space>
            </Form.Item>
          </Col>

            {/* Right column for session details table */}
            <Col span={12}>
              <h3 style={{ marginBottom: 10 }}>Session Details</h3>
                <Table
                dataSource={filteredTableData.length ? filteredTableData : []}
                columns={columns}rowKey={(record) => `session-${record.slot_Session_Id}`}/>
            </Col>
          </Row>
        </Form>
      </Card>


        {/* The second table */}
          <h3 style={{ marginBottom: 10 }}>Appointment Details</h3>
          {/* <Checkbox style={{ right: 50 }}
            onChange={handleOverallSelect}
            checked={selectedRows.length === filteredTableData1.length && filteredTableData1.length > 0}
            indeterminate={selectedRows.length > 0 && selectedRows.length < filteredTableData1.length}>Select All</Checkbox> */}
          <Table dataSource={filteredTableData1}columns={columns1}
          rowKey={(record) => `${record.slot_Session_Id}-${record.seqnbr}-${record.slotDate}`} // Ensure unique row key
            />
    </div>
  );

  }
 export default AppMaster;
