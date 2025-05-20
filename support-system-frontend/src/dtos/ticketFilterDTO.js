// src/dtos/ticketFilterDTO.js

export class TicketFilterDTO {
  constructor(filters = {}) {
    this.status = filters.status || null;
    this.prioridade = filters.prioridade || null;
    this.dataInicio = filters.dataInicio || null;
    this.dataFim = filters.dataFim || null;
    this.clienteId = filters.clienteId || null;
    this.categoria = filters.categoria || null;
  }

  toQueryParams() {
    const params = new URLSearchParams();
    
    if (this.status) params.append('status', this.status);
    if (this.prioridade) params.append('prioridade', this.prioridade);
    if (this.dataInicio) params.append('dataInicio', this.dataInicio);
    if (this.dataFim) params.append('dataFim', this.dataFim);
    if (this.clienteId) params.append('clienteId', this.clienteId);
    if (this.categoria) params.append('categoria', this.categoria);
    
    return params.toString();
  }

  static fromFormData(formData) {
    return new TicketFilterDTO({
      status: formData.status || null,
      prioridade: formData.prioridade || null,
      dataInicio: formData.dataInicio || null,
      dataFim: formData.dataFim || null,
      clienteId: formData.clienteId || null,
      categoria: formData.categoria || null
    });
  }
}