import React, { useState } from 'react';
import './configuracoes.scss';

const SettingsPage = () => {
  // Estados para as configurações
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  const [fontSize, setFontSize] = useState(16);
  const [profileData, setProfileData] = useState({
    name: 'Usuário Exemplo',
    email: 'usuario@exemplo.com',
    bio: 'Esta é uma bio de exemplo para o perfil do usuário.'
  });

  // Funções de manipulação
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.documentElement.setAttribute('data-theme', e.target.value);
    localStorage.setItem('theme', e.target.value);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    if (!notifications) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notificações ativadas');
        }
      });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = () => {
    localStorage.setItem('profile', JSON.stringify(profileData));
    alert('Perfil salvo localmente!');
  };

  return (
    <div className="settings-container">
      <h1>Configurações</h1>
      
      <section className="settings-section">
        <h2>Aparência</h2>
        <div className="setting-item">
          <label>Tema:</label>
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="system">Sistema</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label>Tamanho da fonte:</label>
          <input 
            type="range" 
            min="12" 
            max="24" 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)}
          />
          <span>{fontSize}px</span>
        </div>
      </section>
      
      <section className="settings-section">
        <h2>Notificações</h2>
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={handleNotificationsToggle}
            />
            Receber notificações
          </label>
        </div>
      </section>
      
      <section className="settings-section">
        <h2>Perfil</h2>
        <div className="setting-item">
          <label>Nome:</label>
          <input 
            type="text" 
            name="name" 
            value={profileData.name} 
            onChange={handleProfileChange}
          />
        </div>
        
        <div className="setting-item">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={profileData.email} 
            onChange={handleProfileChange}
          />
        </div>
        
        <div className="setting-item">
          <label>Bio:</label>
          <textarea 
            name="bio" 
            value={profileData.bio} 
            onChange={handleProfileChange}
          />
        </div>
        
        <button onClick={saveProfile} className="save-button">
          Salvar Perfil
        </button>
      </section>
      
      <section className="settings-section">
        <h2>Sobre</h2>
        <p>Versão do aplicativo: 1.0.0</p>
        <button className="reset-button" onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>
          Redefinir todas as configurações
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;