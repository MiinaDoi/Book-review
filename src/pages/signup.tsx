import { Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as Yup from 'yup';

interface SignupValues {
  username: string;
  email: string;
  password: string;
  iconUrl: string; 
}

// Validation Schema
const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Required'),
  iconUrl: Yup.string().url('Must be a valid URL').required('An image is required')
});

function Signup() {
  const handleSubmit = async (values: SignupValues, { setSubmitting }: FormikHelpers<SignupValues>) => {
    setSubmitting(true);
    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      console.log("User created:", data);
      setSubmitting(false);
    } catch (error) {
      console.error("Error:", error);
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File, setFieldValue: (field: string, value: any) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/uploads', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setFieldValue('iconUrl', data.iconUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setFieldValue('iconUrl', null);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{ username: '', email: '', password: '', iconUrl: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username" component="div" />

            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" />

            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" />

            <label htmlFor="iconUrl">Upload Image</label>
            <input type="file" accept="image/jpeg, image/png" onChange={(event) => {
              const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
              if (file) handleImageUpload(file, setFieldValue);
            }} />
            <ErrorMessage name="iconUrl" component="div" />

            <button type="submit">Sign Up</button>
          </Form>
        )}
      </Formik>
      <p>Already have an account.</p>
    </div>
  );
}

export default Signup;
