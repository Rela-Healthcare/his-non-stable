import React from 'react';
import {capitalize} from '../../../../../utils/utils';

interface PatientDetails {
  Name: string;
  Mobile_No: string;
  Email_ID: string;
  Age: string;
  Gender: string;
  UHID?: string;
}

interface PatientDetailsCardProps {
  patient?: PatientDetails;
}

const PatientDetailRow: React.FC<{label: string; value: string}> = ({
  label,
  value,
}) => (
  <div className="w-full flex justify-between items-center py-1">
    <span className="text-[#838383] font-bold text-xs sm:text-sm">{label}</span>
    <span className="text-black font-bold text-xs sm:text-sm mx-1">:</span>
    <span className="text-black font-bold text-xs sm:text-sm flex-1 text-right truncate">
      {value || 'Not Available'}
    </span>
  </div>
);

export const PatientDetailsCard: React.FC<PatientDetailsCardProps> = ({
  patient,
}) => {
  const patientData = {
    Name: capitalize(patient?.Name) || 'Not Available',
    Mobile_No: patient?.Mobile_No || 'Not Available',
    Age: patient?.Age || 'Not Available',
    Gender: patient?.Gender || 'Not Available',
    UHID: patient?.UHID || 'UHID000000',
  };

  return (
    <div className="border-b-2 border-slate-200 px-2 sm:px-4 py-2">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
        Patient Information
      </h3>
      <div className="flex flex-col">
        {/* Stack rows vertically on small screens */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
          <div className="w-full sm:w-1/2 mb-2 sm:mb-0">
            <PatientDetailRow label="Patient Name" value={patientData.Name} />
          </div>
          <div className="w-full sm:w-1/2">
            <PatientDetailRow label="UHID" value={patientData.UHID} />
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:space-x-4 mt-1 sm:mt-2">
          <div className="w-full sm:w-1/2 mb-2 sm:mb-0">
            <PatientDetailRow label="Mobile" value={patientData.Mobile_No} />
          </div>
          <div className="w-full sm:w-1/2">
            <PatientDetailRow
              label="Age/Gender"
              value={`${patientData.Age}/${patientData.Gender}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
