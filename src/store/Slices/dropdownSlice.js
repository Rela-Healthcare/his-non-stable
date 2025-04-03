import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {OPModuleAgent} from '../../agent/agent';

// Async thunks to fetch dropdown data
export const fetchSalutations = createAsyncThunk(
  'dropdown/fetchSalutations',
  async () => {
    const response = (await OPModuleAgent.getSalutations()).data;
    return response;
  }
);

export const fetchDepartments = createAsyncThunk(
  'dropdown/fetchDepartments',
  async () => {
    const response = (await OPModuleAgent.getDepartments()).data;
    return response;
  }
);

export const fetchMobileCodes = createAsyncThunk(
  'dropdown/fetchMobileCodes',
  async () => {
    const response = (await OPModuleAgent.getMobileCodeList()).data;
    return response;
  }
);

export const fetchMaritalStatus = createAsyncThunk(
  'dropdown/fetchMaritalStatus',
  async () => {
    const response = (await OPModuleAgent.getMaritalStatusList()).data;
    return response;
  }
);

export const fetchOccupation = createAsyncThunk(
  'dropdown/fetchOccupation',
  async () => {
    const response = (await OPModuleAgent.getOccupationList()).data;
    return response;
  }
);

export const fetchNationality = createAsyncThunk(
  'dropdown/fetchNationality',
  async () => {
    const response = (await OPModuleAgent.getNationalityList()).data;
    return response;
  }
);

export const fetchIdType = createAsyncThunk(
  'dropdown/fetchIdType',
  async () => {
    const response = (await OPModuleAgent.getIdTypeList()).data;
    return response;
  }
);

export const fetchCountries = createAsyncThunk(
  'dropdown/fetchCountries',
  async () => {
    const response = (await OPModuleAgent.getCountriesList()).data;
    return response;
  }
);

export const fetchState = createAsyncThunk('dropdown/fetchState', async () => {
  const response = (await OPModuleAgent.getStateList()).data;
  return response;
});

export const fetchRelationType = createAsyncThunk(
  'dropdown/fetchRelationType',
  async () => {
    const response = (await OPModuleAgent.getRelationTypeList()).data;
    return response;
  }
);

export const fetchBloodGroup = createAsyncThunk(
  'dropdown/fetchBloodGroup',
  async () => {
    const response = (await OPModuleAgent.getBloodGroupList()).data;
    return response;
  }
);

export const fetchReligion = createAsyncThunk(
  'dropdown/fetchReligion',
  async () => {
    const response = (await OPModuleAgent.getReligionList()).data;
    return response;
  }
);

export const fetchLanguage = createAsyncThunk(
  'dropdown/fetchLanguage',
  async () => {
    const response = (await OPModuleAgent.getLanguageList()).data;
    return response;
  }
);

export const fetchAreaListByPincode = createAsyncThunk(
  'dropdown/fetchAreaListByPincode',
  async (pincode) => {
    const response = (await OPModuleAgent.getAreaListByPincode()).data;
    return response;
  }
);

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: {
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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle the async actions for salutations, departments, and mobile codes
    builder
      .addCase(fetchSalutations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalutations.fulfilled, (state, action) => {
        state.salutationsResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchSalutations.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departmentsResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchMobileCodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMobileCodes.fulfilled, (state, action) => {
        state.mobileCodeResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchMobileCodes.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle the async actions for the other dropdowns
      .addCase(fetchMaritalStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaritalStatus.fulfilled, (state, action) => {
        state.maritalStatusResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchMaritalStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchOccupation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOccupation.fulfilled, (state, action) => {
        state.occupationResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchOccupation.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchNationality.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNationality.fulfilled, (state, action) => {
        state.nationalityResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchNationality.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchIdType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIdType.fulfilled, (state, action) => {
        state.idTypeResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchIdType.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchState.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchState.fulfilled, (state, action) => {
        state.stateResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchState.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchRelationType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRelationType.fulfilled, (state, action) => {
        state.relationTypeResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchRelationType.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchBloodGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBloodGroup.fulfilled, (state, action) => {
        state.bloodGroupResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchBloodGroup.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchReligion.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReligion.fulfilled, (state, action) => {
        state.religionResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchReligion.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchLanguage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLanguage.fulfilled, (state, action) => {
        state.languageResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchLanguage.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchAreaListByPincode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAreaListByPincode.fulfilled, (state, action) => {
        state.areaListByPincodeResponse = action.payload;
        state.loading = false;
      })
      .addCase(fetchAreaListByPincode.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default dropdownSlice.reducer;
