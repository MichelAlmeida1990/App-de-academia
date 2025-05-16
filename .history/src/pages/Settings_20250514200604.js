// src/pages/SettingsPage.js
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWorkout } from '../hooks/useWorkout';
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  VolumeUp as VolumeIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  CloudDownload as ExportIcon,
  CloudUpload as ImportIcon
} from '@mui/icons-material';

function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { getWorkoutStats } = useWorkout();
  
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    restTimer: 60,
    units: 'kg',
    language: 'pt-BR',
    privacyMode: false,
    autoBackup: true
  });
  
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const stats = getWorkoutStats();
  
  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const handleSaveSettings = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    setSnackbar({
      open: true,
      message: 'Configurações salvas com sucesso!',
      severity: 'success'
    });
  };
  
  const handleResetData = () => {
    // Aqui você implementaria a lógica para resetar os dados
    setResetDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Todos os dados foram resetados',
      severity: 'info'
    });
  };
  
  const handleExportData = () => {
    // Aqui você implementaria a lógica para exportar os dados
    setSnackbar({
      open: true,
      message: 'Dados exportados com sucesso!',
      severity: 'success'
    });
  };
  
  const handleImportData = () => {
    // Aqui você implementaria a lógica para importar os dados
    setSnackbar({
      open: true,
      message: 'Dados importados com sucesso!',
      severity: 'success'
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aparência
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Modo Escuro" 
                    secondary="Alterar entre tema claro e escuro" 
                  />
                  <Switch 
                    checked={darkMode} 
                    onChange={toggleDarkMode} 
                    color="primary" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferências de Treino
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Unidade de Peso</InputLabel>
                    <Select
                      value={settings.units}
                      label="Unidade de Peso"
                      onChange={(e) => handleSettingChange('units', e.target.value)}
                    >
                      <MenuItem value="kg">Quilogramas (kg)</MenuItem>
                      <MenuItem value="lb">Libras (lb)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Tempo de Descanso Padrão (segundos)"
                    type="number"
                    value={settings.restTimer}
                    onChange={(e) => handleSettingChange('restTimer', e.target.value)}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NotificationsIcon sx={{ mr: 1 }} />
                      <span>Notificações de Treino</span>
                    </Box>
                  }
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sound}
                      onChange={(e) => handleSettingChange('sound', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VolumeIcon sx={{ mr: 1 }} />
                      <span>Sons do Aplicativo</span>
                    </Box>
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dados e Privacidade
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacyMode}
                      onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Modo de Privacidade (ocultar detalhes sensíveis)"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Backup Automático de Dados"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Resumo dos Dados
              </Typography>
              <Typography variant="body2">
                Treinos registrados: {stats.totalWorkouts}
              </Typography>
              <Typography variant="body2">
                Recordes pessoais: {stats.recordCount}
              </Typography>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<ExportIcon />}
                  onClick={handleExportData}
                >
                  Exportar Dados
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ImportIcon />}
                  onClick={handleImportData}
                >
                  Importar Dados
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => setResetDialogOpen(true)}
                >
                  Resetar Todos os Dados
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Salvar Configurações
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Dialog de confirmação para resetar dados */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>Resetar Todos os Dados?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta ação vai apagar permanentemente todos os seus treinos, recordes pessoais e estatísticas. 
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleResetData} color="error">
            Resetar Dados
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SettingsPage;
