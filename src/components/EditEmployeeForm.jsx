import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, Calendar } from 'lucide-react';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  emailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  phoneNumber: Yup.string()
    .matches(
      /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/,
      'Invalid phone number'
    )
    .required('Phone number is required'),
  position: Yup.string().required('Position is required'),
  department: Yup.string().required('Department is required'),
  dateOfJoining: Yup.date().required('Date of joining is required'),
});

const positionOptions = [
    { value: 'Intern', label: 'Intern' },
  { value: 'Full Time', label: 'Full Time' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Team Lead', label: 'Team Lead' },
];

export default function EditEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employee,
}) {
  const [initialValues, setInitialValues] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    position: '',
    department: '',
    dateOfJoining: '',
  });

  useEffect(() => {
    if (employee) {
      setInitialValues({
        fullName: employee.employeeName || '',
        emailAddress: employee.emailAddress || '',
        phoneNumber: employee.phoneNumber || '',
        position: employee.position || '',
        department: employee.department || '',
        dateOfJoining: employee.dateOfJoining || '',
      });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      onSubmit(values);
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Employee Details</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, errors, touched, setFieldValue }) => (
            <Form className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="text"
                      name="fullName"
                      id="fullName"
                      className={`form-input ${
                        values.fullName ? 'has-value' : ''
                      } ${errors.fullName && touched.fullName ? 'error' : ''}`}
                    />
                    <label htmlFor="fullName" className="floating-label">
                      Full Name*
                    </label>
                  </div>
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      className={`form-input ${
                        values.emailAddress ? 'has-value' : ''
                      } ${
                        errors.emailAddress && touched.emailAddress
                          ? 'error'
                          : ''
                      }`}
                    />
                    <label htmlFor="emailAddress" className="floating-label">
                      Email Address*
                    </label>
                  </div>
                  <ErrorMessage
                    name="emailAddress"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      className={`form-input ${
                        values.phoneNumber ? 'has-value' : ''
                      } ${
                        errors.phoneNumber && touched.phoneNumber ? 'error' : ''
                      }`}
                    />
                    <label htmlFor="phoneNumber" className="floating-label">
                      Phone Number*
                    </label>
                  </div>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="text"
                      name="department"
                      id="department"
                      className={`form-input ${
                        values.department ? 'has-value' : ''
                      } ${
                        errors.department && touched.department ? 'error' : ''
                      }`}
                    />
                    <label htmlFor="department" className="floating-label">
                      Department*
                    </label>
                  </div>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="select-container">
                    <Field
                      as="select"
                      name="position"
                      id="position"
                      className={`form-select ${
                        values.position ? 'has-value' : ''
                      } ${errors.position && touched.position ? 'error' : ''}`}
                    >
                      <option value="" disabled></option>
                      {positionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <label htmlFor="position" className="select-label">
                      Position*
                    </label>
                  </div>
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div className="date-input-container">
                    <div className="floating-input">
                      <Field
                        type="date"
                        name="dateOfJoining"
                        id="dateOfJoining"
                        className={`form-input date-input ${
                          values.dateOfJoining ? 'has-value' : ''
                        } ${
                          errors.dateOfJoining && touched.dateOfJoining
                            ? 'error'
                            : ''
                        }`}
                      />
                      <label htmlFor="dateOfJoining" className="floating-label">
                        Date of Joining*
                      </label>
                      <span
                        className="date-icon"
                        onClick={() =>
                          document.getElementById('dateOfJoining').showPicker()
                        }
                      >
                        <Calendar size={16} />
                      </span>
                    </div>
                    <ErrorMessage
                      name="dateOfJoining"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          background: #4d007d;
          color: white;
          padding: 12px 24px;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          flex:1;
          text-align:center;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-form {
          padding: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          position: relative;
        }

        .floating-input {
          position: relative;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 18px 12px 6px 12px;
          border: 2px solid #4d007d;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
          box-sizing: border-box;
          height: 46px;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px 16px;
          padding-right: 40px;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #4d007d;
        }

        .form-input.error,
        .form-select.error {
          border-color: #ef4444;
        }

        .floating-label,
        .select-label {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          padding: 0 4px;
          color: #6b7280;
          font-size: 14px;
          pointer-events: none;
          transition: all 0.2s ease;
        }

        .form-input:focus + .floating-label,
        .form-input.has-value + .floating-label,
        .form-select:focus + .select-label,
        .form-select.has-value + .select-label {
          top: 0;
          transform: translateY(-50%);
          font-size: 12px;
          color: #4d007d;
        }

        .form-input.error + .floating-label,
        .form-select.error + .select-label {
          color: #ef4444;
        }

        .select-container {
          position: relative;
        }

        .date-input::-webkit-calendar-picker-indicator {
        display: none;
        -webkit-appearance: none;
        }

        .date-input {
        padding-right: 40px;
        position: relative;
        }

        .date-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        pointer-events: none;
        z-index: 2;
        }

        /* Make the icon clickable */
        .date-input-container {
        position: relative;
        }

        .date-input-container .date-icon {
        pointer-events: auto;
        cursor: pointer;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .submit-button {
          background: #4d007d;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .submit-button:hover:not(:disabled) {
          background: #6d28d9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(77, 0, 125, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }


        /* Mobile styles */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-header h2 {
            font-size: 16px;
          }

          .modal-form {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 16px;
          }

          .form-input,
          .form-select {
            padding: 18px 12px 6px 12px;
            font-size: 13px;
          }

          .floating-label,
          .select-label {
            left: 10px;
            font-size: 13px;
          }

          .form-input:focus + .floating-label,
          .form-input.has-value + .floating-label,
          .form-select:focus + .select-label,
          .form-select.has-value + .select-label {
            font-size: 11px;
          }

          .submit-button {
            padding: 10px 24px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
