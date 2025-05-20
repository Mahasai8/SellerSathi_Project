import React, { useState } from 'react';
import axios from 'axios';
import './FormPage.css';

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    costPrice: '',
    sellingPrice: '',
  });

  const [errors, setErrors] = useState({});
  const [profit, setProfit] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'costPrice' || name === 'sellingPrice') {
      const cp = name === 'costPrice' ? Number(value) : Number(formData.costPrice);
      const sp = name === 'sellingPrice' ? Number(value) : Number(formData.sellingPrice);
      setProfit(sp - cp);
    }

    if (name === 'phone' || name === 'email') {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const checkExistence = async (phone, email) => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/check-exist', {
        params: { phone, email },
      });

      const newErrors = {};
      if (res.data.exists) {
        if (res.data.phoneExists) newErrors.phone = 'Phone number already taken';
        if (res.data.emailExists) newErrors.email = 'Email already taken';
      }

      setErrors((prev) => ({ ...prev, ...newErrors }));
      return newErrors;
    } catch (err) {
      console.error('Error checking existence:', err);
      return {};
    }
  };

  const handlePhoneKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (formData.phone.length < 10) {
        setErrors((prev) => ({ ...prev, phone: 'Phone number is below 10 digits' }));
      } else {
        await checkExistence(formData.phone, '');
      }
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Email must include @' }));
    } else {
      await checkExistence('', formData.email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.phone.length !== 10) newErrors.phone = 'Phone number must be exactly 10 digits';
    if (!formData.email.includes('@')) newErrors.email = 'Email must include @';
    if (formData.costPrice === '') newErrors.costPrice = 'Cost Price is required';
    if (formData.sellingPrice === '') newErrors.sellingPrice = 'Selling Price is required';

    const existenceErrors = await checkExistence(formData.phone, formData.email);
    const combinedErrors = { ...newErrors, ...existenceErrors };

    if (Object.keys(combinedErrors).length > 0) {
      setErrors(combinedErrors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        cost_price: Number(formData.costPrice),
        selling_price: Number(formData.sellingPrice),
      });

      setSuccessMessage(res.data.message);
      setFormData({
        name: '',
        phone: '',
        email: '',
        costPrice: '',
        sellingPrice: '',
      });
      setProfit(0);
      setErrors({});
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Entry Form</h2>

      {successMessage && (
        <div style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>
          {successMessage}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {errors.name && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{errors.name}</div>}

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        onKeyDown={handlePhoneKeyDown}
        maxLength={10}
        required
      />
      {errors.phone && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{errors.phone}</div>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleEmailBlur}
        required
      />
      {errors.email && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{errors.email}</div>}

      <input
        type="number"
        name="costPrice"
        placeholder="Cost Price"
        value={formData.costPrice}
        onChange={handleChange}
        required
      />
      {errors.costPrice && (
        <div style={{ color: 'red', marginBottom: '0.5rem' }}>{errors.costPrice}</div>
      )}

      <input
        type="number"
        name="sellingPrice"
        placeholder="Selling Price"
        value={formData.sellingPrice}
        onChange={handleChange}
        required
      />
      {errors.sellingPrice && (
        <div style={{ color: 'red', marginBottom: '0.5rem' }}>{errors.sellingPrice}</div>
      )}

      <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        Profit: {profit}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
