//app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import translations from '../translations/translations';

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsPromos, setAcceptsPromos] = useState(false);
  const [acceptsPrivacyPolicy, setAcceptsPrivacyPolicy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const [locale, setLocale] = useState<'en' | 'es' | 'ca'>('en');
  const router = useRouter();

  useEffect(() => {
    const userLocale = navigator.language || 'en';
    const detectedLocale = userLocale.startsWith('es') ? 'es' : userLocale.startsWith('ca') ? 'ca' : 'en';
    setLocale(detectedLocale as 'en' | 'es' | 'ca');
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
    if (!acceptsPromos) {
      setError(t.error_promos_agree);
      return;
    }
    if (!acceptsPrivacyPolicy) {
      setError(t.error_privacy_policy_agree);
      return;
    }

    setError("");
    setProgress(10);
    try {
      const response = await fetch('/api/sendVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          locale,  
          email_subject: t.email_subject,  // Pass subject from translations
          email_greeting: t.email_greeting,  // Pass greeting from translations
          email_body: t.email_body,  // Pass body content from translations
          success_message: t.email_success,
          name_email_required: t.name_email_required
        }),
      });

      const data = await response.json();

      setProgress(100);
      if (response.ok) {
        setMessage(t.email_success);  // Using translated success message
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
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
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
  <div className="text-center relative">
    <div className="flex items-center justify-center gap-2">
      <h1 className="text-4xl font-light text-gray-900 tracking-widest uppercase">
        GolfBallAssistant
      </h1>
      <div className="flex items-center ml-2">
        <span className="mr-1 text-sm text-gray-700">by</span>
        <img src="bolasgolflogo.png" alt="Logo Bolas.golf" className="logo-enhanced" />
      </div>
    </div>
    <p className="text-lg font-bold text-gray-700 mt-2">
      Golf balls look the same. They are not.
    </p>
  </div>
</header>

      {/* Centered Persuasive Text */}
      <div className="flex flex-col items-center justify-center mt-48 mb-8 text-center z-20">
        <p className="text-4xl font-semibold text-white mb-4 max-w-md">
          {t.persuasive_text}
        </p>
        <p className="text-2xl font-light text-white max-w-md">
          {t.question_text}
        </p>
      </div>

      {/* Registration Form */}
      <div className="relative z-20 p-8 mt-6 bg-[#B3C186] rounded-3xl shadow-2xl max-w-md w-full text-center transition-all duration-500 transform hover:scale-105">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t.enter_details}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {t.agree_privacy}{' '}
              <a
                href={
                  locale === 'es'
                    ? 'https://bolas.golf/politica-de-privacidad/'
                    : locale === 'ca'
                    ? 'https://bolas.golf/ca/politica-de-privacidad/'
                    : 'https://bolas.golf/en/politica-de-privacidad/' // inglés por defecto
                }
                className="underline text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.privacy_policy}
              </a>.
            </label>
          </div>

          {error && <p className="text-[#b22222] text-md font-semibold mb-4">{error}</p>}
          {message && <p className="text-[#006400] text-lg font-semibold mb-4">{message}</p>}
          
          <button
            type="submit"
            className="w-full py-3 text-black rounded-full shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-green-300 relative overflow-hidden"
            style={{ backgroundColor: "#5BA862", position: 'relative' }}
            disabled={progress > 0 && progress < 100}
          >
            <div
              className="absolute top-0 left-0 h-full transition-all duration-500 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? "#5BA862" : "#ffffff",
              }}
            ></div>
            <span className="relative z-10">{t.submit_text}</span>
          </button>
        </form>
      </div>
    </div>
  );
}












