import React from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../../context/WorkoutContext";

const WorkoutCard = ({ workout }) => {
  const { getWorkoutStatus, toggleWorkoutCompletion } = useWorkout();
  const isCompleted = getWorkoutStatus(workout.id);

  const handleToggle = (e) => {
    e.preventDefault();
    toggleWorkoutCompletion(workout.id);
  };

  return (
    <div className={"bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4 flex flex-col md:flex-row items-center transition-all hover:shadow-xl " + 
      (isCompleted ? "border-l-4 border-green-500" : "")}>
      <img
        src={workout.image}
        alt={workout.name}
        className="w-full md:w-1/3 h-48 object-cover rounded-md mb-4 md:mb-0"
      />
      <div className="md:ml-6 flex-1">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{workout.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{workout.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              className="mr-2 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {isCompleted ? "Concluído" : "Marcar como concluído"}
            </span>
          </label>
          
          <Link 
            to={`/workout/${workout.id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
