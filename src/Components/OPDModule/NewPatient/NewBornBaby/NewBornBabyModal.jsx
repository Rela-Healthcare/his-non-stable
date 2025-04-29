import React, {useState, useCallback} from 'react';
import {Modal, Space} from 'antd';
import {Button} from 'react-bootstrap';
import NewBornBabyForm from './NewBornBabyForm';
import LoadingSpinner from '../../../../common/LoadingSpinner';

const NewBornBabyModal = ({
  isVisible,
  onClose,
  width,
  handleNewBornBabyData,
}) => {
  const initialNewBornState = {
    parentUHID: '',
    gender: '',
    dateOfBirth: '',
    motherName: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialNewBornState);
  const [patientData, setPatientData] = useState([]);

  const resetForm = useCallback(() => setFormData(initialNewBornState), []);

  const isSubmitDisabled = useCallback(() => {
    return (
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.parentUHID ||
      !formData.motherName
    );
  }, [formData]);

  return (
    <Modal
      title="Baby Details"
      open={isVisible}
      onCancel={onClose}
      width={width || ''}
      footer={
        <>
          <Button
            type="default"
            disabled={isSubmitDisabled()}
            onClick={resetForm}>
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleNewBornBabyData(patientData, formData)}
            disabled={isSubmitDisabled()}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              {isLoading && <LoadingSpinner size="sm" />}
              <span style={{marginLeft: '5px'}}>Submit</span>
            </div>
          </Button>
        </>
      }>
      <Space direction="vertical" style={{width: '100%', padding: '10px'}}>
        <NewBornBabyForm
          formData={formData}
          setFormData={setFormData}
          setIsLoading={setIsLoading}
          setPatientData={setPatientData}
        />
      </Space>
    </Modal>
  );
};

export default NewBornBabyModal;
