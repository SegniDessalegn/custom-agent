"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

interface SidebarProps {
  chats: string[];
  handleNewChat: () => void;
  handleChatChange: (chat: string) => void;
}

export default function Sidebar({ chats, handleNewChat, handleChatChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full shadow-lg bg-gray-900 text-white hover:text-black cursor-pointer lg:hidden"
        size="icon"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "w-[350px] h-full border-r-2 border-r-gray-900 flex flex-col bg-black justify-start transition-transform",
          "lg:translate-x-0 lg:relative fixed left-0 z-40",
          isOpen ? "translate-x-0 mt-16" : "-translate-x-full"
        )}
      >
        <Button
          onClick={handleNewChat}
          className="mx-3 my-5 font-bold cursor-pointer"
        >
          + New Chat
        </Button>
        <div className="mx-3 mb-5 flex flex-col-reverse gap-2">
          {chats.map((chat: string) => (
            <div key={chat}>
              <Button
                onClick={() => handleChatChange(chat)}
                variant="link"
                className="pb-2 cursor-pointer shadow-none"
              >
                {chat}
              </Button>
              <Separator />
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}