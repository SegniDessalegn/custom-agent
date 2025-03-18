"use client";

import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
  addMessage,
  setCanSendMessage,
} from "../store/slices/sseSlice";
import { extractOutput } from "@/lib/utils";

export const useSSE = () => {
  const dispatch = useDispatch();

  const handleSSE = async (sessionId: string, query: string) => {
    dispatch(startLoading());
    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId, query: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").map((line) => line);
        let currentEvent = "";
        let currentData = "";
        let tool_use = "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            if (currentEvent) {
              if (currentEvent === "chunk") {
                dispatch(addMessage({ text: currentData, isBot: true }));
              } else if (currentEvent === "tool_use") {
                tool_use = currentData.trim();
              } else if (currentEvent === "tool_output") {
                dispatch(
                  addMessage({
                    text: currentData,
                    isBot: true,
                    tool_name: tool_use,
                    tool_output: extractOutput(currentData),
                  })
                );
              }
              currentData = "";
            }
            currentEvent = line.replace("event:", "").trim();
          } else if (line.startsWith("data:")) {
            currentData = line.replace("data:", "");
          }
        }

        if (currentEvent) {
          if (currentEvent === "chunk") {
            dispatch(addMessage({ text: currentData, isBot: true }));
          } else if (currentEvent === "tool_output") {
            dispatch(
              addMessage({
                text: "bla",
                isBot: true,
                tool_name: tool_use,
                tool_output: extractOutput(currentData),
              })
            );
          }
        }

        if (currentEvent === "end") break;
      }

      dispatch(stopLoading());
      dispatch(setCanSendMessage(true));
    } catch (error) {
      console.error("Error handling SSE:", error);
      dispatch(stopLoading());
    }
  };

  return { handleSSE };
};
