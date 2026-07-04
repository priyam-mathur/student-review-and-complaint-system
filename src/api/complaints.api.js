import api from './axios';

export const getComplaints = async (params) => {
  const { data } = await api.get('/complaints', { params });
  return data;
};

export const getComplaint = async (id) => {
  const { data } = await api.get(`/complaints/${id}`);
  return data;
};

export const createComplaint = async (formData) => {
  const { data } = await api.post('/complaints', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateComplaintStatus = async (id, statusData) => {
  const { data } = await api.patch(`/complaints/${id}/status`, statusData);
  return data;
};
