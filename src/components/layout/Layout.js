import React, { useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeContext } from "../../context/ThemeContext";

const Layout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={"flex flex-col min-h-screen " + (darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100")}>
      <Header />
      <main className="flex-grow max-w-5xl mx-auto w-full py-6 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
