"use client";
import React from "react";
import { useState, useEffect } from "react";
import ReloadModal from "@/components/ReloadModal";

export default function Chat() {
  // const [showModal, setShowModal] = useState(false);
  // const [shouldReload, setShouldReload] = useState(false);

  /* useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!shouldReload) {
        event.preventDefault();
        setShowModal(true);
        // This is necessary to show the modal and prevent the default reload behavior
        event.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldReload]);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleReload = () => {
    setShouldReload(true);
    setShowModal(false);
    window.removeEventListener('beforeunload', () => {}); // Remove the event listener to allow reload
    window.location.reload();
  }; */


  // message history
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your University Assistant. Ask me anything about different universities, and I'll provide the most relevant information. Let's get started!",
    },
  ]);
  //  state for message
  const [userMessage, setUserMessage] = useState("");
  // const [isSidebarOpen, setSidebarOpen] = useState(true);

  const sendMessage = async () => {
    setUserMessage("");
    console.log(userMessage);
    //
    setMessages((messages) => [
      ...messages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);
    //
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ...messages,
        { role: "user", content: userMessage },
      ]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };
  //
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-100 p-6 flex flex-col black min-w-[100vh]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* change the color ang the padding */}
              <div
                className={`${
                  message.role === "user" ? "bg-blue-500" : "bg-gray-300"
                } text-black p-3 rounded-lg max-w-xs`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex">
          <input
            className="flex-1 px-4 py-2 border rounded-lg"
            type="text"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
          >
            Send
          </button>
        </div>
      </div>
      <div>
      {/* Other content */}
      {/* <ReloadModal
        showModal={showModal}
        handleCancel={handleCancel}
        handleReload={handleReload}
      /> */}
    </div>
    </div>
  );
}
