"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ModeToggle } from "./ModeToggle";

const Header = ({ showChat }) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="relative flex flex-row w-full items-center  px-4 sm:px-20 md:px-32 py-4"
        >
            {!showChat && (
                <>
                    <Link
                        href="/"
                        className="w-full flex flex-row gap-2 items-center h-16 justify-between"
                    >
                        <h1 className="text-2xl tracking-widest">UniMatch.</h1>
                    </Link>
                    <ModeToggle />
                </>
            )}
            {showChat && (
                <>
                    <div className="h-16"></div>
                </>
            )}
        </motion.header>
    );
};

export default Header;
