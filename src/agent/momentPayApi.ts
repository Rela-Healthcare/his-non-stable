import axios from 'axios';

const BASE_URL = process.env.REACT_APP_MOMENT_PAY_BASE_URL!;

export const initiatePayment = async (payload: any) => {
  const response = await axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
