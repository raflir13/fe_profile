export interface Profile {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar_filename: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  bio?: string;
}

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  profile: Profile;
  avatar_url: string;
}