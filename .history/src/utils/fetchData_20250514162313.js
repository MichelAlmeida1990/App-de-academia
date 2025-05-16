// src/utils/fetchData.js
import axios from 'axios';

const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
  },
};

const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
  },
};

export const fetchExercises = async () => {
  try {
    const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    return [];
  }
};

export const fetchExerciseById = async (id) => {
  try {
    const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, exerciseOptions);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar exercício com ID ${id}:`, error);
    return null;
  }
};

export const fetchExerciseVideos = async (name) => {
  try {
    const response = await axios.get(
      `https://youtube-search-and-download.p.rapidapi.com/search?query=${name} exercise`,
      youtubeOptions
    );
    return response.data.contents;
  } catch (error) {
    console.error(`Erro ao buscar vídeos para ${name}:`, error);
    return [];
  }
};

export const fetchExercisesByBodyPart = async (bodyPart) => {
  try {
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
      exerciseOptions
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar exercícios para ${bodyPart}:`, error);
    return [];
  }
};

export const fetchExercisesByTarget = async (target) => {
  try {
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/exercises/target/${target}`,
      exerciseOptions
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar exercícios para o alvo ${target}:`, error);
    return [];
  }
};

export const fetchExercisesByEquipment = async (equipment) => {
  try {
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`,
      exerciseOptions
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar exercícios para o equipamento ${equipment}:`, error);
    return [];
  }
};
