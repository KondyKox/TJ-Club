"use client";

import { EditProfileModalProps } from "@/types/ProfileModalProps";
import Button from "../ui/Button";
import { useState } from "react";
import Image from "next/image";

// Modal for profile edit
const EditProfileModal = ({
  userFields,
  formData,
  setFormData,
  setSelectedFile,
  onSave,
  saving,
  error,
}: EditProfileModalProps) => {
  const [preview, setPreview] = useState<string | null>(
    formData.photoURL || null
  );

  // Obsługa wyboru pliku
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Podgląd zdjęcia
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-2">
      <h3 className="sub-header">Edycja</h3>
      {/* Profile picture */}
      <div className="relative w-32 h-32 rounded-full border-4 border-button shadow-lg">
        <Image
          src={preview || "/ano_vodka.svg"}
          alt="Zdjęcie profilowe"
          width={128}
          height={128}
          className="profile-picture"
        />
        <label
          htmlFor="profilePicture"
          className="absolute bottom-0 right-0 w-8 h-8 bg-button rounded-full flex justify-center items-center 
                      cursor-pointer hover:opacity-90"
        >
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          ✏️
        </label>
      </div>

      {/* User data */}
      <div className="flex flex-col justify-center items-center gap-4 mt-4">
        <div className="flex flex-col justify-center items-center gap-2">
          {userFields.map(
            (field, index) =>
              field.key !== "uid" && (
                <input
                  key={index}
                  type={field.key === "email" ? "email" : "text"}
                  className="input"
                  placeholder={field.label}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                />
              )
          )}
        </div>
        <Button
          className="border-2 border-button w-full"
          onClick={() => onSave()}
          loading={saving}
        >
          Zapisz
        </Button>
        {error && <p className="text-red text-center">{error}</p>}
      </div>
    </div>
  );
};

export default EditProfileModal;
