import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AppointmentBookingStatus from "./AppointmentBookingStatus";

const Reports = () => {
  const [component, setComponent] = useState(1);
  return (
    <div>
      <Button onClick={() => setComponent(1)}>Laborotory</Button>
      <Button onClick={() => setComponent(2)}>Collections</Button>
      <Button onClick={() => setComponent(3)}>
        Appointment Booking Status
      </Button>

      {component === 1 && <>Labarotory</>}
      {component === 2 && <>Collections</>}
      {component === 3 && (
        <>
          {" "}
          <AppointmentBookingStatus />
        </>
      )}
    </div>
  );
};

export default Reports;
