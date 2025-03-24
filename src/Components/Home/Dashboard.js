import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Input, Table, DatePicker, Row, Col, Spin } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("YOUR_API_ENDPOINT");
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data by doctor name and date range
  useEffect(() => {
    let filtered = data;

    if (doctorSearch) {
      filtered = filtered.filter((item) =>
        item.doctorName.toLowerCase().includes(doctorSearch.toLowerCase())
      );
    }

    if (dateRange.length > 0) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter((item) => {
        const appointmentDate = moment(item.date);
        return appointmentDate.isBetween(startDate, endDate, "days", "[]");
      });
    }

    setFilteredData(filtered);
  }, [doctorSearch, dateRange, data]);

  // Table columns
  const columns = [
    { title: "S.No", dataIndex: "sNo", key: "sNo" },
    { title: "Doctor Name", dataIndex: "doctorName", key: "doctorName" },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "No. of Appointments",
      dataIndex: "appointments",
      key: "appointments",
    },
    { title: "Billed", dataIndex: "billed", key: "billed" },
    { title: "Yet to Bill", dataIndex: "yetToBill", key: "yetToBill" },
    {
      title: "Investigation Bill Count",
      dataIndex: "investigationBills",
      key: "investigationBills",
    },
    {
      title: "Pharmacy Bill Count",
      dataIndex: "pharmacyBills",
      key: "pharmacyBills",
    },
  ];

  // Calculate card data
  const totalAppointments = data.reduce(
    (sum, item) => sum + item.appointments,
    0
  );
  const totalBilled = data.reduce((sum, item) => sum + item.billed, 0);
  const totalYetToBill = data.reduce((sum, item) => sum + item.yetToBill, 0);
  const totalInvestigationBills = data.reduce(
    (sum, item) => sum + item.totalInvestigationBills,
    0
  );
  const totalPharmacyBills = data.reduce(
    (sum, item) => sum + item.totalPharmacyBills,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        {/* Cards */}
        <Col span={4}>
          <Card title="Total Appointments" bordered>
            {loading ? <Spin /> : totalAppointments}
          </Card>
        </Col>
        <Col span={4}>
          <Card title="Billing Completed" bordered>
            {loading ? <Spin /> : totalBilled}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Yet to Bill" bordered>
            {loading ? <Spin /> : totalYetToBill}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Presciption Billed" bordered>
            {loading ? <Spin /> : totalPharmacyBills}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Investigation Billed" bordered>
            {loading ? <Spin /> : totalInvestigationBills}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {/* Filters */}
        <Col span={12}>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="Search by Doctor Name"
            onChange={(e) => setDoctorSearch(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        style={{ marginTop: "20px" }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Dashboard;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, Table, DatePicker, Row, Col, Spin, Button } from "antd";
// import moment from "moment";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
// } from "recharts";

// const { RangePicker } = DatePicker;

// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState([
//     moment().startOf("day"),
//     moment().endOf("day"),
//   ]);
//   const [totalAppointments, setTotalAppointments] = useState(0);
//   const [billingCompleted, setBillingCompleted] = useState(0);
//   const [yetToBill, setYetToBill] = useState(0);
//   const [doctorStats, setDoctorStats] = useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       if (!dateRange || dateRange.length < 2) return;
//       const fromDate = dateRange[0].format("YYYY-MM-DD");
//       const toDate = dateRange[1].format("YYYY-MM-DD");
//       const response = await axios.get(
//         `https://www.relainstitute.in/NewHIS_Live/api/HIS/GetAppointmentPatientSearch?FromDate=${fromDate}&ToDate=${toDate}`
//       );

//       const appointments = response.data || [];

//       const confirmedAppointments = appointments.filter(
//         (item) => item.AppointmentStatus !== "cancel" && item.mobileNo
//       ).length;

//       const checkinAppointments = appointments.filter(
//         (item) => item.appointmentStatus === "Check-In"
//       ).length;

//       setTotalAppointments(confirmedAppointments);
//       setBillingCompleted(checkinAppointments);
//       setYetToBill(confirmedAppointments - checkinAppointments);
//       const doctorData = {};
//       appointments.forEach((appointment) => {
//         if (
//           appointment.doctorName &&
//           appointment.appointmentStatus !== "cancel"
//         ) {
//           if (!doctorData[appointment.doctorName]) {
//             doctorData[appointment.doctorName] = {
//               name: appointment.doctorName,
//               total: 0,
//               billed: 0,
//             };
//           }
//           doctorData[appointment.doctorName].total += 1;
//           if (appointment.appointmentStatus === "Check-In") {
//             doctorData[appointment.doctorName].billed += 1;
//           }
//         }
//       });

//       setDoctorStats(
//         Object.values(doctorData).sort((a, b) => b.total - a.total)
//       );
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [dateRange]);

//   const pieData = [
//     { name: "Total Appointments", value: totalAppointments, color: "#8884d8" },
//     { name: "Billing Completed", value: billingCompleted, color: "#82ca9d" },
//     { name: "Yet to Bill", value: yetToBill, color: "#ffc658" },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Dashboard</h1>
//       <Row gutter={[30, 30]}>
//         <Col span={8}>
//           <Card title="Total Appointments" bordered>
//             {loading ? <Spin /> : totalAppointments}
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card title="Billing Completed" bordered>
//             {loading ? <Spin /> : billingCompleted}
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card title="Yet to Bill" bordered>
//             {loading ? <Spin /> : yetToBill}
//           </Card>
//         </Col>
//       </Row>
//       <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
//         <Col span={12}>
//           <RangePicker
//             value={dateRange}
//             onChange={(dates) => {
//               if (dates && dates.length === 2) {
//                 setDateRange([
//                   dates[0].clone().startOf("day"),
//                   dates[1].clone().endOf("day"),
//                 ]);
//               }
//             }}
//             style={{ width: "100%" }}
//             format="YYYY-MM-DD"
//           />
//         </Col>
//         <Col span={12}>
//           <Button type="primary" onClick={fetchData}>
//             Fetch Data
//           </Button>
//         </Col>
//       </Row>

//       <Row style={{ marginTop: "40px" }} gutter={[40, 40]}>
        

//         {/* Right Side: Bar Chart */}
//         <Col span={24}>
//           <h2>Doctor-wise Appointments</h2>

//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart
//               width={doctorStats.length * 100} // Dynamically adjust width based on doctor count
//               height={400}
//               data={doctorStats}
//               margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
//             >
//               <XAxis
//                 dataKey="name"
//                 angle={-45} // Rotate doctor names for better readability
//                 textAnchor="end"
//                 interval={0} // Show all doctor names
//                 tick={{ fontSize: 12 }} // Adjust font size for better fit
//               />
//               <YAxis />
//               <Tooltip />
//               <Bar
//                 dataKey="total"
//                 fill="#8884d8"
//                 name="Total Appointments"
//                 barSize={30}
//               />
//               <Bar dataKey="billed" fill="#82ca9d" name="Billed" barSize={30} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;