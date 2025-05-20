package com.example.supportsystem.controller;

import com.example.supportsystem.dto.*;
import com.example.supportsystem.model.Ticket;
import com.example.supportsystem.model.Cliente;
import com.example.supportsystem.repository.TicketRepository;
import com.example.supportsystem.repository.ClienteRepository;
import com.example.supportsystem.mapper.SupportSystemMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketRepository ticketRepository;
    private final ClienteRepository clienteRepository;
    private final SupportSystemMapper mapper;

    public TicketController(TicketRepository ticketRepository,
                            ClienteRepository clienteRepository,
                            SupportSystemMapper mapper) {
        this.ticketRepository = ticketRepository;
        this.clienteRepository = clienteRepository;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> listarTodos() {
        List<Ticket> tickets = ticketRepository.findAllWithCliente();
        return ResponseEntity.ok(tickets.stream()
                .map(mapper::toTicketResponseDTO)
                .toList());
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<TicketResponseDTO>> listarRecentes() {
        List<Ticket> tickets = ticketRepository.findTop5ByOrderByDataCriacaoDesc();
        return ResponseEntity.ok(tickets.stream()
                .map(mapper::toTicketResponseDTO)
                .toList());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TicketResponseDTO>> listarPorStatus(@PathVariable Ticket.Status status) {
        List<Ticket> tickets = ticketRepository.findByStatus(status);
        return ResponseEntity.ok(tickets.stream()
                .map(mapper::toTicketResponseDTO)
                .toList());
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<TicketResponseDTO>> filtrarTickets(
            @RequestParam(required = false) Ticket.Status status,
            @RequestParam(required = false) Ticket.Prioridade prioridade,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {

        List<Ticket> tickets;
        if (status != null && prioridade != null) {
            tickets = ticketRepository.findByStatusAndPrioridade(status, prioridade);
        } else if (status != null) {
            tickets = ticketRepository.findByStatus(status);
        } else if (prioridade != null) {
            tickets = ticketRepository.findByPrioridade(prioridade);
        } else {
            tickets = ticketRepository.findAllWithCliente();
        }

        return ResponseEntity.ok(tickets.stream()
                .map(mapper::toTicketResponseDTO)
                .toList());
    }

    @PostMapping
    public ResponseEntity<?> criarTicket(@Valid @RequestBody TicketRequestDTO ticketRequestDTO) {
        try {
            Cliente cliente = clienteRepository.findById(ticketRequestDTO.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            Ticket ticket = mapper.toTicket(ticketRequestDTO);
            ticket.setCliente(cliente);

            Ticket ticketSalvo = ticketRepository.save(ticket);
            return ResponseEntity.ok(mapper.toTicketResponseDTO(ticketSalvo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDetailsDTO> buscarPorId(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(mapper::toTicketDetailsDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> atualizarTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketDTO ticketDTO) {
        return ticketRepository.findById(id)
                .map(ticketExistente -> {
                    Ticket ticket = mapper.toTicket(ticketDTO);
                    ticket.setId(id);
                    if (ticketDTO.getClienteId() != null) {
                        Cliente cliente = clienteRepository.findById(ticketDTO.getClienteId())
                                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
                        ticket.setCliente(cliente);
                    } else {
                        ticket.setCliente(ticketExistente.getCliente());
                    }
                    Ticket ticketAtualizado = ticketRepository.save(ticket);
                    return ResponseEntity.ok(mapper.toTicketResponseDTO(ticketAtualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTicket(@PathVariable Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}