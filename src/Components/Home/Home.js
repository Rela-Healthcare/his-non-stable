import React, {useCallback, useEffect, useState} from 'react';
import PatientSearch from '../OPDModule/PatientSearch';
import PatientCreation from '../OPDModule/NewPatient/PatientCreation';
import ErrorBoundary from '../ErrorBoundary';
import CustomContainer from '../../common/CustomContainer';
import {OPModuleAgent} from '../../agent/agent';
import LoadingSpinner from '../../common/LoadingSpinner';
import {toast} from 'react-toastify';
import {useConfirmDialog} from '../../hooks/useConfirmDialog';

const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [defaultData, setDefaultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNeedRefresh, setIsNeedRefresh] = useState(true);
  const UserId = localStorage.getItem('userName');
  const {confirm, ConfirmDialogComponent} = useConfirmDialog();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await OPModuleAgent.getTemporaryOPDPatient(UserId);
        const res1 = await OPModuleAgent.getPatientList();
        if (res.status === 'success') {
          if (JSON.stringify(res.data) !== JSON.stringify(defaultData)) {
            setDefaultData(res.data);
          }
        } else if (res1.status === 'success') {
          if (JSON.stringify(res1.data) !== JSON.stringify(defaultData)) {
            setDefaultData(res1.data);
          }
        } else {
          defaultData && defaultData.length > 0 && setDefaultData([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (isNeedRefresh) {
      fetchData();
      setIsNeedRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserId, isNeedRefresh]);

  const handleResetLocalData = () => {
    localStorage.removeItem('formStatus');
    localStorage.removeItem('activeAccordions');
    localStorage.removeItem('personalDetails');
    localStorage.removeItem('additionalDetails');
    localStorage.removeItem('nextOfKinDetails');
    localStorage.removeItem('evaluationDetails');
    localStorage.removeItem('appointmentDetails');
    localStorage.removeItem('paymentDetails');
    localStorage.removeItem('serviceDetails');
  };

  const handleEditPatient = useCallback((patient) => {
    setSelectedPatient(patient);
    setShowEdit(true);
  }, []);

  const handleDeletePatientAtTemp = useCallback(
    async (patient) => {
      setLoading(true);
      const payload = {
        ID: patient.id,
        UserId,
      };

      const confirmed = await confirm(
        'Delete Confirmation',
        'Are you sure you want to delete this record?'
      );

      try {
        if (confirmed) {
          const res = await OPModuleAgent.deleteTemporaryOPDPatient(payload);
          if (res.status === 'success') {
            handleResetLocalData();
            toast.success('Patient deleted successfully');
          }
          setIsNeedRefresh(true);
          handleResetLocalData();
        } else {
          console.log('Delete cancelled.');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [UserId, confirm]
  );

  return (
    <CustomContainer
      as="main"
      maxWidth="full"
      centered
      paddingX="px-2"
      fadeIn
      scrollable
      scrollMaxHeight="max-h-[85vh]">
      <ErrorBoundary>
        <>
          {loading && <LoadingSpinner centered />}
          {!showCreate && !showEdit && !loading && (
            <PatientSearch
              setShowPatientCreation={setShowCreate}
              onEditPatient={handleEditPatient}
              defaultData={defaultData}
              handleDeletePatientAtTemp={handleDeletePatientAtTemp}
            />
          )}
          {showCreate && (
            <PatientCreation
              UserId={UserId}
              onClose={() => setShowCreate(false)}
              onRefresh={() => setIsNeedRefresh(!isNeedRefresh)}
            />
          )}
          {showEdit && selectedPatient && (
            <PatientCreation
              isEditMode={true}
              patient={selectedPatient}
              onClose={() => setShowEdit(false)}
              UserId={UserId}
              onRefresh={() => setIsNeedRefresh(!isNeedRefresh)}
            />
          )}
          <ConfirmDialogComponent />
        </>
      </ErrorBoundary>
    </CustomContainer>
  );
};

export default Home;
