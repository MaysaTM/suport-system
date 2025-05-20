package com.example.supportsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketDetailsDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String categoria;
    private String prioridade;
    private String status;
    private LocalDateTime dataCriacao;
    private ClienteDTO cliente;

    @Data
    public static class ClienteDTO {
        private Long id;
        private String nomeCompleto;
        private String email;
        private String telefone;
        private String tipo;
        private String status;
        private String documento;
    }
}