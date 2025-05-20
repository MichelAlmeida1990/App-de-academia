// src/components/layout/Layout.js (Versão Atualizada)
import React, { useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeContext } from "../../context/ThemeContext";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div 
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode 
          ? "dark bg-gradient-to-b from-gray-900 to-gray-800 text-white" 
          : "bg-gradient-to-b from-gray-50 to-gray-100"
      }`}
    >
      <Header />
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-grow w-full py-6 px-4 sm:px-6 md:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
