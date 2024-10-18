import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store'; // Import RootState type
import Compressor from 'compressorjs'; // Import Compressor.js

import './profile.css';

const Profile: React.FC = () => {
  const [name, setName] = useState<string>('');  
  const [iconUrl, setIconUrl] = useState<string>(''); 
  const [newIconUrl, setNewIconUrl] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

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
          const data = await response.json();
          if (response.ok) {
            setName(data.name);
            setIconUrl(data.iconUrl);
          } else {
            setError('Failed to fetch user data');
          }
        } catch (error) {
          setError('Error fetching user data');
        }
      }
    };
    fetchUserData();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Variable to hold the final icon URL
    let finalIconUrl = iconUrl;
  
    // First, compress and upload the new icon if a new image is selected
    if (newIconUrl) {
      try {
        await new Promise<void>((resolve, reject) => {
          new Compressor(newIconUrl, {
            quality: 0.8, // Adjust the quality (80%)
            maxWidth: 800, 
            maxHeight: 800,
            success: async (compressedResult) => {
              const formData = new FormData();
              formData.append('icon', compressedResult);
  
              try {
                const response = await fetch('https://railway.bookreview.techtrain.dev/uploads', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                });
  
                if (!response.ok) {
                  throw new Error('Failed to upload image');
                }
  
                const data = await response.json();
                finalIconUrl = data.iconUrl;  // Set the new icon URL from the upload response
                resolve();
              } catch (error) {
                setError('Error uploading image');
                reject(error);
              }
            },
            error(err) {
              setError('Error compressing image');
              reject(err);
            }
          });
        });
      } catch (error) {
        return; // Exit the function if an error occurs during image upload
      }
    }
  
    // Update user profile with new name and final iconUrl
    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, iconUrl: finalIconUrl }),
      });
  
      if (response.ok) {
        setSuccess('Profile updated successfully');
        navigate('/');  // Redirect to home after successful update
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError('Error updating profile');
    }
  };  

  return (
    <div>
      <h1>Edit Profile</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}  
            onChange={(e) => setName(e.target.value)}  
          />
        </div>
        <div>
          <label htmlFor="iconUrl">Icon:</label>
          <input
            type="file"
            id="iconUrl"
            accept="image/*"
            onChange={(e) => setNewIconUrl(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        {iconUrl && (
          <div className="current-icon-container">
            <img src={iconUrl} alt="Current Icon" className="current-icon" />
          </div>
        )}  
        <button type="submit" className='button'>Update Profile</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default Profile;
