import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { User, RegisterFormData } from '../types';


interface LoginProps {
  setUser: (user: User) => void;
}

function Login({ setUser }: LoginProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
    role: 'customer'
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const response = await authAPI.login({ 
          email: formData.email, 
          password: formData.password 
        });
        
        // Store JWT token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        setUser(response.data.user);
        // Navigate to dashboard
        navigate('/');
      } else {
        await authAPI.register(formData);
        alert('Registration successful! You can now login');
        setIsLogin(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.msg || error.response?.data?.message || 'Error occurred');
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-heartbeat"></i>
              <h1>Medical Monitoring System</h1>
            </div>
            <p>Login to access your control panel</p>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Account Type</label>
                  <select 
                    name="role"
                    className="form-control"
                    value={formData.role} 
                    onChange={handleInputChange}
                  >
                    <option value="admin">System Administrator</option>
                    <option value="customer">Hospital/Clinic</option>
                    <option value="engineer">Maintenance Engineer</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                className="form-control"
                placeholder="example@hospital.com"
                value={formData.email} 
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                className="form-control"
                placeholder={isLogin ? "Enter your password" : "Strong password"}
                value={formData.password} 
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
