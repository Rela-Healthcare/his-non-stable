import React, {useState} from 'react';

const MyForm = () => {
  // Initialize state with the provided payload structure
  const [formData, setFormData] = useState({
    OP_Master: [
      {
        Service_Group: 101,
        Service: 202,
        Priority: 1,
        Rate: 500,
        Discount_Type: 'Percentage',
        AMOUNT: 500,
        Discount: 50,
        Amount_Ttl: 450,
        Remarks: 'General Checkup',
        Discount_Reason: 'Membership Discount',
      },
    ],
    SalutionId: 1,
    Name: 'John Doe',
    DOB: '1985-06-15',
    Age: 39,
    Gender: 'Male',
    Nationality: 1,
    ID_Type: 1,
    ID_No: 'A123456789',
    Marital_Status: 'Married',
    Mobile_No: '9876543210',
    Email_ID: 'johndoe@example.com',
    Occupation: 2,
    Pincode: '560001',
    Country: 1,
    State: 10,
    City: 101,
    Area: 1001,
    Address: '123 Main Street, Cityname',
    Religion: 1,
    Language: 2,
    BloodGroup: 3,
    Special_Assistance: false,
    Select_Special_Assistance: '',
    Spl_Assist_Remarks: '',
    Update_Death_Date: null,
    Relation_Type: 2,
    Relation_Name: 'Jane Doe',
    Relation_Mobile_No: '9876543211',
    Kin_Pincode: '560002',
    Kin_Country: 1,
    Kin_State: 10,
    Kin_City: 101,
    Kin_Area: 1002,
    Kin_Address: '456 Secondary Street, Cityname',
    pat_Is_symptoms: false,
    pat_Is_historyoffever: false,
    pat_Is_outofcountry1month: false,
    pat_Is_diseaseoutbreak: false,
    pat_Is_healthcareworker: false,
    pat_Is_disease_last1month: false,
    pat_Is_chickenpox: false,
    pat_Is_measles: false,
    pat_Is_mumps: false,
    pat_Is_rubella: false,
    pat_Is_diarrheasymptoms: false,
    pat_Is_activeTB: false,
    Department_Name: 5,
    Doctor_Name: 15,
    Visit_Type: 1,
    Appointment_Date: '2025-04-02',
    Sequence_No: 10,
    Patient_Type: 'New',
    Payor_Name: 3,
    Referral_Source: 2,
    Doctor_Type: 'General Physician',
    Internal_Doctor_Name: 15,
    External_Doctor_Name: 0,
    Staff_Employee_ID: 'EMP12345',
    Package_Details: '',
    Gross_Amount: 500,
    Final_Discount: 50,
    Total_Amount: 450,
    Coupon_Balance: 100,
    Apply_Coupon: 50,
    Payment_Mode: 'Credit Card',
    Net_Payable_Amount: 400,
    UserId: 'user123',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted: ', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Example Input Fields */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Gender:</label>
        <select
          name="Gender"
          value={formData.Gender}
          onChange={handleInputChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label>Email ID:</label>
        <input
          type="email"
          name="Email_ID"
          value={formData.Email_ID}
          onChange={handleInputChange}
        />
      </div>

      {/* Continue with more form fields as per the payload structure */}
      <div>
        <label>Special Assistance:</label>
        <input
          type="checkbox"
          name="Special_Assistance"
          checked={formData.Special_Assistance}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Remarks:</label>
        <textarea
          name="Remarks"
          value={formData.OP_Master[0].Remarks}
          onChange={(e) => {
            const newRemarks = e.target.value;
            setFormData((prevData) => ({
              ...prevData,
              OP_Master: [
                {
                  ...prevData.OP_Master[0],
                  Remarks: newRemarks,
                },
              ],
            }));
          }}
        />
      </div>

      {/* Submit button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
