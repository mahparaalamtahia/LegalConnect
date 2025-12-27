import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './DocumentUpload.module.css';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lawyerId: '',
    file: null
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lawyers, setLawyers] = useState([]);

  React.useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await axios.get('/api/lawyers');
      setLawyers(response.data);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      // Sample data
      setLawyers([
        { id: 1, name: 'John Smith', specialization: 'Criminal Law' },
        { id: 2, name: 'Sarah Johnson', specialization: 'Corporate Law' }
      ]);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.file) {
      newErrors.file = 'Please select a file to upload';
    } else {
      const allowedTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = 'Invalid file type. Please upload PDF, DOCX, or images only.';
      }
      if (formData.file.size > 10 * 1024 * 1024) { // 10MB
        newErrors.file = 'File size must be less than 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
      if (errors.file) {
        setErrors(prev => ({
          ...prev,
          file: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('file', formData.file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      if (formData.lawyerId) {
        uploadData.append('lawyerId', formData.lawyerId);
      }

      await axios.post('/api/documents/upload', uploadData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      alert('Document uploaded successfully!');
      navigate('/client/dashboard');
    } catch (error) {
      console.error('Error uploading document:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to upload document. Please try again.' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={styles.documentUpload}>
      <div className={styles.container}>
        <h1 className={styles.title}>Upload Document</h1>

        <Card className={styles.uploadCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Document Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? styles.inputError : ''}
                placeholder="e.g., Contract Review, Legal Agreement"
              />
              {errors.title && <span className={styles.error}>{errors.title}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of the document..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lawyerId">Share with Lawyer (Optional)</label>
              <select
                id="lawyerId"
                name="lawyerId"
                value={formData.lawyerId}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select a lawyer...</option>
                {lawyers.map(lawyer => (
                  <option key={lawyer.id} value={lawyer.id}>
                    {lawyer.name} - {lawyer.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="file">Select File *</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className={styles.fileInput}
                />
                <label htmlFor="file" className={styles.fileLabel}>
                  {formData.file ? formData.file.name : 'Choose File'}
                </label>
              </div>
              {formData.file && (
                <p className={styles.fileInfo}>
                  File: {formData.file.name} ({formatFileSize(formData.file.size)})
                </p>
              )}
              {errors.file && <span className={styles.error}>{errors.file}</span>}
              <p className={styles.fileHint}>
                Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
            </div>

            {uploading && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className={styles.progressText}>Uploading: {uploadProgress}%</p>
              </div>
            )}

            {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;


