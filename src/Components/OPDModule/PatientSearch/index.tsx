import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import {Search, X} from 'lucide-react';
import CustomFormField from '../../../common/form/CustomFormField';
import CustomTable from '../../../common/CustomTable';
import LoadingSpinner from '../../../common/LoadingSpinner';
import {OPModuleAgent} from '../../../agent/agent';

type Props = {
  setShowPatientCreation: (val: boolean) => void;
  onEditPatient?: (patient: any) => void;
  defaultData?: any;
};

const PatientSearch: React.FC<Props> = ({
  setShowPatientCreation,
  onEditPatient,
  defaultData,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);
    try {
      const res = await OPModuleAgent.getExistingPatientDetails(query);
      if (res.status === 'success') {
        setResults(res.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="search-wrapper p-4">
      <div className="d-flex flex-column flex-md-row align-items-center gap-3 mb-4 justify-between items-center">
        <div className="flex justify-between items-center w-[300px] relative">
          <CustomFormField
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search by UHID / Mobile"
            className="w-full"
          />
          {query && (
            <X
              size={20}
              onClick={() => setQuery('')}
              className="absolute right-[1rem] text-red-700 cursor-pointer rounded-full hover:bg-slate-300 active:bg-slate-400 transition duration-150 p-1"
            />
          )}
          <Button
            variant="primary"
            onClick={handleSearch}
            className="absolute right-[-2.9rem]">
            <Search size={26} />
          </Button>
        </div>
        <Button variant="primary" onClick={() => setShowPatientCreation(true)}>
          New Patient
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <LoadingSpinner centered />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="flex justify-center items-center text-center font-bold text-lg mt-4 h-[70vh]">
          No patients found
        </div>
      )}

      {!loading && results.length > 0 && (
        <CustomTable
          rowsPerPage={5}
          data={results}
          columns={[
            {label: 'UHID', accessor: 'uhid'},
            {label: 'Name', accessor: 'patientName'},
            {label: 'Gender', accessor: 'gender'},
            {label: 'Date of Birth', accessor: 'dob'},
            {label: 'Mobile No', accessor: 'mobileNo'},
          ]}
          onRowAction={onEditPatient}
        />
      )}
      {!loading && defaultData.length > 0 && (
        <CustomTable
          rowsPerPage={5}
          data={defaultData}
          columns={[
            {label: 'UHID', accessor: 'id'},
            {label: 'Name', accessor: 'patient_Name'},
            {label: 'Gender', accessor: 'gender'},
            {label: 'Date of Birth', accessor: 'dob'},
            {label: 'Mobile No', accessor: 'mobile_No'},
            {label: 'Registere At', accessor: 'created_date'},
          ]}
          onRowAction={onEditPatient}
        />
      )}
    </div>
  );
};

export default React.memo(PatientSearch, (prevProps, nextProps) => {
  return (
    prevProps.defaultData === nextProps.defaultData &&
    prevProps.setShowPatientCreation === nextProps.setShowPatientCreation &&
    prevProps.onEditPatient === nextProps.onEditPatient
  );
});
