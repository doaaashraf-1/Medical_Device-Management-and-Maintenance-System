import { useState, FormEvent, ChangeEvent } from 'react';
import { maintenanceAPI } from '../services/api';
import { ReportFaultProps, MaintenanceFormData } from '../types';

function ReportFault({ devices, onClose }: ReportFaultProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    deviceId: '',
    issueDescription: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await maintenanceAPI.create(formData);
      alert('Fault reported successfully');
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.msg || error.response?.data?.message || 'Error reporting fault');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const workingDevices = devices.filter(d => d.status === 'Working');

  return (
    <div className="form-container">
      <h2 className="form-title">
        <i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)', marginLeft: '10px' }}></i>
        Report a Fault
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="fas fa-microscope" style={{ marginLeft: '5px', color: 'var(--primary)' }}></i>
            Device
          </label>
          <select 
            name="deviceId"
            className="form-control"
            value={formData.deviceId} 
            onChange={handleChange}
            required
          >
            <option value="">Select Device</option>
            {workingDevices.map(device => (
              <option key={device._id} value={device._id}>
                {device.name} - {device.serialId}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-file-alt" style={{ marginLeft: '5px', color: 'var(--primary)' }}></i>
            Issue Description
          </label>
          <textarea 
            name="issueDescription"
            className="form-control"
            value={formData.issueDescription} 
            onChange={handleChange}
            rows={5} 
            placeholder="Describe the issue in detail..."
            required 
          />
        </div>
        
        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button type="submit" className="btn btn-warning">
            <i className="fas fa-paper-plane"></i> Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportFault;
