"use client";

import { getCurrentUser } from "@/lib/auth";
import { addFriend, fetchFriends, searchUsers } from "@/lib/utils/friends";
import { ProfileProps } from "@/types/ProfileProps";
import { ReactNode, useEffect, useState } from "react";
import LoadingOverlay from "../layout/Loading";
import Image from "next/image";
import Button from "../ui/Button";
import { MagnifyingGlassIcon, UserPlusIcon } from "@heroicons/react/24/solid";

const FriendsList = () => {
  const [friends, setFriends] = useState<ProfileProps[]>([]);
  const [searchResults, setSearchResults] = useState<ProfileProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const currentUser = getCurrentUser();

  // Load friends list
  useEffect(() => {
    const loadFriends = async () => {
      try {
        if (!currentUser) return;

        const friendsData = await fetchFriends(currentUser.uid);
        setFriends(friendsData);
      } catch (error: any) {
        console.error("Error loading friends:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  // Search for people
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      setSearching(true);

      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      console.error("Error searching users:", error);
    } finally {
      setSearching(false);
    }
  };

  // Add friend
  const handleAddFriend = async (friendUid: string) => {
    try {
      setAdding(true);
      if (!currentUser) return;

      await addFriend(currentUser.uid, friendUid);
      console.log("Friend added!");
    } catch (error: any) {
      console.error("Error adding friend:", error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingOverlay message="Wczytuję znajomych..." />;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="underline-custom w-full flex flex-col justify-center items-center gap-2 px-4 sticky top-0 z-10">
        <h3 className="image-header">Znajomi</h3>
        <div className="flex justify-center items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Wyszukaj ludzi (ID lub nazwa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-96"
          />
          <Button onClick={handleSearch} loading={searching}>
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {/* Search results list */}
      {searchResults.length > 0 ? (
        <ul className="flex flex-col justify-center items-center gap-2 py-4">
          {searchResults.map((user, index) => (
            <ListContent user={user} key={index}>
              <Button
                onClick={() => handleAddFriend(user.uid)}
                loading={adding}
              >
                <UserPlusIcon className="h-6 w-6" />
              </Button>
            </ListContent>
          ))}
        </ul>
      ) : // Friends list
      friends.length > 0 ? (
        <ul className="flex flex-col justify-center items-center gap-2 py-4">
          {friends.map((friend, index) => (
            <ListContent user={friend} key={index} />
          ))}
        </ul>
      ) : (
        <p className="pt-8 font-bold text-xl text-red text-center">
          Nie masz znajomych 😢
        </p>
      )}
    </div>
  );
};

// Item list component
const ListContent = ({
  user,
  children,
}: {
  user: ProfileProps;
  children?: ReactNode;
}) => {
  return (
    <li className="flex justify-between items-center gap-2 underline-custom py-2">
      <Image
        src={user.profilePicture || "/ano_vodka.svg"}
        alt={user.username}
        width={64}
        height={64}
        loading="lazy"
      />
      <span className="text-akcent">{user.username}</span>
      {children}
    </li>
  );
};

export default FriendsList;
