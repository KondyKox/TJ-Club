import { UserData } from "@/types/UserData";

// Change user data
export const editUserProfile = async (
  userData: UserData | null,
  formData: { displayName: string; email: string },
  selectedFile: File | null,
  token: string
) => {
  const formDataToSend = new FormData();
  formDataToSend.append("uid", userData?.uid || "");
  formDataToSend.append("displayName", formData.displayName);
  formDataToSend.append("email", formData.email);

  if (selectedFile) formDataToSend.append("photo", selectedFile);

  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formDataToSend,
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Failed to update profile.");
  }

  return await response.json();
};

// Change user password
export const changeUserPassword = async (uid: string, password: string) => {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      password,
    }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Cannot change password.");
  }

  return await response.json();
};
