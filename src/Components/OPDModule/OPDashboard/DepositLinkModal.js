import React, {useEffect, useState} from 'react';
import {Modal, Space} from 'antd';
import {Button} from 'react-bootstrap';
import DepositForm from '../Deposit/DepositForm';
import {toast} from 'react-toastify';
import {OPModuleAgent} from '../../../agent/agent';
import {generateProcessingId} from '../../../utils/utils';

const DepositLinkModal = ({
  isVisible,
  onClose,
  rowData,
  width,
  handleDepositLinkStatus,
}) => {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNo: '',
    depositAmount: '',
    depositRemarks: '',
    depositType: '',
    paymentMethod: '',
    cardType: '',
  });
  const uhid = rowData?.uhid || '011039';

  const resetForm = () => {
    setFormData({
      mobileNo: '',
      depositAmount: '',
      depositRemarks: '',
      depositType: '',
      paymentMethod: '',
      cardType: '',
    });
  };

  useEffect(() => {
    const fetchDepositData = async () => {
      if (uhid && uhid.length >= 6) {
        try {
          const response = await OPModuleAgent.getDepositInfo(uhid.slice(-6));
          const data = response?.data?.[0] || {};
          setFormData((prev) => ({
            ...prev,
            patientName: data.patientName || '',
            depositRemarks: data.depositRemarks || '',
            depositType: data.depositType || '',
          }));
        } catch (error) {
          console.error('Error fetching deposit info:', error);
        }
      } else {
        console.log('UHID should be at least 6 characters long.');
      }
    };
    fetchDepositData();
  }, [uhid]);

  const generatePaymentURL = ({
    patientName,
    uhid,
    chargeRate,
    email,
    mobileNo,
    processingId,
    uname = 'MEFTECmeftec',
    payMode = 'cash-remote-deposit',
  }) => {
    const baseURL = 'https://www.relainstitute.in/DataAegis_Live/';
    const queryParams = new URLSearchParams({
      patientName,
      uhid,
      chargerate: chargeRate,
      email,
      mobileno: mobileNo,
      processingid: processingId,
      uname,
      paymode: payMode,
    });

    return `${baseURL}?${queryParams.toString()}`;
  };

  const handleSendLink = async () => {
    const isFormDataValid = isDisableButton();
    if (isFormDataValid) {
      toast.error('Please fill all the required fields.');
      return;
    }
    const {patientName, mobileNo, depositAmount} = formData;

    try {
      generatePaymentURL({
        patientName,
        uhid: rowData?.uhid || '000000',
        chargeRate: depositAmount,
        email: rowData?.email,
        mobileNo,
        processingId: generateProcessingId(mobileNo),
      });

      setIsSent(true);
      toast.success('Deposit link sent successfully!');
      handleDepositLinkStatus(rowData.sno);
      resetForm();
      onClose();
    } catch (error) {
      console.error('❌ Error generating payment link:', error);
      toast.error('Failed to generate payment link.');
    }
  };

  const isDisableButton = () => {
    const {mobileNo, depositAmount, depositType, paymentMethod, cardType} =
      formData ?? {};

    if (
      mobileNo &&
      depositAmount &&
      depositType &&
      paymentMethod &&
      ((paymentMethod === 'R' && cardType) || paymentMethod !== 'R')
    ) {
      return false;
    }

    return true;
  };

  return (
    <Modal
      title="Sent Deposit Link to Patient"
      open={isVisible}
      onCancel={onClose}
      width={width ? width : ''}
      footer={() => (
        <>
          <Button type="default" onClick={resetForm}>
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleSendLink}
            disabled={isDisableButton()}>
            {isSent ? 'Re-Send Link' : 'Send Link'}
          </Button>
        </>
      )}>
      <Space direction="vertical" style={{width: '100%', padding: '10px'}}>
        <DepositForm
          uhid={uhid}
          formData={formData}
          setFormData={setFormData}
        />
      </Space>
    </Modal>
  );
};

export default DepositLinkModal;
