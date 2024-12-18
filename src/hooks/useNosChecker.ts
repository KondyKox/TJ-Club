"use client";

import { useEffect, useState } from "react";

// Function to check if hour & minutes are the same
export const useNosChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      console.log(`Checking time: ${hours}:${minutes}`);

      if (hours === minutes) {
        setModalText(`${hours}:${minutes.toString().padStart(2, "0")}`);
        setIsOpen(true);
      }
    };

    const interval = setInterval(checkTime, 60000);
    checkTime(); // Sprawdzenie natychmiast po załadowaniu

    return () => clearInterval(interval); // Czyszczenie po odmontowaniu
  }, []);

  return { isOpen, modalText, closeModal: () => setIsOpen(false) };
};
