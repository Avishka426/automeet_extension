import React from 'react';


const SuccessStep = ({ onToCalendar, message }) => {
  const handleToCalendar = () => {
    if (onToCalendar) {
      onToCalendar();
    }
    // For Vite/React Router, you would use navigate programmatically
    // or handle the redirect logic here
    window.location.href = '/';
  };

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
        onClick={handleToCalendar}
      >
        To my calendar
      </button>
    </div>
  );
};

export default SuccessStep;