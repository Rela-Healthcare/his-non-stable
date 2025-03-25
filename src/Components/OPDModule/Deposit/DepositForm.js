import React, {useEffect} from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import CustomDropDown from '../../../common/CustomDropDown/CustomDropDown';
import {useSelector} from 'react-redux';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  options = [],
  required = false,
}) => (
  <Col xs={12} sm={12} md={6} lg={4}>
    <Form.Group>
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      {type === 'select' ? (
        <Form.Select
          className="select"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}>
          <option disabled value="">
            Select one
          </option>
          {options.map((option, index) => (
            <option key={`${index}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          className="select"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
      )}
    </Form.Group>
  </Col>
);

const DepositForm = ({uhid, formData, setFormData}) => {
  const paymentData = useSelector((state) => state.paymentInfo.formData);

  // Handle form input changes
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: paymentData?.paymentMethod,
    }));
  }, [paymentData.paymentMethod, setFormData]);

  return (
    <Form>
      <Row style={{marginBottom: '20px'}}>
        <FormField label="UHID" name="uhid" value={uhid} disabled />
        <FormField
          label="Patient Name"
          name="patientName"
          value={formData?.patientName}
          disabled
        />
        <FormField
          label="Mobile No."
          name="mobileNo"
          value={formData?.mobileNo}
          onChange={handleChange}
          required
        />
      </Row>

      <Row style={{marginBottom: '20px'}}>
        <FormField
          label="Deposit Amount"
          type="number"
          name="depositAmount"
          placeholder="Enter Deposit Amount"
          value={formData?.depositAmount}
          onChange={handleChange}
        />
        <FormField
          label="Deposit Remarks"
          name="depositRemarks"
          placeholder="Deposit Remarks"
          value={formData?.depositRemarks}
          onChange={handleChange}
        />
        <FormField
          label="Deposit Type"
          type="select"
          name="depositType"
          value={formData?.depositType}
          onChange={handleChange}
          options={[
            {value: '1', label: 'OP'},
            {value: '2', label: 'IP'},
            {value: 'Transplant', label: 'Transplant'},
            {value: 'Pharmacy', label: 'Pharmacy'},
            {value: 'Daycare', label: 'Daycare'},
          ]}
        />
      </Row>

      <Row style={{marginBottom: '20px'}}>
        <FormField
          label="Payment Mode"
          type="select"
          required
          name="paymentMethod"
          value={formData?.paymentMethod}
          onChange={handleChange}
          options={paymentData.paymentMethodList.map(
            ({columnCode, columnName}) => ({
              value: columnCode,
              label: columnName,
            })
          )}
        />
        {formData?.paymentMethod === 'R' && (
          <FormField
            label="Card Type"
            type="select"
            name={'cardType'}
            value={formData?.cardType}
            onChange={handleChange}
            options={paymentData.CardList.map((value) => ({
              value: value.label,
              label: value.label,
            }))}
          />
        )}
      </Row>
    </Form>
  );
};

export default DepositForm;
