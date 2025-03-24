

import React, { useState, useEffect } from "react";
import { Form, Select, Button, Input,Space, Row, Col, Table, Spin, DatePicker, message,  Card } from "antd";

import { OPModuleAgent } from "../../../agent/agent";
import { useSelector } from "react-redux";
import { Checkbox ,Switch} from "antd";
import { PlusOutlined, CheckCircleOutlined,DeleteOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import moment from "moment";

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

  const [allowSequenceEdit, setAllowSequenceEdit] = useState(true); // Initially enabled

  const [filterFromDate, setFilterFromDate] = useState(''); // Separate state for date filtering
  const [filterToDate, setFilterToDate] = useState('');   // Separate state for date filtering

  const disableFromDate = (currentDate) => {
    return currentDate && currentDate.isBefore(moment().startOf("minute"));
  };

  const handleFromDateChange = (date) => {
    setFromDate(date); // Update the state directly
    setFilterFromDate(date); // Update the filter state
    if (date) {
      form.setFieldsValue({ toDate: null }); // Clear toDate when fromDate changes
      setToDate(null);
      setFilterToDate(null);
    }
  };


  const disableToDate = (currentDate) => {
  const fromDateVal = fromDate;  // Use the state variable, not form.getFieldValue
  // Allow past dates to be selectable if they are the same as fromDate day
  return (
    currentDate &&
    (currentDate.isBefore(moment().startOf("minute")) ||
    (fromDateVal && currentDate.isBefore(fromDateVal.startOf('day'))) ||
    currentDate.isSame(moment(fromDateVal).startOf('day')) && currentDate.isSame(moment(fromDateVal), 'minute'))
  );
};

const handleToDateChange = (date) => {
  const fromDateValue = fromDate; // Use the state variable, not form.getFieldValue
  // Case where 'To Date' is cleared
  if (!date) {
    setToDate(null);
    setFilterToDate(null);
    form.setFieldsValue({ toDate: null });
    return;
  }
  // If "To Date" is earlier than "From Date", do not allow it
  if (fromDateValue && date.isBefore(fromDateValue)) {
    message.warning("To Date cannot be earlier than From Date."); // Notify user
    form.setFieldsValue({ toDate: null }); // Reset To Date
    setToDate(null); // Reset internal state as well
    setFilterToDate(null);
    return;
  }
  // If both dates are the same and the time is the same, do not allow it
  if (fromDateValue && date.isSame(fromDateValue, 'day') && date.isSame(fromDateValue, 'minute')) {
    message.warning("To Date cannot be the same time as From Date on the same day."); // Notify user
    form.setFieldsValue({ toDate: null }); // Reset To Date
    setToDate(null); // Reset internal state as well
    setFilterToDate(null);
    return;
  }
  // Valid date selected, update state
  setToDate(date);
  setFilterToDate(date);
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
  // Correctly parse date and time
  const [datePart, timePartWithPeriod] = slotDateString.split(' ');
  const [day, month, year] = datePart.split('-');
  const [timePart, period] = timePartWithPeriod.split(' ');
  const [hours, minutes] = timePart.split(':');

  let adjustedHours = parseInt(hours, 10); // Parse hours to integer
  if (period === 'PM' && adjustedHours !== 12) {
      adjustedHours += 12;
  } else if (period === 'AM' && adjustedHours === 12) {
      adjustedHours = 0;
  }

  // Create a date string that JavaScript can reliably parse
  const formattedDateString = `${year}-${month}-${day}T${String(adjustedHours).padStart(2, '0')}:${minutes}:00`;
  return new Date(formattedDateString); // Return a Date object
};


// Correct and Efficient Date Filtering.  Using the separate state variables
const filteredTableData1 = tableData1.filter(item => {
  const slotDate = parseSlotDate(item.slotDate);
  const fromDateInput = filterFromDate ? new Date(filterFromDate) : null;
  const toDateInput = filterToDate ? new Date(filterToDate) : null;
  const slotDateObj = slotDate;

  const isWithinRange = (!fromDateInput || !toDateInput || (slotDateObj >= fromDateInput && slotDateObj <= toDateInput));
  const matchesDepartment = !departmentName || item.departmentName === departmentName;
  const matchesDoctor = !doctorName || item.doctorName === doctorName;

  return matchesDepartment && matchesDoctor && isWithinRange;
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


const columns1 = [
  { title: "Department Name", dataIndex: "departmentName", key: "departmentName" },
  { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
  { title: "Slot Date", dataIndex: "slotDate", key: "slotDate" },
  // { title: "Type", dataIndex: "appointmenttype", key: "appointmenttype" },
  { title: "Seq No", dataIndex: "seqnbr", key: "seqnbr" },
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
    type: "checkbox",
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


// Function to handle "Select All" checkbox

const handleOverallSelect = (e) => {
  const isChecked = e.target.checked;

  const allRowKeys = isChecked
    ? filteredTableData1.map(item => `${item.seqnbr}-${item.slotDate}-${item.departmentName}`)
    : [];

  setSelectedRows(allRowKeys);
  updateFormFields(allRowKeys);
};



const allBlocked = selectedRows.every(seq => {
  const slot = tableData1.find(record => record.seqnbr === seq);
  return slot?.blockedStatus === "Blocked";
});

const allUnblocked = selectedRows.every(seq => {
  const slot = tableData1.find(record => record.seqnbr === seq);
  return slot?.blockedStatus === "Unblocked";
});

const getBlockStatus = () => {
  if (!selectedRows.length) return null; // No selection, return nothing

  const selectedSlots = selectedRows
    .map(key => {
      const [seqnbr, slotDate, departmentName] = key.split("-");
      return tableData1.find(record =>
        record.seqnbr === parseInt(seqnbr) &&
        record.slotDate === slotDate &&
        record.departmentName === departmentName
      );
    })
    .filter(slot => slot !== undefined); // Filter out undefined values

  if (selectedSlots.length === 0) return null;

  const blockedCount = selectedSlots.filter(slot => slot.blockedStatus === "Blocked").length;
  const unblockedCount = selectedSlots.filter(slot => slot.blockedStatus === "Unblocked").length;

  if (blockedCount === selectedSlots.length) {
    return "Unblock"; // If all selected rows are blocked, show "Unblock"
  }
  if (unblockedCount === selectedSlots.length) {
    return "Block"; // If all selected rows are unblocked, show "Block"
  }

  return null; // If mixed selection, show nothing
};


// Function to handle individual checkbox change
    const handleCheckboxChange = (e, record) => {
      const { checked } = e.target;
      let updatedSelections = [...selectedRows];
    // Create unique identifier using seqnbr, slotDate, and departmentName
    const rowKey = `${record.seqnbr}-${record.slotDate}-${record.departmentName}`;
      if (checked) {
        updatedSelections.push(rowKey);
      } else {
        updatedSelections = updatedSelections.filter(seq => seq !== rowKey);
      }
      setSelectedRows(updatedSelections);
      updateFormFields(updatedSelections);
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



useEffect(() => {
  if (useManualEntry) {
    const seqFrom = form.getFieldValue("SeqFrom");
    const seqTo = form.getFieldValue("SeqTo");

    if (seqFrom && seqTo && seqFrom <= seqTo) {
      setManualSelectionValid(true);
    } else {
      setManualSelectionValid(false);
    }
  } else {
    setManualSelectionValid(false);
  }
}, [form, useManualEntry]);



const handleBlockUnblock = async () => {
  const seqFrom = form.getFieldValue("SeqFrom");
  const seqTo = form.getFieldValue("SeqTo");

  let syntheticSelectedRows = [];
  let allRecords = [];

  // Manual entry - Use SeqFrom and SeqTo and  fromDate and toDate
  if (useManualEntry && seqFrom && seqTo) {
    for (let seq = parseInt(seqFrom); seq <= parseInt(seqTo); seq++) {
      const record = tableData1.find(r => r.seqnbr === seq);
      if (record) {
        // Create a synthetic selection key for each record
        syntheticSelectedRows.push(`${record.seqnbr}-${record.slotDate}-${record.departmentName}`);
        allRecords.push(record); // Store matched records
      }
    }
  }

  const rowsToProcess = useManualEntry ? syntheticSelectedRows : selectedRows;

  if (!rowsToProcess.length) {
    message.error("Please select at least one slot or enter SeqFrom and SeqTo.");
    return;
  }

  // Determine if we're blocking or unblocking based on the rowsToProcess
  let slotsToProcess = [];

  if (useManualEntry) {
    slotsToProcess = allRecords;
  } else {
    slotsToProcess = rowsToProcess.map(key => {
      const [seqnbr, slotDate, departmentName] = key.split("-");
      return tableData1.find(record =>
        record.seqnbr === parseInt(seqnbr) &&
        record.slotDate === slotDate &&
        record.departmentName === departmentName
      );
    }).filter(slot => slot !== undefined);
  }

  // Check if all slots are blocked or all are unblocked
  const isBlocking = slotsToProcess.some(record => record.blockedStatus === "Unblocked");
  const isUnblocking = slotsToProcess.every(record => record.blockedStatus === "Blocked");

  const confirmed = window.confirm(`Are you sure you want to ${isBlocking ? "block" : "unblock"} these slots?`);
  if (!confirmed) return;

  setLoading(true);

  try {
    // Sort slotsToProcess by seqnbr to ensure correct first and last
    slotsToProcess.sort((a, b) => a.seqnbr - b.seqnbr);

    const firstSlot = slotsToProcess[0];
    const lastSlot = slotsToProcess[slotsToProcess.length - 1];

    const fromDateToUse = moment(firstSlot.slotDate, "M/DD/YYYY hh:mm:ss A");
    const toDateToUse = moment(lastSlot.slotDate, "M/DD/YYYY hh:mm:ss A");

    if (!fromDateToUse.isValid() || !toDateToUse.isValid()) {
      message.error(`Invalid date format for slotDate: ${firstSlot.slotDate} or ${lastSlot.slotDate}`);
      setLoading(false);
      return;
    }

    const formattedFromDate = fromDateToUse.format("YYYY-MM-DD HH:mm:ss");
    const formattedToDate = toDateToUse.format("YYYY-MM-DD HH:mm:ss");

    const Block = isBlocking ? 1 : 0; // Determine if blocking (1) or unblocking (0)

    const payload = {
      SessionId: firstSlot?.slot_Session_Id || null, // Use first slot's session ID
      FromDate: formattedFromDate,
      ToDate: formattedToDate,
      CreateUser: userName,
      SeqFrom: parseInt(seqFrom), // Use+ the original seqFrom (parsed to integer)
      SeqTo: parseInt(seqTo),     // Use the original seqTo (parsed to integer)
      Block: Block,
    };

    // Make the API Call only once with the combined payload
    const response = await OPModuleAgent.SlotBlockingandUnblocking(payload);

    if (response?.data?.msgDesc?.toLowerCase().includes("successfully")) {
      message.success(`Slots from ${seqFrom} to ${seqTo} ${isBlocking ? "blocked" : "unblocked"} successfully.`);
      fetchTableData();
      setSelectedRows([]);
      form.resetFields(["SeqFrom", "SeqTo"]);
    } else {
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
        // fromDate: moment(record.fromDatetime),
        // toDate: moment(record.toDatetime),
        maxCapping: record.maxCapping,
        sequence: record.sequenceCount,
        appointmentType: record.appointmenttype,
        appointmentStatus: record.appointmentStatus ,
        userName: record.createUser,
        reason:record.reason
      });
    setFilterFromDate(moment(record.fromDatetime).toDate());
    setFilterToDate(moment(record.toDatetime).toDate());

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
      if (response.status === "success" && response.data.msgDesc === "Row Deleted Successfully") {
        message.success("Slot deleted successfully.");
        fetchMasterSlotData();
        fetchdetailSlotData();
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
    setIsBlockEnabled(true);
    console.log("Currently Selected Record:", selectedRecord);

    if (!selectedRecord) {
      message.error("No record selected for updating.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to update/add this slot?");
    if (!confirmed) return;

    // Get sequenceCount from form, now assuming this is the new amount requested:
    const sequenceCount = form.getFieldValue('sequence');
    // Get maxCapping value from the form
    const maxCapping = slotGap;  //Get from state, form value is the maxCapping value

    // Validation:
    if (maxCapping === undefined || maxCapping === null) {  // Make sure it's loaded
      message.error("Max Capping is not available. Please wait.");
      return;
    }

    const parsedSequenceCount = parseInt(sequenceCount, 10); // Parse as integer
    if (isNaN(parsedSequenceCount) || parsedSequenceCount <= 0) {
      message.error("Please enter a valid sequence count greater than 0.");
      return;
    }

    // Get existing slot sequence count (from selectedRecord)
    const existingSequenceCount = selectedRecord.sequence || 0; // Assuming 'sequence' exists in selectedRecord

    // Calculate Total Slots (New + Existing)
    const totalSlots = existingSequenceCount + parsedSequenceCount;
    // Validate against maxCapping *BEFORE* the try block:
    if (totalSlots > maxCapping) {
      message.error(`Total sequence count (${totalSlots}) cannot exceed the Max Capping of ${maxCapping}.`);
      return;
    }


    try {
      setLoading(true);

      const updatedPayload = {
        SessionId: selectedRecord.slot_Session_Id,
        FromDate: fromDate ? fromDate.format("YYYY-MM-DD HH:mm:ss") : selectedRecord.fromDatetime,
        ToDate: toDate ? toDate.format("YYYY-MM-DD HH:mm:ss") : selectedRecord.toDatetime,
        CreateUser: userName,
        Addseq: parsedSequenceCount, // Send only the new amount to ADD (or zero)
      };

      console.log("Update Payload:", updatedPayload);

      let response;

      // Check if sequence addition is enabled and sequence count has increased
      if (allowSequenceEdit && parsedSequenceCount > existingSequenceCount) { //Check if it should add at all
        console.log("Adding new slot...");
        response = await OPModuleAgent.updatedetailslot(updatedPayload); // Call Insert API
      } else {
        console.log("Updating existing slot...");
        response = await OPModuleAgent.updatedetailslot(updatedPayload); // Call Update API
      }

      if (response.data?.msgDesc?.toLowerCase().includes("successfully")) {
        message.success(response.data.msgDesc);
        // Refetch data if necessary,
          fetchMasterSlotData();
        fetchdetailSlotData();
        setSelectedRecord(null); // Clear selection
        form.resetFields(); // Clear the form fields (optional)
      } else {
        message.error(`Failed to update/add record: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("Error updating/adding record:", error);
      message.error("Error updating/adding the record. Please try again.");
    } finally {
      setLoading(false);
    }
    setIsBlockEnabled(false);
  };



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
              <Col span={12}>
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

              <Col span={12}>
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
                    value={fromDate}
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
                    value={toDate}
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
                    disabled={!allowSequenceEdit} // Disabled unless user enables sequence editing
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


          <Switch checked={useManualEntry}
            onChange={(checked) => {setUseManualEntry(checked);
                setSelectedRows([]);
                form.setFieldsValue({ SeqFrom: "", SeqTo: "" }); // Reset input fields
            }} checkedChildren="Manual Entry" unCheckedChildren="Use Selection"/>

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
            </Row>

            {/* Continue with the rest of the form fields in a similar grid layout */}
            <Form.Item style={{ textAlign: "center" }}>
              <Space size="middle">
              <Button type="primary"  htmlType="submit"  icon={<PlusOutlined style={{ color: "white" }} />} disabled={isEditMode}>Save</Button>
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


        <div>
        {/* The second table */}
          <h3 style={{ marginBottom: 10 }}>Appointment Details</h3>
          <Checkbox style={{ right: 50 }}
            onChange={handleOverallSelect}
            checked={selectedRows.length === filteredTableData1.length && filteredTableData1.length > 0}
            indeterminate={selectedRows.length > 0 && selectedRows.length < filteredTableData1.length}>Select All</Checkbox>

          <Table dataSource={filteredTableData1}columns={columns1}
          rowKey={(record) => `${record.slot_Session_Id}-${record.seqnbr}-${record.slotDate}`} // Ensure unique row key
            />
    </div>

      </div>
  );

  }
 export default AppMaster;

