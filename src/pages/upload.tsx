import { useNavigate, useLocation, Link } from 'react-router-dom';
import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Compressor from 'compressorjs';
import './upload.css';

const Upload: React.FC = () => {
  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  const uploadSchema = Yup.object().shape({
    file: Yup.mixed().required('Uploading photo is required'),
  });

  // Function to compress and upload the image
  const handleFileUpload = async (file: File, setSubmitting: (isSubmitting: boolean) => void) => {
    new Compressor(file, {
      quality: 0.8, // Adjust the quality (0.8 means 80% quality)
      maxWidth: 800, 
      maxHeight: 800,
      success(result) {
        const formData = new FormData();
        formData.append('icon', result); // Add the compressed image to FormData

        fetch('https://railway.bookreview.techtrain.dev/uploads', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.iconUrl) {
              console.log('Image uploaded:', data.iconUrl);
              navigate('/home');
            } else {
              throw new Error(data.message || 'Failed to upload image');
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
            setSubmitting(false);
          });
      },
      error(err) {
        console.error('Compression error:', err.message);
        setSubmitting(false);
      },
    });
  };

  return (
    <div>
      <h1>BookReview</h1>
      <Formik
        initialValues={{ file: null }}
        validationSchema={uploadSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (values.file) {
            handleFileUpload(values.file, setSubmitting);
          }
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="upload">Upload your photo</label>
              <input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                  setFieldValue("file", file);
                }}
              />
              <ErrorMessage name="file" component="div" className="error" />
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              Sign in
            </button>
          </Form>
        )}
      </Formik>
      <Link to="/login" className="login-redirect">
        Already have an account.
      </Link>
    </div>
  );
};

export default Upload;
