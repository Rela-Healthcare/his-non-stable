import React, {useState} from 'react';
import {Button, Spinner} from 'react-bootstrap';
import {Search, X} from 'lucide-react';
import CustomFormField from '../../../common/form/CustomFormField';
import {OPModuleAgent} from '../../../agent/agent';
import {toast} from 'react-toastify';
import CustomTable from '../../../common/CustomTable';

export default function PatientSearch({setShowPatientCreation}) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);
    const filtered = await fetchData(query);
    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
      setSearched(true);
    }, 1000);
  };

  const handleEdit = (patient) => {
    setCurrentPatient(patient);
    setEditModalShow(true);
  };

  const handleSaveEdit = () => {
    setResults((prev) =>
      prev.map((patient) =>
        patient.uhid === currentPatient.uhid ? currentPatient : patient
      )
    );
    setEditModalShow(false);
  };

  async function fetchData(searchInput) {
    try {
      const getExistingResponse = await OPModuleAgent.getExistingPatientDetails(
        searchInput
      );

      if (getExistingResponse.status === 'success') {
        return getExistingResponse.data;
      } else {
        toast.warn('No records found!');
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }

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
            className="w-md-auto mx-0 border-l-0 rounded-l-none absolute right-[-2.9rem] hover:bg-slate-900">
            <Search size={26} />
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowPatientCreation(true)}
          className="w-md-auto">
          New Patient
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="flex justify-center items-center text-center font-inter font-bold text-lg mt-4 h-[70vh]">
          No patients found
        </div>
      )}

      {!loading && (
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
          onRowAction={handleEdit}
        />
      )}
    </div>
  );
}
