import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { collections } from "../firebaseConfig";
import { ProfileProps } from "@/types/ProfileProps";

// Fetch friend from firestore
export const fetchFriends = async (userUid: string) => {
  try {
    const userDoc = await getDoc(doc(collections.users, userUid));
    if (!userDoc.exists()) return [];

    const { friends } = userDoc.data();
    if (!friends || !Array.isArray(friends)) return [];

    // Get data of every friend
    const friendsData = await Promise.all(
      friends.map(async (friendUid: string) => {
        const friendDoc = await getDoc(doc(collections.users, friendUid));
        if (friendDoc.exists()) {
          const data = friendDoc.data();
          return {
            uid: friendDoc.id,
            username: data.username || "",
            email: data.email || "",
            profilePicture: data.profilePicture || "",
            friends: data.friends || [],
          } as ProfileProps;
        }
        return null;
      })
    );

    return friendsData.filter(Boolean) as ProfileProps[];
  } catch (error: any) {
    console.error("Error fetching friends:", error);
    return [];
  }
};

// Search new friend
export const searchUsers = async (searchQuery: string) => {
  const q = query(
    collections.users,
    where("username", ">=", searchQuery),
    where("username", "<=", searchQuery + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);

  // Map results to ProfileProps
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id, // Doc ID is the same as user UID
      username: data.username || "",
      email: data.email || "",
      profilePicture: data.profilePicture || "",
      friends: data.friends || [],
    } as ProfileProps;
  });
};

// Add new friend
export const addFriend = async (userUid: string, friendUid: string) => {
  const currentUserRef = doc(collections.users, userUid);
  const friendUserRef = doc(collections.users, friendUid);

  await updateDoc(currentUserRef, {
    friends: arrayUnion(friendUid),
  });

  await updateDoc(friendUserRef, {
    friends: arrayUnion(userUid),
  });
};
