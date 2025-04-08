import React, {useEffect, useState} from 'react';
import PatientPersonCreation from '../OPDModule/NewPatient/PatientCreation/PatientPersonCreation';
import {useDispatch, useSelector} from 'react-redux';
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
} from '../../store/Slices/dropdownSlice'; // Assume we create a batch fetch action
import ErrorBoundary from '../ErrorBoundary';

const Home = () => {
  const dispatch = useDispatch();
  const UserId = useSelector((state) => state.loginInfo.formData.userName);
  const initialPatientData = {
    SalutionId: null,
    Name: '',
    DOB: '',
    Age: null,
    Gender: '',
    Nationality: null,
    ID_Type: null,
    ID_No: '',
    Marital_Status: '',
    Mobile_No: '',
    Email_ID: '',
    Occupation: null,
    Pincode: '',
    Country: null,
    State: null,
    City: null,
    Area: null,
    Address: '',
    Religion: null,
    Language: null,
    BloodGroup: null,
    Special_Assistance: null,
    Select_Special_Assistance: '',
    Spl_Assist_Remarks: '',
    Update_Death_Date: '',
    Relation_Type: null,
    Relation_Name: '',
    Relation_Mobile_No: '',
    Kin_Pincode: '',
    Kin_Country: null,
    Kin_State: null,
    Kin_City: null,
    Kin_Area: null,
    Kin_Address: '',
    pat_Is_symptoms: false,
    pat_Is_historyoffever: false,
    pat_Is_outofcountry1month: false,
    pat_Is_diseaseoutbreak: false,
    pat_Is_healthcareworker: false,
    pat_Is_disease_last1month: false,
    pat_Is_chickenpox: false,
    pat_Is_measles: false,
    pat_Is_mumps: false,
    pat_Is_rubella: false,
    pat_Is_diarrheasymptoms: false,
    pat_Is_activeTB: false,
    Department_Name: null,
    Doctor_Name: null,
    Visit_Type: null,
    Appointment_Date: '',
    Sequence_No: null,
    Patient_Type: '',
    Payor_Name: null,
    Referral_Source: null,
    Doctor_Type: '',
    Internal_Doctor_Name: null,
    External_Doctor_Name: null,
    Staff_Employee_ID: '',
    Package_Details: '',
    Gross_Amount: null,
    Final_Discount: null,
    Total_Amount: null,
    Coupon_Balance: null,
    Apply_Coupon: null,
    Payment_Mode: '',
    Net_Payable_Amount: null,
    UserId: '',
  };

  // Modularizing state handling, could break it further as needed
  const [formData, setFormData] = useState({
    OP_Master: [
      {
        Service_Group: null,
        Service: null,
        Priority: null,
        Rate: null,
        Discount_Type: '',
        AMOUNT: null,
        Discount: null,
        Amount_Ttl: null,
        Remarks: '',
        Discount_Reason: '',
      },
    ],
    ...initialPatientData, // This should be an object holding other patient data
  });

  // Optimized useEffect for fetching all necessary data
  useEffect(() => {
    dispatch(fetchSalutations());
    dispatch(fetchMaritalStatus());
    dispatch(fetchRelationType());
    dispatch(fetchBloodGroup());
    dispatch(fetchReligion());
    dispatch(fetchLanguage());
    dispatch(fetchCountries());
    dispatch(fetchState());
    dispatch(fetchOccupation());
    dispatch(fetchNationality());
    dispatch(fetchIdType());
    dispatch(fetchMobileCodes());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <ErrorBoundary>
        <PatientPersonCreation
          UserId={UserId}
          // patientForm={formData}
          // handleInputChange={handleInputChange}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Home;
