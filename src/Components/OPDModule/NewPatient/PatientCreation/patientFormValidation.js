import {validateID, validateIDType} from '../../../../utils/utils';

export const validateRequired = (value) => {
  return (
    value !== undefined && value !== null && value.toString().trim() !== ''
  );
};

export const validateField = (fieldName, value, validations, formData) => {
  const errors = {};

  if (validations.required && !validateRequired(value)) {
    errors[fieldName] = `${fieldName.replace(/_/g, ' ')} is required`;
    return errors;
  }

  if (
    validations.pattern &&
    value &&
    !validations.pattern(value, formData) // Pass formData here
  ) {
    errors[fieldName] =
      validations.message || `Invalid ${fieldName.replace(/_/g, ' ')}`;
  }

  if (validations.minLength && value && value?.length < validations.minLength) {
    errors[
      fieldName
    ] = `Should be at least ${validations.minLength} characters`;
  }

  return errors;
};

// Define field validation rules
const personalDetailsValidations = {
  SalutionId: {required: true},
  Name: {required: true, minLength: 3},
  DOB: {required: true},
  Gender: {required: true},
  Age: {required: true},
  Nationality: {required: true},
  Marital_Status: {required: true},
  Occupation: {required: true},
  ID_Type: {required: true},
  Mobile_No: {
    required: true,
    pattern: (val) => validateID('mobile', val),
    message: 'Invalid mobile number',
  },
  Email_ID: {
    required: true,
    pattern: (val) => !val || validateID('email', val),
    message: 'Invalid email address',
  },
  ID_No: {
    required: true,
    conditional: (formData) => formData && formData.ID_Type,
    pattern: (val, formData) =>
      formData && validateIDType(formData.ID_Type, val),
    message: 'Invalid ID number',
  },
};

const additionalDetailsValidations = {
  Area: {required: true},
  Religion: {required: true},
  Language: {required: true},
  BloodGroup: {required: true},
  Special_Assistance: {required: true},
  Pincode: {
    required: true,
    pattern: (val) => validateID('pincode', val),
    message: 'Invalid pincode (must be 6 digits)',
  },
  Address: {
    required: true,
    minLength: 10,
  },
  Select_Special_Assistance: {
    conditional: (formData) => formData.Special_Assistance,
    required: true,
  },
};

const nextOfKinValidations = {
  Relation_Type: {required: true},
  Relation_Name: {required: true},
  Kin_Area: {required: true},
  Relation_Mobile_No: {
    required: true,
    pattern: (val) => validateID('mobile', val),
    message: 'Invalid mobile number',
  },
  Kin_Pincode: {
    conditional: (formData, isSameAsPatientAddress) => !isSameAsPatientAddress,
    required: true,
    pattern: (val) => validateID('pincode', val),
    message: 'Invalid pincode (must be 6 digits)',
  },
  Kin_Address: {
    conditional: (formData, isSameAsPatientAddress) => !isSameAsPatientAddress,
    required: true,
  },
};

const appointmentDetailsValidations = {
  Department_Name: {required: true},
  Doctor_Name: {required: true},
  Visit_Type: {required: true},
  Appointment_Date: {required: true},
  Sequence_No: {required: true},
  Patient_Type: {required: true},
  Payor_Name: {
    conditional: (formData) => formData.Patient_Type !== 's',
    required: true,
  },
  Referral_Source: {required: true},
  Doctor_Type: {
    conditional: (formData) => Number(formData.Referral_Source) === 58,
    required: true,
  },
  Internal_Doctor_Name: {
    conditional: (formData) =>
      Number(formData.Referral_Source) === 58 && formData?.Doctor_Type === '1',
    required: true,
  },
  External_Doctor_Name: {
    conditional: (formData) =>
      Number(formData.Referral_Source) === 58 && formData?.Doctor_Type === '0',
    required: true,
  },
  Staff_Employee_ID: {
    conditional: (formData) => Number(formData.Referral_Source) === 76,
    required: true,
  },
  Package_Details: {required: true},
};

// Main validation functions
export const validatePersonalDetails = (formData) => {
  let errors = {};

  Object.keys(personalDetailsValidations).forEach((field) => {
    const validation = personalDetailsValidations[field];

    // Check conditional fields
    if (validation.conditional && !validation.conditional(formData)) {
      return;
    }

    const fieldErrors = validateField(
      field,
      formData[field],
      validation,
      formData
    );

    if (Object.keys(fieldErrors)?.length > 0) {
      errors = {...errors, ...fieldErrors};
    }
  });

  return errors;
};

export const validateAdditionalDetails = (formData) => {
  let errors = {};

  Object.keys(additionalDetailsValidations).forEach((field) => {
    const validation = additionalDetailsValidations[field];

    if (validation.conditional && !validation.conditional(formData)) {
      return;
    }

    const fieldErrors = validateField(field, formData[field], validation);

    if (Object.keys(fieldErrors)?.length > 0) {
      errors = {...errors, ...fieldErrors};
    }
  });

  return errors;
};

export const validateNextOfKin = (formData, isSameAsPatientAddress) => {
  let errors = {};

  Object.keys(nextOfKinValidations).forEach((field) => {
    const validation = nextOfKinValidations[field];

    if (
      validation.conditional &&
      !validation.conditional(formData, isSameAsPatientAddress)
    ) {
      return;
    }

    const fieldErrors = validateField(field, formData[field], validation);

    if (Object.keys(fieldErrors)?.length > 0) {
      errors = {...errors, ...fieldErrors};
    }
  });

  return errors;
};

export const validateScheduleAppointment = (formData) => {
  let errors = {};

  Object.keys(appointmentDetailsValidations).forEach((field) => {
    const validation = appointmentDetailsValidations[field];

    // Check conditional fields
    if (validation.conditional && !validation.conditional(formData)) {
      return;
    }

    const fieldErrors = validateField(
      field,
      formData[field],
      validation,
      formData
    );

    if (Object.keys(fieldErrors)?.length > 0) {
      errors = {...errors, ...fieldErrors};
    }
  });

  return errors;
};
