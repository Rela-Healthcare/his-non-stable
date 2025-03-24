import React from "react";
import { Form } from "react-bootstrap";
import { Container } from "react-bootstrap";
import CalendarViewer from "./CalendarViewer";

const Reschedule = () => {
  return (
    <Form style={{ paddingTop: "50px", paddingLeft: "50px" }} className="row">
      <div
        style={{ color: "red" }}
        className="col-xs-12 col-sm-12 col-md-6 col-lg-6"
      >
        <label style={{ width: "200px" }}>Date</label>
        <input type="date" className="select" />
      </div>
      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <label style={{ width: "200px" }}>Department</label>
        <input type="text" className="select" />
      </div>
      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <label style={{ width: "200px" }}>Doctor Name</label>
        <input type="text" className=" select" />
      </div>
      {/* <div>
        <CalendarViewer />
      </div> */}
      <div>
        {/* dynamic content with constant UI. 7am-10pm(15 cards), each cards may have multiple splits in x axis (depends on the slot timings) */}
        <div
          style={{
            width: "100%",
            height: "20px",
            border: "1px solid black",
            borderRadius: "3px",
            margin: "3px 5px",
          }}
        >
          {/* if slot time is 15 minutes it card must have 4 splits, and so on. */}
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "25%" }}>Uhid 24</div>
            <div style={{ width: "25%" }}>Uhid 25</div>
            <div style={{ width: "25%" }}>Uhid 26</div>
            <div style={{ width: "25%" }}>Uhid 27</div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "20px",
            border: "1px solid black",
            borderRadius: "3px",
            margin: "3px 5px",
          }}
        >
          {" "}
          {/* if slot time is 10 minutes it card must have 6 splits, and so on. */}
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "25%" }}>Uhid 24</div>
            <div style={{ width: "25%" }}>Uhid 25</div>
            <div style={{ width: "25%" }}>Uhid 26</div>
            <div style={{ width: "25%" }}>Uhid 27</div>
            <div style={{ width: "25%" }}>Uhid 28</div>
            <div style={{ width: "25%" }}>Uhid 29</div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "20px",
            border: "1px solid black",
            borderRadius: "3px",
            margin: "3px 5px",
          }}
        >
          {" "}
          {/* if slot time is 5 minutes it card must have 12 splits, and so on. */}
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "25%" }}>Uhid 24</div>
            <div style={{ width: "25%" }}>Uhid 25</div>
            <div style={{ width: "25%" }}>Uhid 26</div>
            <div style={{ width: "25%" }}>Uhid 27</div>
            <div style={{ width: "25%" }}>Uhid 28</div>
            <div style={{ width: "25%" }}>Uhid 29</div>
            <div style={{ width: "25%" }}>Uhid 24</div>
            <div style={{ width: "25%" }}>Uhid 25</div>
            <div style={{ width: "25%" }}>Uhid 26</div>
            <div style={{ width: "25%" }}>Uhid 27</div>
            <div style={{ width: "25%" }}>Uhid 28</div>
            <div style={{ width: "25%" }}>Uhid 29</div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Reschedule;
