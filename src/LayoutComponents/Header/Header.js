import React from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";

const Header = ({ setShowSideBar, showSideBar }) => {
  const handleShowSideBar = () => {
    setShowSideBar((prev) => !prev);
  };
  return (
    <>
      <div className="mother">
        <FontAwesomeIcon
          icon={faBars}
          // fade
          onClick={handleShowSideBar}
          style={{
            width: "2rem",
            height: "2rem",
            color: "rgb(36 60 93)",
            position: "fixed",
            left: "5px",
            top: "5px",
          }}
        />
        <FontAwesomeIcon
          icon={faUser}
          style={{
            width: "1.5rem",
            height: "1.5rem",
            color: "rgb(36 60 93)",
            position: "fixed",
            right: "5px",
            top: "5px",
            paddingTop: "5px",
          }}
        />

        <h3
          style={{
            textAlign: "center",
            color: "rgb(36 60 93)",
          }}
        >
          Hospital Information System - HIS
        </h3>

        {/* <Appointments /> */}
      </div>
    </>
  );
};

export default Header;
