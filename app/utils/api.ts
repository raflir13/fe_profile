import axios from 'axios';
import { Profile, ProfileFormData, UploadAvatarResponse } from '../types/profile';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all profiles
export const getProfiles = async (): Promise<Profile[]> => {
  const response = await api.get('/profiles/');
  return response.data;
};

// Get single profile
export const getProfile = async (id: number): Promise<Profile> => {
  const response = await api.get(`/profiles/${id}/`);
  return response.data;
};

// Create profile
export const createProfile = async (data: ProfileFormData): Promise<Profile> => {
  const response = await api.post('/profiles/', data);
  return response.data;
};

// Update profile
export const updateProfile = async (id: number, data: ProfileFormData): Promise<Profile> => {
  const response = await api.put(`/profiles/${id}/`, data);
  return response.data;
};

// Delete profile
export const deleteProfile = async (id: number): Promise<void> => {
  await api.delete(`/profiles/${id}/`);
};

// Upload avatar
export const uploadAvatar = async (id: number, file: File): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post(`/profiles/${id}/upload_avatar/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete avatar
export const deleteAvatar = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/profiles/${id}/delete_avatar/`);
  return response.data;
};

export default api;