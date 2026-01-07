'use client';

import Image from 'next/image';
import { Profile } from '../types/profile';
import { FaUser, FaEnvelope, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';

interface ProfileCardProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
  onDelete: (id: number) => void;
  onUploadAvatar: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onEdit, onDelete, onUploadAvatar }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Avatar Section */}
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FaUser className="text-white text-6xl opacity-50" />
          </div>
        )}
        
        {/* Upload Avatar Button */}
        <button
          onClick={() => onUploadAvatar(profile)}
          className="absolute bottom-2 right-2 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors duration-200"
          title="Upload Avatar"
        >
          <FaUpload />
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <FaEnvelope className="mr-2" />
          <span className="text-sm">{profile.email}</span>
        </div>

        {profile.bio && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{profile.bio}</p>
        )}

        <div className="text-xs text-gray-500 mb-4">
          Created: {new Date(profile.created_at).toLocaleDateString()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(profile)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(profile.id)}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}