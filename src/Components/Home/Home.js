import React, {useEffect, useState} from 'react';
import PatientPersonDetailFrom from './PatientPersonDetailFrom';
import {
  fetchSalutations,
  fetchDepartments,
  fetchMobileCodes,
  fetchMaritalStatus,
  fetchOccupation,
  fetchNationality,
  fetchIdType,
  fetchCountries,
  fetchState,
  fetchRelationType,
  fetchBloodGroup,
  fetchReligion,
  fetchLanguage,
} from '../../store/Slices/dropdownSlice';
import {useDispatch} from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  // Initialize state with the provided payload structure
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
  });

  // Dispatch fetch actions on component mount
  useEffect(() => {
    dispatch(fetchSalutations());
    dispatch(fetchDepartments());
    dispatch(fetchMobileCodes());
    dispatch(fetchMaritalStatus());
    dispatch(fetchOccupation());
    dispatch(fetchNationality());
    dispatch(fetchIdType());
    dispatch(fetchCountries());
    dispatch(fetchState());
    dispatch(fetchRelationType());
    dispatch(fetchBloodGroup());
    dispatch(fetchReligion());
    dispatch(fetchLanguage());
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <PatientPersonDetailFrom
        formData={formData}
        handleInputChange={handleInputChange}
      />
      {/* Evaluation From */}
      {/* Appointment Form */}
      {/* Op Service From  */}
      {/* Payment Form  */}
    </div>
  );
};

export default Home;
