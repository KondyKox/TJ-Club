"use client";

import Button from "@/components/Button";
import LoadingOverlay from "@/components/Loading";
import Logout from "@/components/Logout";
import Modal from "@/components/Modal";
import useUser from "@/hooks/useUser";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Fields with user data
const userFields = [
  { label: "Wyświetlana nazwa", key: "displayName" },
  { label: "Email", key: "email" },
];

// User page component
const UserPage = () => {
  const { userData, loading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"edit" | "password" | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  });
  const [password, setPassword] = useState<string>("");
  const [repPassword, setRepPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Synchronizacja stanu loading z userData
    if (!loading && userData) {
      setFormData({
        displayName: userData.displayName || "",
        email: userData.email || "",
      });
    }
  }, [loading, userData]);

  // Toggle modal
  const toggleModal = (type: "edit" | "password" | null) => {
    setIsModalOpen(!!type);
    setModalType(type);
  };

  // Edit user profile
  const handleEditProfile = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userData?.uid,
          displayName: formData.displayName,
          email: formData.email,
          photoURL: userData?.photoURL, // TODO: Not implemented yet
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toggleModal(null);
      console.log("Profile updated.");
    } catch (error: any) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  // Change user password
  const handleChangePassword = async () => {
    if (password !== repPassword) {
      setError("Hasła się nie zgadzają.");
      console.error("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userData?.uid,
          password,
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Cannot change password.");

      console.log("Password changed.");
      toggleModal(null);
    } catch (error) {
      console.error("Erro changing password:", error);
    } finally {
      setSaving(false);
    }
  };

  // Show / Hide password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <LoadingOverlay />;
  if (!userData) router.push("/login");

  return (
    <div className="flex flex-col justify-center items-center w-full mx-auto my-12 gap-2 p-2">
      <div className="lg:w-2/3 w-full gradient-bg py-4 md:p-10 rounded-xl shadow-2xl border-2 border-akcent gap-2">
        <div className="flex justify-center mb-12">
          <div className="relative w-32 h-32 rounded-full border-4 border-button shadow-lg">
            <Image
              src={userData?.photoURL || "/ano_vodka.svg"}
              alt="Zdjęcie profilowe"
              width={64}
              height={64}
              className="w-28 h-28 rounded-full absolute top-1 left-1 shadow-secondary border-1 border-button 
                          hover:drop-shadow-button duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* User data */}
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          {userFields.map((field, index) => (
            <div key={index} className="user-field">
              <p className="text-md font-semibold">
                {field.label}:{" "}
                <span className="text-akcent font-bold">
                  {userData?.[field.key as keyof typeof userData]}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* User options */}
        <div className="flex flex-col justify-center items-center gap-4 overline-top mt-10">
          <div className="flex justify-center items-center w-full gap-4">
            <Button
              onClick={() => toggleModal("edit")}
              className="border-2 border-button"
            >
              Edytuj Profil
            </Button>
            <Button
              onClick={() => toggleModal("password")}
              className="border-2 border-button"
            >
              Zmiana Hasła
            </Button>
          </div>
          <Logout />
        </div>
      </div>

      {/* Modal for editing profile / password change  */}
      <Modal isOpen={isModalOpen} onClose={() => toggleModal(null)}>
        {modalType === "edit" ? (
          <div className="flex flex-col justify-center items-center gap-4 p-2">
            <h3 className="sub-header">Edycja</h3>
            <div className="flex flex-col justify-center items-center gap-4 mt-4">
              <div className="flex flex-col justify-center items-center gap-2">
                {userFields.map((field, index) => (
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
                ))}
              </div>
              <Button
                className="border-2 border-button w-full"
                onClick={() => handleEditProfile()}
              >
                {saving ? "Zapisywanie..." : "Zapisz"}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        ) : (
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
              onClick={() => handleChangePassword()}
            >
              {saving ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
