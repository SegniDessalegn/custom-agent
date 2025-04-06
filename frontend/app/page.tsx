"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Chat from "@/components/Chat";
import { MessagesSquareIcon, Minus, Trash } from "lucide-react";
import { setSessionId } from "@/store/slices/sseSlice";
import { useDispatch } from "react-redux";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <nav className="absolute top-0 left-0 w-full flex justify-between p-6 z-2">
        <h1 className="text-2xl font-bold text-red-600">SuperCar</h1>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="hover:text-red-500">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-red-500">
              Models
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-red-500">
              Gallery
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-red-500">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-2">
        <h2 className="text-5xl font-extrabold tracking-wide text-red-500">
          Luxury in Motion
        </h2>
        <p className="mt-4 text-lg max-w-lg">
          Experience the thrill of speed and luxury. Drive the world's most
          powerful supercars.
        </p>
        <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white cursor-pointer px-10 py-6 text-lg">
          Explore Now
        </Button>
      </div>

      <Image
        src="/supercar.jpg"
        alt="Supercar"
        layout="fill"
        objectFit="cover"
        className="opacity-30 z-1"
      />

      <div className="fixed bottom-5 right-5 flex flex-col items-end z-2  shadow-2xl shadow-red-500/10">
        {chatOpen && (
          <div className="h-10 w-full bg-red-600 rounded-t-2xl flex justify-between items-center gap-1 px-5 py-2">
            <div className="text-white">Lex Assistant</div>
            <div className="flex items-center gap-3">
              <Trash
                onClick={() =>
                  dispatch(setSessionId(new Date().toLocaleString()))
                }
                size={20}
                color="white"
                className="cursor-pointer"
              />
              <Minus
                onClick={() => setChatOpen(!chatOpen)}
                size={20}
                color="white"
                className="cursor-pointer"
              />
            </div>
          </div>
        )}
        <div
          className={`bg-black border-[1px] border-gray-900 p-4 rounded-b-lg shadow-lg w-96 mb-4 ${
            chatOpen ? "" : "hidden"
          }`}
        >
          <Chat />
        </div>
        <button
          className="bg-red-600 text-white py-3 px-4 cursor-pointer rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessagesSquareIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
