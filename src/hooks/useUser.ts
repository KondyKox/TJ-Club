import { useEffect, useState } from "react";
import { UserData } from "@/types/UserData";
import { searchUserById } from "@/lib/utils/friends";

const useUser = (uid: string) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // Jeśli przekazano uid, pobierz dane użytkownika po uid
      try {
        const userProfile = await searchUserById(uid);
        // Mapowanie danych z ProfileProps na UserData
        const mappedUserData: UserData = {
          uid: userProfile?.uid!,
          displayName: userProfile?.username, // Zmieniamy "username" na "displayName"
          email: userProfile?.email,
          photoURL: userProfile?.profilePicture, // Zmieniamy "profilePicture" na "photoURL"
        };

        setUserData(mappedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [uid]); // Hook będzie się uruchamiał, gdy zmieni się uid

  return { userData, loading };
};

export default useUser;
