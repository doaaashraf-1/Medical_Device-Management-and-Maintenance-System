import { useState, useEffect } from 'react';
import { deviceAPI, maintenanceAPI, userAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import DeviceList from '../components/DeviceList';
import AddDevice from '../components/AddDevice';
import MaintenanceList from '../components/MaintenanceList';
import { DashboardProps, Device, MaintenanceRequest, User } from '../types';

function AdminDashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [devices, setDevices] = useState<Device[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [engineers, setEngineers] = useState<User[]>([]);
  const [showAddDevice, setShowAddDevice] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
      const [devicesRes, requestsRes, engineersRes] = await Promise.all([
        deviceAPI.getAll(),
        maintenanceAPI.getAll(),
        userAPI.getEngineers()
      ]);
      
      // Handle devices response structure (it returns {devices: [], pagination: {}})
      setDevices(devicesRes.data.devices || []);
      setRequests(requestsRes.data);
      setEngineers(engineersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays on error to prevent filter errors
      setDevices([]);
      setRequests([]);
      setEngineers([]);
    }
  };

  const stats = {
    total: devices.length,
    working: devices.filter(d => d.status === 'Working').length,
    maintenance: devices.filter(d => d.status === 'Under Maintenance').length,
    fault: devices.filter(d => d.status === 'Fault').length,
    pendingRequests: requests.filter(r => r.status === 'Pending').length
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      id: 'devices',
      label: 'Device Management',
      icon: 'fas fa-microscope',
      badge: stats.total
    },
    {
      id: 'maintenance',
      label: 'Maintenance Requests',
      icon: 'fas fa-tools',
      badge: stats.pendingRequests
    },
    {
      id: 'engineers',
      label: 'Engineers',
      icon: 'fas fa-user-cog',
      badge: engineers.length
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

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>Pending Requests</h3>
                  <div className="stat-value">{stats.pendingRequests}</div>
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3>
                  <i className="fas fa-microscope" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
                  Latest Devices
                </h3>
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
            <div className="table-container">
              <div className="table-header">
                <h3>
                  <i className="fas fa-microscope" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
                  Device Management
                </h3>
                <button className="btn btn-outline" onClick={() => setActiveTab('dashboard')}>
                  <i className="fas fa-arrow-right"></i> Back
                </button>
                <button className="btn btn-success" onClick={() => setShowAddDevice(true)}>
                  <i className="fas fa-plus"></i> Add New Device
                </button>
              </div>
              {showAddDevice && <AddDevice onClose={() => { setShowAddDevice(false); loadData(); }} />}
              <DeviceList devices={devices} />
            </div>
          </>
        )}

        {activeTab === 'maintenance' && (
          <>
            <div className="table-container">
              <div className="table-header">
                <h3>
                  <i className="fas fa-tools" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
                  Maintenance Requests
                </h3>
                <button className="btn btn-outline" onClick={() => setActiveTab('dashboard')}>
                  <i className="fas fa-arrow-right"></i> Back
                </button>
              </div>
              <MaintenanceList requests={requests} engineers={engineers} onUpdate={loadData} isAdmin={true} />
            </div>
          </>
        )}

        {activeTab === 'engineers' && (
          <>
            <div className="table-container">
              <div className="table-header">
                <h3>
                  <i className="fas fa-user-cog" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
                  Engineer Management
                </h3>
</div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {engineers.map(engineer => (
                    <tr key={engineer._id}>
                      <td>{engineer.name}</td>
                      <td>{engineer.email}</td>
                      <td>{engineer.createdAt ? new Date(engineer.createdAt).toLocaleDateString('en-US') : 'N/A'}</td>
                      <td>
                        <span className="status-badge status-working">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
