"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // To handle routing
import Head from 'next/head'; // Importa el componente Head para manejar el <head>

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsPromos, setAcceptsPromos] = useState(false);
  const [acceptsPrivacyPolicy, setAcceptsPrivacyPolicy] = useState(false);
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

    // Validate that both fields are filled
    if (!name || !email) {
      setError("Please enter a valid name and email.");
      return;
    }

    // Length limitation for name to prevent abuse
    if (name.length > 50) {
      setError("Name is too long. Please keep it under 50 characters.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check if user accepts promotional emails
    if (!acceptsPromos) {
      setError("You must agree to receive occasional emails with discounts/offers. We don't spam.");
      return;
    }

    // Check if user accepts privacy policy
    if (!acceptsPrivacyPolicy) {
      setError("You must accept the privacy policy to proceed.");
      return;
    }

    try {
      // Note: It's important to sanitize and validate these fields again on the server side
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
      <Head>
        <title>AI Golf Ball Assistant - Find Your Perfect Golf Ball</title>
        <meta name="description" content="Use our AI-powered golf ball assistant to find the perfect golf ball for you. Whether you're a beginner or a pro, there's an ideal ball for every golfer." />
        <meta name="keywords" content="ai golf balls, golf balls ai, golf ball recommender, golf ball assistant" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GolfBallAssistant" />
        <link rel="canonical" href="https://bolas.golf/app" />
      </Head>

      {/* Background image with blur */}
      <div className="absolute inset-0 bg-cover bg-center filter blur-lg brightness-75" style={{ backgroundImage: 'url("/golf-course.jpg")' }}></div>

      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Main content */}
      <header className="w-full py-8 fixed top-0 z-10 border-b border-gray-200 shadow-md" style={{ backgroundColor: "#B3C186" }}>
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 tracking-widest uppercase">
            GolfBallAssistant
          </h1>
          <p className="text-lg font-bold text-gray-700 mt-2">
            Golf balls look the same. They are not.
          </p>
        </div>
      </header>

      {/* Centered Persuasive Text */}
      <div className="flex flex-col items-center justify-center mt-32 mb-8 text-center z-20">
        <p className="text-4xl font-semibold text-white mb-4">
          There is an ideal golf ball for every golfer.
        </p>
        <p className="text-2xl font-light text-white">
          Do you know which one is yours? 
        </p>
      </div>

      {/* Registration Form with modern design */}
      <div className="relative z-20 p-8 mt-6 rounded-3xl shadow-2xl max-w-md w-full text-center transition-all duration-500 transform hover:scale-105" style={{ backgroundColor: "#B3C186" }}>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Enter your details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={50} // Ensures the maxlength is a number
            className="w-full p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-[#D4E1B5] transition-all text-black"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-[#D4E1B5] transition-all text-black"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4" // Consistent size for both checkboxes
              checked={acceptsPromos}
              onChange={() => setAcceptsPromos(!acceptsPromos)}
            />
            <label className="text-sm text-gray-600">
              I agree to receive mails sometimes (No spam)
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4" // Consistent size for both checkboxes
              checked={acceptsPrivacyPolicy}
              onChange={() => setAcceptsPrivacyPolicy(!acceptsPrivacyPolicy)}
            />
            <label className="text-sm text-gray-600">
              I agree to the <a href="/privacy-policy" className="underline text-blue-600">Privacy Policy</a>.
            </label>
          </div>
          {error && <p className="text-[#b22222] text-md font-semibold mb-4">{error}</p>} {/* Rojo oscuro */}
          {message && <p className="text-[#006400] text-lg font-semibold mb-4">{message}</p>} {/* Verde oscuro */}
          <button
            type="submit"
            className="w-full py-3 text-white rounded-full shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-green-300"
            style={{ backgroundColor: "#006400" }} // Verde oscuro para el botón
          >
            Chat with our AI-Powered Assistant
          </button>
        </form>
      </div>
    </div>
  );
}






