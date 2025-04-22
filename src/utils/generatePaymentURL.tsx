export interface PaymentURLParams {
  patientName: string;
  uhid: string;
  chargeRate: number;
  email: string;
  mobileNo: string;
  processingId: string;
  uname?: string;
  payMode?: string;
}

const generatePaymentURL = ({
  patientName,
  uhid,
  chargeRate,
  email,
  mobileNo,
  processingId,
  uname = 'MEFTECmeftec',
  payMode = '',
}: PaymentURLParams): string => {
  const baseURL = 'https://www.relainstitute.in/DataAegis_Live/';
  const queryParams = new URLSearchParams({
    patientName,
    uhid,
    chargerate: chargeRate.toString(),
    email,
    mobileno: mobileNo,
    processingid: processingId,
    uname,
    paymode: payMode,
  });

  return `${baseURL}?${queryParams.toString()}`;
};

export default generatePaymentURL;
