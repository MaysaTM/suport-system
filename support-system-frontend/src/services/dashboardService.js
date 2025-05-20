// src/services/dashboardService.js

import api from './api';
import { DashboardStatisticsDTO } from '../dtos/dashboardDTO';

export const getEstatisticas = async () => {
  try {
    const response = await api.get('/dashboard/estatisticas');
    return new DashboardStatisticsDTO(response.data);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    throw error;
  }
};