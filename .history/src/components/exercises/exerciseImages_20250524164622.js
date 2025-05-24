// src/utils/exerciseImages.js
export const exerciseStaticImages = {
  "0001": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // Squat
  "0002": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // Push-up
  "0003": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // Sit-up
  "0004": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // Plank
  "0005": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // Burpee
  // Adicione mais conforme necessário
};

export const getExerciseImage = (exerciseId, gifUrl) => {
  return {
    primary: gifUrl,
    fallback: exerciseStaticImages[exerciseId] || null
  };
};
