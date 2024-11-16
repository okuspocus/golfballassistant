"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import translations from "../translations/translations";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsTerms, setAcceptsTerms] = useState(false); // Checkbox state
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const [locale, setLocale] = useState<"en" | "es" | "ca">("en");
  const router = useRouter();

  useEffect(() => {
    const userLocale = navigator.language || "en";
    const detectedLocale = userLocale.startsWith("es")
      ? "es"
      : userLocale.startsWith("ca")
      ? "ca"
      : "en";
    setLocale(detectedLocale as "en" | "es" | "ca");
  }, []);

  const t = translations[locale];

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    if (!acceptsTerms) {
      setError(t.error_promos_agree);
      return;
    }

    setError("");
    setProgress(10);
    try {
      const response = await fetch("/api/sendVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          locale,
          email_subject: t.email_subject,
          email_greeting: t.email_greeting,
          email_body: t.email_body,
          success_message: t.email_success,
          name_email_required: t.name_email_required,
        }),
      });

      const data = await response.json();

      setProgress(100);
      if (response.ok) {
        setMessage(t.email_success);
        setError("");
      } else {
        setError(data.message || t.error_sending_email);
        setProgress(0);
      }
    } catch (err) {
      console.error(err);
      setError(t.error_sending_email);
      setProgress(0);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url("/golf-course.jpg")' }}>
      <Head>
        <title>{t.meta_title}</title>
        <meta name="description" content={t.meta_description} />
        <meta name="keywords" content="ai golf balls, golf balls ai, golf ball recommender, golf ball assistant" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GolfBallAssistant" />
        <link rel="canonical" href="https://bolas.golf/app" />
      </Head>

      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Header */}
      <header className="w-full py-6 text-center bg-[#B3C186] fixed top-0 z-10 shadow-md">
        <h1 className="text-xl lg:text-4xl font-light text-gray-900 uppercase tracking-wide">
          GolfBallAssistant
        </h1>
      </header>

      {/* Persuasive Text Container */}
      <div className="flex flex-col items-center justify-center mt-28 z-20 text-center">
        <p className="text-white text-2xl lg:text-3xl font-bold mb-4">{t.persuasive_text}</p>
        <p className="text-white text-lg lg:text-xl">{t.question_text}</p>
      </div>

      {/* Registration Form */}
      <div className="relative z-20 mt-10 p-6 lg:p-8 bg-[#B3C186] rounded-3xl shadow-2xl max-w-lg w-full text-center transition-all duration-500 transform hover:scale-105">
        <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-800">{t.enter_details}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={50}
            className="w-full p-3 lg:p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-[#D4E1B5] transition-all text-black text-base"
            placeholder={t.enter_name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full p-3 lg:p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-[#D4E1B5] transition-all text-black text-base"
            placeholder={t.enter_email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Checkbox */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="acceptsTerms"
              className="mt-1"
              checked={acceptsTerms}
              onChange={() => setAcceptsTerms(!acceptsTerms)}
            />
            <label htmlFor="acceptsTerms" className="text-sm text-gray-700">
              {t.receive_promos}{" "}
              <a
                href="#"
                className="text-blue-600 underline"
              >
                {t.privacy_policy}
              </a>
            </label>
          </div>
          {error && <p className="text-red-600 text-sm lg:text-base font-semibold">{error}</p>}
          {message && <p className="text-green-950 text-sm lg:text-base font-semibold">{message}</p>}

          {/* Submit Button with Loading Effect */}
          <button
            type="submit"
            className="w-full py-2 lg:py-3 bg-green-600 text-white rounded-full shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
            disabled={progress > 0 && progress < 100}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? "#5BA862" : "#ffffff",
              }}
            ></div>
            <span className="relative z-10">{progress === 100 ? t.success_text : t.submit_text}</span>
          </button>
        </form>
      </div>
    </div>
  );
}


