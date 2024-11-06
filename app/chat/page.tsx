"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { knownBallModels } from "./ballmodels";
import translations from '../../translations/translations';
import { basePath } from "../../config"; // Importar basePath desde config.js

function extractBallModels(responseText: string): string[] {
  return knownBallModels.filter((model) => responseText.includes(model));
}

export default function Chat() {
  const router = useRouter();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat();
  const [searchResults, setSearchResults] = useState<any>(null);
  const [previousBallModels, setPreviousBallModels] = useState<string[]>([]);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [sendReport, setSendReport] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); 
  const [showOkButton, setShowOkButton] = useState(false); 
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); 
  const [reportSuccess, setReportSuccess] = useState(false); 

  const [locale, setLocale] = useState<'en' | 'es' | 'ca'>('en');
  const [localeLoaded, setLocaleLoaded] = useState(false);

  useEffect(() => {
    const userLocale = navigator.language || 'en';
    const detectedLocale = userLocale.startsWith('es') ? 'es' : userLocale.startsWith('ca') ? 'ca' : 'en';
    setLocale(detectedLocale as 'en' | 'es' | 'ca');
    setLocaleLoaded(true);
  }, []);

  const t = translations[locale];

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
      const storedUserName = sessionStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
    setLoading(false); 
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      scrollToBottom();
    }
  }, [messages, isAuthenticated]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length === 0 && localeLoaded) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t.greeting_message
        }
      ]);
    }
  }, [localeLoaded, locale, setMessages, messages.length, t.greeting_message]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      const ballModels = extractBallModels(lastMessage.content);
      if (ballModels.length > 0 && JSON.stringify(ballModels) !== JSON.stringify(previousBallModels)) {
        setPreviousBallModels(ballModels);
        const fetchPromises = [
          fetch(`${basePath}/api/search`, {  // Ruta de API con basePath
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords: ballModels[0] })
          }),
        ];

        if (ballModels.length > 1) {
          fetchPromises.push(
            fetch(`${basePath}/api/search`, {  // Segunda llamada API con basePath
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ keywords: ballModels[1] })
            })
          );
        }

        Promise.all(fetchPromises)
          .then(async ([response1, response2]) => {
            const data1 = response1.ok ? await response1.json() : null;
            const data2 = response2?.ok ? await response2.json() : null;

            const combinedResults = [];
            if (data1) combinedResults.push(...data1);
            if (data2) combinedResults.push(...data2);

            if (combinedResults.length > 0) {
              setSearchResults(combinedResults);
              setHasResults(true);
              setIsFadingIn(true);
              setTimeout(() => setIsFadingIn(false), 1500);
            }
          })
          .catch((err) => console.error("Error fetching results:", err));
      }
    }
  }, [messages, previousBallModels]);

  const handleExit = async () => {
    const userEmail = sessionStorage.getItem("userEmail");
    const userName = sessionStorage.getItem("userName");
  
    const conversation = messages.map(msg => ({ role: msg.role, content: msg.content }));
  
    if (sendReport && userEmail) {
      setModalMessage(t.report_generating);
      setShowModal(true);
      setShowOkButton(false);
      setReportSuccess(false);

      try {
        const reportResponse = await fetch(`${basePath}/api/sendReport`, {  // Ruta de API con basePath
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ email: userEmail, locale, conversation, userName }) 
        });
        const reportData = await reportResponse.json();
        
        if (!reportResponse.ok) {
          const errorMessage = reportData.errorType === 'invalidReport' ? 
            t.report_invalid_content_message : t.report_send_failure_message;
          setModalMessage(errorMessage);
        } else {
          setModalMessage(`${t.report_sent_message} ${t.farewell_message}`);
          setReportSuccess(true);
        }
      } catch {
        setModalMessage(t.report_error_message);
      }
  
      setShowOkButton(true);
    } else {
      setShowModal(true);
      setModalMessage(`${t.farewell_message}`);
      setShowOkButton(true);
    }
  
    if (userEmail && userName) {
      try {
        await fetch(`${basePath}/api/saveUser`, {  // Ruta de API con basePath
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName, email: userEmail })
        });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (reportSuccess) {
      sessionStorage.clear();
      router.push("/");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-screen py-24 mx-auto overflow-hidden bg-gray-100">
      <header className="w-full py-8 fixed top-0 z-10 border-b border-gray-200 shadow-md" style={{ backgroundColor: "#B3C186" }}>
        <div className="text-center relative">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-light text-gray-900 tracking-widest uppercase">
              GolfBallAssistant
            </h1>
            <div className="flex items-center ml-2">
              <span className="mr-1 text-sm text-gray-700">by</span>
              <img src={`${basePath}/images/bolasgolflogo.png`} alt="Logo Bolas.golf" className="logo-enhanced" /> {/* Ruta de imagen con basePath */}
            </div>
          </div>
          <p className="text-lg font-bold text-gray-700 mt-2">
            Golf balls look the same. They are not.
          </p>
        </div>
      </header>

      <div className="flex flex-row w-full h-full mt-24 mx-auto overflow-hidden">
        <div className="flex-grow flex flex-col w-2/3 h-full border-r border-gray-300 relative">
          <div 
            className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-50" 
            style={{ 
              backgroundImage: `url("${basePath}/images/golf-ball.jpg")`, // Ruta de imagen con basePath
              pointerEvents: 'none',
              filter: 'blur(8px)'
            }} 
          ></div>

          <div className="relative z-10 flex-grow overflow-auto px-4" ref={messagesContainerRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`whitespace-pre-wrap p-3 m-2 rounded-lg ${
                  m.role === "user" ? "bg-green-100 text-black" : "bg-blue-100 text-black"
                }`}
              >
                <span className={`tag ${m.role === "user" ? "player-tag" : "assistant-tag"}`}>
                  {m.role === "user" ? userName || "Player" : "GolfBallAssistant"}:
                </span>
                {` ${m.content}`}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end pr-4">
                <span className="animate-pulse text-2xl">...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


