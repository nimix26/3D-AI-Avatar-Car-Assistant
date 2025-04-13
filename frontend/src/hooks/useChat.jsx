import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Server response:", data);
      
      // Handle different response formats
      let messagesArray = [];
      if (data.messages) {
        // If messages is an array, use it directly
        if (Array.isArray(data.messages)) {
          messagesArray = data.messages;
        } 
        // If messages is an object with numbered keys, convert to array
        else if (typeof data.messages === 'object') {
          // Check if this is an object that should be treated as a single message
          if (data.messages.text && data.messages.animation) {
            messagesArray = [data.messages];
          } else {
            // Try to extract array from object with numeric keys
            messagesArray = Object.values(data.messages).filter(item => item);
          }
        }
      }
      
      if (!messagesArray.length) {
        console.error("Could not parse messages from response:", data);
        throw new Error("Invalid response format");
      }
      
      setMessages((messages) => [...messages, ...messagesArray]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([{
        text: "Sorry, I'm having trouble connecting. Please check if the server is running.",
        facialExpression: "sad",
        animation: "Idle",
        audio: null,
        lipsync: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
