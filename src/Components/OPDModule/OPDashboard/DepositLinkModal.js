import React, {useState} from 'react';
import {Modal, Button, Space} from 'antd';
import DepositForm from '../Deposit/DepositForm';
import {useDispatch, useSelector} from 'react-redux';
import {depositInformation} from '../../../features/OPDModule/DepositAllocation/DepositSlice';
import {toast} from 'react-toastify';

const DepositLinkModal = ({isVisible, onClose, rowData, width}) => {
  const dispatch = useDispatch();
  const paymentData = useSelector((state) => state.paymentInfo.formData);
  const [isSent, setIsSent] = useState(false);

  const sendWhatsAppMessage = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  const handleSendLink = () => {
    setIsSent(true);
    setTimeout(() => {
      console.log('Deposit link sent!');
      toast.success('Deposit link sent successfully!');
      sendWhatsAppMessage('918610130371', 'Hello! This is a test message.');
      onClose();
    }, 1000);
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
    <Modal
      title="Sent Deposit Link to Patient"
      open={isVisible}
      onCancel={onClose}
      width={width ? width : ''}
      footer={() => (
        <Button type="primary" onClick={handleSendLink}>
          {isSent ? 'Re-Send Link' : 'Send Link'}
        </Button>
      )}>
      <Space direction="vertical" style={{width: '100%', padding: '10px'}}>
        <DepositForm
          uhid={rowData?.uhid}
          dispatch={dispatch}
          depositInformation={depositInformation}
          paymentData={paymentData}
          handleCardTypeChange={handleCardTypeChange}
        />
      </Space>
    </Modal>
  );
};

export default DepositLinkModal;
