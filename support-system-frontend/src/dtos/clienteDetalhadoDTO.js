

export class ClienteDetalhadoDTO {
  constructor(data) {
    this.id = data.id;
    this.nomeCompleto = data.nomeCompleto;
    this.email = data.email;
    this.telefone = data.telefone;
    this.tipoCliente = data.tipoCliente;
    this.cpf = data.cpf;
    this.cnpj = data.cnpj;
    this.status = data.status || 'ATIVO';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    
 
    this.quantidadeTickets = data.quantidadeTickets || 0;
    this.ticketsAbertos = data.ticketsAbertos || 0;
    this.ultimosTickets = Array.isArray(data.ultimosTickets) 
      ? data.ultimosTickets.map(ticket => ({
          id: ticket.id,
          titulo: ticket.titulo,
          status: ticket.status,
          prioridade: ticket.prioridade,
          dataAbertura: new Date(ticket.createdAt)
        }))
      : [];
  }

  get tipoDocumento() {
    return this.tipoCliente === 'PESSOA_FISICA' ? 'CPF' : 'CNPJ';
  }

  get documento() {
    return this.tipoCliente === 'PESSOA_FISICA' ? this.cpf : this.cnpj;
  }

  get tipoFormatado() {
    return this.tipoCliente === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica';
  }
}