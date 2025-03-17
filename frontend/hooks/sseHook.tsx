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
    console.log("========", isSSEActive);
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
        let message = "";
  
        while (reader) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // message += chunk;

          const eventType = chunk
            .split("\n")
            .map((line) => line)
            .filter((line) => line.startsWith("event:")) // Keep only data lines
            .map((line) => line.replace("event:", "")); // Remove "data:" prefix

            if (eventType[0].trim() !== "chunk") {
              continue
            }

          const dataLines = chunk
            .split("\n")
            .map((line) => line)
            .filter((line) => line.startsWith("data:")) // Keep only data lines
            .map((line) => line.replace("data:", "")); // Remove "data:" prefix

          const newData = {
            text: dataLines.join(""),
            isBot: true
          }

          console.log("------", dataLines)
          console.log(chunk)
          // dispatch(addMessage(chunk)); // Update Redux with new data
          dispatch(addMessage(newData)); // Update Redux with new data
        }
  
        dispatch(stopLoading()); // Hide loading after stream ends
        dispatch(setCanSendMessage(true)); // Enable the input field
      } catch (error) {
        console.error("Error handling SSE:", error);
        dispatch(stopLoading());
      }
    }
  };

  return { handleSSE };
};