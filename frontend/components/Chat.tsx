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
import { BeatLoader } from "react-spinners";
import Tools from "./Tools";
import Sidebar from "./Sidebar";

export default function Chat() {
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
    if (sessionId === undefined) {
        dispatch(setSessionId(new Date().toLocaleString()));
    }

    dispatch(
      addMessage({
        text: prompt,
        isBot: false,
      })
    );

    dispatch(setCanSendMessage(false));
    handleSSE(sessionId || "_id", prompt);
  }

  useEffect(()=>{
    dispatch(setSessionId(new Date().toLocaleString()));
  }, [])

  const chats = Object.keys(messages);
  const noConversation =
    sessionId === undefined ||
    !messages[sessionId] ||
    messages[sessionId].length === 0;

  return (
    <div className="flex gap-3 h-screen">
      {chats.length > 0 && (
        <Sidebar chats={chats} handleNewChat={handleNewChat} handleChatChange={handleChatChange} />
      )}

      <div className="flex flex-col w-full h-[100vh] justify-end">
        {sessionId && messages[sessionId] && (
          <div className="flex flex-col overflow-y-auto p-5">
            <div className="space-y-4">
              {messages[sessionId].map((message, index) => {
                if (message.tool_name !== undefined && message.tool_output !== undefined) {
                  return (
                    <Tools
                      key={index}
                      tool={message.tool_name}
                      output={message.tool_output}
                    />
                  );
                } else {
                  return (
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
                  );
                }
              })}
              {loading &&
                sessionId &&
                messages[sessionId] &&
                messages[sessionId].length > 0 &&
                !messages[sessionId][messages[sessionId].length - 1].isBot && (
                  <div className="flex justify-start">
                    <BeatLoader loading={loading} color="white" size={5} />
                  </div>
                )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className={`p-4 h-fit ${noConversation ? "my-auto" : ""}`}>
          {noConversation && (
            <div className="my-10 flex flex-col items-center">
              <div className="text-center text-7xl font-extrabold">LEX</div>
              <span>
                By Segni Dessalegn,{" "}
                <a
                  className="hover:underline"
                  href="https://segni.dev"
                  target="_blank"
                >
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
