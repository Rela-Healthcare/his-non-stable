import React from 'react';
import {
  Button,
  Container,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {motion} from 'framer-motion';
import FormActionButtons from './FormActionButtons';

const EvaluationForm = ({
  formData,
  handleChange,
  setEvaluationDetails,
  onSubmit,
  shouldAnimate,
  onReset,
}) => {
  const questions = [
    {
      key: 'pat_Is_symptoms',
      text: 'Are you suffering from fever, cough, or any respiratory symptoms in the last one week?',
    },
    {
      key: 'pat_Is_historyoffever',
      text: 'Do you have any history of fever and rashes in the past two weeks?',
    },
    {
      key: 'pat_Is_outofcountry1month',
      text: 'Have you travelled out of the country in the last 1 month?',
    },
    {
      key: 'pat_Is_diseaseoutbreak',
      text: 'Has there been any disease outbreak like swine flu, Ebola, Covid-19 in your community?',
    },
    {
      key: 'pat_Is_healthcareworker',
      text: 'Are you a health care worker? (Nurse, Physician, etc.)',
    },
    {
      key: 'pat_Is_diarrheasymptoms',
      text: 'Currently, are you having any diarrhea symptoms?',
    },
    {
      key: 'pat_Is_activeTB',
      text: 'Have you been told/referred by a health care provider that you have active TB?',
    },
    {
      key: 'pat_Is_disease_last1month',
      text: 'Have you been exposed to any of the following diseases in the last 1 month?',
    },
  ];

  const renderRadioGroup = (name) => (
    <div className="flex gap-4">
      {['1', '0'].map((val) => (
        <label
          key={val}
          className={`cursor-pointer px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 hover:bg-blue-50 transition-all ${
            formData[name] === val ? 'bg-blue-100 border-blue-500' : ''
          }`}>
          <input
            type="radio"
            name={name}
            value={val}
            checked={formData[name] === val}
            onChange={handleChange}
            className="accent-blue-600"
          />
          {val === '1' ? 'Yes' : 'No'}
        </label>
      ))}
    </div>
  );

  const handleCheckAllChange = (e) => {
    const {checked} = e.target;
    const relatedCheckboxes = [
      'pat_Is_chickenpox',
      'pat_Is_measles',
      'pat_Is_mumps',
      'pat_Is_rubella',
    ];

    const updatedDetails = {...formData};

    relatedCheckboxes.forEach((key) => {
      updatedDetails[key] = checked;
    });

    setEvaluationDetails(updatedDetails);
  };

  return (
    <Container className="px-2 md:px-6">
      <Form noValidate onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
          {questions.map((q, idx) => (
            <motion.div
              key={`${q.key}-${shouldAnimate}`}
              className="shadow-md rounded-2xl border border-gray-200 flex flex-col justify-between"
              onClick={() =>
                handleChange({
                  target: {name: q.key, value: '1'},
                })
              }
              initial={shouldAnimate ? {opacity: 0, y: 40} : false}
              animate={shouldAnimate ? {opacity: 1, y: 0} : false}
              transition={{delay: idx * 0.05, duration: 0.4}}>
              {/* Question Text */}
              <p className="px-4 pt-4 font-semibold text-gray-800 text-sm mb-4">
                {q.text}
              </p>

              {/* Footer with centered radio buttons */}
              <div className="mt-auto border-t border-blue-200 p-3 bg-blue-200 flex justify-end items-center rounded-b-2xl">
                {renderRadioGroup(q.key)}
              </div>
            </motion.div>
          ))}
          {formData.pat_Is_disease_last1month === '1' && (
            <motion.div
              initial={{opacity: 0, y: 40}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
              className="bg-white shadow-md rounded-2xl p-3 border border-gray-200 flex justify-between flex-col">
              <div className="pl-1 pr-2 flex justify-between">
                <h5 className="text-gray-800 text-base font-bold">
                  Select the diseases:
                </h5>
                <span>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={'all'}>{'select all'}</Tooltip>}>
                    <Form.Check
                      name="select_all_diseases"
                      type="checkbox"
                      onChange={handleCheckAllChange}
                      size={'xl'}
                      style={{transform: 'scale(1.2)'}}
                    />
                  </OverlayTrigger>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {key: 'pat_Is_chickenpox', label: 'Chicken Pox'},
                  {key: 'pat_Is_measles', label: 'Measles'},
                  {key: 'pat_Is_mumps', label: 'Mumps'},
                  {key: 'pat_Is_rubella', label: 'Rubella'},
                ].map(({key, label}) => (
                  <label
                    key={key}
                    htmlFor={key}
                    className="flex items-center justify-center pl-2 pr-1 py-1 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
                    <Form.Check
                      type="checkbox"
                      id={key}
                      name={key}
                      label={label}
                      checked={formData[key] === true || formData[key] === '1'}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full flex items-center justify-start gap-3"
                    />
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <FormActionButtons onClear={onReset} /> {/* Clear and Save Button */}
      </Form>
    </Container>
  );
};

export default EvaluationForm;
