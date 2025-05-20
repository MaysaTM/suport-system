package com.example.supportsystem.dto;

import lombok.Data;

@Data
public class DashboardDTO {
    private long totalTickets;
    private long ticketsAbertos;
    private long ticketsEmAndamento;
    private long ticketsResolvidos;
}