// import { useState, useEffect } from "react";
// import { Form, Button, Modal } from "react-bootstrap";
// import "./EvaluationModal.css";
// import { useDispatch, useSelector } from "react-redux";
// import { patientInformation } from "../../../../features/OPDModule/PatientCreation/PatientCreationSlice";

// function EvaluationModal() {
//   const dispatch = useDispatch();
//   const formData = useSelector((state) => state.patientCreation.formData);

//   useEffect(() => {
//     if (formData) validationModalInfo();
//   }, [formData]);

//   const validationModalInfo = () => {
//     if (
//       formData.pat_Is_activeTB !== "" &&
//       formData.pat_Is_diarrheasymptoms !== "" &&
//       formData.pat_Is_disease_last1month !== "" &&
//       formData.pat_Is_diseaseoutbreak !== "" &&
//       formData.pat_Is_healthcareworker !== "" &&
//       formData.pat_Is_historyoffever !== "" &&
//       formData.pat_Is_outofcountry1month !== "" &&
//       formData.pat_Is_symptoms !== ""
//     ) {
//       switch (formData.pat_Is_disease_last1month) {
//         case "1": {
//           if (
//             formData.pat_Is_chickenpox !== "" ||
//             formData.pat_Is_measles !== "" ||
//             formData.pat_Is_mumps !== "" ||
//             formData.pat_Is_rubella !== ""
//           ) {
//             // alert("Communicable disease should be disclosed if selected 'Yes'");
//             setShow(true);
//             dispatch(
//               patientInformation({
//                 name: "evaluationInfo",
//                 value: false,
//               })
//             );
//           }
//           break;
//         }
//         case "0": {
//           dispatch(
//             patientInformation({
//               name: "evaluationInfo",
//               value: true,
//             })
//           );
//           break;
//         }
//       }
//     }
//   };


//   const [show, setShow] = useState(false);
//   const handleClose = () => {
//     setShow(false);
//   };
//   const handleShow = () => setShow(true);

//   const [diseaseStatus, setDiseaseStatus] = useState({
//     pat_Is_chickenpox: 0,
//     pat_Is_measles: 0,
//     pat_Is_mumps: 0,
//     pat_Is_rubella: 0,
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     dispatch(
//       patientInformation({
//         name,
//         value,
//       })
//     );
//   };

//   const handleDiseaseCheckChange = (event) => {
//     const { name, checked } = event.target;

//     setDiseaseStatus({ ...diseaseStatus, [name]: checked ? "1" : "0" });

//     dispatch(
//       patientInformation({
//         name,
//         value: checked ? "1" : "0",
//       })
//     );
//   };

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow}>
//         Evaluation Form
//       </Button>

