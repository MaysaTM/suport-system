package com.example.supportsystem.dto;

import com.example.supportsystem.model.Ticket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequestDTO {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Categoria é obrigatória")
    private Ticket.Categoria categoria;

    @NotNull(message = "Prioridade é obrigatória")
    private Ticket.Prioridade prioridade;

    @NotNull(message = "Cliente é obrigatório")
    private Long clienteId;
}