"use client";

import Button from "@/components/Button";
import { loginUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(email, password);
      console.log("User logged in.");

      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <h2 className="sub-header">Logowanie</h2>
        <div className="flex flex-col justify-center items-center gap-2 py-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        <Button className="border-2 border-button">
          {isLoading ? "Logowanie..." : "Zaloguj"}
        </Button>
        <p className="mt-4">
          Nie masz konta?{" "}
          <Link href={"/register"} className="link">
            Zarejestruj się tutaj!
          </Link>
        </p>
        {error && <p className="text-red font-bold">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
