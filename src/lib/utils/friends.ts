import {
  arrayRemove,
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

// Search users by username or ID
export const searchUsers = async (searchQuery: string, currentUid: string) => {
  try {
    // Pobierz dokument obecnego użytkownika, żeby sprawdzić jego znajomych
    const currentUserDoc = await getDoc(doc(collections.users, currentUid));
    const currentUserData = currentUserDoc.data();
    const currentFriends = currentUserData?.friends || [];

    // Query by username
    const usernameQuery = query(
      collections.users,
      where("username", ">=", searchQuery),
      where("username", "<=", searchQuery + "\uf8ff")
    );

    // Query by ID
    const idQuery = query(
      collections.users,
      where("uid", ">=", searchQuery),
      where("uid", "<=", searchQuery + "\uf8ff")
    );

    // Pobierz wyniki dla obu zapytań
    const [usernameSnapshot, idSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(idQuery),
    ]);

    // Map results to ProfileProps
    const results = [...usernameSnapshot.docs, ...idSnapshot.docs].map(
      (doc) => {
        const data = doc.data();
        return {
          uid: doc.id, // Doc ID is the same as user UID
          username: data.username || "",
          email: data.email || "",
          profilePicture: data.profilePicture || "",
          friends: data.friends || [],
        } as ProfileProps;
      }
    );

    // Filter results
    const uniqueResults = results
      .filter((user) => user.uid !== currentUid) // Delete current user
      .filter((user) => !currentFriends.includes(user.uid)) // Delete friends
      .filter(
        (value, index, self) =>
          index === self.findIndex((u) => u.uid === value.uid) // Delete duplicats
      );

    return uniqueResults;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
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

// Remove friend
export const removeFriend = async (userUid: string, friendUid: string) => {
  try {
    const currentUserRef = doc(collections.users, userUid);
    const friendUserRef = doc(collections.users, friendUid);

    // Remove friend from current user
    await updateDoc(currentUserRef, {
      friends: arrayRemove(friendUid),
    });

    // Remove current user from friend
    await updateDoc(friendUserRef, {
      friends: arrayRemove(userUid),
    });

    console.log(`Friend ${friendUid} removed.`);
  } catch (error: any) {
    console.error("Error removing friend:", error);
  }
};
