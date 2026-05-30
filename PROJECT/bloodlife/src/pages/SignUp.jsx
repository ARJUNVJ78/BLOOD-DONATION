import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bloodGroup: 'A+'
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signup(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-gradient-blood">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-lg p-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Join BloodLife</h2>
          <p className="text-gray-600">Create an account and start saving lives</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="input-group md:col-span-2">
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                name="name"
                className="input-field pl-11" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                name="email"
                className="input-field pl-11" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="tel" 
                name="phone"
                className="input-field pl-11" 
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Blood Group</label>
            <select 
              name="bloodGroup"
              className="input-field cursor-pointer"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                name="password"
                className="input-field pl-11" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-4 text-lg mb-6 md:col-span-2 mt-4">
            <UserPlus size={20} /> Create Account
          </button>

          <p className="text-center text-gray-600 md:col-span-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--primary)] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>

      <style jsx="true">{`
        .min-h-\[90vh\] { min-height: 90vh; }
        .max-w-lg { max-width: 32rem; }
        .p-10 { padding: 2.5rem; }
        .p-6 { padding: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .text-3xl { font-size: 1.875rem; color: var(--text-primary); }
        .text-sm { font-size: 0.875rem; }
        .text-gray-600 { color: var(--text-secondary); }
        .bg-red-50 { background-color: rgba(239, 68, 68, 0.1); }
        .text-red-600 { color: #f87171; }
        .border-red-100 { border-color: rgba(239, 68, 68, 0.2); }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .left-3 { left: 0.75rem; }
        .top-1\/2 { top: 50%; }
        .-translate-y-1\/2 { transform: translateY(-50%); }
        .pl-11 { padding-left: 2.75rem; }
        .w-full { width: 100%; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .gap-x-6 { column-gap: 1.5rem; }
        .cursor-pointer { cursor: pointer; }
        @media (min-width: 768px) {
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\:col-span-2 { grid-column: span 2 / span 2; }
        }
      `}</style>
    </div>
  );
};

export default SignUp;
