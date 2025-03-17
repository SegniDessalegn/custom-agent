"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useSSE } from "@/hooks/sseHook";
import { Input } from "./ui/input";
import {
  addMessage,
  setCanSendMessage,
  setSessionId,
} from "@/store/slices/sseSlice";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Page() {
  const dispatch = useDispatch();
  const { handleSSE } = useSSE();

  const messages = useSelector((state: RootState) => state.sse.messages);
  const loading = useSelector((state: RootState) => state.sse.loading);
  const canSendMessage = useSelector(
    (state: RootState) => state.sse.canSendMessage
  );
  const sessionId = useSelector((state: RootState) => state.sse.sessionId);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleNewChat() {
    dispatch(setSessionId(new Date().toLocaleString()));
  }

  function handleChatChange(sessionId: string) {
    dispatch(setSessionId(sessionId));
  }

  const chats = Object.keys(messages);

  return (
    <div className="flex gap-3 h-screen">
      <div className="w-[350px] h-full border-r-2 border-r-gray-900 flex flex-col justify-start">
        <Button
          onClick={handleNewChat}
          className="mx-3 my-5 font-bold cursor-pointer"
        >
          + New Chat
        </Button>
        <div className="mx-3 mb-5 flex flex-col gap-2">
          {chats.map((chat: string) => (
            <div>
              <Button
                onClick={() => handleChatChange(chat)}
                variant={"link"}
                className="pb-2 cursor-pointer shadow-none"
              >
                {chat}
              </Button>
              <Separator />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-end w-full h-full">
        {sessionId && messages[sessionId] && (
            <div className="flex flex-col justify-end overflow-y-auto p-5">
            <div className="space-y-4">
                {messages[sessionId].map((message, index) => (
                <div
                    key={index}
                    className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                    }`}
                >
                    <div
                    className={`w-fit p-2 rounded-lg ${
                        message.isBot
                        ? "mr-10"
                        : "bg-gray-950 border-[1px] border-gray-900"
                    }`}
                    >
                    {message.text}
                    </div>
                </div>
                ))}
            </div>
            <div ref={messagesEndRef} />
            </div>
        )}

        <div className="p-4">
          <Input
            // disabled={!canSendMessage}
            className="w-full max-w-2xl mx-auto"
            placeholder="Enter your message"
            onKeyDown={(e: any) => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                setCanSendMessage(false);
                dispatch(
                  addMessage({ text: e.target.value.trim(), isBot: false })
                );
                handleSSE(sessionId as string, e.target.value.trim()); // Send the message to the bot
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

/*


<h1>{loading ? 'Loading SSE...' : 'SSE Messages'}</h1>
            <button
            onClick={() => {
                handleSSE();
                }}
                >
            Start SSE Event
            </button>




            <div>
            {messages.length > 0 ? (
                <div>
                {messages.map((message, index) => (
                    <span key={index}>{message}</span> // Display each message chunk as it comes
                    ))}
                </div>
            ) : (
                <p>No messages yet.</p>
                )}
            </div>
*/
