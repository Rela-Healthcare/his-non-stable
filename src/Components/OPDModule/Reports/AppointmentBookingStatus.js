import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider,PaginationListStandalone,} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { OPModuleAgent } from "../../../agent/agent";
import { Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";


const AppointmentBookingStatus = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [date, setDate] = useState({
    fromDate: new Date().toLocaleDateString(),
    toDate: new Date().toLocaleDateString(),
  });
  const [startDate, setStartDate] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchData();
  }, [date.fromDate, date.toDate]);

  const fetchData = async () => {
    try {
      const appointmentResponse = (
        await OPModuleAgent.getAppointmentStatus(date.fromDate, date.toDate)
      ).data;
      console.log(appointmentResponse);
      setData(appointmentResponse);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleFromDateChange = (date) => {
    setStartDate((prev) => ({ ...prev, fromDate: date }));

    const convertedDate = date.toLocaleDateString();

    setDate((prev) => ({ ...prev, fromDate: convertedDate }));
  };
  const handleToDateChange = (date) => {
    setStartDate((prev) => ({ ...prev, toDate: date }));
    const convertedDate = date.toLocaleDateString();
    setDate((prev) => ({ ...prev, toDate: convertedDate }));
  };
  const options = {
    custom: true,
    totalSize: data.length,
  };
  const tableStyle = {
    // Add styles to the entire table
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  };
  const columns = [

    {
      dataField: "uhid",
      text: "UHID",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "patientName",
      text: "Patient Name",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },

    {
      dataField: "mobileNo",
      text: "Mobile No",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "department.columnName",
      text: "Department",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "doctor.columnName",
      text: "Doctor Name",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "appDate",
      text: "Appointment Date",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "appTime",
      text: "Sequence No",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "visitType",
      text: "Visit Type",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
    {
      dataField: "status",
      text: "Appointment Status",
      style: {
        width: "1px",
        backgroundColor: "whitesmoke",
        fontWeight: "bolder",
      },
    },
  ];
  const handleFilterChange = (event) => {
    setSearchInput(event.target.value);

    if (event.target.value !== "") {
      const filteredData = data.filter(
        (value) =>
          value.uhid.includes(event.target.value) ||
          value.patientName.includes(event.target.value)
      );
      setFilteredData(filteredData);
      console.log(filteredData);
    }
  };
  return (
    <div style={{ height: "80vh", overflowX: "scroll" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Form.Group as={Col} sm={12} md={6} lg={3} xl={3}>
          <Form.Control
            type="text"
            value={searchInput}
            onChange={handleFilterChange}
            placeholder="Search by UHID, Patient Name, Visit Date."
            className="select"
          />
        </Form.Group>
      </div>
      <Row style={{ margin: "15px 3px 0px 3px" }}>
        <Form.Group as={Col} lg={5} md={6} sm={12}>
          <Form.Label>From Date</Form.Label>
          <DatePicker
            className="select form-control"
            selected={startDate.fromDate}
            onChange={handleFromDateChange}
            placeholderText="Date of Birth"
            dateFormat="MMMM d, yyyy" // Format for displaying selected date
            yearDropdownItemNumber={150}
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            scrollableMonthDropdown
            maxDate={new Date()}
            minDate={new Date("1900")}
          />
        </Form.Group>
        <Form.Group as={Col} lg={5} md={6} sm={12}>
          <Form.Label>To Date</Form.Label>
          <DatePicker
            className="select form-control"
            selected={startDate.toDate}
            onChange={handleToDateChange}
            placeholderText="Date of Birth"
            dateFormat="MMMM d, yyyy" // Format for displaying selected date
            yearDropdownItemNumber={150}
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            scrollableMonthDropdown
            maxDate={new Date()}
            minDate={new Date("1900")}
          />
        </Form.Group>
      </Row>
      <div>
        <PaginationProvider pagination={paginationFactory(options)}>
          {({ paginationProps, paginationTableProps }) => (
            <>
              <BootstrapTable
                bordered
                hover
                striped
                keyField="sno"
                data={filteredData.length > 0 ? filteredData : data}
                columns={columns}
                {...paginationTableProps}
                style={tableStyle}
              />
              <PaginationListStandalone {...paginationProps} />
            </>
          )}
        </PaginationProvider>
      </div>
    </div>
  );
};

export default AppointmentBookingStatus;
