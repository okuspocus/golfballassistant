"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { knownBallModels } from "./ballmodels";
import translations from '../../translations/translations';

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
  const [modalMessage, setModalMessage] = useState(""); // Modal message state
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); 

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
          fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords: ballModels[0] })
          }),
        ];

        if (ballModels.length > 1) {
          fetchPromises.push(
            fetch('http://127.0.0.1:5000/search', {
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
  
    // Capture the conversation messages
    const conversation = messages.map(msg => ({ role: msg.role, content: msg.content }));
  
    if (sendReport && userEmail) {
      await fetch('/api/sendReport', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: userEmail, locale, conversation, userName }) 
      })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          // Check for specific error types to customize messages
          let errorMessage = '';
          switch (data.errorType) {
            case 'invalidReport':
              errorMessage = t.report_invalid_content_message;
              break;
            case 'sendReportFailure':
            default:
              errorMessage = t.report_send_failure_message;
              break;
          }
          setShowModal(true);
          setModalMessage(errorMessage);
        } else {
          setShowModal(true);
          setModalMessage(`${t.report_sent_message} ${t.farewell_message}`);
        }
      })
      .catch(() => {
        setShowModal(true);
        setModalMessage(t.report_error_message);
      });
    } else {
      setShowModal(true);
      setModalMessage(`${t.farewell_message}`);
    }
  };
  
    

  const handleModalClose = () => {
    setShowModal(false);
    sessionStorage.clear();
    router.push("/");
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
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 tracking-widest uppercase">
            GolfBallAssistant
          </h1>
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
              backgroundImage: 'url("/golf-ball.jpg")',
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

          <div className="bg-white shadow-lg p-4 border-t border-gray-300">
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                className="w-full p-4 mb-2 border-4 border-blue-400 rounded-lg shadow-lg bg-white focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 text-black text-lg transition-all duration-300 ease-in-out transform hover:scale-102"
                value={input}
                placeholder={t.start_placeholder} 
                onChange={handleInputChange}
              />
            </form>
          </div>
        </div>

        <div className="w-1/3 h-full bg-white shadow-lg p-4 overflow-y-auto max-h-full flex flex-col justify-between">
          <div className={isFadingIn ? 'fade-in' : ''}>
            {hasResults && searchResults ? (
              searchResults.map((item: any, index: number) => (
                <div key={index} className="border-b border-gray-300 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-semibold text-center">{item.model_name}</h3>
                  {item.image_url && (
                    <a href={item.referral_link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.image_url} 
                        alt={item.model_name}
                        className="adjusted-image" 
                      />
                    </a>
                  )}
                  {item.price && (
                    <p className="text-center text-gray-600">Precio: {item.price || "No disponible"}</p>
                  )}
                  <a href={item.referral_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-center">
                    {t.click_for_details}
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                {t.no_results_message}
              </div>
            )}
          </div>

          {/* Exit and Send Report Section */}
          <div className="flex flex-col items-center justify-center mt-4 p-2 border-t border-gray-200 bg-[#f5f5f5] rounded-lg shadow-sm">
            <label className="flex items-center space-x-2 mb-2 text-gray-700">
              <input
                type="checkbox"
                checked={sendReport}
                onChange={() => setSendReport(!sendReport)}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <span>{t.send_report_option}</span>
            </label>
            <button
              onClick={handleExit}
              className="bg-[#5BA862] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[#4a8a5a] transition duration-200"
            >
              {t.exit_button_text}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="modal-overlay">
             <div className="modal-content">
              <p className="text-lg font-semibold mb-4">{t.report_sent_message}{t.farewell_message}</p>
          <button
            onClick={handleModalClose}
            className="bg-[#5BA862] text-white px-4 py-2 rounded-lg hover:bg-[#4a8a5a] transition duration-200"
      >
        OK
      </button>
    </div>
  </div>
)}


        <style jsx>{`
          .fade-in {
            opacity: 0;
            animation: fadeIn 4s forwards;
          }
          .tag {
            padding: 4px 8px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.9rem;
            margin-right: 10px;
          }
          .player-tag {
            background-color: #B3C186; 
            color: white;
          }
          .assistant-tag {
            background-color: #60a5fa; 
            color: white;
          }
          .adjusted-image {
            max-width: 300px;  
            max-height: 400px; 
            object-fit: contain; 
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}



