package com.example.supportsystem.mapper;

import com.example.supportsystem.dto.*;
import com.example.supportsystem.model.*;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SupportSystemMapper {

    public ClienteDTO toClienteDTO(Cliente cliente) {
        if (cliente == null) return null;

        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setNomeCompleto(cliente.getNomeCompleto());
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());
        dto.setTipo(cliente.getTipo() != null ? cliente.getTipo().name() : null);
        dto.setStatus(cliente.getStatus() != null ? cliente.getStatus().name() : null);

        if (cliente.getTipo() == Cliente.TipoCliente.PESSOA_FISICA) {
            dto.setDocumento(cliente.getCpf());
        } else {
            dto.setDocumento(cliente.getCnpj());
        }

        return dto;
    }

    public Cliente toCliente(ClienteDTO clienteDTO) {
        if (clienteDTO == null) return null;

        Cliente cliente = new Cliente();
        cliente.setId(clienteDTO.getId());
        cliente.setNomeCompleto(clienteDTO.getNomeCompleto());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefone(clienteDTO.getTelefone());

        if (clienteDTO.getTipo() != null)
            cliente.setTipo(Cliente.TipoCliente.valueOf(clienteDTO.getTipo()));

        if (clienteDTO.getStatus() != null)
            cliente.setStatus(Cliente.StatusCliente.valueOf(clienteDTO.getStatus()));

        if ("PESSOA_FISICA".equals(clienteDTO.getTipo())) {
            cliente.setCpf(clienteDTO.getDocumento());
            cliente.setCnpj(null);
        } else {
            cliente.setCnpj(clienteDTO.getDocumento());
            cliente.setCpf(null);
        }

        return cliente;
    }

    public TicketResponseDTO toTicketResponseDTO(Ticket ticket) {
        if (ticket == null) return null;

        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitulo(ticket.getTitulo());
        dto.setDescricao(ticket.getDescricao());
        dto.setCategoria(ticket.getCategoria());
        dto.setPrioridade(ticket.getPrioridade());
        dto.setStatus(ticket.getStatus());
        dto.setDataCriacao(ticket.getDataCriacao());

        // Verifica se o cliente foi carregado e está inicializado
        if (ticket.getCliente() != null && Hibernate.isInitialized(ticket.getCliente())) {
            dto.setClienteId(ticket.getCliente().getId());
            dto.setClienteNome(ticket.getCliente().getNomeCompleto());
        }

        return dto;
    }

    public Ticket toTicket(TicketRequestDTO ticketRequestDTO) {
        if (ticketRequestDTO == null) return null;

        Ticket ticket = new Ticket();
        ticket.setTitulo(ticketRequestDTO.getTitulo());
        ticket.setDescricao(ticketRequestDTO.getDescricao());
        ticket.setCategoria(ticketRequestDTO.getCategoria());
        ticket.setPrioridade(ticketRequestDTO.getPrioridade());
        ticket.setStatus(Ticket.Status.ABERTO);

        return ticket;
    }

    public Ticket toTicket(TicketDTO ticketDTO) {
        if (ticketDTO == null) return null;

        Ticket ticket = new Ticket();
        ticket.setId(ticketDTO.getId());
        ticket.setTitulo(ticketDTO.getTitulo());
        ticket.setDescricao(ticketDTO.getDescricao());
        ticket.setCategoria(ticketDTO.getCategoria());
        ticket.setPrioridade(ticketDTO.getPrioridade());

        if (ticketDTO.getStatus() != null) {
            ticket.setStatus(ticketDTO.getStatus());
        } else {
            ticket.setStatus(Ticket.Status.ABERTO);
        }

        return ticket;
    }

    public ClienteResponseDTO toClienteResponseDTO(Cliente cliente, List<Ticket> tickets) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        ClienteDTO clienteDTO = toClienteDTO(cliente);

        dto.setId(clienteDTO.getId());
        dto.setNomeCompleto(clienteDTO.getNomeCompleto());
        dto.setEmail(clienteDTO.getEmail());
        dto.setTelefone(clienteDTO.getTelefone());
        dto.setTipo(clienteDTO.getTipo());
        dto.setDocumento(clienteDTO.getDocumento());
        dto.setStatus(clienteDTO.getStatus());

        dto.setDataCadastro(cliente.getDataCadastro());
        dto.setTotalTickets(tickets.size());
        dto.setTicketsAbertos((int) tickets.stream()
                .filter(t -> t.getStatus() == Ticket.Status.ABERTO)
                .count());
        dto.setTicketsResolvidos((int) tickets.stream()
                .filter(t -> t.getStatus() == Ticket.Status.RESOLVIDO)
                .count());

        dto.setUltimosTickets(tickets.stream()
                .sorted(Comparator.comparing(Ticket::getDataCriacao).reversed())
                .limit(5)
                .map(this::toTicketInfoDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    private ClienteResponseDTO.TicketInfoDTO toTicketInfoDTO(Ticket ticket) {
        ClienteResponseDTO.TicketInfoDTO dto = new ClienteResponseDTO.TicketInfoDTO();
        dto.setId(ticket.getId());
        dto.setTitulo(ticket.getTitulo());
        dto.setStatus(ticket.getStatus().name());
        dto.setDataCriacao(ticket.getDataCriacao());
        return dto;
    }

    public DashboardDTO toDashboardDTO(long totalTickets, long abertos, long emAndamento, long resolvidos) {
        DashboardDTO dto = new DashboardDTO();
        dto.setTotalTickets(totalTickets);
        dto.setTicketsAbertos(abertos);
        dto.setTicketsEmAndamento(emAndamento);
        dto.setTicketsResolvidos(resolvidos);
        return dto;
    }

    public TicketDetailsDTO toTicketDetailsDTO(Ticket ticket) {
        if (ticket == null) return null;

        TicketDetailsDTO dto = new TicketDetailsDTO();
        dto.setId(ticket.getId());
        dto.setTitulo(ticket.getTitulo());
        dto.setDescricao(ticket.getDescricao());
        dto.setCategoria(ticket.getCategoria().name());
        dto.setPrioridade(ticket.getPrioridade().name());
        dto.setStatus(ticket.getStatus().name());
        dto.setDataCriacao(ticket.getDataCriacao());

        if (ticket.getCliente() != null && Hibernate.isInitialized(ticket.getCliente())) {
            TicketDetailsDTO.ClienteDTO clienteDTO = new TicketDetailsDTO.ClienteDTO();
            clienteDTO.setId(ticket.getCliente().getId());
            clienteDTO.setNomeCompleto(ticket.getCliente().getNomeCompleto());
            clienteDTO.setEmail(ticket.getCliente().getEmail());
            clienteDTO.setTelefone(ticket.getCliente().getTelefone());
            clienteDTO.setTipo(ticket.getCliente().getTipo().name());
            clienteDTO.setStatus(ticket.getCliente().getStatus().name());

            if (ticket.getCliente().getTipo() == Cliente.TipoCliente.PESSOA_FISICA) {
                clienteDTO.setDocumento(ticket.getCliente().getCpf());
            } else {
                clienteDTO.setDocumento(ticket.getCliente().getCnpj());
            }

            dto.setCliente(clienteDTO);
        }

        return dto;
    }
}