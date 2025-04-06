"use client";

import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
  addMessage,
} from "../store/slices/sseSlice";
import { cleanText, extractOutput } from "@/lib/utils";

export const useSSE = () => {
  const dispatch = useDispatch();

  const handleSSE = async (sessionId: string, query: string) => {
    dispatch(startLoading());
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, session_id: sessionId }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to SSE");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let event = "";
        let data = "";
        let tool_use = "";

        for (const line of lines) {
          if (line.trim().startsWith("event:")) {
            event = cleanText(line.slice(7));
            continue;
          } else if (line.trim().startsWith("data:")) {
            data = line.slice(6);

            if (event === "chunk" && data) {
              dispatch(addMessage({ text: data, isBot: true }));
            } else if (event === "tool_use" && event.length > 0) {
              tool_use = cleanText(data.trim());
            } else if (event === "tool_output" && tool_use.length > 0) {
              dispatch(
                addMessage({
                  text: "",
                  isBot: true,
                  tool_name: tool_use,
                  tool_output: extractOutput(data.trim()),
                })
              );
            }
          } else if (event.trim() === "end") {
            break;
          }
        }
      }
      dispatch(stopLoading());
    } catch (error) {
      console.error("Error handling SSE:", error);
      dispatch(stopLoading());
    }
  };

  return { handleSSE };
};
