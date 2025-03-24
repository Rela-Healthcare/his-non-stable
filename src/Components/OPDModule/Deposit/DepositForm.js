import React, {useEffect, useState} from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import CustomDropDown from '../../../common/CustomDropDown/CustomDropDown';
import {useDispatch} from 'react-redux';
import {OPModuleAgent} from '../../../agent/agent';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  options,
}) => (
  <Col xs={12} sm={12} md={6} lg={4}>
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      {type === 'select' ? (
        <Form.Select className="select" value={value} onChange={onChange}>
          <option disabled value="">
            Select one
          </option>
          {options &&
            options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
        </Form.Select>
      ) : (
        <Form.Control
          className="select"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </Form.Group>
  </Col>
);

const DepositForm = ({
  uhid,
  depositInformation,
  paymentData,
  handleCardTypeChange,
}) => {
  const dispatch = useDispatch();
  const [depositData, setDepositData] = useState({});

  useEffect(() => {
    const getDepositData = async (uhid) => {
      uhid = uhid.toString().slice(-6);
      if (!uhid || uhid.length < 6) return;
      try {
        const fetchResponse = (
          await OPModuleAgent.getDepositInfo(parseInt(uhid))
        ).data;
        setDepositData(fetchResponse?.[0] || {});
      } catch (error) {
        console.error('Error fetching deposit info:', error);
        setDepositData({});
      }
    };

    getDepositData(uhid);
  }, [uhid]);

  return (
    <>
      <Row style={{marginBottom: '20px'}}>
        <FormField label="UHID" value={uhid} disabled />
        <FormField
          label="Patient Name"
          value={depositData.patientName}
          disabled
        />
        <FormField
          label="Available Deposit Amount"
          type="number"
          value={depositData.avlAmt}
          disabled
        />
      </Row>
      <Row style={{marginBottom: '20px'}}>
        <FormField
          label="Deposit Amount"
          type="number"
          placeholder="Enter Deposit Amount"
          onChange={(event) =>
            dispatch(
              depositInformation({
                name: 'amountTobeAdded',
                value: Math.max(0, parseInt(event.target.value, 10) || 0),
              })
            )
          }
        />
        <FormField
          label="Deposit Remarks"
          placeholder="Deposit Remarks"
          value={depositData.depositRemarks}
          onChange={(event) =>
            dispatch(
              depositInformation({
                name: 'depositRemarks',
                value: event.target.value,
              })
            )
          }
        />
        <FormField
          label="Deposit Type"
          type="select"
          value={depositData.depositType}
          onChange={(event) =>
            dispatch(
              depositInformation({
                name: 'depositType',
                value: event.target.value,
              })
            )
          }
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
        <Col sm={4}>
          <Form.Group>
            <CustomDropDown
              name="paymentMethod"
              additionalname="paymentModeCode"
              label="Payment Mode"
              type="select"
              className="select"
              options={paymentData.paymentMethodList}
            />
          </Form.Group>
        </Col>
        {paymentData.paymentMethod === 'R' && (
          <FormField
            label="Card Type"
            type="select"
            value={depositData.cardType}
            onChange={handleCardTypeChange}
            options={paymentData.CardList.map((value) => ({
              value: value.label,
              label: value.label,
            }))}
          />
        )}
      </Row>
    </>
  );
};

export default DepositForm;
