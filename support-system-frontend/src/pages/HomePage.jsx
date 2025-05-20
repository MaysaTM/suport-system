import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiTrendingUp, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import './HomePage.scss';

const HomePage = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Tickets abertos', value: 24, trend: '+2', icon: <FiAlertTriangle />, color: '#E74C3C' },
    { title: 'Em atendimento', value: 12, trend: '0', icon: <FiClock />, color: '#3498DB' },
    { title: 'Tickets fechados', value: 156, trend: '+5', icon: <FiCheckCircle />, color: '#2ECC71' }
  ];

  const recentTickets = [
    { id: 'HDN191', title: 'Sistema lento com atualização', client: 'Augusto Santos', priority: 'Alta', time: '1 semana', status: 'Aberto', clientInitial: 'AS' },
    { id: 'HDN192', title: 'Problema com login', client: 'Maria Silva', priority: 'Média', time: '3 dias', status: 'Em andamento', clientInitial: 'MS' },
    { id: 'HDN193', title: 'Relatório não gera', client: 'Carlos Oliveira', priority: 'Baixa', time: '1 dia', status: 'Aberto', clientInitial: 'CO' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Visão Geral do Suporte</h1>
        <p className="subtitle">Resumo das atividades e tickets recentes</p>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-values">
                <span className="value">{stat.value}</span>
                <span className={`trend ${stat.trend === '0' ? 'neutral' : stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  <FiTrendingUp className="trend-icon" />
                  {stat.trend === '0' ? '±0' : stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="tickets-section">
        <div className="section-header">
          <div>
            <h2>Últimos Tickets</h2>
            <p className="section-subtitle">Chamados recentes do sistema</p>
          </div>
          <div className="actions">
            <button className="add-ticket-btn" onClick={() => navigate('/clientes')}>
              <FiPlus className="btn-icon" />
              Novo ticket
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th className="code-col">Código</th>
                <th className="title-col">Título</th>
                <th className="client-col">Cliente</th>
                <th className="priority-col">Prioridade</th>
                <th className="time-col">Tempo</th>
                <th className="status-col">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket, index) => (
                <tr key={index}>
                  <td className="ticket-code">#{ticket.id}</td>
                  <td className="ticket-title">{ticket.title}</td>
                  <td className="ticket-client">
                    <span className="client-avatar">{ticket.clientInitial}</span>
                    <span className="client-name">{ticket.client}</span>
                  </td>
                  <td className={`priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </td>
                  <td className="ticket-time">{ticket.time}</td>
                  <td className={`status ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;