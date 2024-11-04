import { useNavigate, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Compressor from 'compressorjs';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import RootState type
import './upload.css';

const Upload: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  // Fetch user data with token (if needed)
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('fetchUserData');
          if (!response.ok) {
            setError('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data');
        }
      }
    };

    fetchUserData();
  }, [token]);

  const uploadSchema = Yup.object().shape({
    file: Yup.mixed().required('Uploading photo is required'),
  });

  const handleFileUpload = async (file: File, setSubmitting: (isSubmitting: boolean) => void) => {
    if (!token) {
      setError('Token is missing. Please login.');
      setSubmitting(false);
      navigate('/login');
      return;
    }

    new Compressor(file, {
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      success(result) {
        const formData = new FormData();
        formData.append('icon', result);

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
              navigate('/');
            } else {
              throw new Error(data.message || 'Failed to upload image');
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
            setError('Error uploading image');
            setSubmitting(false);
          });
      },
      error(err) {
        console.error('Compression error:', err.message);
        setError('Error compressing image');
        setSubmitting(false);
      },
    });
  };

  return (
    <div>
      <h1>BookReview</h1>
      {error && <div className="error">{error}</div>}
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
                  setFieldValue('file', file);
                }}
              />
              <ErrorMessage name="file" component="div" className="error" />
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              Upload Image
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
