import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import axiosInstance from '../services/axiosInstance';
import { Square } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.post('/auth/login', {
        email: values.email,
        password: values.password,
      });
      if (res.data.msg === 'success') {
        dispatch(login({ user: res.data.user, token: res.data.token }));
        toast.success('User Logged in Successfully');
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Login failed';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="container">
      <div className="logo">
        <Square size={34} className="logo-icon" />
        <span>LOGO</span>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="dashboard-preview">
            <img
              src="/hrdashboard.png"
              alt="Dashboard Preview"
              className="dashboard-image"
            />
          </div>
          <div className="content-text">
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </h2>
            <p>
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="pagination">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="right-section">
          <div className="login-form">
            <h1>Welcome to Dashboard</h1>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address<span className="asterisk">*</span>
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      className={
                        errors.email && touched.email ? 'input-error' : ''
                      }
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">
                      Password<span className="asterisk">*</span>
                    </label>
                    <div className="password-input">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Password"
                        className={
                          errors.password && touched.password
                            ? 'input-error'
                            : ''
                        }
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <img src="Eyecon2.svg" />
                        ) : (
                          <img src="Eyecon.svg" alt="" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                    <a href="#" className="forgot-password">
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className={`login-button ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="register-link">
              {"Don't have an account? "}
              <Link to={'/register'}>Register</Link>
            </p>
          </div>
        </div>
      </div>
      <style>
        {`
          .container {
            background-color: #ffffff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 60px;
            padding-bottom: 80px;
            box-sizing: border-box;
          }

          .error-message {
            color: #ef4444;
            font-size: 12px;
            margin-top: 6px;
          }

          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            margin-bottom: 50px;
            font-weight: bold;
          }

          .logo-icon {
            color: #4d007d;
          }

          .logo span {
            color: #4d007d;
            font-weight: 700;
            font-size: 28px;
          }

          .main-content {
            width: 100%;
            max-width: 1200px;
            display: flex;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 4px 4px 6px -1px rgba(0, 0, 0, 0.1),
              -4px -4px 6px -1px rgba(0, 0, 0, 0.1);
            min-height: 600px;
          }

          .left-section {
            flex: 1;
            background-color: #4d007d;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: white;
          }

          .dashboard-preview {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
          }

          .dashboard-image {
            width: 100%;
            max-width: 450px;
            height: 100%;
            max-height: 250px;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .content-text {
            text-align: center;
          }

          .content-text h2 {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 8px 0;
            line-height: 1.3;
          }

          .content-text p {
            font-size: 16px;
            line-height: 1.6;
            opacity: 0.9;
            margin: 0 0 30px 0;
          }

          .pagination {
            display: flex;
            gap: 8px;
            justify-content: center;
          }

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .dot.active {
            background: white;
          }

          .right-section {
            flex: 1;
            padding: 60px 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #e5e5e5;
            border-left: none;
            border-radius: 0px 12px 12px 0px;
          }

          .login-form {
            width: 100%;
            max-width: 400px;
            margin-bottom: 100px;
          }

          .login-form h1 {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 40px 0;
            text-align: left;
          }

          .form-group {
            margin-bottom: 12px;
          }

          .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }

          .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            box-sizing: border-box;
          }

          .form-group input:focus {
            outline: none;
            border-color: #4d007d;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          }

          .form-group input::placeholder {
            color: #9ca3af;
          }

          .password-input {
            position: relative;
          }

          .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #6b7280;
            padding: 4px;
          }

          .forgot-password {
            display: block;
            text-align: right;
            font-size: 14px;
            color: #4d007d;
            text-decoration: none;
            margin-top: 8px;
          }

          .forgot-password:hover {
            text-decoration: underline;
          }

          .login-button {
            width: 44%;
            background: #e5e7eb;
            color: #9ca3af;
            border: none;
            padding: 14px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 500;
            align: left;
            cursor: not-allowed;
            margin-bottom: 24px;
            transition: all 0.3s ease;
          }

          .login-button:hover {
            background: #4d007d;
            color: white;
            cursor: pointer;
          }

          .register-link {
            text-align: left;
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }

          .register-link a {
            color: #4d007d;
            text-decoration: none;
            font-weight: 500;
          }

          .register-link a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .main-content {
              flex-direction: column;
              margin: 20px;
            }

            .left-section {
              display:none;
            }

            .right-section {
              padding: 40px 30px;
            }

            .content-text h2,
            .content-text h3 {
              font-size: 20px;
            }

            .login-form h1 {
              font-size: 24px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
