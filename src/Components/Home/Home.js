import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import PatientSearch from '../OPDModule/PatientSearch';
import PatientCreation from '../OPDModule/NewPatient/PatientCreation';
import ErrorBoundary from '../ErrorBoundary';

const Home = () => {
  const [showPatientCreation, setShowPatientCreation] = React.useState(false);
  const UserId = useSelector((state) => state.loginInfo.formData.userName);

  return (
    <Container>
      <div
        className="h-[80vh] overflow-y-auto px-2"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE 10+
        }}>
        <style>
          {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>

        <ErrorBoundary>
          <>
            {showPatientCreation ? (
              <PatientCreation
                UserId={UserId}
                setShowPatientCreation={setShowPatientCreation}
              />
            ) : (
              <PatientSearch setShowPatientCreation={setShowPatientCreation} />
            )}
          </>
        </ErrorBoundary>
      </div>
    </Container>
  );
};

export default Home;
