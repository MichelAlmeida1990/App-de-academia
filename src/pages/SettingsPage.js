import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SettingsPage.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
    units: 'metric',
    language: 'pt-BR'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <motion.div 
      className="settings-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="settings-header">
        <h1>Configurações</h1>
        <p>Personalize sua experiência no app</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Preferências Gerais</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Notificações</h3>
              <p>Receber lembretes de treino</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Modo Escuro</h3>
              <p>Alternar tema da interface</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Backup Automático</h3>
              <p>Salvar dados automaticamente</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Unidades e Idioma</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Sistema de Unidades</h3>
              <p>Métrico (kg/cm) ou Imperial (lbs/ft)</p>
            </div>
            <div className="setting-control">
              <select 
                value={settings.units}
                onChange={(e) => handleSettingChange('units', e.target.value)}
                className="setting-select"
              >
                <option value="metric">Métrico</option>
                <option value="imperial">Imperial</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Idioma</h3>
              <p>Idioma da interface</p>
            </div>
            <div className="setting-control">
              <select 
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="setting-select"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Conta e Dados</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Exportar Dados</h3>
              <p>Baixar seus dados de treino</p>
            </div>
            <div className="setting-control">
              <button className="btn-secondary">Exportar</button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Limpar Cache</h3>
              <p>Limpar dados temporários</p>
            </div>
            <div className="setting-control">
              <button className="btn-secondary">Limpar</button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Resetar Configurações</h3>
              <p>Voltar às configurações padrão</p>
            </div>
            <div className="setting-control">
              <button className="btn-danger">Resetar</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
