// Atualizações recomendadas para clienteService.js

import api from './api';
import { ClienteResponseDTO } from '../dtos/clienteDTO';
import { ClienteDetalhadoDTO } from '../dtos/clienteDetalhadoDTO';

export const getClientes = async () => {
  try {
    const response = await api.get('/clientes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const getClienteById = async (id) => {
  try {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar cliente ID ${id}:`, error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    console.log('Enviando dados para criação de cliente:', clienteData);
    const response = await api.post('/clientes', clienteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', {
      error: error.response?.data || error.message,
      payload: clienteData
    });
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  try {
    console.log(`Atualizando cliente ID ${id} com dados:`, clienteData);
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar cliente ID ${id}:`, error);
    throw error;
  }
};

export const deleteCliente = async (id) => {
  try {
    await api.delete(`/clientes/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar cliente ID ${id}:`, error);
    throw error;
  }
};

// Nova função para obter os detalhes completos do cliente
export const getClienteCompleto = async (id) => {
  try {
    const response = await api.get(`/clientes/${id}/completo`);
    return new ClienteDetalhadoDTO(response.data);
  } catch (error) {
    console.error(`Erro ao buscar detalhes completos do cliente ID ${id}:`, error);
    throw error;
  }
};

// Nova função para alternar o status do cliente
export const toggleStatusCliente = async (id) => {
  try {
    const response = await api.patch(`/clientes/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao alternar status do cliente ID ${id}:`, error);
    throw error;
  }
};