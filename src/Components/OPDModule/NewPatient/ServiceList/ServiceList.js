import React from "react";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteItemsInServiceCart } from "../../../../features/OPDModule/ServiceList/ServiceListSlice";

const ServiceList = () => {
  const dispatch = useDispatch();
  const serviceListData = useSelector((state) => state.serviceCart.serviceList);
  //console.log(serviceListData);

  const tableHeadings = [
    "Service Group",
    "Service Name",
    "Unit",
    "Rate",
    "Discount",
    "Amount",
    "Priority",
    "Remarks",
    "Delete",
  ];
  return (
    <>
      {" "}
      <Table responsive="lg">
        <thead>
          <tr className="table-primary">
            <th>SNo</th>
            {tableHeadings.map((value, index) => (
              <th key={index}>{value}</th>
            ))}
          </tr>
        </thead>
      
        <tbody>
  {serviceListData.length > 0 &&
    serviceListData.map((value, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{value.ServiceGroup}</td>
        <td>{value.Service.split(":")[0]}</td>
        <td>{value.Unit}</td>
        <td>{parseInt(value.Rate)}</td>
        <td>
          {value.Discount}
          {value.DiscountType === "P"
            ? " %" 
            : value.DiscountType === "A"
            ? " rs."  
            : ""}  
        </td>
        <td>{parseInt(value.Amount)}</td>
        <td>{value.Priority}</td>
        <td>{value.Remarks}</td>
        <td>
          <Button
            onClick={() =>
              dispatch(deleteItemsInServiceCart({ index }))
            }>
            <i className="fas fa-trash"></i>
          </Button>
        </td>
      </tr>
    ))}
</tbody>

      </Table>
    </>
  );
};

export default ServiceList;
