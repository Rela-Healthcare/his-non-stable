import React, {useEffect, useState} from 'react';
import {Accordion, Button, Form, Row, Col, FormGroup} from 'react-bootstrap';
import {OPModuleAgent} from '../../../agent/agent';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {resetPaymentInformation} from '../.././../features/OPDModule/Payment/PaymentSlice';
import {useDispatch, useSelector} from 'react-redux';
import {resetItemsInServiceCart} from '../../../features/OPDModule/ServiceList/ServiceListSlice';
import {useNavigate} from 'react-router-dom';
import CustomDropDown from '../../../common/CustomDropDown/CustomDropDown';
import {
  depositInformation,
  addToDeposit,
  resetDepositInformation,
} from '../../../features/OPDModule/DepositAllocation/DepositSlice';
import {toast} from 'react-toastify';
import DepositDashboard from './DepositDashboard';

const Deposit = () => {
  let initialCheck = false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const paymentData = useSelector((state) => state.paymentInfo.formData);
  const depositData = useSelector((state) => state.depositInfo.formData);

  const userName = localStorage.getItem('userName');
  console.log('UserId:', userName);

  useEffect(() => {
    dispatch(resetPaymentInformation());
    dispatch(resetItemsInServiceCart());
  }, [navigate]);

  useEffect(() => {
    if (depositData.uhid.length < 6) initialCheck = false;
  }, [depositData.uhid]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const fetchData = async () => {
    if (search !== '') {
      const fetchResponse = (await OPModuleAgent.getDepositInfo(search)).data;
      //console.log(fetchResponse);
      console.log(fetchResponse);
      if (fetchResponse.length > 0) {
        dispatch(
          depositInformation({
            name: 'uhid',
            value: fetchResponse[0].patientId,
          })
        );
        dispatch(
          depositInformation({
            name: 'patientName',
            value: fetchResponse[0].patientName,
          })
        );
        dispatch(
          addToDeposit({
            name: 'availableAmount',
            value: fetchResponse[0].avlAmt,
          })
        );
        initialCheck = true;
      } else {
        toast.warn('Invalid UHID!');
      }
    } else {
      toast.warn('Please Enter UHID!');
    }
  };
  //console.log(depositData);
  const handleSearch = () => {
    fetchData();
  };
  const payload = {
    PatientId: depositData.uhid,
    DepAmomunt: depositData.amountTobeAdded,
    UserId: userName,
    DepositType: depositData.depositType,
    clsdepositLine: [
      {
        PayType: depositData.paymentMethod,
        CardNo: '',
        amount: 0,
        ContraVoucherNo: '',
        CreditCardId: 0,
        ValidityDate: '2023-12-14T06:22:01.148Z',
        AuthorisationNo: 0,
      },
    ],
  };

  const saveDepositData = async () => {
    const depositSaveResponse = (await OPModuleAgent.SaveMobileDeposit(payload))
      .data;
    //console.log(depositSaveResponse);
    if (depositSaveResponse.msgDescp === 'Data Saved') {
      toast.success('Amount added successfully!');
      dispatch(resetDepositInformation());
      initialCheck = false;
      setSearch('');
    }
  };

  const handleCardTypeChange = (e) => {
    //console.log(e.target.value);
    const {value} = e.target;
    dispatch(
      depositInformation({
        name: 'CardType',
        value,
      })
    );
  };
  return (
    <div style={{height: '80vh', overflow: 'scroll'}}>
      {' '}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '10px',
        }}>
        <div>
          <Form.Control
            className="select"
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search by UHID"></Form.Control>
        </div>

        <div>
          <Button disabled={initialCheck} onClick={handleSearch}>
            Search
            <FontAwesomeIcon icon={faSearch} style={{marginLeft: '10px'}} />
          </Button>
        </div>
      </div>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <h5>Deposit Allocation</h5>
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Form.Group p as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>UHID</Form.Label>
                <Form.Control
                  className="select"
                  type="text"
                  placeholder="UHID"
                  disabled={true}
                  value={depositData.uhid}
                />
              </Form.Group>
              <Form.Group p as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  className="select"
                  type="text"
                  label="Patient Name"
                  placeholder="Patient Name"
                  disabled={true}
                  value={depositData.patientName}
                />
              </Form.Group>
              <Form.Group p as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>Available Deposit Amount</Form.Label>
                <Form.Control
                  className="select"
                  type="number"
                  label="Available Deposit Amount"
                  placeholder="Available Deposit Amount"
                  disabled={true}
                  value={depositData.availableAmount}
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>Deposit Amount</Form.Label>
                <Form.Control
                  className="select"
                  type="text"
                  label="Enter Deposit Amount"
                  placeholder="Enter Deposit Amount"
                  value={depositData.amountTobeAdded}
                  onChange={(event) =>
                    dispatch(
                      depositInformation({
                        name: 'amountTobeAdded',
                        value:
                          parseInt(event.target.value) >= 0
                            ? parseInt(event.target.value)
                            : 0,
                      })
                    )
                  }
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                {' '}
                <Form.Label>Deposit Remarks</Form.Label>
                <Form.Control
                  className="select"
                  type="text"
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
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={12} md={6} lg={4}>
                <Form.Label>Deposit Type</Form.Label>
                <Form.Select
                  className="select"
                  type="text"
                  value={depositData.depositType}
                  onChange={(event) =>
                    dispatch(
                      depositInformation({
                        name: 'depositType',
                        value: event.target.value,
                      })
                    )
                  }>
                  <option disabled value="">
                    Select one
                  </option>
                  <option value="1">OP</option>
                  <option value="2">IP</option>
                  <option>Transplant</option>
                  <option>Pharmacy</option>
                  <option>Daycare</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Col>
                {' '}
                <Form.Group xs={12} sm={4} md={4} lg={3}>
                  <CustomDropDown
                    name="paymentMethod"
                    additionalname="paymentModeCode"
                    label="Payment Mode"
                    type="text"
                    className="select"
                    placeholder="Payment Mode"
                    options={paymentData.paymentMethodList}
                  />
                </Form.Group>
              </Col>
              <Col>
                {paymentData.paymentMethod === 'R' && (
                  <>
                    <Form.Group xs={12} sm={4} md={4} lg={3}>
                      <Form.Label className="mandatory">Card Type</Form.Label>
                      <Form.Select
                        className="select"
                        value={depositData.cardType}
                        onChange={handleCardTypeChange}>
                        <option value="" disabled>
                          Select Card Type
                        </option>
                        {paymentData.CardList.map((value, index) => {
                          return (
                            <>
                              <option
                                key={value.label + index}
                                value={value.label}>
                                {value.label}
                              </option>
                            </>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                  </>
                )}
              </Col>
            </Row>
            <div style={{textAlign: 'center', margin: '10px 0px'}}>
              <Button onClick={saveDepositData}>Proceed & Check Out</Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div style={{margin: '10px 0px'}}></div>
      {/* <Payment /> */}
      <DepositDashboard />
    </div>
  );
};

export default Deposit;
