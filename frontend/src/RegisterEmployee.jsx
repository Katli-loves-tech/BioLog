import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RegisterEmployee.css';
import { registerEmployee, setFaceVector } from './api';
import * as faceapi from 'face-api.js';

function RegisterEmployee({ onRegisterComplete }) {
  const [formData, setFormData] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    position: '',
    department: '',
    contactNumber: '',
    email: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturing, setCapturing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.warn('Face models not loaded, face capture will be disabled:', err);
      }
    };
    loadModels();
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      setCameraError('Could not access camera. Please allow camera access.');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  // Capture face photo
  const captureFace = async () => {
    if (!videoRef.current || !modelsLoaded) return;
    setCapturing(true);
    setCameraError('');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      // Detect face and get descriptor
      const detection = await faceapi.detectSingleFace(canvas)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceDescriptor(Array.from(detection.descriptor));
        setFaceImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      } else {
        setCameraError('No face detected. Please try again with better lighting.');
      }
    } catch (err) {
      setCameraError('Failed to capture face. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  // Retake face photo
  const retakeFace = () => {
    setFaceDescriptor(null);
    setFaceImage(null);
    setCameraError('');
    startCamera();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Register the employee first
      const result = await registerEmployee(formData);
      const empNo = result.employeeNumber || formData.employeeNumber;

      // If face was captured, upload the face vector
      if (faceDescriptor && faceDescriptor.length > 0) {
        try {
          await setFaceVector(empNo, faceDescriptor);
        } catch (faceErr) {
          console.warn('Face vector upload failed (can be done later):', faceErr);
        }
      }

      setSuccess(`Employee ${empNo} registered successfully!`);
      setFormData({
        employeeNumber: '',
        firstName: '',
        lastName: '',
        idNumber: '',
        position: '',
        department: '',
        contactNumber: '',
        email: '',
        gender: '',
      });
      setFaceDescriptor(null);
      setFaceImage(null);
      if (onRegisterComplete) onRegisterComplete();
    } catch (err) {
      setError(err.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="register-employee-container">
      <h1>Register Employee</h1>
      <p className="form-subtitle">Fill in the employee details below</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="register-employee-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="empNo">Employee Number *</label>
            <input
              type="text"
              id="empNo"
              name="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleChange}
              placeholder="e.g. EMP007"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="idNum">ID Number *</label>
            <input
              type="text"
              id="idNum"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="South African ID number"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Developer"
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. 071 234 5678"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@company.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Face Photo</label>
            {!showCamera && !faceImage && (
              <button
                type="button"
                className="face-capture-btn"
                onClick={startCamera}
                disabled={!modelsLoaded}
              >
                📷 {modelsLoaded ? 'Take Face Picture' : 'Loading camera...'}
              </button>
            )}
          </div>
        </div>

        {/* Camera Preview */}
        {showCamera && (
          <div className="camera-container">
            <video ref={videoRef} autoPlay playsInline className="camera-preview" />
            <div className="camera-actions">
              <button
                type="button"
                className="camera-capture-btn"
                onClick={captureFace}
                disabled={capturing}
              >
                {capturing ? 'Processing...' : '📸 Capture'}
              </button>
              <button type="button" className="camera-close-btn" onClick={stopCamera}>
                Cancel
              </button>
            </div>
            {cameraError && <div className="camera-error">{cameraError}</div>}
          </div>
        )}

        {/* Captured Face Preview */}
        {faceImage && (
          <div className="face-preview-container">
            <img src={faceImage} alt="Captured face" className="face-preview" />
            <div className="face-preview-status">
              ✅ Face captured successfully
            </div>
            <button type="button" className="retake-btn" onClick={retakeFace}>
              Retake Photo
            </button>
          </div>
        )}

        <button type="submit" className="register-submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register Employee'}
        </button>
      </form>
    </div>
  );
}

export default RegisterEmployee;