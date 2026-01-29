import { useState, useEffect } from 'react';
import { maintenanceAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import MaintenanceList from '../components/MaintenanceList';
import { DashboardProps, MaintenanceRequest } from '../types';

function EngineerDashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
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
      const response = await maintenanceAPI.getAll();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Assigned').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Completed').length
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      id: 'tasks',
      label: 'Maintenance Tasks',
      icon: 'fas fa-tasks',
      badge: stats.pending + stats.inProgress
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: 'fas fa-clock',
      badge: stats.pending
    },
    {
      id: 'inprogress',
      label: 'In Progress',
      icon: 'fas fa-cog',
      badge: stats.inProgress
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: 'fas fa-check-circle',
      badge: stats.completed
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
                    <i className="fas fa-tasks"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Tasks</h3>
                    <div className="stat-value">{stats.total}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <div className="stat-value">{stats.pending}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                    <i className="fas fa-cog"></i>
                  </div>
                  <div className="stat-info">
                    <h3>In Progress</h3>
                    <div className="stat-value">{stats.inProgress}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <div className="stat-value">{stats.completed}</div>
                  </div>
                </div>
              </div>

              <div className="table-container">
                <div className="table-header">
                  <h3>
                    <i className="fas fa-tools" style={{ marginLeft: '10px', color: 'var(--primary)' }}></i>
                    Latest Tasks
                  </h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('tasks')}>
                    <i className="fas fa-eye"></i> View All
                  </button>
                </div>
                <MaintenanceList requests={requests.slice(0, 5)} onUpdate={loadData} isEngineer={true} />
              </div>
            </>
          )}

          {activeTab === 'tasks' && (
            <>
              <MaintenanceList requests={requests} onUpdate={loadData} isEngineer={true} />
            </>
          )}

          {activeTab === 'pending' && (
            <>
              <MaintenanceList 
                requests={requests.filter(r => r.status === 'Assigned')} 
                onUpdate={loadData} 
                isEngineer={true} 
              />
            </>
          )}

          {activeTab === 'inprogress' && (
            <>
              <MaintenanceList 
                requests={requests.filter(r => r.status === 'In Progress')} 
                onUpdate={loadData} 
                isEngineer={true} 
              />
            </>
          )}

          {activeTab === 'completed' && (
            <>
              <MaintenanceList 
                requests={requests.filter(r => r.status === 'Completed')} 
                onUpdate={loadData} 
                isEngineer={true} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EngineerDashboard;
