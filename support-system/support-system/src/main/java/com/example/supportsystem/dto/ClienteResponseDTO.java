package com.example.supportsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ClienteResponseDTO {
    private Long id;
    private String nomeCompleto;
    private String email;
    private String telefone;
    private String tipo;
    private String status;
    private String documento;
    private LocalDateTime dataCadastro;

    private int totalTickets;
    private int ticketsAbertos;
    private int ticketsResolvidos;

    private List<TicketInfoDTO> ultimosTickets;

    @Data
    public static class TicketInfoDTO {
        private Long id;
        private String titulo;
        private String status;
        private LocalDateTime dataCriacao;
    }
}