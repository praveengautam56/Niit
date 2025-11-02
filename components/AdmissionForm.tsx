import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { BackArrowIcon } from './icons';

interface AdmissionFormProps {
  courseName: string;
  onClose: () => void;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ courseName, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    guardianName: '',
    dob: '',
    medium: 'Hindi',
    gender: 'Male',
    maritalStatus: 'Single',
    address: '',
    district: '',
    city: '',
    pinCode: '',
    mobile: '',
    email: '',
    aadhar: '',
    education: '',
    bpl: 'No',
    category: '',
    physicallyChallenged: 'No',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    for (const key in formData) {
        if (formData[key as keyof typeof formData].trim() === '' && key !== 'email') { // Email is optional
            alert(`Please fill out the ${key.replace(/([A-Z])/g, ' $1')} field.`);
            return;
        }
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to submit the form.");
      
      const firebasePath = `${courseName.toLowerCase().replace('-', '')}-admissions`;
      const admissionsRef = db.ref(firebasePath);

      await admissionsRef.push({
        ...formData,
        submittedByUid: user.uid,
        submittedAt: Date.now()
      });
      
      setSuccess('Your application has been submitted successfully! Redirecting...');
      
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admission-form-container">
        <div className="admission-form-content">
             <button onClick={onClose} className="back-button" aria-label="Go back">&larr;</button>
            <header className="admission-form-header">
                <h1>Rajasthan Knowledge Corporation</h1>
                <p>7A, Jhalana Institute Area, Jaipur - 302004 (RAJ.)</p>
                <p>Phone number: +91-141-5197000</p>
            </header>
            <h2 className="admission-form-title">Admission Form for Admission to {courseName}</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="guardianName">Father's / Husband Name</label>
                    <input type="text" id="guardianName" name="guardianName" value={formData.guardianName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label>Medium of Study</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input type="radio" name="medium" value="Hindi" checked={formData.medium === 'Hindi'} onChange={handleChange} /> Hindi
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="medium" value="English" checked={formData.medium === 'English'} onChange={handleChange} /> English
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Marital Status</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === 'Single'} onChange={handleChange} /> Single
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === 'Married'} onChange={handleChange} /> Married
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="district">District</label>
                    <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="pinCode">Pin Code</label>
                    <input type="number" id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email ID</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="aadhar">Aadhar Number</label>
                    <input type="number" id="aadhar" name="aadhar" value={formData.aadhar} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="education">Educational Qualification</label>
                    <input type="text" id="education" name="education" value={formData.education} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>BPL</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input type="radio" name="bpl" value="Yes" checked={formData.bpl === 'Yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="bpl" value="No" checked={formData.bpl === 'No'} onChange={handleChange} /> No
                        </label>
                    </div>
                </div>
                 <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Physically Challenged</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input type="radio" name="physicallyChallenged" value="Yes" checked={formData.physicallyChallenged === 'Yes'} onChange={handleChange} /> Yes
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="physicallyChallenged" value="No" checked={formData.physicallyChallenged === 'No'} onChange={handleChange} /> No
                        </label>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="auth-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    </div>
  );
};

export default AdmissionForm;