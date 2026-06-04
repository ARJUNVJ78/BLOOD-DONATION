import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User, Phone, Mail, Droplet, Clock, CheckCircle, XCircle, ChevronRight, X } from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { donors, addRequest, requests } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestForm, setRequestForm] = useState({
    name: user?.name || '',
    age: '',
    email: user?.email || '',
    phone: user?.phone || '',
    bloodType: '',
    category: 'Donor',
    ailments: '',
    units: '1'
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    addRequest({ ...requestForm, userId: user.email });
    setIsSidebarOpen(false);
    setRequestForm({
      ...requestForm,
      age: '',
      ailments: '',
      units: '1'
    });
    alert('Request submitted successfully!');
  };

  const filteredDonors = donors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myRequests = requests.filter(r => r.userId === user.email);

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Donor Network</h1>
            <p className="text-gray-500">Find and connect with blood donors near you</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="btn btn-primary shadow-lg px-6 py-3"
          >
            <Plus size={20} /> New Request
          </button>
        </header>

        {/* My Requests Status */}
        {myRequests && myRequests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-[var(--primary)]" /> My Recent Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRequests.slice(-3).reverse().map((req, i) => (
                <div key={i} className="card p-4 flex items-center justify-between border-l-4" 
                  style={{ borderLeftColor: req.status === 'approved' ? '#4CAF50' : req.status === 'rejected' ? '#F44336' : '#FFC107' }}>
                  <div>
                    <p className="font-bold">{req.category} - {req.bloodType}</p>
                    <p className="text-xs text-gray-500">{new Date(req.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Donor Search & List */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or blood group (e.g. O+)" 
            className="input-field pl-12 h-14 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDonors && filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <motion.div 
                layout
                key={donor.id} 
                className="card group hover:border-[#D32F2F] transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center text-[var(--primary)] font-bold text-2xl">
                    {donor.bloodGroup}
                  </div>
                  <div className="bg-[#FAFAFA] px-3 py-1 rounded-lg text-xs font-semibold text-gray-500">
                    ID: #{donor.id.toString().slice(-4)}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{donor.name}</h3>
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{donor.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{donor.phone}</span>
                  </div>
                </div>
                <button className="w-full py-3 border border-[var(--primary)] text-[var(--primary)] rounded-xl font-bold hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2">
                  Contact Donor <ChevronRight size={16} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              <Droplet size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">No donors found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Side Request Form Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">New Request</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-6">
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Age</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={requestForm.age}
                        onChange={(e) => setRequestForm({...requestForm, age: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Category</label>
                      <select 
                        className="input-field"
                        value={requestForm.category}
                        onChange={(e) => setRequestForm({...requestForm, category: e.target.value})}
                      >
                        <option value="Donor">Donating</option>
                        <option value="Receiver">Requesting</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Blood Type</label>
                      <select 
                        className="input-field"
                        value={requestForm.bloodType}
                        onChange={(e) => setRequestForm({...requestForm, bloodType: e.target.value})}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    {requestForm.category === 'Receiver' && (
                      <div className="input-group">
                        <label className="input-label">Units Needed</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={requestForm.units}
                          onChange={(e) => setRequestForm({...requestForm, units: e.target.value})}
                          min="1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Pre-existing Ailments (if any)</label>
                    <textarea 
                      className="input-field min-h-[100px]" 
                      placeholder="List any conditions or 'None'"
                      value={requestForm.ailments}
                      onChange={(e) => setRequestForm({...requestForm, ailments: e.target.value})}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-4 text-lg">
                    Submit Request
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .flex-1 { flex: 1 1 0%; }
        .bg-\[\#FAFAFA\] { background-color: var(--bg-dark); }
        .p-8 { padding: 2rem; }
        .p-4 { padding: 1rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-12 { margin-bottom: 3rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .text-3xl { font-size: 1.875rem; color: var(--text-primary); }
        .text-2xl { font-size: 1.5rem; color: var(--text-primary); }
        .text-xl { font-size: 1.25rem; color: var(--text-primary); }
        .font-bold { font-weight: 700; }
        .text-gray-500 { color: var(--text-secondary); }
        .text-gray-400 { color: var(--text-secondary); opacity: 0.6; }
        .text-gray-600 { color: var(--text-secondary); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .border-l-4 { border-left-width: 4px; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-2 { gap: 0.5rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .text-xs { font-size: 0.75rem; }
        .uppercase { text-transform: uppercase; }
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .right-0 { right: 0; }
        .top-0 { top: 0; }
        .h-full { height: 100%; }
        .w-full { width: 100%; }
        .max-w-md { max-width: 28rem; }
        .bg-black\/40 { background-color: rgba(0, 0, 0, 0.6); }
        .backdrop-blur-sm { backdrop-filter: blur(8px); }
        .z-\[100\] { z-index: 100; }
        .z-\[101\] { z-index: 101; }
        .overflow-y-auto { overflow-y: auto; }
        .bg-white { background-color: var(--bg-card); border-left: var(--border); }
        .bg-green-100 { background-color: rgba(34, 197, 94, 0.1); }
        .text-green-700 { color: #4ade80; }
        .bg-red-100 { background-color: rgba(239, 68, 68, 0.1); }
        .text-red-700 { color: #f87171; }
        .bg-yellow-100 { background-color: rgba(234, 179, 8, 0.1); }
        .text-yellow-700 { color: #facc15; }
        .min-h-\[100px\] { min-height: 100px; }
        @media (min-width: 768px) {
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
};

export default DonorDashboard;
