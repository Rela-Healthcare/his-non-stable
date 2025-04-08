import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {OPModuleAgent} from '../../agent/agent';
import {convertToSelectOptions} from '../../utils/utils';

// Helper to create thunks
const createDropdownThunk = (name, apiCall) =>
  createAsyncThunk(`dropdown/${name}`, async (arg) => {
    const apiData = (await apiCall(arg)).data;
    return convertToSelectOptions(apiData);
  });

// Define thunks
export const fetchSalutations = createDropdownThunk(
  'fetchSalutations',
  OPModuleAgent.getSalutations
);
export const fetchDepartments = createDropdownThunk(
  'fetchDepartments',
  OPModuleAgent.getDepartments
);
export const fetchMobileCodes = createDropdownThunk(
  'fetchMobileCodes',
  OPModuleAgent.getMobileCodeList
);
export const fetchMaritalStatus = createDropdownThunk(
  'fetchMaritalStatus',
  OPModuleAgent.getMaritalStatusList
);
export const fetchOccupation = createDropdownThunk(
  'fetchOccupation',
  OPModuleAgent.getOccupationList
);
export const fetchNationality = createDropdownThunk(
  'fetchNationality',
  OPModuleAgent.getNationalityList
);
export const fetchIdType = createDropdownThunk(
  'fetchIdType',
  OPModuleAgent.getIdTypeList
);
export const fetchCountries = createDropdownThunk(
  'fetchCountries',
  OPModuleAgent.getCountriesList
);
export const fetchState = createDropdownThunk(
  'fetchState',
  OPModuleAgent.getStateList
);
export const fetchRelationType = createDropdownThunk(
  'fetchRelationType',
  OPModuleAgent.getRelationTypeList
);
export const fetchBloodGroup = createDropdownThunk(
  'fetchBloodGroup',
  OPModuleAgent.getBloodGroupList
);
export const fetchReligion = createDropdownThunk(
  'fetchReligion',
  OPModuleAgent.getReligionList
);
export const fetchLanguage = createDropdownThunk(
  'fetchLanguage',
  OPModuleAgent.getLanguageList
);

export const fetchAreaListByPincode = createAsyncThunk(
  'dropdown/fetchAreaListByPincode',
  async (pincode) => {
    const apiData = (await OPModuleAgent.getAreaListByPincode(pincode)).data;
    return apiData
      .filter((item) => item.columnName) // Ensure valid labels
      .map((item) => ({
        value: String(item.columnName).toLowerCase(),
        label: item.columnName,
      }));
  }
);

// Initial state
const initialState = {
  data: {
    salutationsResponse: [],
    departmentsResponse: [],
    mobileCodeResponse: [],
    maritalStatusResponse: [],
    occupationResponse: [],
    nationalityResponse: [],
    idTypeResponse: [],
    countriesResponse: [],
    stateResponse: [],
    relationTypeResponse: [],
    bloodGroupResponse: [],
    religionResponse: [],
    languageResponse: [],
    areaListByPincodeResponse: [],
  },
  loading: false,
  error: null,
};

// Mapping between thunk and the relevant state key
const thunkToKeyMap = [
  {thunk: fetchSalutations, key: 'salutationsResponse'},
  {thunk: fetchDepartments, key: 'departmentsResponse'},
  {thunk: fetchMobileCodes, key: 'mobileCodeResponse'},
  {thunk: fetchMaritalStatus, key: 'maritalStatusResponse'},
  {thunk: fetchOccupation, key: 'occupationResponse'},
  {thunk: fetchNationality, key: 'nationalityResponse'},
  {thunk: fetchIdType, key: 'idTypeResponse'},
  {thunk: fetchCountries, key: 'countriesResponse'},
  {thunk: fetchState, key: 'stateResponse'},
  {thunk: fetchRelationType, key: 'relationTypeResponse'},
  {thunk: fetchBloodGroup, key: 'bloodGroupResponse'},
  {thunk: fetchReligion, key: 'religionResponse'},
  {thunk: fetchLanguage, key: 'languageResponse'},
  {thunk: fetchAreaListByPincode, key: 'areaListByPincodeResponse'},
];

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    thunkToKeyMap.forEach(({thunk, key}) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          if (state.data[key] === 'areaListByPincodeResponse') {
            console.log(state.data[key]);
          }
          state.data[key] = action.payload;
          state.loading = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    });
  },
});

export default dropdownSlice.reducer;
