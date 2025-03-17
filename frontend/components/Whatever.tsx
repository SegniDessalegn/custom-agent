'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSSE } from '@/hooks/sseHook';


export default function Page() {
  const sessionId = 'test-session'; // Static session ID for the example
  const query = 'Who are you?'; // Static query for the example
  const { activateSSE, handleSSE } = useSSE(sessionId, query); // Use the custom hook

  const messages = useSelector((state: RootState) => state.sse.messages);
  const loading = useSelector((state: RootState) => state.sse.loading);


  console.log("MESSAGES", messages)
  return (
    <div>
      <h1>{loading ? 'Loading SSE...' : 'SSE Messages'}</h1>

      {/* Button to trigger the POST request and activate SSE */}
      <button onClick={() => { handleSSE(); }}>Start SSE Event</button>
      <input type='text' placeholder='hello'/>

      <div>
        {/* Display the messages as they come in */}
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
    </div>
  );
}