window.AuthDebugUtils = {
  checkDataIsolation: () => {
    const allWorkoutKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('fitness_tracker_workouts_')) {
        allWorkoutKeys.push(key);
      }
    }
    console.log('🔍 Chaves encontradas:', allWorkoutKeys);
    allWorkoutKeys.forEach(key => {
      const userId = key.replace('fitness_tracker_workouts_', '');
      const workouts = JSON.parse(localStorage.getItem(key) || '[]');
      console.log(\Usuário: \, Treinos: \\);
      workouts.forEach(w => console.log(\  - ID: \, UserID: \, Nome: \\));
    });
  }
};
