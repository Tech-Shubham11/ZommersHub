import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "../redux/authslice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  MoveLeft,
  MessageCircleCode,
  Search,
  Send,
} from "lucide-react";
import Messages from "./MEssages";
import axios from "axios";
import { setMessage } from "../redux/chatSlice";
import { Link } from "react-router-dom";

function Chatpage() {
  const { suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );

  const { messages } = useSelector((store) => store.chat);

  const [textMessage, setTextMessage] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `https://zommershub.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessage([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = suggestedUsers?.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-slate-100 md:ml-[320px]">

      <div className="h-full flex bg-white shadow-xl">

        {/* ================= SIDEBAR ================= */}
        <section
          className={`
          ${selectedUser ? "hidden md:flex" : "flex"}
          flex-col
          w-full md:w-[320px]
          border-r
          bg-white
        `}
        >
          {/* TOP */}
          <div className="p-6 justify-center text-center border-b bg-gradient-to-r from-indigo-600 to-purple-600  text-white">
            <h1 className="text-xl font-bold">Your NetWork is Your NetWorth</h1>

            {/* SEARCH */}

          </div>

          {/* USER LIST */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {filteredUsers?.map((u) => (
              <button
                key={u._id}
                onClick={() => dispatch(setSelectedUser(u))}
                className="w-full flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition text-left"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={u?.profilePhoto} />
                  <AvatarFallback>
                    {u?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {u.username}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ================= CHAT PANEL ================= */}
        {selectedUser ? (
         <section className="flex-1 flex flex-col h-full">

            {/* HEADER */}
            <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => dispatch(setSelectedUser(null))}
                className="md:hidden h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <MoveLeft />
              </button>

              <Avatar className="w-10 h-10">
                <Link to={`/profile/${selectedUser?._id}`}>
                  <AvatarImage src={selectedUser?.profilePhoto} />
                </Link>
                <AvatarFallback>
                  {selectedUser?.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <Link to={`/profile/${selectedUser?._id}`}>
                <h2 className="font-semibold">
                  {selectedUser?.username}
                </h2>
              </Link>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto bg-slate-50 pb-24">
              <Messages selectedUser={selectedUser} />
            </div>

            {/* INPUT */}
            <div className="fixed bottom-0 left-0 right-0 md:left-[320px] bg-white border-t p-3 md:p-4 mb-22">              <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2">

                <Input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessageHandler(selectedUser?._id);
                    }
                  }}
                  placeholder="Type a message..."
                  className="border-0 bg-transparent shadow-none"
                />

                <Button
                  onClick={() =>
                    sendMessageHandler(selectedUser?._id)
                  }
                  className="rounded-full h-10 w-10 p-0 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50">

            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-white shadow flex items-center justify-center mb-5">
                <MessageCircleCode className="w-12 h-12 text-indigo-500" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                Start Conversation
              </h2>

              <p className="text-gray-500">
                Select a user to start chatting
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Chatpage;


