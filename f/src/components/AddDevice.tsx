import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { deviceAPI, userAPI } from '../services/api';
import { AddDeviceProps, User, DeviceFormData } from '../types';

function AddDevice({ onClose }: AddDeviceProps) {
  const [customers, setCustomers] = useState<User[]>([]);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    serialId: '',
    hospitalId: '',
     status:"Working",
    location: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await userAPI.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deviceAPI.create(formData);
      alert('Device added successfully');
      // setFormData({ name: '', serialId: '', hospitalId: '', status:'',location: '' });
      onClose();
    } catch (error: any) {
      console.error('Error creating device:', error);
      alert(error.response?.data?.msg || error.response?.data?.message || 'Error adding device');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  

  return (
    <div className="card">
      <h3>Add New Device</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Device Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Serial Number</label>
          <input 
            type="text" name="serialId"  value={formData.serialId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hospital/Clinic</label>
          <select name="hospitalId" value={formData.hospitalId} onChange={handleChange} required>
            <option value="">Select Hospital/Clinic</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>{customer.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>status</label>
          <input type="text" name="status" value={formData.status} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input  type="text" name="location"  value={formData.location}  onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={customers.length === 0}>
            <i className="fas fa-save"></i> Save
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDevice;
