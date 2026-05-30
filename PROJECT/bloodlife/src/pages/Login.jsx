import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('blood_bank_user'));
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-gradient-blood">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                className="input-field pl-11" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                className="input-field pl-11" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full py-4 text-lg mb-6">
            <LogIn size={20} /> Sign In
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--primary)] font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>

      </motion.div>

      <style jsx="true">{`
        .min-h-\[90vh\] { min-height: 90vh; }
        .max-w-md { max-width: 28rem; }
        .p-10 { padding: 2.5rem; }
        .p-6 { padding: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-gray-600 { color: var(--text-secondary); }
        .text-gray-500 { color: var(--text-secondary); opacity: 0.8; }
        .text-gray-400 { color: var(--text-secondary); opacity: 0.6; }
        .bg-red-50 { background-color: rgba(239, 68, 68, 0.1); }
        .text-red-600 { color: #f87171; }
        .border-red-100 { border-color: rgba(239, 68, 68, 0.2); }
        .border-gray-100 { border-color: rgba(255, 255, 255, 0.1); }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .left-3 { left: 0.75rem; }
        .top-1\/2 { top: 50%; }
        .-translate-y-1\/2 { transform: translateY(-50%); }
        .pl-11 { padding-left: 2.75rem; }
        .w-full { width: 100%; }
        .tracking-widest { letter-spacing: 0.1em; }
        .pt-8 { padding-top: 2rem; }
        .mt-8 { margin-top: 2rem; }
        .border-t { border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .flex-col { flex-direction: column; }
        .gap-3 { gap: 0.75rem; }
      `}</style>
    </div>
  );
}

export default Login
