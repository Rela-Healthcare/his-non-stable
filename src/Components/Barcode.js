import React, { useRef, useEffect } from "react";
// import JsBarcode from "jsbarcode";
import Barcode from "react-barcode";

const BarcodeGen = () => {
  // const value = 1218167565;
  // const barcodeRef = useRef(null);

  // useEffect(() => {
  //   if (barcodeRef.current) {
  //     JsBarcode(barcodeRef.current, value);
  //   }
  // }, [value]);

  return (
    <div
      style={{
        fontSize: "10px",
        // marginTop: "25px",
        marginLeft: "30px",
        fontWeight: "900",
        fontFamily: "Ubuntu, sans-serif",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: "1500",
          fontFamily: "Ubuntu, sans-serif",
        }}
      >
        UHID: 12018167565
      </span>{" "}
      <br />
      <span
        style={{
          fontSize: "10px",
          fontWeight: "1500",
          fontFamily: "Ubuntu, sans-serif",
        }}>
        Rela R
      </span>{" "}
      <br />
      <span
        style={{
          fontSize: "10px",
          fontWeight: "1200",
          fontFamily: "Ubuntu, sans-serif",
        }}
      >
        Gender: Male
      </span>{" "}
      <span
        style={{
          fontSize: "10px",
          fontWeight: "1000",
          fontFamily: "Ubuntu, sans-serif",
        }}
      >
        DOB: 17-01-2000
      </span>{" "}
      <br />
      <Barcode
        // width="1cm"
        height="40cm"
        fontSize="10px"
        value="12018167565"
        color="white"
      />
    </div>
  );
  // return <svg ref={barcodeRef} />;
};

export default BarcodeGen;
