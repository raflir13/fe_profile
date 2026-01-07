// File: app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Profile, ProfileFormData } from './types/profile';
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  uploadAvatar,
} from './utils/api';
import ProfileCard from './components/ProfileCard';
import ProfileForm from './components/ProfileForm';
import AvatarUpload from './components/AvatarUpload';
import { FaPlus, FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      alert('Failed to load profiles. Make sure backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (data: ProfileFormData) => {
    try {
      await createProfile(data);
      await loadProfiles();
      setShowForm(false);
      alert('Profile created successfully!');
    } catch (error: any) {
      console.error('Failed to create profile:', error);
      const errorMsg = error.response?.data?.email?.[0] || 'Failed to create profile';
      alert(errorMsg);
    }
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    if (!selectedProfile) return;

    try {
      await updateProfile(selectedProfile.id, data);
      await loadProfiles();
      setShowForm(false);
      setSelectedProfile(null);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMsg = error.response?.data?.email?.[0] || 'Failed to update profile';
      alert(errorMsg);
    }
  };

  const handleDeleteProfile = async (id: number) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      await deleteProfile(id);
      await loadProfiles();
      alert('Profile deleted successfully!');
    } catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile');
    }
  };

  const handleUploadAvatar = async (id: number, file: File) => {
    try {
      setUploadingAvatar(true);
      await uploadAvatar(id, file);
      await loadProfiles();
      setShowAvatarUpload(false);
      setSelectedProfile(null);
      alert('Avatar uploaded successfully!');
    } catch (error: any) {
      console.error('Failed to upload avatar:', error);
      const errorMsg = error.response?.data?.error || 'Failed to upload avatar';
      alert(errorMsg);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const openCreateForm = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  const openEditForm = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowForm(true);
  };

  const openAvatarUpload = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowAvatarUpload(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedProfile(null);
  };

  const closeAvatarUpload = () => {
    setShowAvatarUpload(false);
    setSelectedProfile(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Profile Manager
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage user profiles with Cloudflare R2 storage
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2 shadow-lg"
            >
              <FaPlus /> Create Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Total Profiles</p>
            <p className="text-2xl font-bold text-purple-600">{profiles.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Backend Status</p>
            <p className="text-lg font-semibold text-green-600">
              {loading ? 'Connecting...' : 'Connected'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-purple-600 text-6xl animate-spin mb-4" />
            <p className="text-gray-600">Loading profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Profiles Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first profile!
            </p>
            <button
              onClick={openCreateForm}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <FaPlus /> Create First Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onEdit={openEditForm}
                onDelete={handleDeleteProfile}
                onUploadAvatar={openAvatarUpload}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ProfileForm
          profile={selectedProfile}
          onSubmit={selectedProfile ? handleUpdateProfile : handleCreateProfile}
          onCancel={closeForm}
        />
      )}

      {showAvatarUpload && selectedProfile && (
        <AvatarUpload
          profile={selectedProfile}
          onUpload={handleUploadAvatar}
          onClose={closeAvatarUpload}
        />
      )}

      {/* Loading Overlay for Avatar Upload */}
      {uploadingAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <FaSpinner className="text-purple-600 text-6xl animate-spin mb-4" />
            <p className="text-gray-800 text-lg font-semibold">
              Uploading to Cloudflare R2...
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            Profile Manager &copy; 2026 | Backend: Django REST + Cloudflare R2
            | Frontend: Next.js 14
          </p>
        </div>
      </footer>
    </main>
  );
}