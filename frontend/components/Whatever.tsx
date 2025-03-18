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
import { BeatLoader } from "react-spinners";

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
    if (loading) return;
    dispatch(setSessionId(new Date().toLocaleString()));
  }

  function handleChatChange(sessionId: string) {
    if (loading) return;
    dispatch(setSessionId(sessionId));
  }

  function handleSubmit(prompt: string) {
    if (prompt === "") {
      return;
    }
    if (!sessionId) {
      dispatch(setSessionId(new Date().toLocaleString()));
    }

    dispatch(
      addMessage({
        text: prompt,
        isBot: false,
      })
    );

    dispatch(setCanSendMessage(false));

    handleSSE(sessionId || " ", prompt);
  }

  const chats = Object.keys(messages);

  return (
    <div className="flex gap-3 h-screen">
      {sessionId !== undefined && (
        <div className="w-[350px] h-full border-r-2 border-r-gray-900 flex flex-col justify-start">
          <Button
            onClick={handleNewChat}
            className="mx-3 my-5 font-bold cursor-pointer"
          >
            + New Chat
          </Button>
          <div className="mx-3 mb-5 flex flex-col gap-2">
            {chats.map((chat: string) => (
              <div key={chat}>
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
      )}

      <div className="flex flex-col w-full h-full">
        {sessionId && messages[sessionId] && (
          <div className="flex flex-col justify-end flex-1 h-[calc(100vh-80px)] overflow-y-auto p-5">
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
              {loading && sessionId && messages[sessionId] && messages[sessionId].length > 0 && !messages[sessionId][messages[sessionId].length - 1].isBot && (
                <div className="flex justify-start">
                  <BeatLoader loading={loading} color="gray" size={5} />
                </div>
               )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="p-4 my-auto">
          {(sessionId === undefined || !messages[sessionId] || messages[sessionId].length === 0) && (
            <div className="my-10 flex flex-col items-center">
              <div className="text-center text-7xl font-extrabold">LEX</div>
              <span>
                By Segni Dessalegn,{" "}
                <a className="hover:underline" href="https://segni.dev" target="_blank">
                  segni.dev
                </a>
              </span>
            </div>
          )}
          <Input
            className="w-full max-w-3xl mx-auto"
            placeholder="Enter your message"
            autoFocus
            onKeyDown={(e: any) => {
              if (e.key === "Enter" && e.target.value !== "" && !loading) {
                handleSubmit(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
