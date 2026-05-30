import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mx-4 mt-4 flex items-center justify-between" style={{ borderRadius: '24px' }}>
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[var(--primary)]">
        <Droplet fill="var(--primary)" size={32} />
        <span>BloodLife</span>
      </Link>

      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link to="/login" className="font-semibold text-[#263238] hover:text-[#D32F2F] transition-colors">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        ) : (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin" className="flex items-center gap-2 font-semibold text-[#263238] hover:text-[#D32F2F]">
                <Shield size={20} /> Admin Panel
              </Link>
            ) : (
              <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-[#263238] hover:text-[#D32F2F]">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            )}
            
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)]">
                  <User size={18} />
                </div>
                <span className="font-medium text-sm hidden md:block">{user.name || user.email}</span>
              </div>
              <button onClick={handleLogout} className="text-[#D32F2F] p-2 hover:bg-[#FFEBEE] rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx="true">{`
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .mx-4 { margin-left: 1rem; margin-right: 1rem; }
        .mt-4 { margin-top: 1rem; }
        .sticky { position: sticky; }
        .top-0 { top: 0; }
        .z-50 { z-index: 50; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-2xl { font-size: 1.5rem; }
        .text-sm { font-size: 0.875rem; }
        .text-[#D32F2F] { color: var(--primary); }
        .text-[#263238] { color: var(--secondary); }
        .hover\:text-[#D32F2F]:hover { color: var(--primary); }
        .hover\:bg-[#FFEBEE]:hover { background-color: var(--primary-light); }
        .transition-colors { transition: color 0.3s ease, background-color 0.3s ease; }
        .p-2 { padding: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .border-l { border-left: 1px solid; }
        .border-gray-200 { border-color: #e5e7eb; }
        .w-8 { width: 2rem; }
        .h-8 { height: 2rem; }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\:block { display: block; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
