import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessage";
import useGetRTM from "../hooks/useGetRtm.jsx";

function Messages({ selectedUser }) {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-white">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 bg-gray-50 space-y-3">

        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.senderId === user?._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    px-4 py-2
                    rounded-2xl
                    max-w-[75%] sm:max-w-sm
                    break-words
                    text-sm
                    shadow-sm
                    ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    }
                  `}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No messages yet
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default Messages;