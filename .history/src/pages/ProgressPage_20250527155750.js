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
  Paper,
  Divider, // Adicionado para melhor separação visual
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

// Ícones do Material-UI para os cards e PRs
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Importe o componente de gráfico (você precisará criá-lo e instalá-lo)
// Exemplo: import ProgressChart from '../components/charts/ProgressChart';

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { darkMode } = useTheme(); // Para usar o tema se necessário
  const { workouts = [] } = useWorkout(); // Garante que workouts seja um array

  // Dados simulados para gráficos e estatísticas
  const completedWorkouts = workouts.filter(workout => workout.completed).length;
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts * 100).toFixed(1) : 0;

  // Calcula dias ativos (apenas para treinos completados nos últimos 30 dias)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const activeDays = new Set(
    workouts
      .filter(workout => workout.completed && new Date(workout.date) >= thirtyDaysAgo)
      .map(workout => new Date(workout.date).toDateString())
  ).size;

  // Dados simulados para PRs (Personal Records) - adicione mais se tiver
  const personalRecords = {
    'Supino Reto': { value: '100kg', date: '2024-03-15' },
    'Agachamento': { value: '140kg', date: '2024-04-20' },
    'Levantamento Terra': { value: '160kg', date: '2024-05-10' },
    'Barra Fixa': { value: '15 reps', date: '2024-02-28' },
    'Remada Curvada': { value: '80kg', date: '2024-03-01' },
  };

  // Dados mockados para o gráfico de progresso (substitua por dados reais da API/estado)
  const mockChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    weight: [75, 74.5, 74, 73.8, 73.5], // Exemplo de evolução de peso
    caloriesBurned: [300, 320, 310, 340, 330], // Exemplo de calorias
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: darkMode ? 'white' : 'text.primary' }}>
        Progresso
      </Typography>

      <Paper
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: darkMode ? '#333' : '#fff',
          boxShadow: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          indicatorColor="primary"
          textColor={darkMode ? 'primary' : 'inherit'}
        >
          <Tab label="Resumo" sx={{ color: darkMode ? 'white' : 'inherit' }} />
          <Tab label="Histórico" sx={{ color: darkMode ? 'white' : 'inherit' }} />
          <Tab label="Recordes Pessoais" sx={{ color: darkMode ? 'white' : 'inherit' }} />
        </Tabs>
      </Paper>

      {/* Resumo */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Card: Treinos Completados */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', backgroundColor: darkMode ? '#424242' : '#fff', boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircleOutlineIcon color="success" sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" component="div" sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                    Treinos Completados
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#66bb6a' }}> {/* Green for success */}
                  {completedWorkouts}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: darkMode ? 'lightgray' : 'text.secondary' }}>
                  de {totalWorkouts} treinos programados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card: Taxa de Conclusão */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', backgroundColor: darkMode ? '#424242' : '#fff', boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <SportsScoreIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" component="div" sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                    Taxa de Conclusão
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#42a5f5' }}> {/* Blue for primary */}
                  {completionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: darkMode ? 'lightgray' : 'text.secondary' }}>
                  dos treinos programados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card: Dias Ativos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', backgroundColor: darkMode ? '#424242' : '#fff', boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarTodayIcon color="warning" sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" component="div" sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                    Dias Ativos
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}> {/* Orange for warning */}
                  {activeDays}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: darkMode ? 'lightgray' : 'text.secondary' }}>
                  nos últimos 30 dias
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card Grande: Progresso Recente (Gráfico) */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: darkMode ? '#424242' : '#fff', boxShadow: 3, p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUpIcon color="info" sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                    Progresso Recente
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />
                <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                  {/* Substitua esta área pelo seu componente de gráfico real */}
                  {/* Exemplo de uso: <ProgressChart data={mockChartData} /> */}
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ color: darkMode ? 'gray' : 'text.secondary' }}>
                    Gráfico de progresso será exibido aqui (ex: peso, volume de treino, calorias queimadas).
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Histórico */}
      {activeTab === 1 && (
        <Card sx={{ backgroundColor: darkMode ? '#424242' : '#fff', boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'text.primary' }}>
              Histórico de Treinos
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />
            {workouts.length > 0 ? (
              <Timeline position="alternate" sx={{ '& .MuiTimelineItem-root:before': { flex: 0.1 } }}> {/* Ajuste de layout */}
                {workouts.slice(0, 10).map((workout, index) => ( // Limita a 10 itens para visualização
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={workout.completed ? "success" : "grey"} variant={workout.completed ? "filled" : "outlined"} />
                      {index < workouts.length - 1 && <TimelineConnector sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'text.secondary' }} />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          backgroundColor: darkMode ? '#555' : '#f0f0f0',
                          color: darkMode ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="h6" component="span" sx={{ color: darkMode ? 'white' : 'text.primary' }}>
                          {workout.name || `Treino ${index + 1}`}
                        </Typography>
                        <Typography sx={{ color: darkMode ? 'lightgray' : 'text.secondary' }}>
                          {new Date(workout.date || Date.now()).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color={workout.completed ? "success.main" : "text.secondary"}>
                          {workout.completed ? 'Concluído' : 'Não concluído'}
                        </Typography>
                        {workout.notes && ( // Exibe notas se existirem
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: darkMode ? '#bbb' : 'text.secondary' }}>
                            Notas: {workout.notes}
                          </Typography>
                        )}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
                {workouts.length > 10 && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="info" />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        ... e mais treinos
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4, color: darkMode ? 'gray' : 'text.secondary' }}>
                Nenhum treino registrado ainda. Que tal começar um novo?
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recordes Pessoais */}
      {activeTab === 2 && (
        <Card sx={{ backgroundColor: darkMode ? '#424242' : '#fff', boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'text.primary' }}>
              Recordes Pessoais (PRs)
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />
            {Object.keys(personalRecords).length > 0 ? (
              <Grid container spacing={3}>
                {Object.entries(personalRecords).map(([exercise, data]) => (
                  <Grid item xs={12} sm={6} md={4} key={exercise}>
                    <Card
                      variant="outlined"
                      sx={{
                        backgroundColor: darkMode ? '#555' : '#f9f9f9',
                        borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        boxShadow: 1,
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' },
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <FitnessCenterIcon color="action" sx={{ mr: 1, fontSize: 24, color: darkMode ? 'lightgray' : 'inherit' }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: darkMode ? 'white' : 'text.primary' }}>
                            {exercise}
                          </Typography>
                        </Box>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {data.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ color: darkMode ? 'gray' : 'text.secondary' }}>
                          Desde: {new Date(data.date).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4, color: darkMode ? 'gray' : 'text.secondary' }}>
                Nenhum recorde pessoal registrado ainda. Desafie-se!
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProgressPage;
