// Edit profile modal props
export interface EditProfileModalProps {
  userFields: { label: string; key: string }[];
  formData: { displayName: string; email: string; photoURL: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      displayName: string;
      email: string;
      photoURL: string;
    }>
  >;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}

// Change password modal props
export interface ChangePasswordModalProps {
  password: string;
  repPassword: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setRepPassword: React.Dispatch<React.SetStateAction<string>>;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}
