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
