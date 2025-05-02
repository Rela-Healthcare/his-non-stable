import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MomentPay} from '../../../sdk/momentPaySdk';

interface MomentPayState {
  instance: MomentPay | null;
  isLoading: boolean;
  error: string | null;
  transactionStatus: 'idle' | 'pending' | 'success' | 'failed';
  lastTransactionId: string | null;
}

const initialState: MomentPayState = {
  instance: null,
  isLoading: false,
  error: null,
  transactionStatus: 'idle',
  lastTransactionId: null,
};

const momentPaySlice = createSlice({
  name: 'momentPay',
  initialState,
  reducers: {
    initializeSDK(state) {
      if (!state.instance) {
        state.instance = new MomentPay();
      }
    },
    startPayment(state) {
      state.isLoading = true;
      state.error = null;
      state.transactionStatus = 'pending';
    },
    paymentSuccess(state, action: PayloadAction<{transactionId: string}>) {
      state.isLoading = false;
      state.transactionStatus = 'success';
      state.lastTransactionId = action.payload.transactionId;
    },
    paymentFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.transactionStatus = 'failed';
    },
    resetState(state) {
      Object.assign(state, initialState);
      if (state.instance) {
        state.instance.close();
      }
    },
  },
});

export const {
  initializeSDK,
  startPayment,
  paymentSuccess,
  paymentFailed,
  resetState,
} = momentPaySlice.actions;

// Selectors
export const selectMomentPayInstance = (state: {momentPay: MomentPayState}) =>
  state.momentPay.instance;
export const selectPaymentStatus = (state: {momentPay: MomentPayState}) => ({
  isLoading: state.momentPay.isLoading,
  error: state.momentPay.error,
  status: state.momentPay.transactionStatus,
  lastTransactionId: state.momentPay.lastTransactionId,
});

export default momentPaySlice.reducer;
