import React, { useState, useEffect } from "react";
import { Form, Accordion, Col, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomDropDown from "../../../../common/CustomDropDown/CustomDropDown";
import CustomFormInput from "../../../../common/CustomFormInput/CustomFormInput";
import { OPModuleAgent } from "../../../../agent/agent";
import { resetServiceInformation,serviceInformation} from "../../../../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import {dropDownInformation,calculateNetAmount} from "../../../../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import { addItemsInServiceCart } from "../../../../features/OPDModule/ServiceList/ServiceListSlice";
import { toast } from "react-toastify";

const ServiceCreation = () => {
  const [rate, setRate] = useState(0);
  const [inputValue, setInputValue] = useState(14);

  const resetDropdown = () => {
    setInputValue("");
  };
  const dispatch = useDispatch();

  const serviceData = useSelector((state) => state.serviceCreation.formData);
  //console.log(serviceData);

  useEffect(() => {
    fetchData(); // eslint-disable-next-line
  }, [serviceData.ServiceGroup]);

  useEffect(() => {
    if (serviceData.Service !== "") {
      handleServiceRate();
    } else return;
    // eslint-disable-next-line
  }, [serviceData.Service, serviceData.Rate]);

  useEffect(() => {
    if (serviceData.DiscountType === "") {
      dispatch(
        serviceInformation({
          name: "Discount",
          value: 0,
        })
      );
    }
  }, [serviceData.DiscountType]);

  useEffect(() => {
    if (serviceData.Discount !== "" && serviceData.DiscountType !== "") {
      handleAmountValue();
    } else return;
    // eslint-disable-next-line
  }, [serviceData.Discount, serviceData.DiscountType]);

  useEffect(() => {
    validateServiceCheck();
  }, [serviceData]);

  const validateServiceCheck = () => {
    if (serviceData) {
    }
  };
  const handleServiceRate = () => {
    const rate = parseInt(serviceData.Service.split(":")[1]);
    setRate(rate);
    dispatch(
      serviceInformation({
        name: "Rate",
        value: rate,
      })
    );
    dispatch(
      serviceInformation({
        name: "Amount",
        value: parseInt(rate),
      })
    );
  };

  // //console.log(rate);
  async function fetchData() {
    try {
      const serviceGroupResponse = (await OPModuleAgent.getServiceGroupList())
        .data;
       console.log(serviceGroupResponse);
      dispatch(
        dropDownInformation({
          name: "ServiceGroupList",
          value: serviceGroupResponse,
        })
      );

      const priorityResponse = (await OPModuleAgent.getPriorityList()).data;
      dispatch(
        dropDownInformation({
          name: "PriorityList",
          value: priorityResponse,
        })
      );
      if (serviceData.ServiceGroup !== "") {
        const serviceListResponse = (
          await OPModuleAgent.getServicesList(serviceData.ServiceGroup)
        ).data;
        dispatch(
          dropDownInformation({
            name: "ServiceList",
            value: serviceListResponse,
          })
        );
      }
    } catch (error) {
      //console.log("Error fetching Data:", error);
    }
  }

  const handleAmountValue = () => {
    if (rate !== 0) {
      dispatch(calculateNetAmount({
          name: "Amount",
          value: serviceData.Discount,
        })
      );
    }
  };



//   const handleDiscountChange = (event) => {
//     let { value } = event.target;
    
//     // Allow empty input (user deletes value)
//     if (value === '') {
//         dispatch(
//             serviceInformation({
//                 name: "Discount",
//                 value: '', 
//             })
//         );
//         return;
//     }

//     const inputValue = parseInt(parseFloat(value));

//     switch (serviceData.DiscountType) {
//         case "P": {
//             if ( /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?|0(\.\d{1,2})?)$/.test(value)) {
//                 value = Math.min(100, Math.max(0, inputValue));
//             } else {
//                 alert("Invalid percentage input!");
//                 return;
//             }
//             break;
//         }
//         case "A": {
//             if (isNaN(inputValue) || inputValue < 0 || inputValue > rate) {
//                 alert("Invalid amount input!");
//                 return;
//             }
//             value = Math.min(rate, inputValue);
//             break;
//         }
//         default: {
//             value = 0;
//             break;
//         }
//     }

//     dispatch(
//         serviceInformation({
//             name: "Discount",
//             value: value,
//         })
//     );
// };


const handleDiscountChange = (event) => {
  let { value } = event.target;

  // Allow empty input (user deletes value)
  if (value === '') {
    dispatch(
      serviceInformation({
        name: "Discount",
        value: '', 
      })
    );
    return;
  }

  // Parse the value as a floating point number
  let inputValue = parseFloat(value);

  // Validate the input based on DiscountType
  switch (serviceData.DiscountType) {
    case "P": {
      // Allow percentage format with up to 2 decimal places
      if (/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/.test(value)) {
        inputValue = Math.min(100, Math.max(0, inputValue));
      } else {
        alert("Invalid percentage input!");
        return;
      }
      break;
    }
    case "A": {
      // Validate amount is within the range
      if (isNaN(inputValue) || inputValue < 0 || inputValue > rate) {
        alert("Invalid amount input!");
        return;
      }
      inputValue = Math.min(rate, inputValue);
      break;
    }
    default: {
      inputValue = 0;
      break;
    }
  }

  // Round to 2 decimal places if necessary
  inputValue = parseFloat(inputValue.toFixed(2));

  // Dispatch the updated discount value
  dispatch(
    serviceInformation({
      name: "Discount",
      value: inputValue,
    })
  );
};

  const handleDiscountTypeChange = (event) => {
    const { value } = event.target;
    dispatch(
      serviceInformation({
        name: "DiscountType",
        value,
      })
    );
  };

  const handleServiceAdd = () => {
    if (
      serviceData.ServiceID !== "" ||
      serviceData.ServiceGroup !== "" ||
      serviceData.Service !== "" ||
      serviceData.Discount !== 0 ||
      serviceData.Amount !== 0
    ) {
      if (serviceData.Amount > serviceData.Rate || serviceData.Amount < 0) {
        toast.warn("Discounted Amount exceeds actual rate!");
      } else {  
        // Specify whether a discount has been applied
        const discountApplied = serviceData.Discount !== 0;
  
        dispatch(
          addItemsInServiceCart({
            ServiceID: serviceData.ServiceID,
            ServiceGroup: serviceData.ServiceGroupName,
            Service: serviceData.Service,
            Unit: 1,
            Rate: serviceData.Rate,
            DiscountType: serviceData.DiscountType,
            Amount: serviceData.Amount,
            PriorityType: serviceData.PriorityType,
            Remarks: serviceData.Remarks,
            Discount: serviceData.Discount,
            Priority: serviceData.Priority,
            DiscountApplied: discountApplied, // Add this line
          })
        );
  
        // Reset the service information
        dispatch(resetServiceInformation({}));
        setRate(0);
  
        // Reset discount
        dispatch(
          serviceInformation({
            name: "Discount",
            value: 0, // Reset discount value to 0
          })
        );
  
        // Set the discount applied flag in the Redux store
        dispatch(
          serviceInformation({
            name: "DiscountApplied", // New entry for discount applied
            value: discountApplied, // Pass the boolean flag
          })
        );
      }
    } else {
      toast.info("All details required for the Service Addition!");
    }
  };



  return (
    <>
      <Accordion defaultActiveKey="2">
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <h5>OP Invoice & Service Addition</h5>
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                {" "}
                <CustomDropDown
                  className="select"
                  label="Service Group"
                  name="ServiceGroup"
                  additionalname="ServiceGroupName"
                  type="text"
                  placeholder="Service Group"
                  required
                  options={serviceData.ServiceGroupList}
                  inputValue={inputValue}/>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                {" "}
                <CustomDropDown
                  className="select"
                  label="Service"
                  name="ServiceID"
                  additionalname="Service"
                  type="text"
                  placeholder="Select Service"
                  required
                  options={serviceData.ServiceList}
                  disabled={serviceData.ServiceGroup !== "" ? false : true}/>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                {" "}
                <CustomDropDown
                  className="select"
                  label="Priority"
                  name="PriorityType"
                  additionalname="Priority"
                  type="text"
                  placeholder="Select Priority"
                  required
                  options={serviceData.PriorityList}
                  defaultValue={{
                    columnCode: 2,
                    columnName: "ROUTINE",
                    responseType: "priority",
                  }}/>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} xs={12} sm={6} md={6} lg={2}>
                {" "}
                <Form.Label className="mandatory">Rate</Form.Label>
                <Form.Control
                  className="select"
                  label="Rate"
                  name="Rate"
                  type="number"
                  placeholder="Rate"
                  value={rate}
                  readOnly>
                  </Form.Control>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={6} lg={2}>
                {" "}
                <Form.Label className="mandatory">Discount Type</Form.Label>
                <Form.Select
                  className="select"
                  label="Discount Type"
                  name="DiscountType"
                  type="text"
                  placeholder="Select Discount Type"
                  required
                  value={serviceData.DiscountType}
                  onChange={handleDiscountTypeChange}>
                  <option value="" disabled>
                    Select Discount Type
                  </option>
                  <option value="P">Percentage</option>
                  <option value="A">Amount</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={6} md={6} lg={2}>
                {" "}
                <Form.Label className="mandatory">Discount</Form.Label>
                <Form.Control
                  className="select"
                  label="Discount"
                  name="Discount"
                  type="number"
                  onChange={handleDiscountChange}
                  placeholder="Discount"
                  min={0}
                  value={serviceData.Discount}
                  max={serviceData.DiscountType === "P" ? 100 : rate}
                  disabled={serviceData.DiscountType !== "" ? false : true}>
                  </Form.Control>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={6} lg={2}>
                {" "}
                <Form.Label className="mandatory">Amount</Form.Label>
                <Form.Control
                  className="select"
                  name="Amount"
                  type="number"
                  readOnly
                  placeholder="Net Amount"
                  value={serviceData.Amount}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                {" "}
                <CustomFormInput
                  className="select"
                  label="Remarks"
                  name="Remarks"
                  type="text"
                  placeholder="Remarks"/>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} xs={12} sm={6} md={6} lg={4}>
                {" "}
                <CustomFormInput
                  className="select"
                  label="Discount Reason"
                  name="Remarks"
                  type="text"
                  placeholder="Discount Reason"
                />
              </Form.Group>
             
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div style={{ textAlign: "center", margin: "10px 0px" }}>
        <Button className="primary" type="button" onClick={handleServiceAdd}>
          Add
        </Button>
      </div>
    </>
  );
};

export default ServiceCreation;
