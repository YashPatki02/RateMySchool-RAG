"use client";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
    const [showChat, setShowChat] = useState(false);
    const [headerAnimated, setHeaderAnimated] = useState(false);

    useEffect(() => {
        // Set headerAnimated to true after the initial render
        if (!headerAnimated) {
            setHeaderAnimated(true);
        }
    }, [headerAnimated]);

    return (
        <div className="w-screen h-screen overflow-hidden">
            <AnimatePresence mode="sync">
                {headerAnimated && (
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Header />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence mode="sync">
                {!showChat && (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -200 }}
                        transition={{ duration: 1 }}
                    >
                        <Hero showChat={showChat} setShowChat={setShowChat} />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence mode="sync">
                {showChat && (
                    <motion.div
                        key="chat"
                        initial={{ y: 400, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0, y: 200 }}
                        transition={{ duration: 1 }}
                    >
                        <Chat showChat={showChat} setShowChat={setShowChat} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
