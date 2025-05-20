import api from './api';

export const getTickets = async () => {
  try {
    const response = await api.get('/tickets');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    throw new Error('Falha ao carregar tickets. Tente novamente mais tarde.');
  }
};

export const getTicketById = async (id) => {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ticket com ID ${id}:`, error);
    throw new Error(`Falha ao carregar ticket ${id}. Tente novamente mais tarde.`);
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    
    let errorMessage = 'Falha ao criar ticket.';
    if (error.response?.data?.message) {
      errorMessage += ` Detalhes: ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage += ` Detalhes: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

export const updateTicket = async (id, ticketData) => {
  try {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar ticket com ID ${id}:`, error);
    
    let errorMessage = `Falha ao atualizar ticket ${id}.`;
    if (error.response?.data?.message) {
      errorMessage += ` Detalhes: ${error.response.data.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

export const deleteTicket = async (id) => {
  try {
    await api.delete(`/tickets/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Erro ao deletar ticket com ID ${id}:`, error);
    throw new Error(`Falha ao deletar ticket ${id}. Tente novamente mais tarde.`);
  }
};

export const filtrarTickets = async (filters) => {
  try {
    // Converte os filtros para query params
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.prioridade) params.append('prioridade', filters.prioridade);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters.dataFim) params.append('dataFim', filters.dataFim);
    
    const response = await api.get(`/tickets/filtrar?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao filtrar tickets:', error);
    throw new Error('Falha ao filtrar tickets. Tente novamente mais tarde.');
  }
};

export const getTicketsByCliente = async (clienteId) => {
  try {
    const response = await api.get(`/tickets/cliente/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar tickets do cliente ${clienteId}:`, error);
    throw new Error(`Falha ao carregar tickets do cliente. Tente novamente mais tarde.`);
  }
};

export const getTicketsByStatus = async (status) => {
  try {
    const response = await api.get(`/tickets/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar tickets com status ${status}:`, error);
    throw new Error(`Falha ao carregar tickets com status ${status}. Tente novamente mais tarde.`);
  }
};

export const countTicketsByStatus = async () => {
  try {
    const response = await api.get('/tickets/contagem-por-status');
    return response.data;
  } catch (error) {
    console.error('Erro ao contar tickets por status:', error);
    throw new Error('Falha ao carregar contagem de tickets. Tente novamente mais tarde.');
  }
};