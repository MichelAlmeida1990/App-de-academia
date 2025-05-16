// src/pages/ProgressPage.js
import React, { useState } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { useTheme } from '../context/ThemeContext';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { darkMode } = useTheme();
  const { workouts = [] } = useWorkout();

  // Dados simulados para gráficos e estatísticas
  const completedWorkouts = workouts.filter(workout => workout.completed).length;
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts * 100).toFixed(1) : 0;

  // Dados simulados para PRs (Personal Records)
  const personalRecords = {
    'Supino Reto': '100kg',
    'Agachamento': '140kg',
    'Levantamento Terra': '160kg',
    'Barra Fixa': '15 reps'
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Progresso
      </Typography>

      <Paper sx={{ mb: 4, p: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Resumo" />
          <Tab label="Histórico" />
          <Tab label="Recordes Pessoais" />
        </Tabs>
      </Paper>

      {/* Resumo */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Treinos Completados
                </Typography>
                <Typography variant="h3">
                  {completedWorkouts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  de {totalWorkouts} treinos programados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Taxa de Conclusão
                </Typography>
                <Typography variant="h3">
                  {completionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  dos treinos programados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Dias Ativos
                </Typography>
                <Typography variant="h3">
                  {Math.min(completedWorkouts, 30)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  nos últimos 30 dias
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progresso Recente
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Gráfico de progresso será exibido aqui
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Histórico */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Histórico de Treinos
            </Typography>
            {workouts.length > 0 ? (
              <Timeline position="alternate">
                {workouts.slice(0, 10).map((workout, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={workout.completed ? "success" : "grey"} />
                      {index < workouts.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        {workout.name || `Treino ${index + 1}`}
                      </Typography>
                      <Typography>
                        {new Date(workout.date || Date.now()).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {workout.completed ? 'Concluído' : 'Não concluído'}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                Nenhum treino registrado ainda.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recordes Pessoais */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recordes Pessoais (PRs)
            </Typography>
            {Object.keys(personalRecords).length > 0 ? (
              <Grid container spacing={2}>
                {Object.entries(personalRecords).map(([exercise, record]) => (
                  <Grid item xs={12} sm={6} md={4} key={exercise}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{exercise}</Typography>
                        <Typography variant="h4" color="primary">{record}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                Nenhum recorde pessoal registrado ainda.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProgressPage;
