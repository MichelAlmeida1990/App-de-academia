import React from 'react';
import { useParams } from 'react-router-dom';

const EditWorkoutPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Treino</h1>
      <p>ID do treino: {id}</p>
      {/* Formulário de edição será implementado aqui */}
    </div>
  );
};

export default EditWorkoutPage;
