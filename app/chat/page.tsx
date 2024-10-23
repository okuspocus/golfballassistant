"use client"; // Add this at the top

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { knownBallModels } from "./ballmodels";  // Importar desde ballmodels.ts

// Función para extraer los modelos de bolas del texto del asistente
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
  const [userName, setUserName] = useState<string | null>(null); // State to hold the user's name

  // Get the user's name from sessionStorage
  useEffect(() => {
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Auto-scroll: función para desplazarse al final del contenedor de mensajes
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll automático cada vez que cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with a greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Let's find the best golf ball for you and feel free to use linked related results on the right side!`
        }
      ]);
    }
  }, []); 

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.role === "assistant") {
      const ballModels = extractBallModels(lastMessage.content);

      // Solo se activa una nueva búsqueda si los modelos de bolas son nuevos o diferentes
      if (ballModels.length >= 2 && JSON.stringify(ballModels) !== JSON.stringify(previousBallModels)) {
        setPreviousBallModels(ballModels);
        const [firstModel, secondModel] = ballModels.slice(0, 2);

        // Hacer la búsqueda de los nuevos modelos de bolas
        Promise.all([
          fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords: firstModel })
          }),
          fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords: secondModel })
          })
        ])
          .then(async ([response1, response2]) => {
            const data1 = response1.ok ? await response1.json() : null;
            const data2 = response2.ok ? await response2.json() : null;

            // Si ambas respuestas son válidas, combinarlas y mostrarlas
            if (data1 && data2) {
              const combinedResults = [...data1, ...data2];
              console.log('Combined Results:', combinedResults);
              setSearchResults(combinedResults);
              setHasResults(true); // Marcar que hay resultados válidos

              // Aplicar un efecto fade-in una vez que los datos estén disponibles
              setIsFadingIn(true);
              setTimeout(() => setIsFadingIn(false), 3000); // Quitar el efecto fade-in después de 3 segundos
            }
          })
          .catch(err => {
            console.error('Error fetching results:', err);
            setHasResults(false);  // Marcar que no hay resultados válidos
          });
      }
    }
  }, [messages, previousBallModels, hasResults]);

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
        {/* Conversación con la imagen de fondo */}
        <div className="flex-grow flex flex-col w-2/3 h-full border-r border-gray-300 relative">
          {/* Imagen de fondo */}
          <div 
            className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-50" 
            style={{ 
              backgroundImage: 'url("/golf-ball.jpg")',
              pointerEvents: 'none',
              filter: 'blur(8px)'  // Aplica desenfoque
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

          {/* Caja de texto destacada */}
          <div className="bg-white shadow-lg p-4 border-t border-gray-300">
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                className="w-full p-4 mb-2 border-4 border-blue-400 rounded-lg shadow-lg bg-white focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 text-black text-lg transition-all duration-300 ease-in-out transform hover:scale-102"
                value={input}
                placeholder="START HERE say hello to our AI-Powered golf assistant..."
                onChange={handleInputChange}
              />
            </form>
          </div>
        </div>

        {/* Resultados de búsqueda en el lado derecho */}
        <div className="w-1/3 h-full bg-white shadow-lg p-4 overflow-y-auto max-h-full">
          {hasResults && searchResults ? (  // Solo mostrar resultados si hay datos válidos
            <div className={isFadingIn ? 'fade-in' : ''}> {/* Aplicar fade-in */}
              {searchResults.map((item: any, index: number) => (
                <div key={index} className="border-b border-gray-300 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-semibold text-center">{item.model_name}</h3>
                  {item.image_url && (
                    <a href={item.referral_link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.image_url}  // Directly use image_url without any modification
                        alt={item.model_name}
                        className="adjusted-image"  // Apply a CSS class to handle consistent styling
                      />
                    </a>
                  )}
                  {item.price && (
                    <p className="text-center">Precio: {item.price || "No disponible"}</p>
                  )}
                  <a href={item.referral_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-center">
                    Ver más detalles
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No results yet. Please wait for the assistant to recommend golf ball models.
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
    background-color: #B3C186; /* Updated Green color for player */
    color: white;
  }

  .assistant-tag {
    background-color: #60a5fa; /* Blue color for assistant */
    color: white;
  }

  .adjusted-image {
    max-width: 250px;  /* Adjust the max width of the image */
    max-height: 250px; /* Adjust the max height of the image */
    object-fit: contain; /* Ensures the image maintains its aspect ratio */
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

