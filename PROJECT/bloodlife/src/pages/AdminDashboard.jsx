import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Droplet, Plus, Edit, Trash2, Check, X, 
  Search, Filter, ChevronRight, UserPlus, FileText,
  AlertCircle, CheckCircle2, XCircle, Mail, Phone
} from 'lucide-react';

const AdminDashboard = () => {
  const { donors, addDonor, updateDonor, deleteDonor, requests, updateRequestStatus } = useData();
  const [activeTab, setActiveTab] = useState('donors');
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [donorForm, setDonorForm] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    ailments: ''
  });

  const handleDonorSubmit = (e) => {
    e.preventDefault();
    if (editingDonor) {
      updateDonor(editingDonor.id, donorForm);
    } else {
      addDonor(donorForm);
    }
    closeDonorModal();
  };

  const openDonorModal = (donor = null) => {
    if (donor) {
      setEditingDonor(donor);
      setDonorForm(donor);
    } else {
      setEditingDonor(null);
      setDonorForm({ name: '', age: '', email: '', phone: '', bloodGroup: 'A+', ailments: '' });
    }
    setIsDonorModalOpen(true);
  };

  const closeDonorModal = () => {
    setIsDonorModalOpen(false);
    setEditingDonor(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[var(--secondary)] text-white p-6 fixed h-full shadow-2xl">
        <div className="flex items-center gap-2 text-2xl font-bold text-[var(--primary)] mb-12">
          <Droplet fill="var(--primary)" size={32} />
          <span className="text-white">Admin</span>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('donors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'donors' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <Users size={20} /> Donors
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <FileText size={20} /> Requests
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold capitalize">{activeTab} Management</h1>
            <p className="text-gray-500">Overview of system {activeTab}</p>
          </div>
          {activeTab === 'donors' && (
            <button 
              onClick={() => openDonorModal()}
              className="btn btn-primary px-6 py-3 shadow-lg"
            >
              <UserPlus size={20} /> Add New Donor
            </button>
          )}
        </header>

        {activeTab === 'donors' ? (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Ailments</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donors && donors.length > 0 ? donors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold">{donor.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full font-bold">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span>{donor.email}</span>
                        <span className="text-gray-400">{donor.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{donor.ailments || 'None'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openDonorModal(donor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => { if(window.confirm('Delete donor?')) deleteDonor(donor.id) }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                      No donors registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests && requests.length > 0 ? requests.slice().reverse().map((req) => (
              <motion.div 
                layout
                key={req.id} 
                className={`card flex items-center justify-between p-6 border-l-4 ${
                  req.status === 'approved' ? 'border-green-500' : 
                  req.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    req.category === 'Donor' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {req.bloodType}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{req.name} <span className="text-gray-400 font-normal text-sm">({req.age} yrs)</span></h3>
                    <p className="text-sm text-gray-500 flex items-center gap-4">
                      <span className="flex items-center gap-1"><Mail size={14} /> {req.email}</span>
                      <span className="flex items-center gap-1"><Phone size={14} /> {req.phone}</span>
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${req.category === 'Donor' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {req.category}
                      </span>
                      {req.category === 'Receiver' && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100">{req.units} Units</span>}
                      {req.ailments && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">Ailments: {req.ailments}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {req.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => updateRequestStatus(req.id, 'approved')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button 
                        onClick={() => updateRequestStatus(req.id, 'rejected')}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                      >
                        <X size={18} /> Reject
                      </button>
                    </>
                  ) : (
                    <div className={`flex items-center gap-2 font-bold uppercase text-sm ${req.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                      {req.status === 'approved' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                      {req.status}
                    </div>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="card py-20 text-center text-gray-400">
                No requests found.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Donor Add/Edit Modal */}
      <AnimatePresence>
        {isDonorModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDonorModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">{editingDonor ? 'Edit Donor' : 'Add New Donor'}</h2>
              <form onSubmit={handleDonorSubmit} className="space-y-4">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={donorForm.name}
                    onChange={(e) => setDonorForm({...donorForm, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="input-label">Age</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={donorForm.age}
                      onChange={(e) => setDonorForm({...donorForm, age: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Blood Group</label>
                    <select 
                      className="input-field"
                      value={donorForm.bloodGroup}
                      onChange={(e) => setDonorForm({...donorForm, bloodGroup: e.target.value})}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={donorForm.email}
                    onChange={(e) => setDonorForm({...donorForm, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone</label>
                  <input 
                    type="tel" 
                    className="input-field" 
                    value={donorForm.phone}
                    onChange={(e) => setDonorForm({...donorForm, phone: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Ailments</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="None"
                    value={donorForm.ailments}
                    onChange={(e) => setDonorForm({...donorForm, ailments: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closeDonorModal} className="btn flex-1 bg-gray-100 text-gray-700">Cancel</button>
                  <button type="submit" className="btn btn-primary flex-1">Save Donor</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .flex-1 { flex: 1 1 0%; }
        .flex-col { flex-direction: column; }
        .h-full { height: 100%; }
        .w-64 { width: 16rem; }
        .w-full { width: 100%; }
        .bg-\[\#FAFAFA\] { background-color: var(--bg-dark); }
        .bg-\[\#263238\] { background-color: var(--secondary); }
        .text-white { color: white; }
        .text-gray-400 { color: var(--text-secondary); opacity: 0.6; }
        .text-gray-500 { color: var(--text-secondary); }
        .p-6 { padding: 1.5rem; }
        .p-10 { padding: 2.5rem; }
        .p-0 { padding: 0; }
        .p-8 { padding: 2rem; }
        .mb-12 { margin-bottom: 3rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .fixed { position: fixed; }
        .ml-64 { margin-left: 16rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-3xl { border-radius: 1.5rem; }
        .font-bold { font-weight: 700; }
        .text-3xl { font-size: 1.875rem; color: var(--text-primary); }
        .text-2xl { font-size: 1.5rem; color: var(--text-primary); }
        .text-xl { font-size: 1.25rem; color: var(--text-primary); }
        .text-lg { font-size: 1.125rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .capitalize { text-transform: capitalize; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .overflow-hidden { overflow: hidden; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .divide-y > * + * { border-top-width: 1px; }
        .divide-gray-100 > * + * { border-color: rgba(255, 255, 255, 0.05); }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-0\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .bg-gray-50 { background-color: rgba(255, 255, 255, 0.03); }
        .bg-blue-50 { background-color: rgba(59, 130, 246, 0.1); }
        .text-blue-600 { color: #60a5fa; }
        .bg-red-50 { background-color: rgba(239, 68, 68, 0.1); }
        .text-red-600 { color: #f87171; }
        .bg-green-600 { background-color: #16a34a; }
        .bg-red-600 { background-color: #dc2626; }
        .text-green-600 { color: #4ade80; }
        .border-green-500 { border-color: #22c55e; }
        .border-red-500 { border-color: #ef4444; }
        .border-yellow-500 { border-color: #eab308; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-\[100\] { z-index: 100; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .bg-black\/40 { background-color: rgba(0, 0, 0, 0.6); }
        .backdrop-blur-sm { backdrop-filter: blur(8px); }
        .max-w-lg { max-width: 32rem; }
        .pt-4 { padding-top: 1rem; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-2 { gap: 0.5rem; }
        .justify-between { justify-content: space-between; }
        .justify-end { justify-content: space-end; }
        .items-center { align-items: center; }
        .hover\:bg-gray-50:hover { background-color: rgba(255, 255, 255, 0.05); }
        .hover\:bg-white\/5:hover { background-color: rgba(255, 255, 255, 0.05); }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
