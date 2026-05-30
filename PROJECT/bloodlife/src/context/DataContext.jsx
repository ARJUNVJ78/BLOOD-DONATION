import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  const getHeaders = () => {
    const token = localStorage.getItem('blood_bank_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchDonors = async () => {
    try {
      const res = await fetch('/api/donors', {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setDonors(data);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests', {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDonors();
      fetchRequests();
    } else {
      setDonors([]);
      setRequests([]);
    }
  }, [user]);

  const addDonor = async (donor) => {
    try {
      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(donor)
      });
      if (res.ok) {
        const newDonor = await res.json();
        setDonors(prev => [...prev, newDonor]);
        return { success: true };
      }
      return { success: false, message: 'Failed to add donor' };
    } catch (error) {
      console.error('Error adding donor:', error);
      return { success: false, message: error.message };
    }
  };

  const updateDonor = async (id, updatedDonor) => {
    try {
      const res = await fetch(`/api/donors/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedDonor)
      });
      if (res.ok) {
        const updated = await res.json();
        setDonors(prev => prev.map(d => d.id === id ? updated : d));
        return { success: true };
      }
      return { success: false, message: 'Failed to update donor' };
    } catch (error) {
      console.error('Error updating donor:', error);
      return { success: false, message: error.message };
    }
  };

  const deleteDonor = async (id) => {
    try {
      const res = await fetch(`/api/donors/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setDonors(prev => prev.filter(d => d.id !== id));
        return { success: true };
      }
      return { success: false, message: 'Failed to delete donor' };
    } catch (error) {
      console.error('Error deleting donor:', error);
      return { success: false, message: error.message };
    }
  };

  const addRequest = async (request) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(request)
      });
      if (res.ok) {
        const newRequest = await res.json();
        setRequests(prev => [...prev, newRequest]);
        return { success: true };
      }
      return { success: false, message: 'Failed to submit request' };
    } catch (error) {
      console.error('Error submitting request:', error);
      return { success: false, message: error.message };
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        return { success: true };
      }
      return { success: false, message: 'Failed to update request status' };
    } catch (error) {
      console.error('Error updating request status:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <DataContext.Provider value={{ 
      donors, addDonor, updateDonor, deleteDonor,
      requests, addRequest, updateRequestStatus 
    }}>
      {children}
    </DataContext.Provider>
  );
};

