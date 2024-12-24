import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { UserData } from "@/types/UserData";

const useUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = () => {
      const currentUser = getCurrentUser();

      if (currentUser) {
        setUserData({
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
      } else {
        console.warn("No logged in user.");
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  return { userData, loading };
};

export default useUser;
