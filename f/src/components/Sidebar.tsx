interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface User {
  name: string;
  email: string;
  role: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  user: User;
  onLogout: () => void;
}

function Sidebar({ items, activeItem, onItemClick, user, onLogout }: SidebarProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#ef4444';
      case 'engineer':
        return '#3b82f6';
      case 'customer':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getRoleText = (role: string): string => {
    if (role === 'admin') return 'System Administrator';
    if (role === 'customer') return 'Hospital/Clinic';
    if (role === 'engineer') return 'Maintenance Engineer';
    return role;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-heartbeat"></i>
          <span>Medical Device Management System</span>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
            <div className="user-role" style={{ color: getRoleColor(user.role) }}>
              {getRoleText(user.role)}
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
          >
            <div className="sidebar-item-content">
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="sidebar-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;