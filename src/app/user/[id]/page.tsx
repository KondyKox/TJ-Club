"use client";

import Button from "@/components/ui/Button";
import LoadingOverlay from "@/components/layout/Loading";
import Logout from "@/components/features/Logout";
import Modal from "@/components/ui/Modal";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";
import EditProfileModal from "@/components/user/EditProfileModal";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FriendsList from "@/components/user/FriendsList";
import { userFields } from "../constants";
import { getCurrentUser } from "@/lib/auth";

// User page component
const UserPage = () => {
  const params = useParams();
  const profileId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { userData, loading } = useUser(profileId);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"edit" | "password" | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  });
  const [password, setPassword] = useState<string>("");
  const [repPassword, setRepPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const router = useRouter();
  const user = getCurrentUser();

  const isOwnProfile = profileId === user?.uid;

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
    setError(null);
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
      setError(error.message);
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
    } catch (error: any) {
      setError(error.message);
      console.error("Erro changing password:", error);
    } finally {
      setSaving(false);
      setError(null);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!userData) router.push("/login");

  return (
    <>
      <section className="flex flex-col lg:flex-row justify-center items-stretch w-full mx-auto my-12 gap-2 md:gap-6 p-2">
        <div className="lg:w-1/2 panel">
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
                <p className="text-sm md:text-lg font-semibold">
                  {field.label}:{" "}
                  <span className="text-akcent font-bold">
                    {userData?.[field.key as keyof typeof userData]}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* User options */}
          {isOwnProfile && (
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
          )}
        </div>

        {/* Friends */}
        <div className="panel lg:w-1/3 flex flex-col items-center">
          <FriendsList isOwnProfile={isOwnProfile} />
        </div>
      </section>

      {/* Modal for editing profile / password change  */}
      <Modal isOpen={isModalOpen} onClose={() => toggleModal(null)}>
        {modalType === "edit" ? (
          <EditProfileModal
            userFields={userFields}
            formData={formData}
            setFormData={setFormData}
            onSave={handleEditProfile}
            saving={saving}
            error={error}
          />
        ) : (
          <ChangePasswordModal
            password={password}
            repPassword={repPassword}
            setPassword={setPassword}
            setRepPassword={setRepPassword}
            onSave={handleChangePassword}
            saving={saving}
            error={error}
          />
        )}
      </Modal>
    </>
  );
};

export default UserPage;
