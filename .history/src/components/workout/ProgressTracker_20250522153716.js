```jsx
// ...

const ProgressTracker = () => {
  // ...

  const [progress, setProgress] = useState({
    weeklyWorkouts: 0,
    weeklyGoal: 5,
    monthlyProgress: 0,
    streakDays: 0,
    totalCompleted: 0,
    weeklyTrend: 'stable',
    completionRate: 0,
    bodyPartDistribution: [],
    weeklyActivity: []
  });

  // ...

  useEffect(() => {
    const calculateProgress = async () => {
      setLoading(true);

      try {
        // ...

        const progressData = await calculateProgressData();

        setProgress(progressData);
      } catch (error) {
        console.error("Erro ao processar dados de progresso:", error);

        setProgress({
          weeklyWorkouts: 0,
          weeklyGoal: 5,
          monthlyProgress: 0,
          streakDays: 0,
          totalCompleted: 0,
          weeklyTrend: 'stable',
          completionRate: 0,
          bodyPartDistribution: [],
          weeklyActivity: eachDayOfInterval({
            start: subDays(today, 6),
            end: today
          }).map((day) => ({
            date: format(day, 'dd/MM'),
            day: format(day, 'EEE', { locale: ptBR }),
            count: 0,
            isToday: day.getDate() === today.getDate() && 
                     day.getMonth() === today.getMonth() &&
                     day.getFullYear() === today.getFullYear()
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    calculateProgress();
  }, [workouts, getCompletedWorkouts, getMuscleGroupStats, getWorkoutStatsByPeriod, parseWorkoutDate, today]);

  const calculateProgressData = async () => {
    const completedWorkouts = getCompletedWorkouts();
    console.log(`Treinos completados processados: ${completedWorkouts.length}`);

    if (!completedWorkouts || completedWorkouts.length === 0) {
      console.log("Nenhum treino completado encontrado, inicializando com zeros");

      return {
        weeklyWorkouts: 0,
        weeklyGoal: 5,
        monthlyProgress: 0,
        streakDays: 0,
        totalCompleted: 0,
        weeklyTrend: 'stable',
        completionRate: 0,
        bodyPartDistribution: [],
        weeklyActivity: eachDayOfInterval({
          start: subDays(today, 6),
          end: today
        }).map((day) => ({
          date: format(day, 'dd/MM'),
          day: format(day, 'EEE', { locale: ptBR }),
          count: 0,
          isToday: day.getDate() === today.getDate() && 
                   day.getMonth() === today.getMonth() &&
                   day.getFullYear() === today.getFullYear()
        }))
      };
    }

    // Calcular estatísticas com base nos treinos reais
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const lastWeekStart = subDays(weekStart, 7);
    const lastWeekEnd = subDays(weekStart, 1);

    const weeklyWorkouts = getWorkoutStatsByPeriod('week');

    const lastWeekWorkouts = completedWorkouts.filter(workout => {
      const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);
      return workoutDate && isWithinInterval(workoutDate, { start: lastWeekStart, end: lastWeekEnd });
    });

    let weeklyTrend = 'stable';
    if (weeklyWorkouts.length > lastWeekWorkouts.length) {
      weeklyTrend = 'up';
    } else if (weeklyWorkouts.length < lastWeekWorkouts.length) {
      weeklyTrend = 'down';
    }

    let streakDays = 0;
    if (completedWorkouts.length > 0) {
      const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
        const dateA = parseWorkoutDate(a.completedAt || a.date);
        const dateB = parseWorkoutDate(b.completedAt || b.date);

        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      });

      const latestWorkoutDate = parseWorkoutDate(sortedWorkouts[0].completedAt || sortedWorkouts[0].date);

      if (latestWorkoutDate) {
        const daysSinceLastWorkout = differenceInDays(today, latestWorkoutDate);

        if (daysSinceLastWorkout <= 1) {
          let currentDate = latestWorkoutDate;
          let consecutiveDays = 1;

          const workoutsByDay = {};

          sortedWorkouts.forEach(workout => {
            const date = parseWorkoutDate(workout.completedAt || workout.date);
            if (!date) return;

            const dateKey = format(date, 'yyyy-MM-dd');
            workoutsByDay[dateKey] = true;
          });

          for (let i = 1; i <= 30; i++) {
            const prevDate = subDays(latestWorkoutDate, i);
            const dateKey = format(prevDate, 'yyyy-MM-dd');

            if (workoutsByDay[dateKey]) {
              consecutiveDays++;
            } else {
              break;
            }
          }

          streakDays = consecutiveDays;
        }
      }
    }

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const monthlyTarget = Math.min(currentDay, daysInMonth);

    const daysWithWorkouts = new Set();

    completedWorkouts.forEach(workout => {
      const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);

      if (workoutDate && 
          workoutDate.getMonth() === today.getMonth() && 
          workoutDate.getFullYear() === today.getFullYear()) {
        daysWithWorkouts.add(workoutDate.getDate());
      }
    });

    const monthlyProgress = Math.round((daysWithWorkouts.size / monthlyTarget) * 100);

    const allScheduledWorkouts = workouts.filter(workout => {
      const workoutDate = parseWorkoutDate(workout.date);
      return workoutDate && workoutDate <= today;
    });

    const completionRate = allScheduledWorkouts.length > 0
      ? Math.round((completedWorkouts.length / allScheduledWorkouts.length) * 100)
      : 0;

    const bodyPartDistribution = getMuscleGroupStats('all');

    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today
    });

    const weeklyActivity = last7Days.map(day => {
      const dayWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = parseWorkoutDate(workout.completedAt || workout.date);

        if (!workoutDate) return false;

        return workoutDate.getDate() === day.getDate() &&
               workoutDate.getMonth() === day.getMonth() &&
               workoutDate.getFullYear() === day.getFullYear();
      });

      const isToday = day.getDate() === today.getDate() && 
                      day.getMonth() === today.getMonth() &&
                      day.getFullYear() === today.getFullYear();

      return {
        date: format(day, 'dd/MM'),
        day: format(day, 'EEE', { locale: ptBR }),
        count: dayWorkouts.length,
        isToday
      };
    });

    return {
      weeklyWorkouts: weeklyWorkouts.length,
      weeklyGoal: 5,
      monthlyProgress,
      streakDays,
      totalCompleted: completedWorkouts.length,
      weeklyTrend,
      completionRate,
      bodyPartDistribution,
      weeklyActivity
    };
  };

  // ...
};
```