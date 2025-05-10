import React, {useState, useEffect} from 'react';
import ScheduleAppointmentForm from './ScheduleAppointmentForm';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchDepartments,
  fetchDoctorListByDepartment,
  fetchIdType,
  fetchInternalDoctorList,
  fetchPayorsList,
  fetchRefSrcList,
  fetchRelationType,
} from '../../../../../store/Slices/dropdownSlice';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import CustomContainer from '../../../../../common/CustomContainer';
import ErrorBoundary from '../../../../../Components/ErrorBoundary';
import LoadingSpinner from '../../../../../common/LoadingSpinner';
import {REFERRAL} from '../patientFormConstants';

const BookAppointment = ({patient}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize form data with defaults
  const [formData, setFormData] = useState({
    Department_Name: '',
    Appointment_Date: new Date().toISOString().split('T')[0],
    Doctor_Name: '',
    Sequence_No: '',
    Visit_Type: '3',
    Patient_Type: 's',
    Payor_Name: '',
    Referral_Source: '',
    Doctor_Type: '',
    Internal_Doctor_Name: '',
    External_Doctor_Name: '',
    Staff_Employee_ID: '',
    VIP_Txt: '',
    Cor_Company_name: '',
    Cor_Employee_Id: '',
    Cor_Relationship: '',
    Remarks: '',
    Is_Recurring: false,
    Recurring_Pattern: '',
    Recurring_End_Date: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch dropdown data from Redux store
  const dropdownData = useSelector((state) => state?.dropdown?.data);
  const {
    relationTypeResponse = [],
    doctorListByDepartmentResponse = [],
    appointmentDetailsResponse = [],
    payorsListResponse = [],
    refSrcListResponse = [],
    internalDoctorListResponse = [],
    departmentsResponse = [],
  } = dropdownData || {};

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(fetchRelationType()),
          dispatch(fetchInternalDoctorList()),
          dispatch(fetchDepartments()),
          dispatch(fetchPayorsList()),
          dispatch(fetchRefSrcList()),
          dispatch(fetchIdType()),
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (formData?.Department_Name) {
      dispatch(fetchDoctorListByDepartment(formData?.Department_Name));
    }
  }, [dispatch, formData.Department_Name]);

  // Handle field changes with dependent field resets
  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
      // Reset dependent fields when their parent field changes
      ...(name === 'Department_Name' && {
        Doctor_Name: '',
        Sequence_No: '',
      }),
      ...(name === 'Doctor_Name' && {
        Sequence_No: '',
      }),
      ...(name === 'Patient_Type' && {
        Payor_Name: '',
      }),
      ...(name === 'Referral_Source' && {
        Doctor_Type: '',
        Internal_Doctor_Name: '',
        External_Doctor_Name: '',
        Staff_Employee_ID: '',
        VIP_Txt: '',
        Cor_Company_name: '',
        Cor_Employee_Id: '',
        Cor_Relationship: '',
      }),
      ...(name === 'Doctor_Type' && {
        Internal_Doctor_Name: '',
        External_Doctor_Name: '',
      }),
      ...(name === 'Is_Recurring' &&
        !fieldValue && {
          Recurring_Pattern: '',
          Recurring_End_Date: '',
        }),
    }));

    // Clear error for the changed field
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ''}));
    }
  };

  // Handle field validation on blur
  const handleBlur = (e) => {
    const {name, value} = e.target;
    validateField(name, value);
  };

  // Field validation function
  const validateField = (name, value) => {
    let error = '';

    if (!value) {
      error = 'This field is required';
    } else if (name === 'Appointment_Date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        error = 'Date cannot be in the past';
      }
    } else if (
      name === 'Email' &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = 'Invalid email format';
    }
    // Add more validations as needed

    setErrors((prev) => ({...prev, [name]: error}));
    return !error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      'Department_Name',
      'Appointment_Date',
      'Doctor_Name',
      'Sequence_No',
      'Visit_Type',
      'Patient_Type',
      'Referral_Source',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    // Conditional required fields
    if (formData.Patient_Type !== 's' && !formData.Payor_Name) {
      newErrors.Payor_Name = 'This field is required';
      isValid = false;
    }

    if (Number(formData.Referral_Source) === REFERRAL.DOCTOR) {
      if (!formData.Doctor_Type) {
        newErrors.Doctor_Type = 'This field is required';
        isValid = false;
      }
      if (formData.Doctor_Type === '1' && !formData.Internal_Doctor_Name) {
        newErrors.Internal_Doctor_Name = 'This field is required';
        isValid = false;
      }
      if (formData.Doctor_Type === '0' && !formData.External_Doctor_Name) {
        newErrors.External_Doctor_Name = 'This field is required';
        isValid = false;
      }
    }
    // Add more conditional validations as needed

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      // api Here
      toast.success('Appointment booked successfully!');
      navigate('/op-search');
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      Department_Name: '',
      Appointment_Date: new Date().toISOString().split('T')[0],
      Doctor_Name: '',
      Sequence_No: '',
      Visit_Type: '3',
      Patient_Type: 's',
      Payor_Name: '',
      Referral_Source: '',
      Doctor_Type: '',
      Internal_Doctor_Name: '',
      External_Doctor_Name: '',
      Staff_Employee_ID: '',
      VIP_Txt: '',
      Cor_Company_name: '',
      Cor_Employee_Id: '',
      Cor_Relationship: '',
      Remarks: '',
      Is_Recurring: false,
      Recurring_Pattern: '',
      Recurring_End_Date: '',
    });
    setErrors({});
  };

  return (
    <CustomContainer
      as="main"
      maxWidth="full"
      centeredr
      paddingX="px-2"
      fadeIn
      scrollable
      scrollMaxHeight="max-h-[85vh]">
      <ErrorBoundary>
        {loading && <LoadingSpinner centered />}
        {!loading && (
          <ScheduleAppointmentForm
            formData={formData}
            errors={errors}
            dropdownData={{
              relationTypeResponse,
              doctorListByDepartmentResponse,
              appointmentDetailsResponse,
              payorsListResponse,
              refSrcListResponse,
              internalDoctorListResponse,
              departmentsResponse,
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isSubmitting={isSubmitting}
          />
        )}
      </ErrorBoundary>
    </CustomContainer>
  );
};

export default BookAppointment;
