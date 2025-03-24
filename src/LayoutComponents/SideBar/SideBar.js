import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MedicineBoxFilled,
  DashboardFilled,
  CalendarFilled,
  ExportOutlined,
  BankFilled,
  ExperimentOutlined ,
  HomeOutlined,
  RollbackOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, message } from "antd";
import { useNavigate } from "react-router-dom";
import relalogo from "../../assets/relalogo.png";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { resetLoginInformation } from "../../features/Login/LoginSlice";
const { Header, Sider, Content } = Layout;

const navItems = [
  {
    key: "home",
    icon: <DashboardFilled />,
    label: <Link to="/home">Home</Link>,
  },
  {
    key: "HelpDesk",
    icon: <CalendarFilled />,
    label: "Price List",
    children: [
      {
        key: "Servicepricelist",
        label: (
          <Link to="/op-reports/servicepricelist">Service price list</Link>
        ),
      },
      {
        key: "packagepricelist",
        label: (
          <Link to="/op-reports/packagepricelist">Package price list</Link>
        ),
      },
    ],
  },

  {
    key: "op-search",
    icon: <DashboardFilled />,
    label: <Link to="/op-search">Patient Search</Link>,
  },
  {
    key: "op-dashboard",
    icon: <MedicineBoxFilled />,
    label: <Link to="/op-dashboard">OP Dashboard</Link>,
  },

  {
    key: "lab-dashboard",
    icon: <ExperimentOutlined  />,
    label: <Link to="/lab-dashboard">Lab Dashboard</Link>,
  },

  {
    key: "ip-dashboard",
    icon: <HomeOutlined   />,
    label: <Link to="/ip Dashboard">IP Dashboard</Link>,
  },


  {
    key: "Appointment sequence",
    icon: <CalendarFilled />,
    label: "Appointment sequence",
    children: [
      {
        key: "App Search",
        label: <Link to="/op-reports/search">Appointment Search</Link>,
      },
      {
        key: "App master",
        label: <Link to="/op-reports/appmaster">Appointment Master</Link>,
      },
 
    ],
  },
  {
    key: "deposit",
    icon: <BankFilled />,
    label: <Link to="/deposit">Deposit Dashboard</Link>,
  },



  {
    key: "Refund",
    icon: <RollbackOutlined />,
    label: <Link to="/Refund">Refund Dashboard</Link>,
  },

  {
    key: "Inventory",
    icon: <CalendarFilled />,
    label: "Inventory",
    children: [
      {
        key: "indentrequest",
        label: <Link to="/op-reports/indentrequest">Indent request</Link>,
      },
      {
        key: "indentapproval",
        label: <Link to="/op-reports/indentapproval">Indent Approval</Link>,
      },
    ],
  },
  {
    key: "Logs",
    icon: <CalendarFilled />,
    label: "Logs",
    children: [
      {
        key: "smslog",
        label: <Link to="/op-reports/smslog">SMS log</Link>,
      },
      {
        key: "whatsapp",
        label: <Link to="/op-reports/whatsapp">Whatsapp log</Link>,
      },
      {
        key: "webpaymentlog",
        label: (
          <Link to="/op-reports/webpayment">web portal paymnt detail log</Link>
        ),
      },
      // {
      //   key: "audittracking",
      //   label: <Link to="/op-reports/audittracking">Audit tracking</Link>,
      // },
    ],
  },
  {
    key: "op-reports",
    icon: <ExportOutlined />,
    label: "Reports",
    children: [
      {
        key: "appointment",
        label: <Link to="/op-reports/opappointment">OP Appointments</Link>,
      },
      {
        key: "depositreport",
        label: <Link to="/op-reports/deposit">Deposit reports</Link>,
      },

      {
        key: "refund",
        label: <Link to="/op-reports/refund">Refund reports</Link>,
      },
      {
        key: "creditnote",
        label: <Link to="/op-reports/creditnote">Credit note report</Link>,
      },
      {
        key: "patietregisterreport",
        label: (
          <Link to="/op-repors/patientregistration">
            New Registration report{" "}
          </Link>
        ),
      },
      {
        key: "opinvoice",
        label: <Link to="/op-reports/opinvoice">Invoice Report</Link>,
      },
      // {
      //   key: "serviceorder",
      //   label: <Link to="/op-reports/serviceorder">service order</Link>,
      // },
      {
        key: "oprevenue",
        label: <Link to="/op-reports/oprevenue">OP revenue report</Link>,
      },

      {
        key: "cashcollection",
        label: (
          <Link to="/op-reports/cashcollection">Cash collection report</Link>
        ),
      },
      {
        key: "concesion",
        label: <Link to="/op-reports/concessionreport">Concession report</Link>,
      },
      {
        key: "billcancellation",
        label: <Link to="/op-reports/billcancellation">Bill cancellation</Link>,
      },
    ],
  },
];
const App = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.loginInfo.formData);
  const userName = localStorage.getItem("userName");
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSignOut = () => {
    const check = window.confirm("Are you sure you want to sign out?");
    if (check) {
      navigate("/");
      dispatch(resetLoginInformation());
      localStorage.removeItem("userName");
      localStorage.setItem("validEntry", false);
    }
    message.success("Successfully logged out!!");
  };
  const [currentKey, setCurrentKey] = useState("op-search");
  const handleOnClick = (e) => {
    const { keys } = e;
    setCurrentKey(keys);
  };
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: "#3C4B64",
          color: "white",
        }}
      >
        <div
          style={{
            height: `${collapsed}?65px:50px`,
            width: `${collapsed}?150px:100px`,
          }}
        >
          <img src={relalogo} alt="Rela Logo" style={{ objectFit: "fill" }} />
     
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[currentKey]}
          style={{
            background: "#3C4B64",
            color: "white",
          }}
          onClick={(event) => handleOnClick(event)}
          items={navItems}
        ></Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 20,
            background: "whitesmoke",
            height: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center", // Center vertically
              justifyContent: "center", // Center horizontally
            }}
          >
            {" "}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                position: "absolute",
                left: collapsed ? 80 : 200,
              }}
            />
            <div
              className="header-username"
              style={{
                width: 200,
                height: 64,
                position: "absolute",
                left: collapsed ? 130 : 250,
              }}
            >
              {userName}
            </div>
          
          </div>

          <div
            onClick={handleSignOut}
            style={{
              position: "fixed",
              top: "5px",
              right: "50px",
            }}
          >
            <div
              className="signout"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "5px",
              }}
            >
          <FontAwesomeIcon
                icon={faPowerOff}
                style={{ height: "20px" ,color:'red'}}/>
              <div>
                <h6 style={{ fontSize: "large"}}></h6>
              </div>
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: "5px 16px",
            padding: "25px 25px 0px 25px",
            minHeight: 280,
            height: "90vh",
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
