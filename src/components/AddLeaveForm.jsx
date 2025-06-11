import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, Calendar, Upload, Search, ChevronDown } from 'lucide-react';

const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const validationSchema = Yup.object({
  employeeName: Yup.string().required('Employee name is required'),
  designation: Yup.string().required('Designation is required'),
  leaveDate: Yup.date().required('Leave date is required'),
  reason: Yup.string()
    .min(5, 'Reason must be at least 5 characters')
    .required('Reason is required'),
  documents: Yup.mixed()
    .nullable()
    .test('fileSize', 'File too large (max 2MB)', (value) => {
      if (!value) return true;
      return value.size <= FILE_SIZE;
    })
    .test('fileFormat', 'Unsupported file format', (value) => {
      if (!value) return true;
      return SUPPORTED_FORMATS.includes(value.type);
    }),
});

const initialValues = {
  employeeName: '',
  designation: '',
  leaveDate: '',
  reason: '',
  documents: null,
  employeeId: '',
};

export default function AddLeaveModal({
  isOpen,
  onClose,
  onSubmit,
  employees,
}) {
  const [fileName, setFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter((emp) => {
        return (
          emp.status === 'Present' &&
          emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredEmployees(filtered);
    } else {
      const presentEmployees = employees.filter(
        (emp) => emp.status === 'Present'
      );
      setFilteredEmployees(presentEmployees);
    }
  }, [searchQuery, employees]);

  if (!isOpen) return null;

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      onSubmit(values);
      resetForm();
      setFileName('');
      setSearchQuery('');
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('documents', file);
      setFileName(file.name);
    }
  };

  const handleEmployeeSelect = (employee, setFieldValue) => {
    setFieldValue('employeeName', employee.employeeName);
    setFieldValue('designation', employee.position);
    setFieldValue('employeeId', employee.id);
    setSearchQuery(employee.employeeName);
    setShowDropdown(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Leave</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <div className="floating-input">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                        if (!e.target.value) {
                          setFieldValue('employeeName', '');
                          setFieldValue('designation', '');
                        }
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className={`form-input search-input ${
                        searchQuery ? 'has-value' : ''
                      } ${
                        errors.employeeName && touched.employeeName
                          ? 'error'
                          : ''
                      }`}
                    />
                    <label className="floating-label">
                      Search Employee Name*
                    </label>
                    <Search className="input-icon search-icon" size={16} />
                    <ChevronDown
                      className="input-icon dropdown-icon"
                      size={16}
                    />
                    {showDropdown && filteredEmployees.length > 0 && (
                      <div className="dropdown-menu">
                        {filteredEmployees
                          .slice(0, 5)
                          .map((employee, index) => (
                            <div
                              key={index}
                              className="dropdown-item"
                              onClick={() =>
                                handleEmployeeSelect(employee, setFieldValue)
                              }
                            >
                              <div className="employee-info">
                                <div className="employee-name">
                                  {employee.employeeName}
                                </div>
                                <div className="employee-position">
                                  {employee.position} - {employee.department}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <ErrorMessage
                    name="employeeName"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="text"
                      name="designation"
                      id="designation"
                      className={`form-input ${
                        values.designation ? 'has-value' : ''
                      } ${
                        errors.designation && touched.designation ? 'error' : ''
                      }`}
                      readOnly
                    />
                    <label htmlFor="designation" className="floating-label">
                      Designation*
                    </label>
                  </div>
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="date"
                      name="leaveDate"
                      id="leaveDate"
                      className={`form-input date-input ${
                        values.leaveDate ? 'has-value' : ''
                      } ${
                        errors.leaveDate && touched.leaveDate ? 'error' : ''
                      }`}
                    />
                    <label htmlFor="leaveDate" className="floating-label">
                      Leave Date*
                    </label>
                    <Calendar
                      className="input-icon date-icon"
                      size={16}
                      onClick={() =>
                        document.getElementById('leaveDate')?.showPicker?.()
                      }
                    />
                  </div>
                  <ErrorMessage
                    name="leaveDate"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div className="floating-input">
                    <div
                      className={`file-upload ${fileName ? 'has-file' : ''} ${
                        errors.documents && touched.documents ? 'error' : ''
                      }`}
                    >
                      <input
                        type="file"
                        id="documents"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(event) =>
                          handleFileChange(event, setFieldValue)
                        }
                        className="file-input"
                      />
                      <label htmlFor="documents" className="file-label">
                        <span>{fileName || 'Documents'}</span>
                        <Upload className="input-icon upload-icon" size={16} />
                      </label>
                    </div>
                  </div>
                  <ErrorMessage
                    name="documents"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <div className="floating-input">
                    <Field
                      as="input"
                      type="text"
                      name="reason"
                      id="reason"
                      className={`form-input ${
                        values.reason ? 'has-value' : ''
                      } ${errors.reason && touched.reason ? 'error' : ''}`}
                    />
                    <label htmlFor="reason" className="floating-label">
                      Reason*
                    </label>
                  </div>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="error-message"
                  />
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
          flex: 1;
          text-align: center;
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
          justify-content: center;
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

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .floating-input {
          position: relative;
        }

        .form-input {
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

        .form-input:focus {
          outline: none;
          border-color: #4d007d;
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .floating-label {
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
        .form-input.has-value + .floating-label {
          top: 0;
          transform: translateY(-50%);
          font-size: 12px;
          color: #4d007d;
        }

        .form-input.error + .floating-label {
          color: #ef4444;
        }

        /* Search input specific styles */
        .search-input {
          padding-left: 40px;
          padding-right: 40px;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
          z-index: 2;
        }

        .search-icon {
          left: 12px;
        }

        .dropdown-icon {
          right: 12px;
        }

        .date-icon {
          right: 12px;
          cursor: pointer;
          pointer-events: auto;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #4d007d;
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
        }

        .dropdown-item {
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .employee-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .employee-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
        }

        .employee-position {
          font-size: 12px;
          color: #6b7280;
        }

        /* Date input styles */
        .date-input {
          padding-right: 40px;
        }

        .date-input::-webkit-calendar-picker-indicator {
          display: none;
          -webkit-appearance: none;
        }

        .date-input::-webkit-datetime-edit {
          color: transparent;
        }

        .date-input::-webkit-datetime-edit-fields-wrapper {
          color: transparent;
        }

        .date-input::-webkit-datetime-edit-text {
          color: transparent;
        }

        .date-input::-webkit-datetime-edit-month-field {
          color: transparent;
        }

        .date-input::-webkit-datetime-edit-day-field {
          color: transparent;
        }

        .date-input::-webkit-datetime-edit-year-field {
          color: transparent;
        }

        .date-input.has-value::-webkit-datetime-edit {
          color: #1f2937;
        }

        .date-input.has-value::-webkit-datetime-edit-fields-wrapper {
          color: #1f2937;
        }

        .date-input.has-value::-webkit-datetime-edit-text {
          color: #1f2937;
        }

        .date-input.has-value::-webkit-datetime-edit-month-field {
          color: #1f2937;
        }

        .date-input.has-value::-webkit-datetime-edit-day-field {
          color: #1f2937;
        }

        .date-input.has-value::-webkit-datetime-edit-year-field {
          color: #1f2937;
        }

        /* File upload styles */
        .file-upload {
          border: 2px solid #4d007d;
          border-radius: 8px;
          height: 46px;
          box-sizing: border-box;
          position: relative;
        }

        .file-upload.error {
          border-color: #ef4444;
        }

        .file-input {
          position: absolute;
          display: none;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 12px;
          cursor: pointer;
          color: #6b7280;
          font-size: 14px;
          height: 100%;
          box-sizing: border-box;
        }

        .upload-icon {
          flex-shrink: 0;
          position: static !important;
          transform: none !important;
        }

        .file-upload.has-file .file-label {
          color: #1f2937;
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

          .form-input {
            font-size: 13px;
          }

          .floating-label {
            font-size: 13px;
          }

          .form-input:focus + .floating-label,
          .form-input.has-value + .floating-label {
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
