package com.example.supportsystem.dto;

import com.example.supportsystem.model.Ticket;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketResponseDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private Ticket.Categoria categoria;
    private Ticket.Prioridade prioridade;
    private Ticket.Status status;
    private LocalDateTime dataCriacao;

    // Apenas informações básicas do cliente
    private Long clienteId;
    private String clienteNome;
}