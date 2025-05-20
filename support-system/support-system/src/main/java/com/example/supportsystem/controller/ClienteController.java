package com.example.supportsystem.controller;

import com.example.supportsystem.dto.*;
import com.example.supportsystem.model.Cliente;
import com.example.supportsystem.model.Ticket;
import com.example.supportsystem.repository.ClienteRepository;
import com.example.supportsystem.repository.TicketRepository;
import com.example.supportsystem.mapper.SupportSystemMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteRepository repository;
    private final TicketRepository ticketRepository;
    private final SupportSystemMapper mapper;

    public ClienteController(ClienteRepository repository,
                             TicketRepository ticketRepository,
                             SupportSystemMapper mapper) {
        this.repository = repository;
        this.ticketRepository = ticketRepository;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listarTodos() {
        List<ClienteDTO> clientes = repository.findAll().stream()
                .map(mapper::toClienteDTO)
                .toList();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}/completo")
    public ResponseEntity<ClienteResponseDTO> getClienteCompleto(@PathVariable Long id) {
        return repository.findById(id)
                .map(cliente -> {
                    List<Ticket> tickets = ticketRepository.findByCliente_Id(id);
                    return ResponseEntity.ok(mapper.toClienteResponseDTO(cliente, tickets));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> criarCliente(@Valid @RequestBody ClienteDTO clienteDTO) {
        Cliente cliente = mapper.toCliente(clienteDTO);
        Cliente clienteSalvo = repository.save(cliente);
        return ResponseEntity.ok(mapper.toClienteDTO(clienteSalvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(mapper::toClienteDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> atualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody ClienteDTO clienteDTO) {
        return repository.findById(id)
                .map(clienteExistente -> {
                    Cliente cliente = mapper.toCliente(clienteDTO);
                    cliente.setId(id);
                    Cliente clienteAtualizado = repository.save(cliente);
                    return ResponseEntity.ok(mapper.toClienteDTO(clienteAtualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ClienteDTO> alternarStatus(@PathVariable Long id) {
        return repository.findById(id)
                .map(cliente -> {
                    cliente.setStatus(cliente.getStatus() == Cliente.StatusCliente.ATIVO ?
                            Cliente.StatusCliente.INATIVO : Cliente.StatusCliente.ATIVO);
                    Cliente clienteAtualizado = repository.save(cliente);
                    return ResponseEntity.ok(mapper.toClienteDTO(clienteAtualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}