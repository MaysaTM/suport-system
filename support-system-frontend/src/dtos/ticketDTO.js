export class TicketCreateDTO {
  constructor(titulo, descricao, status, clienteId, categoria, prioridade) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.status = status?.toUpperCase() || 'ABERTO';
    this.clienteId = Number(clienteId);
    this.categoria = categoria?.toUpperCase() || 'SUPORTE';
    this.prioridade = prioridade?.toUpperCase() || 'MEDIA';
  }

  static fromForm(values) {
    return new TicketCreateDTO(
      values.titulo,
      values.descricao,
      values.status,
      values.clienteId,
      values.categoria || 'SUPORTE',
      values.prioridade
    );
  }
}

export class TicketResponseDTO {
  constructor(data) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.descricao = data.descricao;
    this.status = data.status;
    
    
    if (typeof data.cliente === 'object' && data.cliente !== null) {
      this.clienteId = data.cliente.id;
      this.clienteNome = data.cliente.nomeCompleto || 'Cliente sem nome';
    } else {
      this.clienteId = data.clienteId || null;
      this.clienteNome = data.clienteNome || 'Cliente não encontrado';
    }
    
    this.categoria = data.categoria;
    this.prioridade = data.prioridade;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.responsavel = data.responsavel || null;
  }

  static toList(tickets) {
    return tickets.map(ticket => new TicketResponseDTO(ticket));
  }
}