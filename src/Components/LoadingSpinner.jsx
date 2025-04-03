import React from 'react';
import {Spinner} from 'react-bootstrap';

const LoadingSpinner = ({size = 'lg'}) => {
  return <Spinner animation="border" variant="primary" size={size} />;
};

export default LoadingSpinner;
