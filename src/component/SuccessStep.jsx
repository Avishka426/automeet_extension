import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessStep = ({  message }) => {
  const navigate = useNavigate();
  

  return (
    <div className="success-step animate-fade-in font-inter d-flex flex-column align-items-start justify-content-center h-100">
      <div className='d-flex flex-row align-items-center justify-content-start gap-5'>
        <h2 className="mb-3 fs-1 fw-bold">Success</h2>
        <img
          src="/success.png"
          alt="Success"
          className="mb-4"
          style={{ width: '100px', height: 'auto' }}
        />
      </div>
      <p className="mb-4 text-muted font-inter fw-semibold fs-3">
        {message || "Your meeting is on your calendar now"}
      </p>
      <button
        type="button"
        className="btn btn-primary btn-lg px-4 mt-4"
        onClick={() => navigate('/home')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default SuccessStep;