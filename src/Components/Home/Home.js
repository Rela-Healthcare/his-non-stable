import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import PatientSearch from '../OPDModule/PatientSearch';
import {
  fetchSalutations,
  fetchMaritalStatus,
  fetchRelationType,
  fetchBloodGroup,
  fetchReligion,
  fetchLanguage,
  fetchCountries,
  fetchState,
  fetchOccupation,
  fetchNationality,
  fetchIdType,
  fetchMobileCodes,
  fetchDepartments,
  fetchPayorsList,
  fetchRefSrcList,
  fetchInternalDoctorList,
  fetchExternalDoctorList,
  fetchServiceGroupList,
  fetchPriorityList,
} from '../../store/Slices/dropdownSlice'; // Assume we create a batch fetch action
import PatientCreation from '../OPDModule/NewPatient/PatientCreation';
import ErrorBoundary from '../ErrorBoundary';

const Home = () => {
  const dispatch = useDispatch();
  const [showPatientCreation, setShowPatientCreation] = React.useState(false);
  const UserId = useSelector((state) => state.loginInfo.formData.userName);

  // Optimized useEffect for fetching all necessary data
  useEffect(() => {
    // persional, addional details, next of kin, evaluation, appointment
    dispatch(fetchSalutations());
    dispatch(fetchMaritalStatus());
    dispatch(fetchOccupation());
    dispatch(fetchBloodGroup());
    dispatch(fetchReligion());
    dispatch(fetchLanguage());
    dispatch(fetchIdType());
    dispatch(fetchMobileCodes());
    dispatch(fetchNationality());
    dispatch(fetchCountries());
    dispatch(fetchState());
    dispatch(fetchRelationType());
    dispatch(fetchDepartments());
    dispatch(fetchPayorsList());
    dispatch(fetchRefSrcList());
    dispatch(fetchInternalDoctorList());
    dispatch(fetchExternalDoctorList());
    dispatch(fetchServiceGroupList());
    dispatch(fetchPriorityList());
  }, [dispatch]);

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
              <PatientCreation UserId={UserId} setShowPatientCreation={setShowPatientCreation} />
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
