"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head'; 
import translations from '../translations/translations';  // Assuming your translations file is named 'translations.ts'

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsPromos, setAcceptsPromos] = useState(false);
  const [acceptsPrivacyPolicy, setAcceptsPrivacyPolicy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Restrict locale type to 'en' | 'es' | 'ca'
  const [locale, setLocale] = useState<'en' | 'es' | 'ca'>('en');
  const router = useRouter();

  useEffect(() => {
    const userLocale = navigator.language || 'en'; // Default to 'en' if language isn't available
    const detectedLocale = userLocale.startsWith('es') ? 'es' : userLocale.startsWith('ca') ? 'ca' : 'en';
    setLocale(detectedLocale as 'en' | 'es' | 'ca'); // Cast as one of the allowed values
  }, []);

  const t = translations[locale]; // TypeScript knows locale is valid

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!name || !email) {
      setError(t.error_valid_name_email);
      return;
    }
    if (name.length > 50) {
      setError(t.error_name_too_long);
      return;
    }
    if (!validateEmail(email)) {
      setError(t.error_valid_email);
      return;
    }
    if (!acceptsPromos) {
      setError(t.error_promos_agree);
      return;
    }
    if (!acceptsPrivacyPolicy) {
      setError(t.error_privacy_policy_agree);
      return;
    }

    try {
      const response = await fetch('/api/sendVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError(data.message || t.error_sending_email);
      }
    } catch (err) {
      console.error(err);
      setError(t.error_sending_email);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>{t.meta_title}</title>
        <meta name="description" content={t.meta_description} />
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
          {t.persuasive_text}
        </p>
        <p className="text-2xl font-light text-white">
          {t.question_text}
        </p>
      </div>

      {/* Registration Form */}
      <div className="relative z-20 p-8 mt-6 rounded-3xl shadow-2xl max-w-md w-full text-center transition-all duration-500 transform hover:scale-105"
           style={{ backgroundColor: "#B3C186" }}> {/* Updated the background color */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t.enter_details}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={50}
            className="w-full p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-[#D4E1B5] transition-all text-black"
            placeholder={t.enter_name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-[#D4E1B5] transition-all text-black"
            placeholder={t.enter_email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4"
              checked={acceptsPromos}
              onChange={() => setAcceptsPromos(!acceptsPromos)}
            />
            <label className="text-sm text-gray-600">
              {t.receive_promos}
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4"
              checked={acceptsPrivacyPolicy}
              onChange={() => setAcceptsPrivacyPolicy(!acceptsPrivacyPolicy)}
            />
            <label className="text-sm text-gray-600">
              {t.agree_privacy} <a href="/privacy-policy" className="underline text-blue-600">{t.privacy_policy}</a>.
            </label>
          </div>
          {error && <p className="text-[#b22222] text-md font-semibold mb-4">{error}</p>}
          {message && <p className="text-[#006400] text-lg font-semibold mb-4">{message}</p>}
          <button
            type="submit"
            className="w-full py-3 text-white rounded-full shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-green-300"
            style={{ backgroundColor: "#006400" }}
          >
            {t.submit_text}
          </button>
        </form>
      </div>
    </div>
  );
}





