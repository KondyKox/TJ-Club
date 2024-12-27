"use client";

import { getCurrentUser } from "@/lib/auth";
import {
  addFriend,
  fetchFriends,
  removeFriend,
  searchUsers,
} from "@/lib/utils/friends";
import { ProfileProps } from "@/types/ProfileProps";
import { ReactNode, useEffect, useState } from "react";
import LoadingOverlay from "../layout/Loading";
import Image from "next/image";
import Button from "../ui/Button";
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

const FriendsList = () => {
  const [friends, setFriends] = useState<ProfileProps[]>([]);
  const [searchResults, setSearchResults] = useState<ProfileProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
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

  // Reset search results when search query is empty
  useEffect(() => {
    if (!searchQuery) setSearchResults([]);
  }, [searchQuery]);

  // Search for people
  const handleSearch = async () => {
    if (!searchQuery || !currentUser) return;
    try {
      setSearching(true);

      const results = await searchUsers(searchQuery, currentUser.uid);
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

      const updatedFriends = await fetchFriends(currentUser.uid);
      setFriends(updatedFriends);

      setSearchResults([]);
      setSearchQuery("");

      console.log("Friend added!");
    } catch (error: any) {
      console.error("Error adding friend:", error);
    } finally {
      setAdding(false);
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendUid: string) => {
    if (!currentUser?.uid) return;

    try {
      setRemoving(true);

      await removeFriend(currentUser.uid, friendUid);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.uid !== friendUid)
      );
    } catch (error) {
      console.error("Błąd podczas usuwania znajomego:", error);
    } finally {
      setRemoving(false);
    }
  };

  if (loading) return <LoadingOverlay message="Wczytuję znajomych..." />;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="underline-custom w-full flex flex-col justify-center items-center gap-2 px-4 sticky top-0 z-10">
        <h3 className="header-sm">Znajomi</h3>
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
        <ListContent
          users={searchResults}
          onAction={handleAddFriend}
          actionIcon={<UserPlusIcon className="h-6 w-6" />}
          actionLoading={adding}
          actionType="add"
        />
      ) : // Friends list
      friends.length > 0 ? (
        <ListContent
          users={friends}
          onAction={handleRemoveFriend}
          actionIcon={<MinusCircleIcon className="h-6 w-6" />}
          actionLoading={removing}
          actionType="remove"
        />
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
  users,
  onAction,
  actionIcon,
  actionLoading,
  actionType,
}: {
  users: ProfileProps[];
  onAction: (userUid: string) => void;
  actionIcon: ReactNode;
  actionLoading: boolean;
  actionType: "add" | "remove";
}) => {
  return (
    <ul className="flex flex-col items-center gap-2 p-6 w-full max-h-[400px] overflow-y-auto">
      {users.map((user) => (
        <li
          key={user.uid}
          className="flex justify-between items-center gap-2 border-2 border-button rounded w-full p-2"
        >
          <div className="flex justify-center items-center gap-4">
            <Image
              src={user.profilePicture || "/ano_vodka.svg"}
              alt={user.username}
              width={64}
              height={64}
              loading="lazy"
              className="w-12 h-12"
            />
            <span className="text-akcent">{user.username}</span>
          </div>
          <Button
            onClick={() => onAction(user.uid)}
            loading={actionLoading}
            noHover={true}
            className={`hover:${
              actionType === "add" ? "text-green-500" : "text-red"
            }`}
          >
            {actionIcon}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default FriendsList;
