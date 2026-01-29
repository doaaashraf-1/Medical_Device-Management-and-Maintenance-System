import { DeviceListProps, Device } from '../types';

function DeviceList({ devices }: DeviceListProps) {
  const getStatusClass = (status: Device['status']): string => {
    if (status === 'Working') return 'status-working';
    if (status === 'Fault') return 'status-fault';
    return 'status-maintenance';
  };

  const getStatusText = (status: Device['status']): string => {
    if (status === 'Working') return 'Working';
    if (status === 'Fault') return 'Fault';
    return 'Under Maintenance';
  };

  if (!devices || devices.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-microscope"></i>
        <h3>No Devices</h3>
        <p>No devices found.</p>
      </div>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Device Name</th>
          <th>Serial Number</th>
          <th>Hospital/Clinic</th>
          <th>Location</th>
          <th>Status</th>
          <th>Created Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {devices.map(device => ( 
          <tr key={device._id}>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-microscope" style={{ color: 'var(--primary)' }}></i>
                <strong>{device.name}</strong>
              </div>
            </td>
            <td>
              <code style={{ 
                background: '#f5f5f5', 
                padding: '2px 6px', 
                borderRadius: '4px',
                fontSize: '0.9em'
              }}>
                {device.serialId}
              </code>
            </td>
            <td>
              {typeof device.hospitalId === 'object' 
                ? device.hospitalId.name 
                : 'N/A'}
            </td>
            <td>{device.location || 'Not specified'}</td>
            <td>
              <span className={`status-badge ${getStatusClass(device.status)}`}>
                {getStatusText(device.status)}
              </span>
            </td>
            <td>
              {device.createdAt 
                ? new Date(device.createdAt).toLocaleDateString('ar-EG')
                : 'N/A'
              }
            </td>
            <td>
              <div className="action-buttons">
                <button className="btn btn-outline btn-sm" title="View Details">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="btn btn-outline btn-sm" title="Edit">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DeviceList;
