package com.example.supportsystem.service;

import com.example.supportsystem.dto.DashboardDTO;
import com.example.supportsystem.model.Ticket;
import com.example.supportsystem.repository.TicketRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {
    private final TicketRepository ticketRepository;

    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public DashboardDTO getEstatisticas() {
        DashboardDTO dto = new DashboardDTO();
        List<Ticket> tickets = ticketRepository.findAll();

        dto.setTotalTickets(tickets.size());
        dto.setTicketsAbertos((int) tickets.stream()
                .filter(t -> "ABERTO".equals(t.getStatus()))
                .count());
        dto.setTicketsEmAndamento((int) tickets.stream()
                .filter(t -> "EM_ANDAMENTO".equals(t.getStatus()))
                .count());
        dto.setTicketsResolvidos((int) tickets.stream()
                .filter(t -> "RESOLVIDO".equals(t.getStatus()))
                .count());

        return dto;
    }
}