"use client"; // Add this at the top

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { knownBallModels } from "./ballmodels";  // Import from ballmodels.ts
import translations from '../../translations/translations'; // Import translations

// Function to extract ball models from assistant's response
function extractBallModels(responseText: string): string[] {
  return knownBallModels.filter((model) => responseText.includes(model));
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat();
  const [searchResults, setSearchResults] = useState<any>(null);
  const [previousBallModels, setPreviousBallModels] = useState<string[]>([]);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Locale management
  const [locale, setLocale] = useState<'en' | 'es' | 'ca'>('en');
  const [localeLoaded, setLocaleLoaded] = useState(false); // Track if locale has been set

  useEffect(() => {
    const userLocale = navigator.language || 'en'; // Detect browser language
    const detectedLocale = userLocale.startsWith('es') ? 'es' : userLocale.startsWith('ca') ? 'ca' : 'en';
    setLocale(detectedLocale as 'en' | 'es' | 'ca');
    setLocaleLoaded(true);  // Mark locale as loaded
  }, []);

  const t = translations[locale]; // Get the correct translation based on locale

  // Get username from sessionStorage
  useEffect(() => {
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Auto-scroll function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll automatically whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with a greeting message after locale is set
  useEffect(() => {
    if (messages.length === 0 && localeLoaded) {  // Ensure locale is loaded before setting message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t.greeting_message // Use translated greeting message
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
            }
          })
          .catch((err) => console.error("Error fetching results:", err));
      }
    }
  }, [messages, previousBallModels]);

  return (
    <div className="flex flex-col w-full h-screen py-24 mx-auto overflow-hidden bg-gray-100">
      <header className="w-full py-8 fixed top-0 z-10 border-b border-gray-200" style={{ backgroundColor: "#B3C186" }}>
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 tracking-widest uppercase">
            golfballassistant
          </h1>
          <p className="text-lg font-bold text-gray-700 mt-2">
            Golf balls look the same. They are not.
          </p>
        </div>
      </header>

      <div className="flex flex-row w-full h-full mt-24 mx-auto overflow-hidden">
        {/* Conversation with background image */}
        <div className="flex-grow flex flex-col w-2/3 h-full border-r border-gray-300 relative">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-50" 
            style={{ 
              backgroundImage: 'url("/golf-ball.jpg")',
              pointerEvents: 'none',
              filter: 'blur(8px)'  // Apply blur effect
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

          {/* Input box */}
          <div className="bg-white shadow-lg p-4 border-t border-gray-300">
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                className="w-full p-4 mb-2 border-4 border-blue-400 rounded-lg shadow-lg bg-white focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 text-black text-lg transition-all duration-300 ease-in-out transform hover:scale-102"
                value={input}
                placeholder={t.start_placeholder}  // Translated placeholder
                onChange={handleInputChange}
              />
            </form>
          </div>
        </div>

        {/* Search results on the right side */}
        <div className="w-1/3 h-full bg-white shadow-lg p-4 overflow-y-auto max-h-full">
          {hasResults && searchResults ? (
            <div className={isFadingIn ? 'fade-in' : ''}> {/* Apply fade-in */}
              {searchResults.map((item: any, index: number) => (
                <div key={index} className="border-b border-gray-300 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-semibold text-center">{item.model_name}</h3>
                  {item.image_url && (
                    <a href={item.referral_link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.image_url}  // Directly use image_url without any modification
                        alt={item.model_name}
                        className="adjusted-image"  // Apply consistent styling
                      />
                    </a>
                  )}
                  {item.price && (
                    <p className="text-center">Precio: {item.price || "No disponible"}</p>
                  )}
                  <a href={item.referral_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-center">
                    {t.click_for_details} {/* Translated "View more details" */}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {t.no_results_message} {/* No results traducido */}
            </div>
          )}
        </div>

        {/* Styles for tags and fade-in animation */}
        <style jsx>{`
  .fade-in {
            opacity: 0;
            animation: fadeIn 3s forwards;
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
            max-width: 250px;  
            max-height: 250px; 
            object-fit: contain; 
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`     }</style>
      </div>
    </div>
  );
}

