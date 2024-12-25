"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Button from "../ui/Button";
import { useState } from "react";
import { ChangePasswordModalProps } from "@/types/ProfileModalProps";

// Modal for password change
const ChangePasswordModal = ({
  password,
  repPassword,
  setPassword,
  setRepPassword,
  onSave,
  saving,
  error,
}: ChangePasswordModalProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Show / Hide password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h3 className="sub-header">Zmiana hasła</h3>
      <div className="flex flex-col justify-center items-center gap-2 w-full relative">
        <input
          type={showPassword ? "text" : "password"}
          className="input"
          placeholder="Nowe hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}
          className="input"
          placeholder="Powtórz hasło"
          value={repPassword}
          onChange={(e) => setRepPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 bottom-2 text-gray-500"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-6 w-6" />
          ) : (
            <EyeIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      <Button
        className="border-2 border-button w-full"
        onClick={() => onSave()}
      >
        {saving ? "Zapisywanie..." : "Zapisz"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ChangePasswordModal;
