import { firebase } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  //   const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      setIsLoggedIn(!!user);
      //   setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isLoggedIn };
};

export default useAuth;
