import React from 'react';
import {Accordion} from 'react-bootstrap';
import PersonalDetails from './Accordions/PersonalDetails';
import AdditionalDetails from './Accordions/AdditionalDetails';
import NextOfKin from './Accordions/NextOfKin';

const NewBornBabyCreation = () => {
  return (
    <Accordion defaultActiveKey="1">
      {/* Personal Details */}
      <Accordion.Item eventKey="1" className="mb-3 border border-solid">
        <Accordion.Header>Personal Details</Accordion.Header>
        <Accordion.Body>
          <PersonalDetails />
        </Accordion.Body>
      </Accordion.Item>

      {/* Additional Details */}
      <Accordion.Item eventKey="2" className="mb-3 border border-solid">
        <Accordion.Header>Additional Details</Accordion.Header>
        <Accordion.Body>
          <AdditionalDetails />
        </Accordion.Body>
      </Accordion.Item>

      {/* Next of Kin */}
      <Accordion.Item eventKey="3" className="mb-3 border border-solid">
        <Accordion.Header>Next of Kin</Accordion.Header>
        <Accordion.Body>
          <NextOfKin />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default NewBornBabyCreation;
