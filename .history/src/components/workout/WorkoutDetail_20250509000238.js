// src/pages/TempDetail/TempDetailPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const TempDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>
        <h2 className="text-2xl font-bold mb-4">Página Temporária</h2>
        <p className="text-gray-600 dark:text-gray-400">
          ID do treino: {id}
        </p>
      </div>
    </div>
  );
};

export default TempDetailPage;
