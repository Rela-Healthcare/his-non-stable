
import React, { useState, useEffect } from "react";
import { Form, Accordion, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { serviceInformation} from "../../../../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import { calculateNetAmount} from "../../../../features/OPDModule/ServiceDetails/ServiceDetailsSlice";
import { posPaymentInformation } from "../../../../features/OPDModule/Payment/PaymentSlice";
import { applyFinalDiscount,updateServiceList  } from "../../../../features/OPDModule/ServiceList/ServiceListSlice";
import CustomDropDown from "../../../../common/CustomDropDown/CustomDropDown";
import { paymentInformation } from "../../../../features/OPDModule/Payment/PaymentSlice";

const Payment = (props) => {

  const dispatch = useDispatch();
  const paymentData = useSelector((state) => state.paymentInfo.formData);
  const Amount = useSelector((state) => state.serviceCart.totalAmount);
  const serviceData = useSelector((state) => state.serviceCreation.formData);
  const [applyCoupon, setApplyCoupon] = useState(false);
  const couponBalance = 50; // Sample coupon balance
  const [discount, setDiscount] = useState(serviceData.Discount || 0);
  const isDiscountApplied = useSelector((state) => state.serviceCreation.formData.DiscountApplied);
  const [discountType, setDiscountType] = useState(serviceData.DiscountType || ""); // Store discount type
  // Calculate net payable amount once, avoid redundant calculations
  const [netAmount, setNetAmount] = useState(Amount);

  useEffect(() => {
    const discountAmount =
      discountType === "P" ? (Amount * discount) / 100 : discount;
    let adjustedAmount = Amount - discountAmount;
  
    if (applyCoupon) {
      adjustedAmount -= couponBalance;
    }
  
    const finalAmount = Math.max(adjustedAmount, 0);
    setNetAmount(finalAmount);
  
    console.log("Payment Net Amount Changed:", finalAmount);
  
    dispatch(calculateNetAmount({ value: finalAmount })); 
  }, [Amount, discount, applyCoupon, couponBalance, discountType, dispatch]);
  

  const handleDiscountTypeChange = (e) => {
    const value = e.target.value;
    setDiscountType(value);
    dispatch(serviceInformation({ name: "DiscountType", value }));
    setDiscount(0); // Reset discount when discount type changes
  };

  const handleDiscountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (discountType === "P" && (value < 0 || value > 100)) {
      toast.error("Percentage must be between 0 and 100.");
      return;
    }
    if (discountType === "A" && value > Amount) {
      toast.error("Discount cannot exceed the total amount.");
      return;
    }
    setDiscount(value); // Set the new discount value
    dispatch(serviceInformation({ name: "Discount", value }));
  };


  const handleApplyDiscount = () => {
    const discountAmount =
      discountType === "P" ? (Amount * discount) / 100 : discount;
  
    dispatch(
      applyFinalDiscount({
        discountType,
        discountValue: discount,
      })
    );
  };
  
  useEffect(() => {
    handleApplyDiscount();
  }, [discount, discountType]);
  

  const handleCardTypeChange = (e) => {
    //console.log(e.target.value);
    const { value } = e.target;
    dispatch(
      paymentInformation({
        name: "CardType",
        value,
      })
    );
  };


  return (
    <Accordion defaultActiveKey={"1"}>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <h5>Payment Information</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Gross Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="Total Amount"
                  className="select"
                  placeholder="Gross Amount"
                  value={Amount}
                  readOnly/>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group xs={12} sm={6} md={6} lg={2}>
                <Form.Label className="mandatory">Discount Type</Form.Label>
                <Form.Select
                  className="select"
                  label="Discount Type"
                  name="DiscountType"
                  required
                  value={discountType}
                  disabled={isDiscountApplied}
                  onChange={handleDiscountTypeChange}>
                    
                  <option value="" disabled>Select Discount Type</option>
                  <option value="P">Percentage</option>
                  <option value="A">Amount</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Final Discount</Form.Label>
                <Form.Control
                  className="select"
                  label="Discount"
                  name="Discount"
                  type="number"
                  onChange={handleDiscountChange}
                  placeholder="Discount"
                  min={0}
                  max={discountType === "P" ? 100 : Amount}
                  value={discount}
                  disabled={isDiscountApplied || discountType === ""}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Total Amount</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  className="select"
                  value={netAmount}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Coupon Balance</Form.Label>
                <Form.Control
                  type="text"
                  name="CouponAmount"
                  value={applyCoupon ? couponBalance : 0}
                  className="select"
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Apply Coupon</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="applyCoupon"
                  checked={applyCoupon}
                  onChange={(e) => setApplyCoupon(e.target.checked)}
                />
              </Form.Group>
            </Col>

            </Row>

            <Row>
            {/* Payment Method and Card Type */}
            <Col>
                <CustomDropDown
                  name="paymentMethod"
                  label="Payment Mode"
                  type="text"
                  className="select"
                  placeholder="Payment Mode"
                  options={paymentData.paymentMethodList}/>
              </Col>

              {/* <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Contar Voucher No </Form.Label>
                <Form.Control
                  type="text"
                  name="ContarVoucherNo"
                 value={}
                  className="text"
                  />
              </Form.Group>
            </Col> */}

              {paymentData.paymentMethod === "R" && (
                <Col>
                  <Form.Group xs={12} sm={4} md={4} lg={3}>
                    <Form.Label className="mandatory">Card Type</Form.Label>
                    <Form.Select
                      className="select"
                      defaultValue={""}
                      onChange={handleCardTypeChange}>
                      <option value="" disabled>Select Card Type</option>
                      {paymentData.CardList.map((value) => (
                        <option key={value.label} value={value.label}>
                          {value.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                )}

            <Col>
              <Form.Group xs={12} sm={4} md={4} lg={3}>
                <Form.Label className="mandatory">Net Payable Amount </Form.Label>
                <Form.Control
                  type="text"
                  name="netPayable"
                  value={netAmount || 0}
                  className="select"
                  readOnly/>
              </Form.Group>
            </Col>
              <Col>

              </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Payment;