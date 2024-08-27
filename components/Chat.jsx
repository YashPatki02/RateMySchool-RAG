"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowUp, RotateCcw } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

const Chat = ({ showChat, setShowChat }) => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi there! I'm your University Assistant. Ask me anything about different universities, and I'll provide the most relevant information. Let's get started!",
        },
    ]);

    const [userMessage, setUserMessage] = useState("");
    const inputRef = useRef(null);
    const endOfMessagesRef = useRef(null);

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        setUserMessage("");
        setMessages((messages) => [
            ...messages,
            { role: "user", content: userMessage },
            { role: "assistant", content: "" },
        ]);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([
                ...messages,
                { role: "user", content: userMessage },
            ]),
        }).then(async (res) => {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            return reader.read().then(function processText({ done, value }) {
                if (done) {
                    return result;
                }
                const text = decoder.decode(value || new Uint8Array(), {
                    stream: true,
                });
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1];
                    let otherMessages = messages.slice(0, messages.length - 1);
                    return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + text },
                    ];
                });
                return reader.read().then(processText);
            });
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Scroll to the bottom whenever messages are updated
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const restartChat = () => {
        setMessages([
            {
                role: "assistant",
                content:
                    "Hi there! I'm your University Assistant. Ask me anything about different universities, and I'll provide the most relevant information. Let's get started!",
            },
        ]);
    };

    return (
        <div className="relative flex h-[calc(100vh-0px)] justify-center items-center -mt-24 ">
            <Card className="w-full h-[75%] flex flex-col px-1 md:px-6 mx-4 sm:mx-12 md:max-w-4xl lg:max-w-5xl">
                <CardHeader className="border-b-2 border-primary pb-2">
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-2xl font-semibold">Chat.</h2>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        onClick={() => setShowChat(false)}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <ArrowUp size={22} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Close Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="cursor-pointer"
                                            >
                                                <RotateCcw
                                                    size={20}
                                                    strokeWidth={3}
                                                />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader className="mb-10">
                                                <DialogTitle>
                                                    Do you want to restart the
                                                    chat?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Restarting the chat will
                                                    clear all messages.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="sm:justify-start">
                                                <DialogClose asChild>
                                                    <Button
                                                        onClick={() => {
                                                            restartChat();
                                                        }}
                                                    >
                                                        Restart Chat
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    <p>Restart Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden mt-4">
                    <ScrollArea className="h-full gap-2 ">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start text-start"
                                }`}
                            >
                                <div
                                    className={` ${
                                        message.role === "user"
                                            ? "bg-primary"
                                            : ""
                                    } py-3 sm:px-3 md:px-4 rounded-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {/* Scroll Anchor */}
                        <div ref={endOfMessagesRef} />
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-row gap-1 w-full px-2">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 mr-4"
                    />
                    <Button
                        onClick={sendMessage}
                        size="icon"
                        className="p-2 w-10 h-10"
                    >
                        <ArrowUpRight size={22} />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Chat;
