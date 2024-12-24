"use client";

import Button from "@/components/Button";
import Logout from "@/components/Logout";
import useUser from "@/hooks/useUser";
import Image from "next/image";

// Fields with user data
const userFields = [
  { label: "Wyświetlana nazwa", key: "displayName" },
  { label: "Email", key: "email" },
];

const UserPage = () => {
  const { userData, loading } = useUser();

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
            <Button className="border-2 border-button">Edytuj Profil</Button>
            <Button className="border-2 border-button">Zmiana Hasła</Button>
          </div>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
