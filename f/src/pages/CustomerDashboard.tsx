import { useState, useEffect } from 'react';
import { deviceAPI, maintenanceAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import DeviceList from '../components/DeviceList';
import ReportFault from '../components/ReportFault';
import MaintenanceList from '../components/MaintenanceList';
import { DashboardProps, Device, MaintenanceRequest } from '../types';

function CustomerDashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [devices, setDevices] = useState<Device[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Helper function to get status class and text
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'Working':
        return { class: 'working', text: 'Working' };
      case 'Fault':
        return { class: 'fault', text: 'Fault' };
      case 'Under Maintenance':
        return { class: 'maintenance', text: 'Under Maintenance' };
      default:
        return { class: 'working', text: 'Working' };
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      if (mq.matches && sidebarOpen) document.body.classList.add('sidebar-open');
      else document.body.classList.remove('sidebar-open');
    };
    update();
    mq.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  const loadData = async () => {
    try {
      const [devicesRes, requestsRes] = await Promise.all([
        deviceAPI.getAll(),
        maintenanceAPI.getAll()
      ]);
      console.log('Customer Devices:', devicesRes.data);
      console.log('Customer Requests:', requestsRes.data);
      
      const devices = devicesRes.data?.devices || devicesRes.data || [];
      const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
      
      setDevices(devices);
      setRequests(requests);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const stats = {
    total: devices.length,
    working: devices.filter(d => d.status === 'Working').length,
    maintenance: devices.filter(d => d.status === 'Under Maintenance').length,
    fault: devices.filter(d => d.status === 'Fault').length
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      id: 'devices',
      label: 'My Devices',
      icon: 'fas fa-microscope',
      badge: stats.total
    },
    {
      id: 'maintenance',
      label: 'Track Maintenance',
      icon: 'fas fa-tools',
      badge: requests.filter(r => r.status === 'Pending' || r.status === 'In Progress').length
    }
  ];

  return (
    <div className="app-layout">
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>
      
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          items={sidebarItems}
          activeItem={activeTab}
          onItemClick={(itemId) => {
            setActiveTab(itemId);
            setSidebarOpen(false);
          }}
          user={user}
          onLogout={onLogout}
        />
      </div>

      <div className="main-content">
        <div className="container">
        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                  <i className="fas fa-microscope"></i>
                </div>
                <div className="stat-info">
                  <h3>Total Devices</h3>
                  <div className="stat-value">{stats.total}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>Working Devices</h3>
                  <div className="stat-value">{stats.working}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                  <i className="fas fa-tools"></i>
                </div>
                <div className="stat-info">
                  <h3>Under Maintenance</h3>
                  <div className="stat-value">{stats.maintenance}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="stat-info">
                  <h3>Faulty Devices</h3>
                  <div className="stat-value">{stats.fault}</div>
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3>Latest Devices</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('devices')}>
                  <i className="fas fa-eye"></i> View All
                </button>
              </div>
              <DeviceList devices={devices.slice(0, 5)} />
            </div>
          </>
        )}

        {activeTab === 'devices' && (
          <>
            {devices.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-microscope"></i>
                <h3>No Registered Devices</h3>
                <p>No devices have been assigned to your hospital yet.</p>
              </div>
            ) : (
              <div className="devices-grid">
                {devices.map(device => (
                  <div key={device._id} className="device-card">
                    <div className="device-header">
                      <h3 className="device-name">{device.name}</h3>
                      <span className={`status-badge status-${getStatusInfo(device.status).class}`}>
                        {getStatusInfo(device.status).text}
                      </span>
                    </div>
                    <div className="device-details">
                      <div className="device-detail">
                        <i className="fas fa-hashtag"></i>
                        <span>Serial Number: {device.serialId}</span>
                      </div>
                      <div className="device-detail">
                        <i className="fas fa-calendar-check"></i>
                        <span>Created Date: {device.createdAt ? new Date(device.createdAt).toLocaleDateString('en-US') : 'N/A'}</span>
                      </div>
                      {device.location && (
                        <div className="device-detail">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>Location: {device.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="device-actions">
                      <button className="btn btn-outline">
                        <i className="fas fa-eye"></i> View Details
                      </button>
                      {device.status === 'Working' && (
                        <button className="btn btn-warning" onClick={() => setActiveTab('report')}>
                          <i className="fas fa-exclamation-triangle"></i> Report Fault
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'report' && (
          <>
            <ReportFault devices={devices} onClose={() => { setActiveTab('dashboard'); loadData(); }} />
          </>
        )}

        {activeTab === 'maintenance' && (
          <>
            <MaintenanceList requests={requests} onUpdate={loadData} />
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
