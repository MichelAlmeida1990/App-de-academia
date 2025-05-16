// src/pages/ProgressPage.js
import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

function ProgressPage() {
  const [timeRange, setTimeRange] = useState(0);
  const { 
    getWorkoutProgressForPeriod, 
    getWorkoutStats, 
    getPersonalRecord,
    getMostFrequentExercises,
    getWorkoutFrequencyByDay,
    personalRecords
  } = useWorkout();

  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  const timeRanges = [30, 90, 180, 365];
  const selectedRange = timeRanges[timeRange];
  const workoutProgress = getWorkoutProgressForPeriod(selectedRange);
  const stats = getWorkoutStats();
  const frequentExercises = getMostFrequentExercises(5);
  const dayFrequency = getWorkoutFrequencyByDay();

  // Prepare data for volume chart
  const volumeData = workoutProgress.map(workout => ({
    date: new Date(workout.date).toLocaleDateString(),
    volume: workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.completed ? (set.weight * set.reps) : 0);
      }, 0);
    }, 0)
  }));

  // Prepare data for workout frequency chart
  const frequencyData = dayFrequency.map(item => ({
    day: item.day.substring(0, 3),
    treinos: item.count
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Seu Progresso
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={timeRange}
          onChange={handleTimeRangeChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="30 dias" />
          <Tab label="3 meses" />
          <Tab label="6 meses" />
          <Tab label="1 ano" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Treinos Concluídos
              </Typography>
              <Typography variant="h5" component="div">
                {stats.completedWorkouts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Taxa de Conclusão
              </Typography>
              <Typography variant="h5" component="div">
                {stats.completionRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tempo Total (min)
              </Typography>
              <Typography variant="h5" component="div">
                {stats.totalMinutes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sequência Atual
              </Typography>
              <Typography variant="h5" component="div">
                {stats.currentStreak} dias
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Volume Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Volume de Treino ao Longo do Tempo
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={volumeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      name="Volume (kg)" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Frequent Exercises */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exercícios Mais Frequentes
              </Typography>
              <List>
                {frequentExercises.map((exercise, index) => (
                  <React.Fragment key={exercise.name}>
                    <ListItem>
                      <ListItemText 
                        primary={exercise.name} 
                        secondary={`${exercise.count} vezes`} 
                      />
                    </ListItem>
                    {index < frequentExercises.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Workout Frequency Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Frequência por Dia da Semana
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={frequencyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="treinos" name="Treinos" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Records */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recordes Pessoais
              </Typography>
              <List>
                {Object.entries(personalRecords || {}).slice(0, 5).map(([exercise, weight]) => (
                  <React.Fragment key={exercise}>
                    <ListItem>
                      <ListItemText 
                        primary={exercise} 
                        secondary={`${weight} kg`} 
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Workouts Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Histórico de Treinos Recentes
              </Typography>
              <Timeline position="alternate">
                {workoutProgress.slice(0, 5).map((workout, index) => (
                  <TimelineItem key={workout.id || index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < workoutProgress.slice(0, 5).length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(workout.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">
                        {workout.name || `Treino ${index + 1}`}
                      </Typography>
                      <Typography variant="body2">
                        {workout.exercises.length} exercícios
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProgressPage;
