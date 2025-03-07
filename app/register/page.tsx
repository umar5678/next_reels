"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useNotification } from "../components/Notification";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("");

    const {showNotification} = useNotification()
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      setError("Provide password");
    }

    console.log({ email, password });

      try {
          const res = await fetch("/api/auth/register", {
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({email, password})
        })

          const data = await res.json()

          if (!res.ok) {
              throw new Error(data.error || "Registration Failed")
          }

      showNotification("Registration successful! Please log in.", "success");
      router.push("/login");
      } catch (error) {
         showNotification(
           error instanceof Error ? error.message : "Registration failed",
           "error"
         );
      }
  };

  return (
    <div className="container mx-auto">
      <div className="hero  min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left"></div>
          <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <h1 className="text-4xl font-bold">Signup now!</h1>
                <form onSubmit={handleSubmit} className=" ">
                  <label className="fieldset-label">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="input input-neutral mb-2 mt-1 "
                    placeholder="Email"
                  />
                  <label className="fieldset-label">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="input input-neutral mb-2 mt-1"
                    placeholder="Password"
                  />
                  <div>
                    <a className="link link-hover">Forgot password?</a>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button type="submit" className="btn btn-neutral">
                      Signup
                    </button>
                    <Link href="/login" className="btn btn-default">
                      Login instead
                    </Link>
                  </div>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
