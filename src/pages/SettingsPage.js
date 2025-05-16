// src/pages/SettingsPage.js
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Brightness4,
  Notifications,
  FitnessCenter,
  Storage,
  Security,
  Language,
  Timer
} from '@mui/icons-material';

const SettingsPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  // Configurações de notificações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(60); // em minutos
  
  // Configurações de treino
  const [units, setUnits] = useState('metric'); // metric ou imperial
  const [restTimerDuration, setRestTimerDuration] = useState(90); // em segundos
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  
  // Configurações de dados
  const [autoSync, setAutoSync] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  
  const handleSaveSettings = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    alert('Configurações salvas com sucesso!');
  };
  
  const handleExportData = () => {
    // Lógica para exportar dados
    alert('Exportação de dados iniciada');
  };
  
  const handleImportData = () => {
    // Lógica para importar dados
    alert('Por favor, selecione um arquivo para importar');
  };
  
  const handleDeleteAccount = () => {
    // Lógica para excluir conta
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Conta excluída');
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações
      </Typography>
      
      {/* Aparência */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Brightness4 sx={{ mr: 2 }} />
            <Typography variant="h6">Aparência</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode} 
                onChange={toggleTheme} 
              />
            }
            label="Modo Escuro"
          />
        </CardContent>
      </Card>
      
      {/* Notificações */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Notifications sx={{ mr: 2 }} />
            <Typography variant="h6">Notificações</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch 
                checked={notificationsEnabled} 
                onChange={(e) => setNotificationsEnabled(e.target.checked)} 
              />
            }
            label="Ativar Notificações"
          />
          
          <Box mt={2}>
            <Typography gutterBottom>
              Lembrete de Treino (minutos antes)
            </Typography>
            <Slider
              value={reminderTime}
              onChange={(e, newValue) => setReminderTime(newValue)}
              disabled={!notificationsEnabled}
              step={15}
              marks
              min={15}
              max={120}
              valueLabelDisplay="auto"
            />
          </Box>
        </CardContent>
      </Card>
      
      {/* Configurações de Treino */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <FitnessCenter sx={{ mr: 2 }} />
            <Typography variant="h6">Configurações de Treino</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="units-label">Unidades de Medida</InputLabel>
                <Select
                  labelId="units-label"
                  value={units}
                  label="Unidades de Medida"
                  onChange={(e) => setUnits(e.target.value)}
                >
                  <MenuItem value="metric">Métrico (kg, cm)</MenuItem>
                  <MenuItem value="imperial">Imperial (lb, in)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Timer sx={{ mr: 1 }} />
                <Typography>Tempo de Descanso (segundos)</Typography>
              </Box>
              <Slider
                value={restTimerDuration}
                onChange={(e, newValue) => setRestTimerDuration(newValue)}
                step={5}
                min={5}
                max={300}
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={autoStartTimer} 
                    onChange={(e) => setAutoStartTimer(e.target.checked)} 
                  />
                }
                label="Iniciar Timer Automaticamente"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Dados e Sincronização */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Storage sx={{ mr: 2 }} />
            <Typography variant="h6">Dados e Sincronização</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={
              <Switch 
                checked={autoSync} 
                onChange={(e) => setAutoSync(e.target.checked)} 
              />
            }
            label="Sincronização Automática"
          />
          
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="outlined" onClick={handleExportData}>
                  Exportar Dados
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={handleImportData}>
                  Importar Dados
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      
      {/* Idioma */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Language sx={{ mr: 2 }} />
            <Typography variant="h6">Idioma</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControl fullWidth>
            <InputLabel id="language-label">Idioma do Aplicativo</InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Idioma do Aplicativo"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
              <MenuItem value="en-US">English (US)</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
      
      {/* Conta e Segurança */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Security sx={{ mr: 2 }} />
            <Typography variant="h6">Conta e Segurança</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Alterar Senha" 
                secondary="Atualize sua senha para manter sua conta segura" 
              />
              <ListItemSecondaryAction>
                <Button variant="outlined">Alterar</Button>
              </ListItemSecondaryAction>
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemText 
                primary="Excluir Conta" 
                secondary="Exclui permanentemente sua conta e todos os dados" 
              />
              <ListItemSecondaryAction>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleDeleteAccount}
                >
                  Excluir
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* Botões de ação */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleSaveSettings}
        >
          Salvar Configurações
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsPage;
