// ErrorBoundary.js
import React, {Component} from 'react';
import {toast} from 'react-toastify';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error};
  }

  componentDidCatch(error, errorInfo) {
    toast.error('Something went wrong. Please try again.');
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4 text-red-600">
          <h2 className="text-xl font-semibold mb-2">
            Oops! Something went wrong.
          </h2>
          <p>Please refresh the page or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
