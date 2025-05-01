import React from 'react';
import {Spinner} from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'default'; // Correct: 'sm' or 'default' (custom default)
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  centered?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  variant = 'primary',
  centered = false,
  message = 'Loading...',
}) => {
  return (
    <div
      className={
        centered
          ? 'd-flex flex-column justify-content-center align-items-center min-h-full'
          : ''
      }>
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        size={size === 'sm' ? 'sm' : undefined}>
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && <div className="mt-2 text-muted small">{message}</div>}
    </div>
  );
};

export default LoadingSpinner;
