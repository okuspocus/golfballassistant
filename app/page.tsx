"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // To handle routing

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsPromos, setAcceptsPromos] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // To display a success message
  const router = useRouter(); // For redirection

  // Email validation function using regular expression
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please enter a valid name and email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!acceptsPromos) {
      setError("You must agree to receive occasional emails with discounts/offers. We don't spam.");
      return;
    }

    try {
      // Call the backend API to send the verification email
      const response = await fetch('/api/sendVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Show success message like 'Email sent successfully'
        setError(""); // Clear previous errors
      } else {
        setError(data.message || "An error occurred while sending the verification email.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while sending the verification email.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      {/* Background image with blur */}
      <div className="absolute inset-0 bg-cover bg-center filter blur-lg brightness-75" style={{ backgroundImage: 'url("/golf-course.jpg")' }}></div>

      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Main content */}
      <header className="bg-white w-full py-8 fixed top-0 z-10 border-b border-gray-200 shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 tracking-widest uppercase">
            golfballassistant
          </h1>
          <p className="text-lg font-bold text-gray-700 mt-2">
            Golf balls look the same. They are not.
          </p>
        </div>
      </header>

      {/* Centered Persuasive Text */}
      <div className="flex flex-col items-center justify-center mt-32 mb-8 text-center z-20">
        <p className="text-4xl font-semibold text-white mb-4">
          There is an ideal ball for every golfer.
        </p>
        <p className="text-2xl font-light text-white">
          Do you know which one is yours?
        </p>
      </div>

      {/* Registration Form with modern design */}
      <div className="relative z-20 bg-white p-8 mt-6 rounded-3xl shadow-2xl max-w-md w-full text-center transition-all duration-500 transform hover:scale-105">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Enter your details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2 w-6 h-6" // Make the checkbox larger
              checked={acceptsPromos}
              onChange={() => setAcceptsPromos(!acceptsPromos)}
            />
            <label className="text-sm text-gray-600">
              I agree to receive emails with discounts or offers from time to time.
            </label>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            className="w-full py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-xl hover:from-green-500 hover:to-blue-600 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Chat with our AI-Powered Assistant
          </button>
        </form>
      </div>
    </div>
  );
}



