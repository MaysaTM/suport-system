// src/dtos/dashboardDTO.js

export class DashboardStatisticsDTO {
  constructor(data) {
    this.totalTickets = data.totalTickets || 0;
    this.ticketsAbertos = data.ticketsAbertos || 0;
    this.ticketsEmAndamento = data.ticketsEmAndamento || 0;
    this.ticketsResolvidos = data.ticketsResolvidos || 0;
    this.ticketsPorPrioridade = data.ticketsPorPrioridade || {
      BAIXA: 0,
      MEDIA: 0,
      ALTA: 0,
      URGENTE: 0
    };
    this.ticketsRecentes = Array.isArray(data.ticketsRecentes) 
      ? data.ticketsRecentes.map(ticket => ({
          id: ticket.id,
          titulo: ticket.titulo,
          status: ticket.status,
          prioridade: ticket.prioridade,
          clienteNome: ticket.cliente?.nomeCompleto || 'Cliente não encontrado',
          dataAbertura: new Date(ticket.createdAt)
        }))
      : [];
  }
}