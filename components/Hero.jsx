"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, animate } from "framer-motion";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

const Hero = ({ showChat, setShowChat }) => {
    const variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                ease: "easeInOut",
                dampness: 20,
                bounce: 0.1,
                duration: 0.6,
            },
        },
    };

    const messages = [
        {
            role: "user",
            content: "What is the best university for food?",
        },
        {
            role: "assistant",
            content:
                "Students rate University of California, Los Angeles (UCLA) for its great food options and dining halls. It has a variety of food options and is known for its quality and taste.",
        },
    ];

    return (
        <>
            <motion.section
                className="container flex flex-col mt-8 items-center gap-8 pt-12 sm:gap-10"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -40, transition: { duration: 0.5 } }}
            >
                <motion.h2
                    variants={childVariants}
                    className="text-2xl font-semibold text-center -mt-4 text-primary sm:text-3xl"
                >
                    Find your perfect university.
                </motion.h2>
                <motion.div
                    variants={childVariants}
                    className="w-full h-[85%] pt-4 md:px-6 sm:mx-12 md:max-w-4xl lg:max-w-5xl"
                >
                    <Card className="flex flex-col bg-transparent shadow-md border-none ">
                        <CardContent className="flex-1 overflow-hidden gap-4 flex flex-col">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end text-end"
                                            : "justify-start text-start"
                                    }`}
                                >
                                    <div
                                        className={`${
                                            message.role === "user"
                                                ? "bg-primary"
                                                : "bg-card"
                                        } py-3 px-2 sm:px-3 md:px-4 rounded-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.p
                    variants={childVariants}
                    className="text-center text-lg max-w-2xl text-muted-foreground sm:text-xl"
                >
                    Ask questions about universities, student life, and
                    experiences to get results based on direct student feedback.
                </motion.p>
                <motion.div
                    variants={childVariants}
                    className="flex flex-row items-center gap-4"
                >
                    <Button
                        size="lg"
                        onClick={() => setShowChat(!showChat)}
                        className="text-lg text-foreground"
                    >
                        Get Started{" "}
                        <ArrowUpRight className="ml-2 text-foreground" />
                    </Button>
                </motion.div>
                <motion.div
                    variants={childVariants}
                    className="relative sm:mt-8 mb-4 shadow-lg"
                ></motion.div>
            </motion.section>
        </>
    );
};

export default Hero;
