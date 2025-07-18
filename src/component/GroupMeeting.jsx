import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaSearch, FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import FormStepNavigator from './FormStepNavigator';
import Calendar from './Calendar';
import SuccessStep from './SuccessStep';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const GroupMeetingForm = () => {
  const navigate = useNavigate();

  // Add these missing state variables
  const [contacts, setContacts] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [searchContact, setSearchContact] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [timeSlots, setTimeSlots] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [repeat, setRepeat] = useState('none');
  const [duration, setDuration] = useState('60');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [participantError, setParticipantError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Refs for detecting clicks outside the dropdown
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const contactDropdownRef = useRef(null);

  // Fetch contacts when component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/community/contacts', {
          withCredentials: true
        });

        const contactsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.contacts || []);
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts');
        setContacts([]);
      }
    };

    fetchContacts();

    // Click outside handler for all dropdowns
    const handleClickOutside = (event) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setShowContactDropdown(false);
      }
      if (startTimeRef.current && !startTimeRef.current.contains(event.target)) {
        setShowStartTime(false);
      }
      if (endTimeRef.current && !endTimeRef.current.contains(event.target)) {
        setShowEndTime(false);
      }
      if (!event.target.closest('.calendar-container')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateGroupMeeting = async () => {
    // Prevent multiple submissions
    if (isSubmitted) return;

    if (!timeSlots.length || participants.length === 0) {
      setError('Please add at least one time slot and participant');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a meeting title');
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true); // Disable button immediately
    setError('');

    try {
      const formatTimeToUTC = (date, time) => {
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        let adjustedHours = hours;
        if (period === 'PM' && hours !== 12) {
          adjustedHours += 12;
        }
        if (period === 'AM' && hours === 12) {
          adjustedHours = 0;
        }

        const meetingDateTime = new Date(date);
        meetingDateTime.setHours(adjustedHours, minutes, 0, 0);
        return meetingDateTime.toISOString();
      };

      const formattedTimeSlots = timeSlots.map(slot => ({
        startTime: formatTimeToUTC(slot.date, slot.startTime),
        endTime: formatTimeToUTC(slot.date, slot.endTime)
      }));

      const meetingPayload = {
        title: title.trim(),
        location,
        description,
        groupTimeSlots: formattedTimeSlots,
        groupDuration: duration,
        participantIds: participants.map(p => p.id),
        repeat
      };

      await axios.post('http://localhost:8080/api/group/meetings', meetingPayload, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating group meeting:', error);
      setError(error.response?.data?.message || 'Failed to create group meeting. Please try again.');
      setIsSubmitted(false); // Re-enable button on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Title validation
      if (!title.trim()) {
        setTitleError('Please enter a meeting title');
        const titleInput = document.querySelector('input[placeholder="Meeting title"]');
        titleInput?.scrollIntoView({ behavior: 'smooth' });
        titleInput?.focus();
        return;
      }

      // Date and time validation
      if (!selectedDate) {
        setDateError('Please select a date');
        const dateSection = document.querySelector('.time-slot-section');
        dateSection?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (!startTime || !endTime) {
        setTimeError('Please select both start and end times');
        const timeSection = document.querySelector('.time-slot-section');
        timeSection?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Time slots validation
      if (timeSlots.length === 0) {
        setTimeError('Please add at least one time slot');
        const timeSlotSection = document.querySelector('.time-slot-section');
        timeSlotSection?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Clear errors and proceed
      setTitleError('');
      setTimeError('');
      setParticipantError('');
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      // Participant validation
      if (participants.length === 0) {
        setParticipantError('Please add at least one participant');
        const participantSection = document.querySelector('.participant-section');
        participantSection?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      setParticipantError('');
      handleCreateGroupMeeting();
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Clear error messages when going back
      setParticipantError('');
      setTitleError('');
      setTimeError('');
      setIsSubmitted(false); // Re-enable button when going back
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDateSelect = (date) => {
    const newDate = date instanceof Date ? date : new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      setDateError('Please select a date from today or in the future');
      return;
    }

    setDateError('');
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const generateTimeOptions = () => {
    const times = [];
    let hour = 12;
    let period = "AM";

    for (let i = 0; i < 24; i++) {
      times.push(`${hour}:00 ${period}`);
      times.push(`${hour}:30 ${period}`);
      hour = hour === 12 ? 1 : hour + 1;
      if (hour === 12) period = period === "AM" ? "PM" : "AM";
    }
    return times;
  };

  const validateTimeFormat = (time) => {
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/i;
    return timeRegex.test(time);
  };

  const convertTo24HourFormat = (time) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    }
    if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const handleAddTimeSlot = () => {
    setTimeError('');
    setDateError('');

    // Date validation
    if (!selectedDate) {
      setDateError('Please select a date');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setDateError('Cannot select a past date');
      return;
    }

    // Time format validation
    if (!validateTimeFormat(startTime)) {
      setTimeError('Invalid start time format. Use HH:MM AM/PM');
      return;
    }

    if (!validateTimeFormat(endTime)) {
      setTimeError('Invalid end time format. Use HH:MM AM/PM');
      return;
    }

    // Time logic validation
    const startMinutes = convertTo24HourFormat(startTime);
    const endMinutes = convertTo24HourFormat(endTime);

    if (endMinutes <= startMinutes) {
      setTimeError('End time must be later than start time');
      return;
    }
    else if (startMinutes === endMinutes) {
      setTimeError('Start time and end time cannot be the same');
      return;
    }

    const newTimeSlot = {
      id: Date.now(),
      date: selectedDate,
      startTime: startTime,
      endTime: endTime
    };

    const isDuplicate = timeSlots.some(
      slot => 
        slot.date.toDateString() === newTimeSlot.date.toDateString() &&
        slot.startTime === newTimeSlot.startTime && 
        slot.endTime === newTimeSlot.endTime
    );

    if (isDuplicate) {
      setTimeError('This time slot has already been added');
      return;
    }

    setTimeSlots([...timeSlots, newTimeSlot]);
    // Reset times for next slot
    setStartTime("09:00 AM");
    setEndTime("10:00 AM");
  };

  const handleRemoveTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleTimeSelect = (time, type) => {
    if (type === "start") {
      setStartTime(time);
      setShowStartTime(false);
    } else if (type === "end") {
      setEndTime(time);
      setShowEndTime(false);
    }
  };

  const handleTimeChange = (value, type) => {
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  const handleDoubleClick = (type) => {
    if (type === "start") {
      setShowStartTime(true);
    } else if (type === "end") {
      setShowEndTime(true);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    (contact.username && contact.username.toLowerCase().includes(searchContact.toLowerCase())) ||
    (contact.name && contact.name.toLowerCase().includes(searchContact.toLowerCase()))
  );

  const handleAddParticipant = (contact) => {
    if (!participants.some(p => p.id === contact.id)) {
      setParticipants([...participants, contact]);
      setShowContactDropdown(false);
      setSearchContact('');
      // Clear participant error when adding a participant
      setParticipantError('');
    }
  };

  const handleRemoveParticipant = (id) => {
    const updatedParticipants = participants.filter(participant => participant.id !== id);
    setParticipants(updatedParticipants);
    
    // Set error if all participants are removed
    if (updatedParticipants.length === 0) {
      setParticipantError('Please add at least one participant');
    }
  };

  const renderDateDisplay = () => {
    if (dateError) return <div className="text-danger">{dateError}</div>;
    return selectedDate ? selectedDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) : "Select Date";
  };

  const formatTimeSlotDisplay = (slot) => {
    return `${slot.date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} | ${slot.startTime} - ${slot.endTime}`;
  };

  const handleToCalendar = () => {
    console.log('Redirecting to home');
    navigate('/'); // Navigate to home component
  };


  return (
    <div 
      className="group-meeting-form h-100 font-inter"
      style={{ 
        width: '500px',
        maxWidth: '500px',
        minWidth: '500px',
        padding: '20px',
        margin: '0 auto',
        backgroundColor: '#f5f8fa',
        boxSizing: 'border-box'
      }}
    >
      {/* Header with Back Button */}
      <div className="d-flex align-items-center mb-4" style={{ width: '100%' }}>
        <button
          type="button"
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #dee2e6',
            backgroundColor: '#fff',
            color: '#6c757d'
          }}
        >
          <FaArrowLeft />
        </button>
        {currentStep !== 3 && (
          <h3 className="mb-0 fw-bold" style={{ flex: 1 }}>
            Create Group Meeting
          </h3>
        )}
      </div>

      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}

      <form className="flex-grow-1">
        {currentStep === 1 && (
          <div className="animate-fade-in" style={{ width: '100%' }}>
            <div className="mb-4 fs-6" style={{ width: '100%' }}>
              <label className="form-label fw-medium">Title</label>
              <input
                type="text"
                className={`form-control form-control-lg ${titleError ? 'is-invalid' : ''}`}
                placeholder="Meeting title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setTitleError('');
                  }
                }}
                required
                style={{ width: '100%' }}
              />
              {titleError && (
                <div className="invalid-feedback d-block">
                  {titleError}
                </div>
              )}
            </div>

            <div className="mb-4" style={{ width: '100%' }}>
              <label className="form-label fw-medium">Time slot</label>
              <div className="p-2 bg-light rounded position-relative time-slot-section" style={{ width: '100%' }}>
                <div className="d-flex align-items-center gap-2" style={{ width: '100%', flexWrap: 'wrap' }}>
                  <div
                    className="d-flex align-items-center bg-white py-2 px-3 rounded"
                    style={{ 
                      cursor: "pointer", 
                      flex: '1',
                      minWidth: '150px',
                      maxWidth: '180px'
                    }}
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <div className="text-center flex-grow-1">
                      {renderDateDisplay()}
                    </div>
                    <div className="ms-2">
                      <FaCalendarAlt />
                    </div>
                  </div>

                  {showCalendar && (
                    <div
                      className="position-absolute shadow rounded calendar-container"
                      style={{ top: "60px", left: "10px", zIndex: 10 }}
                    >
                      <Calendar 
                        onDateSelect={handleDateSelect} 
                        value={selectedDate} 
                      />
                    </div>
                  )}

                  <div className="position-relative" ref={startTimeRef} style={{ flex: '1', minWidth: '90px', maxWidth: '100px' }}>
                    <input
                      type="text"
                      className="form-control bg-white py-2 px-2 rounded"
                      style={{ width: '100%', cursor: "pointer", fontSize: '0.9rem' }}
                      placeholder="Start"
                      value={startTime}
                      onChange={(e) => handleTimeChange(e.target.value, "start")}
                      onDoubleClick={() => handleDoubleClick("start")}
                    />
                    {showStartTime && (
                      <div
                        className="position-absolute bg-white shadow p-3 rounded mt-1"
                        style={{ top: "100%", left: "0", zIndex: 10, maxHeight: "200px", overflowY: "auto", width: '120px' }}
                      >
                        {generateTimeOptions().map((time, index) => (
                          <div
                            key={index}
                            className="py-2 px-3 hover-bg-light"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTimeSelect(time, "start")}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="position-relative" ref={endTimeRef} style={{ flex: '1', minWidth: '90px', maxWidth: '100px' }}>
                    <input
                      type="text"
                      className="form-control bg-white py-2 px-2 rounded"
                      style={{ width: '100%', cursor: "pointer", fontSize: '0.9rem' }}
                      placeholder="End"
                      value={endTime}
                      onChange={(e) => handleTimeChange(e.target.value, "end")}
                      onDoubleClick={() => handleDoubleClick("end")}
                    />
                    {showEndTime && (
                      <div
                        className="position-absolute bg-white shadow p-3 rounded mt-1"
                        style={{ top: "100%", left: "0", zIndex: 10, maxHeight: "200px", overflowY: "auto", width: '120px' }}
                      >
                        {generateTimeOptions().map((time, index) => (
                          <div
                            key={index}
                            className="py-2 px-3 hover-bg-light"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTimeSelect(time, "end")}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "38px",
                      flexShrink: 0,
                    }}
                    onClick={handleAddTimeSlot}
                  >
                    <FaCheckCircle />
                  </button>
                </div>

                {timeError && (
                  <div className="text-danger mt-2 small">
                    {timeError}
                  </div>
                )}

                {timeSlots.length > 0 && (
                  <div className="mt-3" style={{ width: '100%' }}>
                    <h6 className="text-muted mb-2">Added Time Slots</h6>
                    <div className="d-flex flex-wrap gap-2" style={{ width: '100%' }}>
                      {timeSlots.map((slot) => (
                        <div 
                          key={slot.id} 
                          className="badge bg-white text-dark d-flex align-items-center gap-2 p-2"
                          style={{ 
                            fontSize: '0.75rem', 
                            maxWidth: '100%',
                            wordBreak: 'break-word'
                          }}
                        >
                          <span className="text-truncate">{formatTimeSlotDisplay(slot)}</span>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger p-0"
                            onClick={() => handleRemoveTimeSlot(slot.id)}
                            style={{ 
                              width: '18px', 
                              height: '18px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '12px'
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4" style={{ width: '100%' }}>
              <label className="form-label fw-medium">Duration</label>
              <select 
                className="form-select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div className="mb-4" style={{ width: '100%' }}>
              <label className="form-label fw-medium">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="A short description for the meeting"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div className="mb-4" style={{ width: '100%' }}>
              <label className="form-label fw-medium">Location</label>
              <select 
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Choose a place for the meeting</option>
                <option value="Conference Room">Conference Room</option>
                <option value="Virtual Meeting">Virtual Meeting</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4" style={{ width: '100%' }}>
              <label className="form-label fw-medium">Repeat</label>
              <select 
                className="form-select"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
                <option value="weekday">Every weekday (Mon-Fri)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in participant-section" style={{ width: '100%' }}>
            <div className="mb-4" style={{ width: '100%' }}>
              <h4 className="form-label fw-medium mb-3">Add participants</h4>
              
              <div className="mb-3 position-relative" ref={contactDropdownRef} style={{ width: '100%' }}>
                <div className={`input-group ${participantError ? 'is-invalid' : ''}`} style={{ width: '100%' }}>
                  <input
                    type="text"
                    className={`form-control ${participantError ? 'is-invalid' : ''}`}
                    placeholder="Search contacts"
                    value={searchContact}
                    onChange={(e) => {
                      setSearchContact(e.target.value);
                      setShowContactDropdown(true);
                    }}
                    onFocus={() => setShowContactDropdown(true)}
                    disabled={isLoading || isSubmitted}
                    style={{ flex: '1' }}
                  />
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${participantError ? 'btn-outline-danger' : ''}`}
                    onClick={() => setShowContactDropdown(!showContactDropdown)}
                    disabled={isLoading || isSubmitted}
                  >
                    <FaChevronDown />
                  </button>
                </div>
                
                {participantError && (
                  <div className="invalid-feedback d-block">
                    {participantError}
                  </div>
                )}
                
                {showContactDropdown && filteredContacts.length > 0 && !isLoading && !isSubmitted && (
                  <div 
                    className="position-absolute bg-white shadow rounded mt-1"
                    style={{ 
                      zIndex: 1000, 
                      maxHeight: '200px', 
                      overflowY: 'auto',
                      width: '100%',
                      left: '0'
                    }}
                  >
                    {filteredContacts.map(contact => (
                      <div 
                        key={contact.id} 
                        className={`p-2 hover-bg-light cursor-pointer ${
                          participants.some(p => p.id === contact.id) ? 'bg-light' : ''
                        }`}
                        onClick={() => handleAddParticipant(contact)}
                        style={{ width: '100%' }}
                      >
                        <div className="d-flex align-items-center" style={{ width: '100%' }}>
                          <img 
                            src={contact.profileImage || '/profile.png'} 
                            alt="participant" 
                            className="rounded-circle me-3"
                            style={{ width: '30px', height: '30px', flexShrink: 0 }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/profile.png';
                            }}
                          />
                          <div style={{ flex: '1', minWidth: '0' }}>
                            <div className="fw-bold text-truncate">{contact.name || contact.username}</div>
                            <small className="text-muted text-truncate d-block">{contact.role || contact.email || 'No details'}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showContactDropdown && filteredContacts.length === 0 && (
                  <div 
                    className="position-absolute bg-white shadow rounded mt-1 p-2"
                    style={{ 
                      zIndex: 1000,
                      width: '100%',
                      left: '0'
                    }}
                  >
                    <div className="text-muted">No contacts found</div>
                  </div>
                )}
              </div>

              {participants.length > 0 ? (
                <div style={{ width: '100%' }}>
                  {participants.map((participant) => (
                    <div 
                      key={participant.id} 
                      className="d-flex align-items-center bg-light p-3 rounded mb-2"
                      style={{ width: '100%' }}
                    >
                      <div className="me-auto d-flex align-items-center" style={{ flex: '1', minWidth: '0' }}>
                        <img 
                          src={participant.profileImage || '/profile.png'} 
                          alt="participant" 
                          className="rounded-circle me-3"
                          style={{ width: '40px', height: '40px', flexShrink: 0 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/profile.png';
                          }}
                        />
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <div className="fw-bold text-truncate">{participant.name || participant.username}</div>
                          <small className="text-muted text-truncate d-block">{participant.role || participant.email || 'No details'}</small>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveParticipant(participant.id)}
                        disabled={isLoading || isSubmitted}
                        style={{ flexShrink: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted" style={{ width: '100%' }}>
                  No participants added yet
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ width: '100%' }}>
            <SuccessStep 
              onToCalendar={handleToCalendar}
              message="Your group meeting has been successfully created!"
            />
          </div>
        )}

        {/* Step Navigator */}
        {currentStep !== 3 && (
          <div style={{ width: '100%' }}>
            <FormStepNavigator 
              currentStep={currentStep} 
              totalSteps={3} 
              onNext={handleNext}
              onBack={handleBack}
              isLoading={isLoading}
              nextLabel={currentStep === 2 ? "Create Meeting" : "Next"}
              isDisabled={currentStep === 2 && isSubmitted}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default GroupMeetingForm;