import {calculateAgeByDOB} from '../../../../utils/utils';

export const validateRequired = (value) => {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (typeof value === 'number') {
    return true;
  }

  return false;
};

export const validateAge = (dob) => {
  if (!dob) return false;
  const parsedDOB = new Date(dob);
  if (isNaN(parsedDOB.getTime())) return false;

  const age = calculateAgeByDOB(parsedDOB);
  return age >= 0 && age <= 120;
};

export const validatePersonalDetails = (
  formData,
  validateID,
  validateIDType
) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    if (!validateRequired(formData[key])) {
      errors[key] = `${key.replace(/_/g, ' ')} is required`;
    }
    if (key === 'DOB' && !validateAge(formData.DOB)) {
      errors.DOB = 'Invalid date of birth';
    }
  });

  if (formData.Name.length < 3) {
    errors.Name = 'Name must be at least 3 characters';
  }

  if (formData.ID_Type && !validateIDType(formData.ID_Type, formData.ID_No)) {
    errors.ID_No = 'Invalid ID number for selected type';
  }

  if (!validateID('mobile', formData.Mobile_No)) {
    errors.Mobile_No = 'Invalid mobile number (10 digits required)';
  }

  if (formData.Email_ID && !validateID('email', formData.Email_ID)) {
    errors.Email_ID = 'Invalid email address';
  }

  return errors;
};

export const validateAdditionalDetails = (formData, validateID) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    if (key === 'Spl_Assist_Remarks' || key === 'Update_Death_Date') {
      return;
    }
    if (!validateRequired(formData[key])) {
      errors[key] = `${key.replace(/_/g, ' ')} is required`;
    }
  });

  if (!validateRequired(formData.Address)) {
    errors.Address = 'Address is required';
  } else if (formData.Address.length < 8) {
    errors.Address = 'Address is too short';
  }

  if (formData.Special_Assistance && !formData.Select_Special_Assistance) {
    errors.Select_Special_Assistance = 'Please select assistance type';
  }

  if (
    formData.Special_Assistance &&
    formData.Select_Special_Assistance === 'Other'
  ) {
    if (!validateRequired(formData.Spl_Assist_Remarks)) {
      errors.Spl_Assist_Remarks = 'Please enter assistance type';
    }
  }

  return errors;
};

export const validateNextOfKin = (
  formData,
  validateID,
  isCheckedSameAsPatientAddress
) => {
  const errors = {};

  console.log('formData', formData);
  Object.keys(formData).forEach((key) => {
    if (!validateRequired(formData[key])) {
      errors[key] = `${key.replace(/_/g, ' ')} is required`;
    }
  });

  if (
    !validateID('mobile', formData.Relation_Mobile_No) &&
    validateRequired(formData.Relation_Mobile_No)
  ) {
    errors.Relation_Mobile_No = 'Invalid mobile number (10 digits required)';
  }

  return errors;
};
