import React, { useEffect } from "react";
import "./Logout.css";
import { useDispatch } from "react-redux";
import { resetLoginInformation } from "../../features/Login/LoginSlice";
const NotFound = ({ navigate }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // Redirect to home page after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
      dispatch(resetLoginInformation());
      localStorage.setItem("validEntry", false);
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [navigate]);
  console.log("Logging Out...!");
  
  return (
    <div className="logout-mother">
      <h5>Unauthorised acesss. Contact IT department!!</h5>
    </div>
  );
};

export default NotFound;
