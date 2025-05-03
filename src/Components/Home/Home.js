import React, {useCallback, useEffect, useState} from 'react';
import PatientSearch from '../OPDModule/PatientSearch';
import PatientCreation from '../OPDModule/NewPatient/PatientCreation';
import ErrorBoundary from '../ErrorBoundary';
import CustomContainer from '../../common/CustomContainer';
import {OPModuleAgent} from '../../agent/agent';
import LoadingSpinner from '../../common/LoadingSpinner';

const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [defaultData, setDefaultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const UserId = localStorage.getItem('userName');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await OPModuleAgent.getTemporaryOPDPatient(UserId);
        if (res.status === 'success') {
          if (JSON.stringify(res.data) !== JSON.stringify(defaultData)) {
            setDefaultData(res.data);
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
    fetchData();
  }, [UserId, defaultData]);

  const handleEditPatient = useCallback((patient) => {
    setSelectedPatient(patient);
    setShowEdit(true);
  }, []);

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
            />
          )}
          {showCreate && (
            <PatientCreation UserId={UserId} onClose={setShowCreate} />
          )}
          {showEdit && selectedPatient && (
            <PatientCreation
              patient={selectedPatient}
              onClose={() => setShowEdit(false)}
            />
          )}
        </>
      </ErrorBoundary>
    </CustomContainer>
  );
};

export default Home;
