'use client'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading, addMessage, setCanSendMessage } from '../store/slices/sseSlice';

export const useSSE = () => {
  const dispatch = useDispatch();
  const [isSSEActive, setSSEActive] = useState(true);

  // const activateSSE = async () => {
  //   try {
  //     // Step 1: Make the POST request to trigger the SSE event
  //     const response = await fetch('http://localhost:8000/query', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ session_id: sessionId, query: query }),
  //     });


  //     console.log("RESPONSE HERE 1", response)
  //     if (response.ok) {
  //       console.log("aosidjfaosidjfoaisdjfoaisdjf")
  //       setSSEActive(true); // <==== NOT UPDATING THE STATE?
  //       dispatch(startLoading()); // Show loading indicator
  //       handleSSE();   // <=== HANDLE SSE WILL BE CALLED BUT SSEACTIVE IS FALSE
  //     } else {
  //       console.error('Error triggering the query');
  //     }
  //   } catch (error) {
  //     console.error('Error with the POST request:', error);
  //   }
  // };

  // Listen to the SSE events after POST request
  
  const handleSSE = async (sessionId: string, query: string) => {
    dispatch(startLoading());
    if (isSSEActive) {
      console.log("================================================");
  
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
                // console.log(`event=====>: ${currentEvent}\ndata: ${currentData}`, currentEvent === "tool_output");
                if (currentEvent === "chunk") {
                  dispatch(addMessage({ text: currentData, isBot: true }));
                } else if (currentEvent === "tool_use") {
                  tool_use = currentData.trim();
                } else if (currentEvent === "tool_output") {
                  dispatch(addMessage({ text: currentData, isBot: true, tool_name: tool_use, tool_output: currentData }));
                }
                currentData = "";
              }
              currentEvent = line.replace("event:", "").trim();
            } else if (line.startsWith("data:")) {
              currentData = line.replace("data:", "");
            }
          }

          if (currentEvent) {
            // console.log(`event: ${currentEvent}\ndata: ${currentData}`);
            if (currentEvent === "chunk") {
              dispatch(addMessage({ text: currentData, isBot: true }));
            } else if (currentEvent === "tool_output") {
              console.log("TOOL USE", tool_use, currentData)
              dispatch(addMessage({ text: "bla", isBot: true, tool_name: tool_use, tool_output: currentData }));
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
    }
  };

  return { handleSSE };
};