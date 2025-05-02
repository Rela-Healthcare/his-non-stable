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
    <span className="text-[#838383] font-bold text-sm">{label}</span>
    <span className="text-black font-bold text-sm ml-2">:</span>
    <span className="text-black font-bold text-sm flex-1 text-right ml-2">
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
    <div className="border-b-2 border-slate-200">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        Patient Information
      </h3>
      <div className="flex flex-col items-center justify-between">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="w-5/12">
              <PatientDetailRow label="Patient Name" value={patientData.Name} />
            </div>
            <div className="w-5/12">
              <PatientDetailRow label="UHID" value={patientData.UHID} />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="w-5/12">
              <PatientDetailRow label="Mobile" value={patientData.Mobile_No} />
            </div>
            <div className="w-5/12">
              <PatientDetailRow
                label="Age/Gender"
                value={`${patientData.Age}/${patientData.Gender}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
