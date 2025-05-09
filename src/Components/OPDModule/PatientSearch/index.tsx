import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import {Search, X} from 'lucide-react';
import CustomFormField from '../../../common/form/CustomFormField';
import CustomTable from '../../../common/CustomTable';
import LoadingSpinner from '../../../common/LoadingSpinner';
import {OPModuleAgent} from '../../../agent/agent';
import {getFormattedShortDate} from '../../../utils/utils';
import {toast} from 'react-toastify';
import ReusableModal from '../../../common/ui/ReusableModal';

type Props = {
  setShowPatientCreation: (val: boolean) => void;
  onEditPatient?: (patient: any) => void;
  defaultData?: any;
  handleDeletePatientAtTemp?: (patient: any) => void;
};

const PatientSearch: React.FC<Props> = ({
  setShowPatientCreation,
  onEditPatient,
  defaultData,
  handleDeletePatientAtTemp,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isBookAppointment, setIsBookAppointment] = useState(false);

  const handleBookAppointment = (patient: any) => {
    setIsBookAppointment(true);
  };

  const handleSearch = async () => {
    setLoading(true);
    if (!query) {
      toast.warn('Please enter UHID or Mobile');
      setLoading(false);
      return;
    }

    try {
      const res = await OPModuleAgent.getExistingPatientDetails(query);
      if (res.status === 'success') {
        setResults(res.data);
        res.data.length === 0 && toast.warn('Incorrect UHID or Mobile Number');
      } else {
        setResults([]);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
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
        <div>
          {defaultData && defaultData.length > 0 && results?.length !== 0 && (
            <Button
              variant="link"
              className="text-decoration-none hover:border-[#3c4b64] text-[#3c4b64] hover:text-[#3c4b64] font-semibold transition duration-150"
              onClick={() => setResults([])}>
              Inprogress Registration
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => setShowPatientCreation(true)}>
            New Patient
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center my-4">
          <LoadingSpinner centered />
        </div>
      )}

      {!loading && results.length > 0 ? (
        <CustomTable
          data={results}
          columns={[
            {label: 'UHID', accessor: 'uhid'},
            {label: 'Name', accessor: 'patientName'},
            {label: 'Gender', accessor: 'gender'},
            {label: 'Date of Birth', accessor: 'dob'},
            {label: 'Mobile No', accessor: 'mobileNo'},
          ]}
          tableName="Search Results"
          rowsPerPage={5}
          onPrimaryAction={onEditPatient}
          onView={handleBookAppointment}
          onBook={handleBookAppointment}
        />
      ) : (
        !loading &&
        defaultData.length > 0 && (
          <CustomTable
            tableName="Inprogress Registration"
            rowsPerPage={5}
            data={defaultData.slice(-1)}
            columns={[
              {label: 'UHID', accessor: 'id'},
              {label: 'Name', accessor: 'patient_Name'},
              {
                label: 'Gender',
                accessor: 'gender',
                render: (item) => {
                  const gender = item.gender?.toLowerCase();
                  const icon = gender === 'male' ? '♂️' : '♀️';
                  return `${icon} ${item.gender.slice(0, 1).toUpperCase()}`;
                },
              },
              {
                label: 'Date of Birth',
                accessor: 'dob',
                render: (item) => getFormattedShortDate(item.dob),
              },
              {label: 'Mobile No', accessor: 'mobile_No'},
            ]}
            onPrimaryAction={onEditPatient}
            onDelete={handleDeletePatientAtTemp}
          />
        )
      )}
      <ReusableModal
        isOpen={isBookAppointment}
        onClose={() => setIsBookAppointment(false)}
        title="Book Appoinment">
        <div>Appoinment content</div>
      </ReusableModal>
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
