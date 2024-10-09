"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsPromos, setAcceptsPromos] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please enter a valid name and email.");
      return;
    }

    if (!acceptsPromos) {
      setError("You must agree to receive occasional emails with discounts or offers.");
      return;
    }

    // Guardar los datos en sessionStorage
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userEmail", email);

    // Redirigir al chat
    router.push("/chat");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Enter your details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Introduce tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Introduce tu email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={acceptsPromos}
              onChange={() => setAcceptsPromos(!acceptsPromos)}
            />
            <label className="text-sm text-gray-700">
            I agree to receive emails with discounts or offers from time to time
            </label>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-green-500 w-full p-2 text-white rounded shadow-xl"
          >
            Enter the Chat with our AI
          </button>
        </form>
      </div>
    </div>
  );
}

