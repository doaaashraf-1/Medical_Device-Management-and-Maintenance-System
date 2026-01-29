import { useState } from 'react';
import { maintenanceAPI } from '../services/api';
import { MaintenanceListProps, MaintenanceRequest, User, Device } from '../types';

function MaintenanceList({ requests, engineers, onUpdate, isAdmin, isEngineer }: MaintenanceListProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [engineerId, setEngineerId] = useState<string>('');
  const [updateData, setUpdateData] = useState<{
    status: string;
  }>({
    status: ''
  });

  const handleAssign = async (requestId: string) => {
    try {
      await maintenanceAPI.assignEngineer(requestId, engineerId);
      alert('Engineer assigned successfully');
      setSelectedRequest(null);
      onUpdate();
    } catch (error: any) {
      alert(error.response?.data?.msg || error.response?.data?.message || 'Error occurred');
    }
  };

  const handleUpdate = async (requestId: string) => {
    try {
      await maintenanceAPI.updateStatus(requestId, updateData as any);
      alert('Status updated successfully');
      setSelectedRequest(null);
      onUpdate();
    } catch (error: any) {
      alert(error.response?.data?.msg || error.response?.data?.message || 'Error occurred');
    }
  };

  const getStatusText = (status: MaintenanceRequest['status']): string => {
    const statusMap: Record<MaintenanceRequest['status'], string> = {
      'Pending': 'Pending',
      'Assigned': 'Assigned',
      'In Progress': 'In Progress',
      'Completed': 'Completed'
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status: MaintenanceRequest['status']): string => {
    if (status === 'Completed') return 'status-working';
    if (status === 'Pending') return 'status-fault';
    return 'status-maintenance';
  };

  const getDeviceName = (device: Device | string): string => {
    return typeof device === 'object' ? device.name : 'N/A';
  };

  const getEngineerName = (engineer: User | string | undefined): string => {
    if (!engineer) return 'Not assigned';
    return typeof engineer === 'object' ? engineer.name : 'Not assigned';
  };

  const getHospitalName = (hospital: User | string): string => {
    return typeof hospital === 'object' ? hospital.name : 'N/A';
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-tools"></i>
        <h3>No Maintenance Requests</h3>
        <p>No maintenance requests found.</p>
      </div>
    );
  }

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Device</th>
            <th>Hospital/Clinic</th>
            <th>Issue Description</th>
            <th>Status</th>
            <th>Engineer</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-microscope" style={{ color: 'var(--primary)' }}></i>
                  <strong>{getDeviceName(request.deviceId)}</strong>
                </div>
              </td>
              <td>{getHospitalName(request.hospitalId)}</td>
              <td style={{ maxWidth: '200px' }}>{request.issueDescription}</td>
              <td>
                <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </td>
              <td>{getEngineerName(request.assignedEngineer)}</td>
              <td>{new Date(request.createdAt).toLocaleDateString('ar-EG')}</td>
              <td>
                <div className="action-buttons">
                  {isAdmin && request.status === 'Pending' && (
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedRequest(request._id)}>
                      <i className="fas fa-user-plus"></i> Assign
                    </button>
                  )}
                  {isEngineer && request.status !== 'Completed' && (
                    <button className="btn btn-success btn-sm" onClick={() => setSelectedRequest(request._id)}>
                      <i className="fas fa-edit"></i> Update
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRequest && isAdmin && (
        <div className="form-container" style={{ marginTop: '20px' }}>
          <h4 className="form-title">
            <i className="fas fa-user-cog" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
            Assign Engineer
          </h4>
          <div className="form-group">
            <label>
              <i className="fas fa-user" style={{ marginLeft: '5px', color: 'var(--primary)' }}></i>
              Select Engineer
            </label>
            <select className="form-control" value={engineerId} onChange={(e) => setEngineerId(e.target.value)}>
              <option value="">Select...</option>
              {engineers?.map(eng => (
                <option key={eng._id} value={eng._id}>{eng.name}</option>
              ))}
            </select>
          </div>
          <div className="form-footer">
            <button className="btn btn-outline" onClick={() => setSelectedRequest(null)}>
              <i className="fas fa-times"></i> Cancel
            </button>
            <button className="btn btn-success" onClick={() => handleAssign(selectedRequest)}>
              <i className="fas fa-check"></i> Confirm
            </button>
          </div>
        </div>
      )}

      {selectedRequest && isEngineer && (
        <div className="form-container" style={{ marginTop: '20px' }}>
          <h4 className="form-title">
            <i className="fas fa-tools" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
            Update Maintenance Status
          </h4>
          <div className="form-group">
            <label>
              <i className="fas fa-info-circle" style={{ marginLeft: '5px', color: 'var(--primary)' }}></i>
              Status
            </label>
            <select className="form-control" value={updateData.status} onChange={(e) => setUpdateData({...updateData, status: e.target.value})}>
              <option value="">Select...</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="form-footer">
            <button className="btn btn-outline" onClick={() => setSelectedRequest(null)}>
              <i className="fas fa-times"></i> Cancel
            </button>
            <button className="btn btn-success" onClick={() => handleUpdate(selectedRequest)}>
              <i className="fas fa-save"></i> Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MaintenanceList;
