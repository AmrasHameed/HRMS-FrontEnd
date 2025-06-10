import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X, Upload, ChevronDown } from 'lucide-react';

const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const positionOptions = [
  { value: 'Intern', label: 'Intern' },
  { value: 'Full Time', label: 'Full Time' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Team Lead', label: 'Team Lead' },
];

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  emailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  phoneNumber: Yup.string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  department: Yup.string()
    .min(2, 'Department must be at least 2 characters')
    .required('Department is required'),
  position: Yup.string()
    .oneOf(
      positionOptions.map((option) => option.value),
      'Please select a valid position'
    )
    .required('Position is required'),
  experience: Yup.string().required('Experience is required'),
  resume: Yup.mixed()
    .required("Resume is required")
    .test('fileSize', 'File too large (max 2MB)', (value) => {
      if (!value) return true;
      return value.size <= FILE_SIZE;
    })
    .test('fileFormat', 'Unsupported file format', (value) => {
      if (!value) return true;
      return SUPPORTED_FORMATS.includes(value.type);
    }),
  declaration: Yup.boolean()
    .oneOf([true], 'You must accept the declaration')
    .required('Declaration is required'),
});

const initialValues = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  department: '',
  position: '',
  experience: '',
  resume: null,
  declaration: false,
};

export default function AddCandidateModal({ isOpen, onClose, onSubmit }) {
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      const candidateData = {
        ...values,
        displayPosition: `${values.department} ${values.position}`,
        department: values.department,
        position: values.position,
      };

      onSubmit(candidateData);
      resetForm();
      setFileName('');
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('resume', file);
      setFileName(file.name);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Candidate</h2>
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
                    <ChevronDown className="select-icon" size={16} />
                  </div>
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div className="floating-input">
                    <Field
                      type="text"
                      name="experience"
                      id="experience"
                      className={`form-input ${
                        values.experience ? 'has-value' : ''
                      } ${
                        errors.experience && touched.experience ? 'error' : ''
                      }`}
                    />
                    <label htmlFor="experience" className="floating-label">
                      Experience*
                    </label>
                  </div>
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <div className="file-upload-container">
                    <div
                      className={`file-upload ${fileName ? 'has-file' : ''} ${
                        errors.resume && touched.resume ? 'error' : ''
                      }`}
                    >
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) =>
                          handleFileChange(event, setFieldValue)
                        }
                        className="file-input"
                      />
                      <label htmlFor="resume" className="file-label">
                        <span> {fileName || 'Resume*'}</span>
                        <span className="upload-icon">
                          <Upload size={16} />
                        </span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="resume"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
              </div>

              {/* Preview of combined position */}
              {values.department && values.position && (
                <div className="position-preview">
                  <strong>Position Preview:</strong> {values.department}{' '}
                  {values.position}
                </div>
              )}

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <Field
                    type="checkbox"
                    name="declaration"
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    I hereby declare that the above information is true to the
                    best of my knowledge and belief
                  </span>
                </label>
                <ErrorMessage
                  name="declaration"
                  component="div"
                  className="error-message"
                />
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

        .form-group.full-width {
          grid-column: 1 / -1;
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

        .select-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
          z-index: 2;
        }

        .file-upload-container {
          position: relative;
        }

        .file-upload {
          position: relative;
          border: 2px solid #4d007d;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          height: 46px;
        }

        .file-upload.error {
          border-color: #ef4444;
        }

        .file-input {
          position: absolute;
          display:none;
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
          padding: 1px 0px 1px 12px;
          cursor: pointer;
          color: #6b7280;
          font-size: 14px;
          min-height: 24px;
          height: 56px;
        }

        .file-label span {
         margin-bottom:10px;
        }

        .upload-icon {
            margin-right: 10px;
        }

        .file-upload.has-file .file-label {
          color: #1f2937;
        }

        .position-preview {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #0c4a6e;
          font-size: 14px;
        }

        .checkbox-group {
          margin: 24px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          line-height: 1.5;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          position: relative;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #4d007d;
          border-color: #4d007d;
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .checkbox-text {
          color: #6b7280;
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
          .form-select,
          .file-label {
            padding: 1px 0px 1px 12px;
            font-size: 13px;
          }

          .file-label span {
            margin-bottom:10px;
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

          .checkbox-label {
            font-size: 13px;
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
