"use client";

import Button from "@/components/Button";
import Logout from "@/components/Logout";
import Modal from "@/components/Modal";
import useUser from "@/hooks/useUser";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

// Fields with user data
const userFields = [
  { label: "Wyświetlana nazwa", key: "displayName" },
  { label: "Email", key: "email" },
];

const UserPage = () => {
  const { userData, loading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"edit" | "password" | null>(null);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || "",
    email: userData?.email || "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Edit user profile
  const handleEditClick = () => {
    setIsModalOpen(true);
    setModalType("edit");
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  // Change user password
  const changePasswordClick = () => {
    setIsModalOpen(true);
    setModalType("password");
  };

  const handleChangePassword = () => {
    console.log("Change password");
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  // Show / Hide password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full mx-auto my-12 gap-2">
      <div className="lg:w-2/3 w-full gradient-bg p-10 rounded-xl shadow-2xl border-2 border-akcent gap-2">
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

        {/* Dane użytkownika */}
        {loading ? (
          <h6 className="image-header mb-10">Ładowanie danych...</h6>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            {userFields.map((field, index) => (
              <div key={index} className="user-field">
                <p className="text-md font-semibold">
                  {field.label}:{" "}
                  <span className="text-akcent font-bold">
                    {userData?.[field.key as keyof typeof userData] ||
                      "Brak danych"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Opcje dla użytkownika */}
        <div className="flex flex-col justify-center items-center gap-4 overline-top mt-10">
          <div className="flex justify-center items-center w-full gap-4">
            <Button
              onClick={() => handleEditClick()}
              className="border-2 border-button"
            >
              Edytuj Profil
            </Button>
            <Button
              onClick={() => changePasswordClick()}
              className="border-2 border-button"
            >
              Zmiana Hasła
            </Button>
          </div>
          <Logout />
        </div>
      </div>

      {/* Modal for editing profile / password change  */}
      <Modal isOpen={isModalOpen} onClose={() => closeModal()}>
        {modalType === "edit" ? (
          <div className="flex flex-col justify-center items-center gap-4 p-2">
            <h3 className="sub-header">Edycja</h3>
            <div className="flex flex-col justify-center items-center gap-4 mt-4">
              <div className="flex flex-col justify-center items-center gap-2">
                {userFields.map((field, index) => (
                  <input
                    key={index}
                    type={`${field.key} === "email" ? "email" : "text"`}
                    className="input"
                    placeholder={field.label}
                    value={userData?.[field.key as keyof typeof userData] || ""}
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
                Zapisz
              </Button>
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
              Zapisz
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