//       <Modal size="xl" show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Patient Consent Form</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div
//             style={{
//               textAlign: "left",
//               border: "1px solid black",
//               borderRadius: "5px",
//               position: "relative",
//               marginTop: "50px",
//               paddingTop: "10px",
//             }}
//           >
//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Are you suffering from fever, cough, or any respiratory
//                   symptoms in last one week?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_symptoms"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_symptoms === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_symptoms"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_symptoms === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Do you have any history of fever and rashes in the past two
//                   weeks?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_historyoffever"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_historyoffever === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_historyoffever"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_historyoffever === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Have you travelled out of country in last 1 month?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_outofcountry1month"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_outofcountry1month === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_outofcountry1month"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_outofcountry1month === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Has there been any disease outbreak like swine flu, Ebola.
//                   Covid- 19 in your community?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_diseaseoutbreak"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_diseaseoutbreak === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_diseaseoutbreak"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_diseaseoutbreak === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Are you a health care worker? (Nurse, Physician, allied health
//                   service personnel, Laboratory worker)
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_healthcareworker"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_healthcareworker === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_healthcareworker"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_healthcareworker === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Have you been exposed to any of the following disease in last
//                   1 month?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type={type}
//                         id={`default-${type}`}
//                         name="pat_Is_disease_last1month"
//                         label={`Yes`}
//                         value={1}
//                         checked={formData.pat_Is_disease_last1month === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type={type}
//                         id={`default-${type}`}
//                         name="pat_Is_disease_last1month"
//                         label={`No`}
//                         value={0}
//                         checked={formData.pat_Is_disease_last1month === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div style={{ paddingLeft: "30px" }}>
//               {["checkbox"].map((type) => (
//                 <div key={`default-${type}`} className="mb-3 check">
//                   <div>
//                     <Form.Check
//                       type={type}
//                       id={`default-${type}-ChickenPox`}
//                       name="pat_Is_chickenpox"
//                       label="Chicken Pox"
//                       checked={diseaseStatus.pat_Is_chickenpox === "1"}
//                       value={diseaseStatus.pat_Is_chickenpox}
//                       disabled={
//                         formData.pat_Is_disease_last1month === "0"
//                           ? true
//                           : false
//                       }
//                       onChange={handleDiseaseCheckChange}
//                     />
//                   </div>
//                   <div>
//                     <Form.Check
//                       type={type}
//                       id={`default-${type}-Measles`}
//                       name="pat_Is_measles"
//                       label="Measles"
//                       checked={diseaseStatus.pat_Is_measles === "1"}
//                       value={diseaseStatus.pat_Is_measles}
//                       disabled={
//                         formData.pat_Is_disease_last1month === "0"
//                           ? true
//                           : false
//                       }
//                       onChange={handleDiseaseCheckChange}
//                     />
//                   </div>
//                   <div>
//                     <Form.Check
//                       type={type}
//                       id={`default-${type}-Mumps`}
//                       name="pat_Is_mumps"
//                       label="Mumps"
//                       value={diseaseStatus.pat_Is_mumps}
//                       checked={diseaseStatus.pat_Is_mumps === "1"}
//                       disabled={
//                         formData.pat_Is_disease_last1month === "0"
//                           ? true
//                           : false
//                       }
//                       onChange={handleDiseaseCheckChange}
//                     />
//                   </div>
//                   <div>
//                     <Form.Check
//                       type={type}
//                       id={`default-${type}-Rubella`}
//                       name="pat_Is_rubella"
//                       label="Rubella"
//                       value={diseaseStatus.pat_Is_rubella}
//                       checked={diseaseStatus.pat_Is_rubella === "1"}
//                       disabled={
//                         formData.pat_Is_disease_last1month === "0"
//                           ? true
//                           : false
//                       }
//                       onChange={handleDiseaseCheckChange}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Currently are you having any diarrhea symptoms?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_diarrheasymptoms"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_diarrheasymptoms === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_diarrheasymptoms"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_diarrheasymptoms === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="query">
//               <div>
//                 <p className="mandatory">
//                   Have you been told/ referred by a health care provider that
//                   you have active TB?
//                 </p>
//               </div>
//               <div>
//                 {["radio"].map((type) => (
//                   <div key={`default-${type}`} className="mb-3 check">
//                     <div className="flex">
//                       <Form.Check
//                         type="radio"
//                         id="yes"
//                         name="pat_Is_activeTB"
//                         value={1}
//                         label="Yes"
//                         checked={formData.pat_Is_activeTB === "1"}
//                         onChange={handleChange}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="no"
//                         name="pat_Is_activeTB"
//                         value={0}
//                         label="No"
//                         checked={formData.pat_Is_activeTB === "0"}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <div
//               style={{
//                 textAlign: "left",
//                 border: "1px solid black",
//                 borderRadius: "5px",
//                 position: "relative",
//                 marginTop: "50px",
//               }}
//             >
//               <h2 className="absolute">General consent</h2>
//               <p className="para justify">
//                 I ( Responsible relative/ Patient ) here by consent to authorize
//                 Dr. Rela Institute & Medical Centre's physicians and medical
//                 professionals to administer and perform medical examination,
//                 routine investigations, medical treatment, outpatient
//                 procedures, vaccinations and immunization during patient's care,
//                 be deemed necessary.
//               </p>
//               <p className="justify">
//                 Agreeing this also gives consent to the hospital to use medical
//                 information for insurance coverage and to contact him or her by
//                 telephone, if needed, regarding appointment and follow-up needs.
//                 The consent given online will be considered for offline purposes
//                 as well.
//               </p>
//               <p className="justify">
//                 I would like to receive whatsapp messages, SMSs and emails from
//                 the hospital.
//               </p>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default EvaluationModal;


import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import "./EvaluationModal.css";
import { useDispatch, useSelector } from "react-redux";
import { patientInformation } from "../../../../features/OPDModule/PatientCreation/PatientCreationSlice";

function EvaluationModal() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.patientCreation.formData);
  
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    // Always set evaluationInfo to true when showing the modal
    dispatch(
      patientInformation({
        name: "evaluationInfo",
        value: true, // Set true unconditionally
      })
    );
    setShow(true);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Evaluation Form
      </Button>

      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Consent Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "left", border: "1px solid black", borderRadius: "5px", position: "relative", marginTop: "50px", paddingTop: "10px" }}>
            {/* ... Your existing form elements ... */}
            <div className="query">
              <div>
                <p className="mandatory">
                  Are you suffering from fever, cough, or any respiratory symptoms in the last one week?
                </p>
              </div>
              <div>
                <Form.Check
                  type="radio"
                  id="yes-symptoms"
                  name="pat_Is_symptoms"
                  value={1}
                  label="Yes"
                />
                <Form.Check
                  type="radio"
                  id="no-symptoms"
                  name="pat_Is_symptoms"
                  value={0}
                  label="No"
                />
              </div>
            </div>

            {/* ... Repeat similar structure for other questions ... */}

          </div>
          
          <div>
            <div style={{ textAlign: "left", border: "1px solid black", borderRadius: "5px", position: "relative", marginTop: "50px" }}>
              <h2 className="absolute">General consent</h2>
              <p className="para justify">
                I (Responsible relative/Patient) here by consent to authorize
                Dr. Rela Institute & Medical Centre's physicians and medical
                professionals to administer and perform medical examination,
                routine investigations, medical treatment, outpatient procedures,
                vaccinations, and immunization during the patient's care, be deemed necessary.
              </p>
              <p className="justify">
                Agreeing to this also gives consent to the hospital to use medical
                information for insurance coverage and to contact him or her by
                telephone, if needed, regarding appointment and follow-up needs.
                The consent given online will be considered for offline purposes
                as well.
              </p>
              <p className="justify">
                I would like to receive WhatsApp messages, SMSs, and emails from
                the hospital.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EvaluationModal;