import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { setToken } from '../slices/authSlice';

import './signup.css';

interface SignupValues {
  name: string;
  email: string;
  password: string;
}

// Validation schema for form inputs
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Required'),
});

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values: SignupValues, { setSubmitting }: FormikHelpers<SignupValues>) => {
    setSubmitting(true);
    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User created:', data);
        // setCookie(data.token);
        dispatch(setToken(data.token));
        navigate('/upload', { state: { token: data.token } }); // Navigate to the upload page with the token directly
      } else {
        console.error('Failed to create user:', data); // for developer
        alert(data.ErrorMessageEN); // for user
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1>BookReview</h1>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Username</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              Continue
            </button>
          </Form>
        )}
      </Formik>

      {/* Use Link component for SEO and accessibility setting */}
      <Link to="/login" className="login-redirect">
        Already have an account.
      </Link>
    </div>
  );
}

export default Signup;