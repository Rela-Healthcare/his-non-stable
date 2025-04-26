import React, {useState, useEffect} from 'react';
import axios from 'axios';
import forge from 'node-forge';

const PaymentForm = () => {
  const [patientID, setPatientID] = useState('UHID000001');
  const [patientName, setPatientName] = useState('Bharath');
  const [chargeRate, setChargeRate] = useState(1);
  const [email, setEmail] = useState('Barathtechbumbles@gmail.com');
  const [mobileNo, setMobileNo] = useState('8610130371');
  const [processingID, setProcessingID] = useState('TXN000001');
  const [token, setToken] = useState('');
  const [mid] = useState('KkZma9ph');
  const [checkSumHash, setCheckSumHash] = useState('');

  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search);
    // setPatientID(urlParams.get('PatientID') || '');
    // setPatientName(urlParams.get('PatientName') || '');
    // setChargeRate(urlParams.get('ChargeRate') || '');
    // setEmail(urlParams.get('Email') || '');
    // setMobileNo(urlParams.get('MobileNo') || '');
    // setProcessingID(urlParams.get('ProcessingID') || '');
  }, []);

  const generateHash = (plainText) => {
    const md = forge.md.sha256.create();
    md.start();
    md.update(plainText, 'utf8');
    const hashText = md.digest().toHex();
    return btoa(hashText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myVal = JSON.stringify({
      auth: {
        user: 'jrsuperspecialityadmin',
        key: 'ebSQrwGuVVbZwq6TCLTm25eO0AXWIjlYoytBjFvxYjLkUZeXa0',
      },
      username: 'Patient',
      accounts: [
        {
          patient_name: patientName,
          account_number: `UHID${patientID}`,
          amount: chargeRate,
          email: email,
          phone: mobileNo,
        },
      ],
      processing_id: processingID,
      paymode: '',
      transaction_type: '',
      package_code: '',
      appointment_id: '',
      payment_location: 'Test Hospital',
      return_url:
        'https://www.relainstitute.in/his_payment/Forms/payment_result_live.aspx',
      response_url:
        'https://www.relainstitute.in/his_payment/Forms/payment_result_live.aspx',
    });

    setToken(myVal);

    const hash = generateHash(
      `jrsuperspecialityadmin|uwVoleGcWIHfgUwgmOMYR8lgx1G7gCz6|${processingID}|KkZma9ph|qKJQDElYtyVwGH8i9mCcVMiCOgH1puYm`
    );
    setCheckSumHash(hash);

    try {
      const response = await axios.post(
        'https://testing.momentpay.in/ma/v2/extended-iframe-payment',
        {
          PatientID: patientID,
          PatientName: patientName,
          ChargeRate: chargeRate,
          Email: email,
          MobileNo: mobileNo,
          ProcessingID: processingID,
          token: myVal,
          mid: 27,
          check_sum_hash: hash,
        }
      );
      console.log('Form submitted successfully', response.data);
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="hidden"
        value={patientID}
        onChange={(e) => setPatientID(e.target.value)}
      />
      <input
        type="hidden"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      <input
        type="hidden"
        value={chargeRate}
        onChange={(e) => setChargeRate(e.target.value)}
      />
      <input
        type="hidden"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="hidden"
        value={mobileNo}
        onChange={(e) => setMobileNo(e.target.value)}
      />
      <input
        type="hidden"
        value={processingID}
        onChange={(e) => setProcessingID(e.target.value)}
      />
      <input type="hidden" value={token} />
      <input type="hidden" value={mid} />
      <input type="hidden" value={checkSumHash} />

      <button type="submit" className="btn btn-primary">
        Proceed To Pay
      </button>
    </form>
  );
};

export default PaymentForm;
