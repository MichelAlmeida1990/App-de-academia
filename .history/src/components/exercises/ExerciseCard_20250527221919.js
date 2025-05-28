// src/components/exercises/ExerciseCard.js (versão corrigida)
import React, { useState } from 'react';
import { getExerciseImage } from '../../utils/exerciseImages'; // Certifique-se que este caminho está correto
import { Link } from 'react-router-dom';
import { FaBookmark } from 'react-icons/fa';

const ExerciseCard = ({ exercise, isFavorite, onToggleFavorite, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fallback = {
        icon: '📸',
        description: 'Imagem indisponível',
        gradient: 'from-red-500 to-orange-500'
    };

    const images = getExerciseImage(exercise.id, exercise.gifUrl);
    const imageUrls = [images.primary, images.fallback].filter(Boolean); // Isso é crucial para a ordem e existência

    const handleImageError = () => {
        if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(prev => prev + 1); // Tenta a próxima URL
            setImageLoading(true); // Reinicia o estado de loading para a nova imagem
        } else {
            setImageError(true); // Todas as URLs falharam
            setImageLoading(false); // Parar de carregar
        }
    };

    const handleImageLoad = () => {
        setImageLoading(false); // Imagem carregada com sucesso
    };

    // ... (restante do código)

    return (
        <div
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 relative h-full flex flex-col"
            // Não chame onClick aqui se a intenção é que a div inteira seja um link
            // onClick={() => onClick && onClick(exercise)} // Isso pode conflitar com o <Link>
        >
            <button
                className={`absolute top-2 right-2 z-10 p-1 rounded-full ${isFavorite ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' : 'text-gray-400 bg-gray-100 dark:bg-gray-700'}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(exercise.id);
                }}
                aria-label={isFavorite ? "Remover dos favoritos" : "Salvar exercício"}
            >
                <FaBookmark className="text-lg" />
            </button>

            {/* O Link agora encapsula todo o conteúdo clicável do card, incluindo a imagem */}
            <Link to={`/exercise/${exercise.id}`} className="block flex-grow flex flex-col">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden flex-shrink-0">
                    {/* Exibe o spinner de carregamento */}
                    {imageLoading && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Carregando exercício...</p>
                            </div>
                        </div>
                    )}

                    {/* Exibe o fallback se houver erro ou todas as imagens falharem */}
                    {imageError ? (
                        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${fallback.gradient} transition-transform duration-300`}>
                            <div className="text-center text-white p-4">
                                <div className="text-6xl mb-4 animate-bounce">{fallback.icon}</div>
                                <p className="text-xl font-bold mb-2">{fallback.description}</p>
                                <p className="text-sm opacity-90 capitalize bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                    {exercise.target}
                                </p>
                            </div>
                        </div>
                    ) : (
                        // A imagem real. O estilo `opacity-0` quando carregando e `opacity-100` quando carregada
                        // garante uma transição suave. `object-cover` para preencher o container.
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={exercise.name}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${
                                imageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            loading="lazy" // Boa prática para otimização de performance
                        />
                    )}

                    {/* Overlays e informações */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

                    <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getLevelColor(exercise.level)}`}>
                            {getLevelText(exercise.level)}
                        </span>
                    </div>

                    <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            🔥 {exercise.calories} cal
                        </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                            <p className="text-sm font-medium truncate">{exercise.name}</p>
                            <p className="text-xs opacity-80">⏱️ {exercise.duration}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 dark:text-white">
                        {exercise.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            {exercise.bodyPart}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {exercise.target}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {exercise.equipment}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ExerciseCard;