"use client";

import Button from "@/components/Button";
import { loginUser, registerUser } from "@/lib/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(username, email, password);
      console.log("User registered.");

      // Login after registration
      await loginUser(email, password);
      console.log("User logged in.");

      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show / Hide password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <h2 className="sub-header">Rejestracja</h2>
        <div className="flex flex-col justify-center items-center gap-2 py-4 relative">
          <input
            type="username"
            placeholder="Nick"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 bottom-6 text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-6 w-6" />
            ) : (
              <EyeIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        <Button className="border-2 border-button">
          {isLoading ? "Rejestracja..." : "Zarejestruj"}
        </Button>
        <p className="mt-4 text-center">
          Masz już konto?{" "}
          <Link href={"/login"} className="link">
            Zaloguj się tutaj!
          </Link>
        </p>
        {error && <p className="text-red font-bold text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
