package com.example.supportsystem.dto;

import com.example.supportsystem.model.Ticket;
import lombok.Data;

@Data
public class FiltroTicketDTO {
    private String texto;
    private Ticket.Status status;
    private Ticket.Categoria categoria;
    private Ticket.Prioridade prioridade;
    private Long clienteId;
}