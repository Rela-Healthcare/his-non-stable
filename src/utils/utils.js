import {format, isValid, parseISO} from 'date-fns';
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export const ageCalculator = (DOB) => {
  const todayDate = new Date();

  const todayDay = todayDate.getDate();

  const todayMonth = todayDate.getMonth();

  const todayYear = todayDate.getFullYear();

  console.log(DOB);

  const dobDate = new Date(DOB);

  const dobDay = dobDate.getDate();

  const dobMonth = dobDate.getMonth();

  const dobYear = dobDate.getFullYear();

  let ageInYears;

  //2023-2000 ==> age in years = 23

  let ageInMonths;

  // 6-5 ==> age in months = 1 || 5-5 ==> age in months = 0 || 4-5 ==> age in months = -1
  // todayMonth > dobmonth     || todaymonth == dobmonth    || todayMonth < dobMonth
  // 1 months old              ||  0 month old              || -1+12 = 11 months ol

  let ageInDays;

  // 27-17 ==> age in days = 10 || 17-17 ==> age in days = 0 || 7-17 ==> age in days = -10
  // todayDay > dobDay          || todayDay == dobDay        || todayDay < dobDay
  // 10 days old                || 0 days old                ||

  if (
    todayMonth > dobMonth ||
    (todayMonth === dobMonth && todayDay >= dobDay)
  ) {
    ageInYears = todayYear - dobYear;
  } else {
    ageInYears = todayYear - dobYear - 1;
  }

  if (todayDay >= dobDay) {
    ageInMonths = todayMonth - dobMonth;
  } else if (todayDay < dobDay) {
    ageInMonths = todayMonth - dobMonth - 1;
  }
  // make month positive
  ageInMonths = ageInMonths < 0 ? ageInMonths + 12 : ageInMonths;

  var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (todayDay >= dobDay) {
    ageInDays = todayDay - dobDay;
  } else {
    ageInDays = todayDay - dobDay + monthDays[dobMonth];
  }

  console.log(ageInYears);
  return `${ageInYears} years ${ageInMonths} months ${ageInDays} days`;
};

/**
 * Returns a string representing the given date in the format:
 * DD/MM/YYYY HH:MM:SS AM/PM Exampl: 24/03/2025 11:29:06 AM
 *
 * @param {Date} [date] - The date to format. Defaults to the current date.
 * @returns {string} The formatted date string.
 */
export const getFormattedDate = (date = new Date()) => {
  const pad = (num) => num.toString().padStart(2, '0');

  // Extract parts of the date
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Convert to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert '0' hour to '12' for AM/PM format

  return `${day}/${month}/${year} ${pad(hours)}:${minutes}:${seconds} ${ampm}`;
};

/**
 * Returns a string representing the given date in the format:
 * DD/MMM/YYYY example: 24/Mar/2025
 * If use like getFormattedShortDate() // Current date: "24/Mar/2025"
 * If use like getFormattedShortDate(new Date("2025-03-24")) // Specific date: "24/Mar/2025"
 * @param {Date} [date] - The date to format. Defaults to the current date.
 * @returns {string} The formatted date string.
 */
export const getFormattedShortDate = (date = new Date()) => {
  const pad = (num) => num.toString().padStart(2, '0');

  // Month abbreviations
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract parts of the date
  const day = pad(date.getDate());
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const generateProcessingId = (patientMobileNo) => {
  const mobileNo = patientMobileNo ? patientMobileNo.toString() : '0000'; // Default to "0000"

  return (
    mobileNo.slice(-4) +
    new Date().getHours().toString().padStart(2, '0') +
    new Date().getMinutes().toString().padStart(2, '0') +
    new Date().getSeconds().toString().padStart(2, '0')
  );
};

export const convertToSelectOptions = (data) => {
  return data
    .filter((item) => item.columnName) // Ensure valid labels
    .map((item) => ({
      value:
        typeof item.columnCode === 'string'
          ? item.columnCode
          : Number(item.columnCode),
      label: item.columnName,
    }));
};

export const validateIDType = (type, value) => {
  switch (type) {
    case '1014':
      return validateID('aadhaar', value);
    case '1016':
      return validateID('pan', value);
    case '5':
      return validateID('passport', value);
    case '1015':
      return validateID('drivingLicence', value);
    case '9':
      return validateID('policeArmyID', value);
    case '1017':
      return validateID('voterID', value);
    default:
      return false;
  }
};

export const validateID = (type, value) => {
  /* 
  ID Type        Pattern                  Example
  -----------------------------------------------
  * Aadhaar      12-digit (No leading 0/1)   234567890123
  * Driving Licence  State Code + Digits     MH-12-1234567890
  * PAN Card     ABCDE1234F              ABCDE1234F
  * Passport     A1234567                A1234567
  * Police/Army ID  5-15 Alphanumeric        IND12345
  * Voter ID     XYZ1234567              XYZ1234567 
  * Mobile       10-digit (Starts 6-9)       9876543210
  * Pincode      6-digit                    600061
  * Email        Standard Email Format       example@domain.com
  */

  const patterns = {
    aadhaar: /^[2-9]{1}[0-9]{11}$/,
    drivingLicence: /^[A-Z]{2}[-]?[0-9]{2}[-]?[0-9]{6,10}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    passport: /^[A-Z][0-9]{7}$/,
    policeArmyID: /^[A-Z0-9]{5,15}$/,
    voterID: /^[A-Z]{3}[0-9]{7}$/,
    mobile: /^[6-9]\d{9}$/,
    pincode: /^[1-9][0-9]{5}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };

  return patterns[type]?.test(value) || false;
};

export const calculateAgeByDOB = (DOB) => {
  const today = new Date();
  const birthDate = new Date(DOB);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Formats a date string into 'dd/MM/yyyy' format.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string or an empty string if the date is invalid.
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString); // Parse the date string into a Date object
  if (!isValid(date)) return ''; // Return an empty string if the date is invalid
  return format(date, 'dd/MM/yyyy'); // Format the date into 'dd/MM/yyyy'
};

/**
 * Converts a date picker object to a string in 'YYYY-MM-DD' format.
 *
 * @param {Object} datePickerObject - The date picker object to convert.
 * @returns {string} The formatted date string or an empty string if the input is invalid.
 */
export const dateObjectToString = (dateObj) => {
  return dateObj ? format(dateObj, 'yyyy-MM-dd') : '';
};

export const stringToObjectDate = (dateValue) => {
  if (!dateValue) return null;
  if (typeof dateValue === 'string') {
    const parsedDate = parseISO(dateValue);
    return isValid(parsedDate) ? parsedDate : null;
  }
  return dateValue;
};

export const capitalize = (str) => {
  if (!str || str.trim() === '') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const upperCase = (value) => {
  if (typeof value !== 'string') return value;
  return value.toUpperCase();
};

export const lowerCase = (value) => {
  if (typeof value !== 'string') return value;
  return value.toLowerCase();
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Example usage:
// console.log(truncateString(7, 'bharathkumar')); // Output: bharath...
export const truncateString = (maxLength, str) => {
  if (typeof str !== 'string') return;
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

export const formatPrice = (amount) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};